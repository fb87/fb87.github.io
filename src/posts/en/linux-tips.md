---
title: "Linux Tips/Hints"
layout: "base.njk"
date: "2021-11-19"
lang: "EN"

channel: 4
---

### General

* Reset tty: `printf "\033c"`
  * In case we wanna reset tty to default setting (e.g after changing by `htop`)  
  * Setting permission to all external disk/tty via u-dev
    ```bash
    # cat /etc/udev/rules.d/99-local.rules
    KERNEL=="ttyUSB[0-9]*", MODE="0666"
    KERNEL=="ttyACM[0-9]*", MODE="0666"

    KERNEL=="sd[d-f]*",     MODE="0666"
    ```
    * NixOS
        ```bash
        services.udev.extraRules = ''
          KERNEL=="ttyUSB[0-9]*", MODE="0666"
          KERNEL=="ttyACM[0-9]*", MODE="0666"
          KERNEL=="sd[d-f]*",     MODE="0666"
        '';
        ```