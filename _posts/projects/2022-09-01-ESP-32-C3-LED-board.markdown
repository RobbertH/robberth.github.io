---
layout: post
title:  "RISC-V LED controller"
date:   2022-09-01 
categories: projects
comments: true
---

<h2>Background & Concept</h2>
There is an excellent RISC-V microcontroller for sale: the ESP32 C3.
I've bought mine from M5Stack: the [M5Stamp C3](https://shop.m5stack.com/products/m5stamp-c3-mate-with-pin-headers), and I am absolutely in love with it.
There are [posts on hackaday](https://hackaday.com/2021/02/08/hands-on-the-risc-v-esp32-c3-will-be-your-new-esp8266/) that go more in depth, but the essence is you're getting a Wi-Fi, Bluetooth, USB-C microcontroller in a tiny package for $6.

After browsing through and flashing some examples, I thought of using it for my LED strips instead of the Xtensa-based ESP32s that are running now.
The software stack that's running now to control the LEDs is also far from perfect with nodered or home assistant sending custom messages over MQTT that basically trigger routines on the ESP32.

<h2>WLED and ESPHome</h2>
At the time of writing, [https://install.wled.me/](https://install.wled.me/) was not working for the relatively young ESP32C3.
With the [help of some kind internet strangers](https://github.com/esphome/issues/issues/2946), I've found a working [ESPHome](https://esphome.io/) configuration.
It involves adding some platform options to the yaml used to configure ESPHome:
```
  platformio_options:
    board_build.flash_mode: dio
    platform_packages:
      - framework-arduinoespressif32 @ https://github.com/espressif/arduino-esp32.git#2.0.1
    platform:
      - https://github.com/platformio/platform-espressif32.git#feature/arduino-upstream
```
And for WLED, also specifying some extra parameters:
```
light:
  - platform: neopixelbus
    id: ws2812
    type: GRB
    variant: WS2812
    method: ESP32_RMT_1
    num_leds: 150
    pin: GPIO7
```

And after flashing with 
`docker run --rm -v "${PWD}":/config --device=/dev/ttyACM0 -it esphome/esphome run esp32-led-config.yaml`
it was ready to be added in Home Assistant, where colors and effects can be configured.
No more MQTT or NodeRED needed. Thank you ESPHome.

<h2>Printed Circuit Board</h2>
Another microcontroller, another PCB!
With the previous PCB, I took a lot of space for extra connectors that I didn't need, so I wanted it a bit more minimal now: only the bare necessary connections.
Slowly getting used to Autodesk's Eagle, I thought I'd go for a round PCB this time:

<img src="/assets/img/led/round_PCB.png" alt="led controller" style="width: 100%;"/><br>

<h2>Conclusion</h2>
The ESP32 C3 is super cool!

<h2>Some resources crossed along the way</h2>
* [https://github.com/esphome/issues/issues/2946](https://github.com/esphome/issues/issues/2946)
* [https://github.com/Aircoookie/WLED/issues/2518](https://github.com/Aircoookie/WLED/issues/2518)
* [https://github.com/Aircoookie/WLED/issues/1940](https://github.com/Aircoookie/WLED/issues/1940)
* [https://esphome.io/components/light/index.html](https://esphome.io/components/light/index.html)
* [https://esphome.io/components/light/index.html#addressable-fireworks-effect](https://esphome.io/components/light/index.html#addressable-fireworks-effect)
* [https://github.com/esphome/issues/issues/2931](https://github.com/esphome/issues/issues/2931)
