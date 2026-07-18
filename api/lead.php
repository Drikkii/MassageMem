<?php

declare(strict_types=1);

require_once __DIR__ . '/smtp.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

function lead_rate_limited(): bool
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $key = preg_replace('/[^a-zA-Z0-9._:-]/', '_', $ip) ?? 'unknown';
    $dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'massagemem-leads';
    $file = $dir . DIRECTORY_SEPARATOR . $key . '.json';

    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        return false;
    }

    $now = time();
    $window = 300;
    $max = 8;
    $data = ['times' => []];

    if (is_file($file)) {
        $raw = file_get_contents($file);
        $decoded = json_decode($raw !== false ? $raw : '', true);
        if (is_array($decoded) && isset($decoded['times']) && is_array($decoded['times'])) {
            $data['times'] = $decoded['times'];
        }
    }

    $data['times'] = array_values(array_filter(
        $data['times'],
        static fn ($ts) => is_int($ts) && $ts > $now - $window,
    ));

    if (count($data['times']) >= $max) {
        return true;
    }

    $data['times'][] = $now;
    file_put_contents($file, json_encode($data), LOCK_EX);

    return false;
}

function lead_read_config(): array
{
    $defaults = [
        'recipient' => '',
        'from_email' => '',
        'from_name' => 'Екатерина Мухина',
        'smtp' => [
            'host' => 'smtp.beget.com',
            'port' => 465,
            'username' => '',
            'password' => '',
        ],
    ];

    $configPath = __DIR__ . '/config.php';
    if (!is_file($configPath)) {
        return $defaults;
    }

    /** @var array<string, mixed> $config */
    $config = require $configPath;
    $smtp = is_array($config['smtp'] ?? null) ? $config['smtp'] : [];

    return [
        'recipient' => trim((string) ($config['recipient'] ?? '')),
        'from_email' => trim((string) ($config['from_email'] ?? '')),
        'from_name' => trim((string) ($config['from_name'] ?? $defaults['from_name'])),
        'smtp' => [
            'host' => trim((string) ($smtp['host'] ?? $defaults['smtp']['host'])),
            'port' => (int) ($smtp['port'] ?? $defaults['smtp']['port']),
            'username' => trim((string) ($smtp['username'] ?? $config['from_email'] ?? '')),
            'password' => (string) ($smtp['password'] ?? ''),
        ],
    ];
}

function lead_strip_header_value(string $value): string
{
    return str_replace(["\r", "\n", "\0"], '', trim($value));
}

function lead_sanitize_fields(array $fields): array
{
    $clean = [];

    foreach ($fields as $key => $value) {
        if (!is_string($key) || $key === '' || str_starts_with($key, '_')) {
            continue;
        }

        if (is_array($value)) {
            $value = implode(', ', array_map('strval', $value));
        }

        $value = mb_substr(trim((string) $value), 0, 2000);
        if ($value === '') {
            continue;
        }

        $clean[mb_substr($key, 0, 80)] = $value;
    }

    return $clean;
}

function lead_send_mail(array $config, string $to, string $subject, string $body): bool
{
    $host = (string) ($_SERVER['HTTP_HOST'] ?? 'localhost');
    $host = preg_replace('/[^a-zA-Z0-9.-]/', '', $host) ?? 'localhost';

    $fromEmail = lead_strip_header_value($config['from_email']);
    if ($fromEmail === '' || !filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
        $fromEmail = 'noreply@' . $host;
    }

    $fromName = lead_strip_header_value($config['from_name'] !== '' ? $config['from_name'] : 'Екатерина Мухина');
    $fromName = mb_substr($fromName, 0, 80);

    $smtp = $config['smtp'];
    $smtp['username'] = $smtp['username'] !== '' ? $smtp['username'] : $fromEmail;

    if ($smtp['password'] !== '') {
        return smtp_send_message($smtp, $fromEmail, $fromName, $to, $subject, $body);
    }

    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . $encodedFromName . ' <' . $fromEmail . '>',
        'Reply-To: ' . $fromEmail,
        'Return-Path: ' . $fromEmail,
        'X-Mailer: MassageMem',
    ];

    ini_set('sendmail_from', $fromEmail);

    return mail(
        $to,
        $encodedSubject,
        $body,
        implode("\r\n", $headers),
        '-f' . $fromEmail,
    );
}

if (lead_rate_limited()) {
    http_response_code(429);
    echo json_encode(
        ['success' => false, 'message' => 'Слишком много заявок. Попробуйте позже.'],
        JSON_UNESCAPED_UNICODE,
    );
    exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw !== false ? $raw : '', true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Некорректные данные'], JSON_UNESCAPED_UNICODE);
    exit;
}

$config = lead_read_config();
$to = $config['recipient'];

if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    http_response_code(500);
    echo json_encode(
        ['success' => false, 'message' => 'Не указан email получателя в api/config.php'],
        JSON_UNESCAPED_UNICODE,
    );
    exit;
}

$subject = lead_strip_header_value(
    mb_substr(trim((string) ($payload['subject'] ?? 'Заявка с сайта')), 0, 200),
);
$fields = lead_sanitize_fields(is_array($payload['fields'] ?? null) ? $payload['fields'] : []);

if (!$fields) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Пустая заявка'], JSON_UNESCAPED_UNICODE);
    exit;
}

$lines = [];
foreach ($fields as $label => $value) {
    $lines[] = $label . ': ' . $value;
}

$body = implode("\n", $lines);
$sent = lead_send_mail($config, $to, $subject, $body);

if (!$sent) {
    http_response_code(500);
    echo json_encode(
        [
            'success' => false,
            'message' => 'Сервер не смог отправить письмо. Укажите пароль SMTP в api/config.php.',
        ],
        JSON_UNESCAPED_UNICODE,
    );
    exit;
}

echo json_encode(['success' => true, 'method' => 'server'], JSON_UNESCAPED_UNICODE);
