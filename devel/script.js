// vim: tabstop=2 softtabstop=2 shiftwidth=2 autoindent expandtab
(function() {
  const PATHNAME = `${window.location.pathname}`;
  const BASE_URL = `${window.location.origin}${PATHNAME}`;

  const basename = function() {
    let hash = window.location.hash;
    if (hash.lastIndexOf("?") > 0) hash = hash.substring(0, hash.lastIndexOf('?'))
    if (hash.endsWith(".md")) hash = hash.substring(0, hash.lastIndexOf('/'))
    return hash;
  };

  const file_path = function(uri) {
    if (uri.lastIndexOf("?") > 0) uri = uri.substring(0, uri.lastIndexOf('?'))
    if (!uri.endsWith(".md")) uri = `${uri}/index.md`;
    if (!uri.startsWith(PATHNAME)) uri = `${PATHNAME}${uri}`;
    return uri;
  };

  const render_page = function(uri) {
    fetch(file_path(uri)).then(response => {	
      return response.text();
    }).then((text) => {			
      marked.use({renderer});
      let html = marked.parse(text);
      document.getElementById('content').innerHTML = html;
      if (hljs != undefined) hljs.highlightAll();
      let casts = document.getElementsByClassName("_the_asciinema_media");
      for (var i = 0; i < casts.length; i++) {
        let cast = casts[i];
        if (cast.hasAttribute("file_uri")) {
          AsciinemaPlayer.create(cast.getAttribute("file_uri"), cast, {
            terminalFontSize: "small",
            idleTimeLimit: 2,
          });
        }
      }
    }).catch((error) => {
      console.log(`Error: ${error.message}`);
    });
  };

  const renderer = {
    link: function(obj) {
      let href = obj.href, text = obj.text;
      if (href.indexOf("://") > 0 || href.indexOf("//") === 0) {
        if (href.startsWith("cast:///")) {
          console.log("cast", href);
          let file_uri = href.replace("cast:///", "");
          console.log("file uri", file_uri);
          return `<div class="_the_asciinema_media" file_uri="${file_uri}"></div>`;
        }

        if (href.startsWith("file:///")) {
          console.log("file", href);
          let file_uri = href.replace("file:///", "");
          console.log("file uri", file_uri);
          return `<a href="${window.location.origin}/${file_uri}" target="_blank">${text}</a>`;
        }

        return `<a href="${href}" target="_blank">${text}</a>`;
      } else {
        // specific link, don't touch
        if (href.startsWith("mailto")) {
          return `<a href="${href}">${text}</a>`;
        }

        if (!href.startsWith("/")) href = `${basename()}/${href}`;
        href = href.replace("#", "");

        if (!href.endsWith(".md") || href.endsWith("index.md")) {
          return `<i class="fa-solid fa-folder"></i> <a href="#${href}?${Math.random()}">${text}</a>`;
        } else {
          return `<i class="fa-solid fa-file"></i> <a href="#${href}?${Math.random()}">${text}</a>`;
        }
      }
    }
  };
  const _update_page = function () {
    const new_page = location.hash ? location.hash: '#/index.md';
    render_page(new_page.replace('#', ''));
  };

  window.onload = window.onhashchange = _update_page;

  const scripts = [
    "https://cdnjs.cloudflare.com/ajax/libs/marked/14.1.3/marked.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/highlight.min.js",
    "https://cdn.jsdelivr.net/npm/asciinema-player@3.8.1/dist/bundle/asciinema-player.min.js"
  ];

  const styles = [
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/atom-one-dark.min.css",
    "https://cdn.jsdelivr.net/npm/asciinema-player@3.8.1/dist/bundle/asciinema-player.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css",
  ];

  window.addEventListener("DOMContentLoaded", () => {
    let tag = document.createElement("meta");
    tag.charset = "UTF-8";
    tag.name = "viewport"
    tag.content = "width=device-width, initial-scale=1";
    document.head.appendChild(tag);

    for(const script of scripts) {
      const tag = document.createElement("script");
      tag.src = script;
      document.head.appendChild(tag);
    }

    for(const style of styles) {
      const tag = document.createElement("link");
      tag.rel="stylesheet"
      tag.type="text/css"
      tag.href = style;
      tag.crossorigin="anonymous";
      document.head.appendChild(tag);
    }

    const links = [
      { title: "HOME",  href: "#/index.md" },
      { title: "ACTIVITIES",  href: "#/posts" },
      { title: "ABOUT",  href: "#/about" },
    ];

    for (const link of links) {
      let tag = document.createElement("span");
      tag.innerHTML = link === links[0] ? "" : " | ";
      document.body.appendChild(tag);

      tag = document.createElement("a");
      tag.href = link.href;
      tag.innerHTML = link.title;
      document.body.appendChild(tag);
    }
    document.body.appendChild(document.createElement("hr"));

    tag = document.createElement("div");
    tag.id = "content";
    document.body.appendChild(tag);
    document.body.appendChild(document.createElement("hr"));

    tag = document.createElement("span");
    tag.innerHTML = "&copy;2024 ";
    document.body.appendChild(tag);

    tag = document.createElement("a");
    tag.href = `${window.location.origin}`;
    tag.innerHTML = `${window.location.hostname.toUpperCase()}`;
    document.body.appendChild(tag);
  });
})();
