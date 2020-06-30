# motioneye2homeassistant
Запрашивает снимок из камеры в [motionEye](https://motion-project.github.io) и сразу отправляет его в [Home Assistant](https://www.home-assistant.io) без сохранения в файл

## Настройка

В файле `config.json` настраиваем потоки и движения:

* `port`: порт, на котором висит слушатель webhook`ов от [motionEye](https://motion-project.github.io) при обнаружении движения
* `streams`: массив из снимков прямого эфира
  * `timeout`: задержка между снимками в милисекундах
  * `motioneye`: ссылка на снимок из [motionEye](https://motion-project.github.io)
  * `homeassistant`: ссылка на интеграцию [Push](https://www.home-assistant.io/integrations/push) в [Home Assistant](https://www.home-assistant.io)
  * `field`: название поля с изображением в [HTTP POST](https://www.home-assistant.io/integrations/push#field) запросе
  * `disabled`: отключить сервис
* `motions`: массив из снимков обнаруженного движения
  * `webhook`: ссылка, которую [motionEye](https://motion-project.github.io) должен дёрнуть
  * `motioneye`: ссылка на снимок из [motionEye](https://motion-project.github.io)
  * `homeassistant`: ссылка на интеграцию [Home Assistant Integration: Push](https://www.home-assistant.io/integrations/push) в [Home Assistant](https://www.home-assistant.io)
  * `field`: название поля с изображением в [HTTP POST](https://www.home-assistant.io/integrations/push#field) запросе
  * `disabled`: отключить сервис

Например:

```json
{
  "port": 3333,
  "streams": [
    {
      "timeout": 1000,
      "motioneye": "http://localhost:8765/picture/1/current",
      "homeassistant": "https://home.example.org/api/webhook/camera_stream_1",
      "field": "image",
      "disabled": false
    }
  ],
  "motions": [
    {
      "webhook": "/camera_motion_1",
      "motioneye": "http://localhost:8765/picture/1/current",
      "homeassistant": "https://home.example.org/api/webhook/camera_motion_1",
      "field": "image",
      "disabled": false
    }
  ]
}
```

## [motionEye](https://motion-project.github.io)

В настройках камеры в [motionEye](https://motion-project.github.io) переходим в раздел `Motion Notifications` и указываем:

* `Call A Web Hook`: `on` включить webhook`и
* `Web Hook URL`: `http://localhost:3333/camera_motion_1` где:
  * `localhost`: хост, где работает сервис [motioneye2homeassistant](https://github.com/Nanak1/motioneye2homeassistant)
  * `3333`: порт из `config.json`
  * `/camera_motion_1`: webhook для движения, указанный в `config.json`
* `HTTP Method`: `GET` метод HTTP запроса для webhook, который обработает [motioneye2homeassistant](https://github.com/Nanak1/motioneye2homeassistant)

## [Home Assistant](https://www.home-assistant.io)

Для удобства настройки рекомендую установить `Add-on` для [Home Assistant](https://www.home-assistant.io) в меню `Supervisor`:

[Home Assistant Add-on: File editor](https://github.com/home-assistant/hassio-addons/tree/master/configurator)

Описываем в `configuration.yaml` свою камеру через интеграцию [Home Assistant Integration: Push](https://www.home-assistant.io/integrations/push):

```yaml
camera:

  - platform: push
    name: camera_stream_1
    webhook_id: camera_stream_1
    field: image
    
  - platform: push
    name: camera_motion_1
    webhook_id: camera_motion_1
    field: image
```

Включаем режим `yaml` в `lovelace`:

```yaml
lovelace:
  mode: yaml
```

В файле `ui-lovelace.yaml` добавляем карточки с камерой в одну из `views`:

```yaml
title: Умный дом
views:

  - title: Камера
    icon: mdi:cctv
    cards:

      - type: picture-glance
        title: Прямой эфир
        entities: []
        camera_image: camera.camera_stream_1
        camera_view: live

      - type: picture-glance
        title: Обнаруженное движение
        entities: []
        camera_image: camera.camera_stream_1
        camera_view: live
```

## Ссылки

* [motioneye2homeassistant](https://github.com/Nanak1/motioneye2homeassistant)
* [motionEye](https://motion-project.github.io)
* [Home Assistant](https://www.home-assistant.io)
  * [Home Assistant Integration: Push](https://www.home-assistant.io/integrations/push)
  * [Home Assistant Add-on: File editor](https://github.com/home-assistant/hassio-addons/tree/master/configurator)