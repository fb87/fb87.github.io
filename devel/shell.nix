{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  shellHook = ''
    function minifyAll() {
      ${pkgs.minify}/bin/minify -o rhtml/style.min.css devel/style.css
      ${pkgs.minify}/bin/minify -o rhtml/script.min.js devel/script.js
      ${pkgs.minify}/bin/minify -o index.html          devel/index.htm
    }

    function preview() {
      ${pkgs.python3}/bin/python3 -m http.server&
    }
  '';
}
