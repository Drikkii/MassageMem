<?php

declare(strict_types=1);

function smtp_send_message(array $smtp, string $fromEmail, string $fromName, string $to, string $subject, string $body): bool
{
    $host = trim((string) ($smtp['host'] ?? ''));
    $port = (int) ($smtp['port'] ?? 465);
    $username = trim((string) ($smtp['username'] ?? ''));
    $password = (string) ($smtp['password'] ?? '');

    if ($host === '' || $username === '' || $password === '') {
        return false;
    }

    $remote = ($port === 465 ? 'ssl://' : 'tcp://') . $host . ':' . $port;
    $socket = @stream_socket_client($remote, $errno, $errstr, 20);

    if (!$socket) {
        return false;
    }

    stream_set_timeout($socket, 20);

    if (!smtp_expect($socket, [220])) {
        fclose($socket);
        return false;
    }

    $ehloHost = 'spaexpert-em.ru';
    if (!smtp_command($socket, "EHLO {$ehloHost}\r\n", [250])) {
        fclose($socket);
        return false;
    }

    if ($port !== 465) {
        if (!smtp_command($socket, "STARTTLS\r\n", [220])) {
            fclose($socket);
            return false;
        }

        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($socket);
            return false;
        }

        if (!smtp_command($socket, "EHLO {$ehloHost}\r\n", [250])) {
            fclose($socket);
            return false;
        }
    }

    if (!smtp_command($socket, "AUTH LOGIN\r\n", [334])
        || !smtp_command($socket, base64_encode($username) . "\r\n", [334])
        || !smtp_command($socket, base64_encode($password) . "\r\n", [235])) {
        fclose($socket);
        return false;
    }

    if (!smtp_command($socket, "MAIL FROM:<{$fromEmail}>\r\n", [250])
        || !smtp_command($socket, "RCPT TO:<{$to}>\r\n", [250])
        || !smtp_command($socket, "DATA\r\n", [354])) {
        fclose($socket);
        return false;
    }

    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . $encodedFromName . ' <' . $fromEmail . '>',
        'To: <' . $to . '>',
        'Subject: ' . $encodedSubject,
        'Date: ' . date('r'),
    ];

    $message = implode("\r\n", $headers) . "\r\n\r\n" . str_replace(["\r\n", "\r"], "\n", $body);
    $message = str_replace("\n.", "\n..", $message);
    $message = str_replace("\n", "\r\n", $message);

    fwrite($socket, $message . "\r\n.\r\n");

    if (!smtp_expect($socket, [250])) {
        fclose($socket);
        return false;
    }

    smtp_command($socket, "QUIT\r\n", [221]);
    fclose($socket);

    return true;
}

function smtp_command($socket, string $command, array $okCodes): bool
{
    fwrite($socket, $command);
    return smtp_expect($socket, $okCodes);
}

function smtp_expect($socket, array $okCodes): bool
{
    $response = '';

    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }

    if ($response === '') {
        return false;
    }

    $code = (int) substr($response, 0, 3);

    return in_array($code, $okCodes, true);
}
