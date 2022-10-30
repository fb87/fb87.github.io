---
title: "Build and boot NIXOS for/on Pinephone"
layout: "base.njk"
date: "2021-11-19"
lang: "EN"

channel: 5
---

### Pre-require

* A Linux with Nixpkgs Manager pre-installed

### Build NixOS installer

NixOS installer is bootstrap image which could be flashed to SDCard to boot and install NixOS on eMMC of Pinephone (PP).
There is prebuilt image which could be found at [Hydra](https://hydra.nixos.org)  - NixOS official build farm. In this post we will try to build the same on local development machine.

```bash
[user@local ~]$ git clone --depth=1 https://github.com/samueldr/cross-system
[user@local ~]$ nix-build -A aarch64-linux.sdImage cross-system/default.nix

# replace /dev/sdX with dedicated device
[user@local ~]$ zstdcat result/sd-image/*.img.zst | dd of=/dev/sdX status=progress

# write u-boot, replace /dev/sdX with dedicated device
# to get u-boot-sunxi-with-spl.bin, either we could download prebuilt binary from
# other distro (google :D) or download u-boot and build ourselve
[user@local ~]$ dd if=u-boot-sunxi-with-spl.bin of=/dev/sdX bs=8k seek=1
```

### Boot NixOS install and install to eMMC

Boot the SDCard which contains installer image, get access to **root** user by typing `sudo -i`. To partitioning eMMC, get [**holey**](https://github.com/samueldr/holey) script.
In the example below, we will create 3 partitions for **efi boot**, **swap** and **root**.

```bash
[root@nixos ~]# nix-shell -p 'import (fetchTarball https://github.com/samueldr/holey/archive/master.tar.gz) {}'
[nix-shell: ~]# holey /dev/mmcblk2 init
[nix-shell: ~]# holey /dev/mmcblk2 add esp 1G
[nix-shell: ~]# holey /dev/mmcblk2 add swap 2G
[nix-shell: ~]# holey /dev/mmcblk2 add linux

[nix-shell: ~]# mkfs.vfat -F32 /dev/mmcblk2p1
[nix-shell: ~]# mkswap /dev/mmcblk2p2
[nix-shell: ~]# swapon /dev/mmcblk2p2
[nix-shell: ~]# mkfs.ext4 /dev/mmcblk2p3
[nix-shell: ~]# exit
```

Mount eMMC
```bash
[root@nixos ~]# mount /dev/mmcblk3 /mnt && mkdir /mnt/boot -p
[root@nixos ~]# mount /dev/mmcblk1 /mnt/boot
[root@nixos ~]# nixos-generate-config --root /mnt
```

Edit configuration files by **vi /mnt/etc/nixos/configuration.nix**. Change *defaultGateway* to correct one, otherwise we will not able to connect to internet.

```nix
# /etc/nixos/configuration.nix

{ config, lib, pkgs, ... }:

{
  imports = [
    ./hardware-configuration.nix
  ];

  boot.loader.grub.enable = false;
  boot.loader.generic-extlinux-compatible.enable = true;

  networking = {
    hostName = "nixos-aarch64";
    wireless.enable = false;

    useDHCP = true;
    interfaces.eth0 = {
      useDHCP = true;
      ipv4.addresses = [{
	    address = "192.168.1.200";
	    prefixLength = 24;
      }];
    };

    # run 'ip route show' to find correct gateway
    defaultGateway = "192.168.1.100";

    # use opendns and cloudflare dns instead of google dns
    nameservers = [ "208.67.222.222" "1.1.1.1" ];
  };

  time.timeZone = "Asia/Ho_Chi_Minh";

  i18n.defaultLocale = "en_US.UTF-8";
  console = {
    font = "Lat2-Terminus16";
    keyMap = "us";
  };

  users.users.nixos = {
    isNormalUser = true;
    extraGroups = [ "wheel" ];
  };

  environment.systemPackages = with pkgs; [
    vim wget htop wpa_supplicant

    # enable wayland + weston
    weston
  ];

  programs.gnupg.agent = {
    enable = true;
    enableSSHSupport = true;
  };

  powerManagement.enable = true;
  hardware.opengl.enable = true;

  services.openssh.enable = true;

  system.stateVersion = "21.11";
}
```

Install NixOS to eMMC

```nix
[root@nixos ~]# nixos-install --root /mnt

# create password for **nixos** user
[root@nixos ~]# nixos-enter --root /mnt
[root@nixos ~]# passwd nixos

[root@nixos ~]# exit && sync && poweroff
```

Remove SDCard letting device boot from eMMC.
