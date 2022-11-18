---
title: "About"
layout: "base.njk"

permalink: "about/index.html"
---

I'm the Embedded Software Engineer since 2008, mainly focusing on Embedded Linux including Package dev./intergrated, Root filesystem, BSP dev. Bootloader/Boot-rom code.

* From 2008 to 2012 (Renesas Vietnam), I worked as BSP developer on Symbian OS and Linux then after. I was working on Mobile Platform team which supposed to deliver base software to our vendors. The delivable package include complete low-end software as such bootloader, kernel with all related device drivers. At that time I also be parted of Power Management team who developed ARCH specific part of Linux DVFS framework our provided mobile chipset (including CPUIdle, CPUFreq, Voltage Scaling, System Suspend). Our work is mainly on ASM language, to add more levels of power optimization as such support dynamic cut of CPU power/clock during IDLE(ing) instead of just executing WFI, or implementing Disk mode on Suftware Suspend.
* From 2012 to 2015 (Viettel R&D), I worked as firmware developer on Linux platform. Our main goal is to develop the complete Linux platform on Set-top box including BSP, Application framework and also complete Application suite. The productline is from low-end (pure Linux base) to high-end (Linux platform + Web based application framework).
* From 2015 to now (Robert Bosch Vietnam), I am working as Linux platform development (Yokto Linux, Apertis Linux).

----

Apart from Embedded Software, I am also the Web technology enthusiasm. I used to use web technology to develop tools/apps which are used to support my daily work.

* Mark Tech Editor - Eclipse plugin (Java/Javascript - interconnect) which used to render PlantUML + Markdown on single HTML page (live preview). It supports to synchronize the scrolling between markdown editor panel and live preview panel.
* Remote target - A web app (flask socket-io + angularjs) which used to connect to remote target to support mirror target screen on web page (live mode), it supports to interact with remote target UI (mouse clicking - simulate touch event), supports capture and display log from remote target on realtime.
* 11ty static web - I develop my web site based on **11ty**, apart from theming, with **Angularjs** integrated, it also support searching/filtering topic based on input keyword.

----

I'm using Linux on all of my devices (Laptop, main Workstation, my RPI), the distribution I installed is [NixOS](https://nixos.org). I built myself the custom Linux for my smartphone [Pinephone](https://www.pine64.org/pinephone/) based on Buildroot (Buildroot + OSTree), I built and run [Flutter Engine](https://github.com/flutter/engine) with custom embedder on my smartphone and my RPI as POC.

