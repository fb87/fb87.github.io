{ pkgs ? import <nixpkgs> {} }:

let
  index_html = pkgs.writeText "index.html" ''
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.2">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="icon" href="./favicon.ico" type="image/x-icon">
        <style>${builtins.readFile ./style.css}</style>
	<link href="https://fonts.cdnfonts.com/css/junicode" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Lekton:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
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
      ${pkgs.python3}/bin/python3 -m http.server -p 8080 &
    }
  '';
}
