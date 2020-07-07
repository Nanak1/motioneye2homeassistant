# motioneye2homeassistant

Цель создания [motioneye2homeassistant](https://github.com/Nanak1/motioneye2homeassistant):
1. Запрос снимка из [motionEye](https://motion-project.github.io) и отправка в [Home Assistant](https://www.home-assistant.io) без сохранения в файл.
2. Бонусом описана интеграция с [Telegram](https://www.home-assistant.io/integrations/telegram) ботом для отправки уведомлений о движении. 

## Настройка

В файле `config.json`:

* `source`: ссылка на снимок из [motionEye](https://motion-project.github.io);
* `stream`: ссылка на интеграцию [Push](https://www.home-assistant.io/integrations/push) в [Home Assistant](https://www.home-assistant.io);
* `field`: название поля с изображением в [HTTP POST](https://www.home-assistant.io/integrations/push#field) запросе;
* `timeout`: задержка между снимками в миллисекундах.

Например:

```json
{
  "source": "http://localhost:8765/picture/1/current",
  "stream": "https://home.example.org/api/webhook/camera_1",
  "field": "image",
  "timeout": 1000
}
```

## [motionEye](https://motion-project.github.io)

В настройках камеры в [motionEye](https://motion-project.github.io) переходим в раздел `Motion Notifications` и указываем:

* `Call A Web Hook`: `on` включить webhook`и
* `Web Hook URL`: `https://home.example.org/api/webhook/camera_1_motion` где:
  * `home.example.org`: адрес вашего [Home Assistant](https://www.home-assistant.io)
  * `api/webhook`: обработка webhook с движением
  * `/camera_1_motion`: webhook для движения
* `HTTP Method`: `POST` поддерживаются только POST запросы на webhook в [Home Assistant](https://www.home-assistant.io)

## [Home Assistant](https://www.home-assistant.io)

Для удобства настройки рекомендую установить `Add-on` для [Home Assistant](https://www.home-assistant.io) в меню `Supervisor`:

[Home Assistant Add-on: File editor](https://github.com/home-assistant/hassio-addons/tree/master/configurator)

Для создания бота советую воспользоваться инструкцией, описанной в интеграции [Telegram](https://www.home-assistant.io/integrations/telegram) в [Home Assistant](https://www.home-assistant.io). Я предпочитаю использовать несколько потоков для оповещения, так как движения в камере могут сильно спамить, например:

* `telegram_nanaki`: системные уведомления лично мне;
* `telegram_family`: сообщения в семейную группу;
* `telegram_camera`: отдельная семейная группа для сообщений от камеры, которую при сильном спаме можно замутить.

По итогу в `configuration.yaml` у вас должно получится примерно это:

```yaml
lovelace:
  mode: yaml

telegram_bot:
  - platform: polling
    api_key: YOUR_API_KEY
    allowed_chat_ids:
      - CHAT_ID_1
      - CHAT_ID_2
      - CHAT_ID_3

notify:
  - name: telegram_nanaki
    platform: telegram
    chat_id: CHAT_ID_1
  - name: telegram_family
    platform: telegram
    chat_id: CHAT_ID_2
  - name: telegram_camera
    platform: telegram
    chat_id: CHAT_ID_3

camera:
  - platform: push
    name: camera_1
    webhook_id: camera_1
    field: image

automation:
  - id: camera_1_motion
    alias: Оповещение о движении - Камера 1
    initial_state: true
    trigger:
      - platform: webhook
        webhook_id: camera_1_motion
    action:
      - service: notify.telegram_camera
        data:
          message: ''
          data:
            photo:
              - url: http://home.example.org{{ states.camera.camera_1.attributes.entity_picture }}
                caption: Камера 1
```

В файле `ui-lovelace.yaml` добавляем карточку с камерой в одну из `views`:

```yaml
title: Home Assistant
views:
  - title: Камера
    cards:
      - type: picture-glance
        title: Камера 1
        entities: []
        camera_image: camera.camera_1
        camera_view: live
```

## Ссылки

* [motioneye2homeassistant](https://github.com/Nanak1/motioneye2homeassistant)
* [motionEye](https://motion-project.github.io)
* [Home Assistant](https://www.home-assistant.io)
  * [Home Assistant Integration: Push](https://www.home-assistant.io/integrations/push)
  * [Home Assistant Integration: Telegram](https://www.home-assistant.io/integrations/telegram)
  * [Home Assistant Add-on: File editor](https://github.com/home-assistant/hassio-addons/tree/master/configurator)