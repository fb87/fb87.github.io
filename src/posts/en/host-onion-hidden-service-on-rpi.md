---
title: "Host an Onion hidden service using Raspberry Pi"
layout: "base.njk"
date: "2022-03-01"
lang: "EN"

channel: 6
---

### Pre-require

* A Raspberry Pi Board + SDCard (>= 1GB)
* Basic Linux knowledge

### Install Linux OS on RPi

Follow [RPi Alpine Headless](https://wiki.alpinelinux.org/wiki/Raspberry_Pi_-_Headless_Installation) to prepare base software on RPi board, **diskless** mode is recommended.
It's recommended to have 1 R/W partition to store Tor config and Web contents. Partition scheme should look like:
* Boot partition (Fat format) ~256MiB
* Persistent partition (Ext4 format) size dependent.

From my experience, our system comsumes about 80MiB RAM runtime, there is no need to have swap partition.

### Install Tor and Nginx

* Mount second partition to e.g `/media/data`
* Install `tor`, `nginx`
  ```bash
  ~# apk add nginx tor
  ```
* Create `torrc` by copying `/etc/tor/torrc.sample`
  ```bash
  ~# cp /etc/tor/torrc.sample /etc/tor/torrc
  ```
* Mount data partition
  ```bash
  ~# mkdir /media/data
  ~# mount /dev/mmcblk0p2 /media/data
  ```
* Create mount point for our hidden service
  ```bash
  ~# mkdir /media/data/var/lib/tor/hidden_service
  ~# chown tor -R /media/data/var
  ~# chmod -R 0700 /media/data/var
  ~# mkdir /media/data/htdocs
  ```
* Enable hidden service on `torrc`
  * Before
    ```shell
    # HiddenServiceDir /media/data/var/lib/tor/hidden_service
    # HiddenServicePort 80 127.0.0.1:80
    ```
  * After
    ```bash
    HiddenServiceDir /media/data/var/lib/tor/hidden_service/

    # bind to socket instead to avoid exposing ourselves to out side
    HiddenServicePort 80 unix:/var/run/onion.sock
    ```
* Restart **tor** service to get hostname
  ```bash
  ~# rc-update add tor
  ~# rc-update add nginx
  ~# service tor restart
  ```
> Check `/media/data/var/lib/tor/hidden_service/hostname` to find host name of our hidden service, this info need to be filled into nginx configuration later on.

* Create virtual server on **nginx** to bind to **tor** socket by edit `/etc/nginx/http.d/default`, replace it with content below:
  ```bash
  server {
    listen unix:/var/run/onion.sock;
    server_name <your-onion-address>.onion;
    access_log /var/log/nginx/onion.log;
    index index.html;
    root /media/data/htdocs;
  }
  ```
> Fill **your-onion-address** with content from `/media/data/var/lib/tor/hidden_service/hostname`

* Create **/media/data/htdocs/index.html** with simple html content to test e.g `<h1>Welcome to my site</h1>`
* Restart **nginx** `service nginx restart`

Check if our web is up and running using [**Tor Browser**](https://www.torproject.org/download/) with address indecated by content of `/media/data/var/lib/tor/hidden_service/hostname`.

* Save all the changes
  ```bash
  ~# lbu commit
  ```

> Important! per each step above, it'd better to run `lbu commit` to save all modifications

### Reference

* [Onion Hidden Service](https://community.torproject.org/onion-services/setup/)
* [Alpine headless on Raspberry Pi](https://wiki.alpinelinux.org/wiki/Raspberry_Pi_-_Headless_Installation)