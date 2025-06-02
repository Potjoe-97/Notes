{
  description = "TriliumNext Notes (experimental flake)";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        packageJSON = builtins.fromJSON (builtins.readFile ./package.json);
        pkgs = import nixpkgs { inherit system; };
        electron = pkgs.electron_35;
        inherit (pkgs)
          copyDesktopItems
          lib
          makeBinaryWrapper
          makeDesktopItem
          nodejs
          pnpm
          stdenv
          wrapGAppsHook3
          ;
        desktop = stdenv.mkDerivation (finalAttrs: {
          pname = "triliumnext-desktop";
          version = packageJSON.version;
          src = lib.cleanSource ./.;

          nativeBuildInputs = [
            pnpm.configHook
            nodejs
            nodejs.python
            copyDesktopItems
            makeBinaryWrapper
            wrapGAppsHook3
          ];

          dontWrapGApps = true;

          buildPhase = ''
            runHook preBuild

            # Disable NX interaction
            export NX_TUI=false
            export NX_DAEMON=false

            patchelf --set-interpreter $(cat $NIX_CC/nix-support/dynamic-linker) \
              node_modules/.pnpm/sass-embedded-linux-x64@*/node_modules/sass-embedded-linux-x64/dart-sass/src/dart
            pnpm nx run desktop:build --outputStyle stream --verbose

            # Rebuild dependencies
            export npm_config_nodedir=${electron.headers}
            pnpm nx run desktop:rebuild-deps --outputStyle stream --verbose

            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall

            mkdir -p $out/{bin,share/icons/hicolor/512x512/apps,opt/trilium}
            cp --archive apps/desktop/dist/* $out/opt/trilium
            cp apps/client/src/assets/icon.png $out/share/icons/hicolor/512x512/apps/trilium.png
            makeWrapper ${lib.getExe electron} $out/bin/trilium \
              "''${gappsWrapperArgs[@]}" \
              --set-default ELECTRON_IS_DEV 0 \
              --add-flags $out/opt/trilium/main.cjs

            runHook postInstall
          '';

          desktopItems = [
            (makeDesktopItem {
              name = "TriliumNext Notes";
              exec = finalAttrs.meta.mainProgram;
              icon = "trilium";
              comment = finalAttrs.meta.description;
              desktopName = "TriliumNext Notes";
              categories = [ "Office" ];
              startupWMClass = "Trilium Notes Next";
            })
          ];

          pnpmDeps = pnpm.fetchDeps {
            inherit (finalAttrs) pname version src;
            hash = "sha256-xC0u1h92wtthylOAw+IF9mpFi0c4xajJhUcA9pqzcAw=";
          };

          meta = {
            description = "Free and open-source, cross-platform hierarchical note taking application with focus on building large personal knowledge bases";
            mainProgram = "trilium";
          };
        });
      in
      {
        packages.default = desktop;
      }
    );
}
