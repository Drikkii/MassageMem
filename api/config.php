<?php
declare(strict_types=1);

/**
 * Настройки отправки заявок.
 *
 * 1. recipient — куда приходит письмо.
 * 2. from_email — ящик на Beget (noreply@spaexpert-em.ru).
 * 3. smtp.password — пароль от ящика noreply@spaexpert-em.ru (обязательно для надёжной доставки).
 */
return [
    'recipient' => 'ekaterina_spa_massage@mail.ru',
    'from_email' => 'noreply@spaexpert-em.ru',
    'from_name' => 'Сайт Екатерины Мухиной',
    'smtp' => [
        'host' => 'smtp.beget.com',
        'port' => 465,
        'username' => 'noreply@spaexpert-em.ru',
        'password' => '!!!!!!!!!',
    ],
];
