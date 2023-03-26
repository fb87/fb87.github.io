# vim: tabstop=4 softtabstop=4
{ pkgs ? import <nixpkgs>{}}:

pkgs.mkShell {
        packages = with pkgs; [
                nodejs
        ];

        shellHook = ''
                npm install
                npm audit fix --force
        '';
}
