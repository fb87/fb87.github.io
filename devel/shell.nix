{ pkgs ? import <nixpkgs> {} }:

let
  base64_font = pkgs.runCommandNoCC "" { src = ./.; } ''
    ${pkgs.coreutils}/bin/base64 -w 0 $src/fonts/default.ttf > $out
  '';

  index_html = pkgs.writeText "index.html" ''
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="icon" href="./favicon.ico" type="image/x-icon">
        <style>
          @font-face { font-family: "default-1"; src: url(data:font/truetype;charset=utf-8;base64,${builtins.readFile base64_font}) format('truetype');} }
	</style>
        <style>${builtins.readFile ./style.css}</style>
      </head>
      <body> <script language="javascript">${builtins.readFile ./script.js}</script> </body>
    </html>
  '';

in pkgs.mkShell {
  shellHook = ''
    function minifyAll() {
      rm -f index.html && ${pkgs.minify}/bin/minify -o index.html ${index_html}
    }

    function preview() {
      ${pkgs.python3}/bin/python3 -m http.server&
    }
  '';
}
