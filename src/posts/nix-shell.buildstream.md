---
title: "NIX shell for buildstream development environment"
layout: "base.njk"

channel: 1
---

### Pre-require:
* Get to know more about **buildstream**, check [here](https://www.buildstream.build/)
* Get to know more about **NIXOS**, check [here](https://nixos.org/manual/nixpkgs/stable/)

### Setup

**buildstream** requires [Python](https://python.org) environment and [Bubblewrap ](https://github.com/containers/bubblewrap) 
to be installed. During the installation of **buildstream**, some depedencies are also installed. These pip modules will also
pull some prebuilt binarries those might not work right away in NIXOS since they are not able to find glibc at **/usr/lib** as
usual. The best way to overcome this sittuation is to use FHS User env. (**autoPatchelfHook** is also okay but not in today).

To make it easy, we will:

* Create FHS User env. with **bubblewrap**, **gcc**, **fuse**, etc.,
* Before jumping to the shell, create Python virtual env. and:
    * Install **buildstream** and **buildstream external**
    * Patch [**fusepy**](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/python-modules/fusepy/default.nix) if any


Create **shell.nix** with content as below:

```nix
{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
    name = "bst-fhsenv";
    targetPkgs = pkgs: (with pkgs; [
        gcc
        glibc
        fuse
        bubblewrap

        python39
        python39Packages.pip
        python39Packages.virtualenv
    ]);

    runScript = "bash";

    profile = ''
        export PS1='[shell - \u@\h \w]\n> '

        if [ ! -d .venv ]; then
            # create local environment
            virtualenv .venv || exit -1
        fi

        source .venv/bin/activate || exit -1

        if [ ! -f .venv/installed ]; then
            # get rid of pip warning messages
            pip install --upgrade pip

            # install requires tools
            pip install buildstream || exit -1

            # install bst-external
            git clone --depth=1 \
                https://gitlab.com/BuildStream/bst-external.git \
                /tmp/bst-external
            (
                cd /tmp/bst-external
                pip install . || exit -1
            )
            rm -Rf /tmp/bst-external
            
            # W/A for libfuse not found issue
            sed -i "s|find_library('fuse')|'${pkgs.fuse}/lib/libfuse.so'|g" \
                .venv/${pkgs.python39.sitePackages}/buildstream/_fuse/fuse.py || exit -1

            touch .venv/installed
        fi
    '';
}).env
```

To use

```bash
[user@localhost ~/sample ]$ nix-shell
(.venv) [shell - user@localhost ~/sample ]$ bst build sample.bst
```

