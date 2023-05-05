---
title: "NIX shell for Flutter Linux development"
layout: "base.njk"
date: "2023-05-05"
lang: "EN"

channel: 1
---

### Pre-require:
* Get to know more about **Flutter**, check [here](https://flutter.dev/)
* Get to know more about **NIXOS**, check [here](https://nixos.org/manual/nixpkgs/stable/)

### Setup

The **shell.nix** with content as below:

```nix
# ref: https://discourse.nixos.org/t/flutter-run-d-linux-build-process-failed/16552
with (import <nixpkgs> { });

mkShell {
  buildInputs = [
    at-spi2-core.dev
    clang
    cmake
    dart
    dbus.dev
    flutter
    gtk3
    libdatrie
    libepoxy.dev
    libselinux
    libsepol
    libthai
    libxkbcommon
    ninja
    pcre
    pkg-config
    util-linux.dev
    xorg.libXdmcp
    xorg.libXtst
  ];
  shellHook = ''
    export LD_LIBRARY_PATH=${libepoxy}/lib
  '';
}
```

To use

```bash
[user@localhost ~/sample ]$ nix-shell
[shell - user@localhost ~/sample ]$ flutter create --platforms=linux
[shell - user@localhost ~/sample ]$ flutter run -d linux
```

