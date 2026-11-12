# RALauncher

Arcade Shelf: a single-file PWA launcher for RetroArch on iPad/iPhone, built to be driven by a controller in landscape.

- Consoles: one console in focus, flanked by its neighbours. D-pad/stick to choose, A to open.
- Games: a shelf of that console's cartridges (or discs) with the box art on the label, plus the full box and a blurred screenshot behind.
  LB/RB (or up/down) jumps by letter, A launches in RetroArch, B goes back.
- Touch and keyboard work too (swipe/tap, arrows, Enter, Esc, PageUp/PageDown).

Add it to the home screen from Safari, then tap **Update library** and pick the `.lpl` playlists from `RetroArch › playlists`.

## Releasing changes

Bump the version with every change you push, or installed copies won't notice:

```sh
tools/bump-version.sh          # 1.1.0 -> 1.1.1
tools/bump-version.sh minor    # 1.1.0 -> 1.2.0
```

This updates `APP_VERSION` and the `app-version` meta tag in `index.html`. The page registers `sw.js?v=<version>`, so a new version installs a fresh service worker and clears the old cache. Each time you come back to the app (for example after quitting a game in RetroArch), it checks the live version and reloads if it changed. Your library and position are kept. The service worker serves the app network-first, so it also opens offline.
