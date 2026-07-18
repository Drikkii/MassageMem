<?php
declare(strict_types=1);

/**
 * Скопируйте как config.php и укажите пароль SMTP.
 */
return [
    'recipient' => 'ekaterina_spa_massage@mail.ru',
    'from_email' => 'noreply@spaexpert-em.ru',
    'from_name' => 'Сайт Екатерины Мухиной',
    'smtp' => [
        'host' => 'smtp.beget.com',
        'port' => 465,
        'username' => 'noreply@spaexpert-em.ru',
        'password' => 'ВАШ_ПАРОЛЬ_ОТ_ПОЧТЫ',
    ],
];
