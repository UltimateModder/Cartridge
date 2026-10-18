# Cartridge

A private retro game library and launcher that lives in **one HTML file**. Import the ROMs you own, organize them by console, fetch box art automatically, and play right in the browser, on desktop or mobile.

No server, no account, no build step. Your files never leave your device.

<!-- Add a screenshot here, e.g. ![Home](screenshots/home.png) -->

> **Legal:** Cartridge ships with no games, BIOS files, or ROM downloads. It is for games you legally own. You supply your own files.

## Features

- **Single file:** everything is in `index.html` (HTML, CSS, and vanilla JavaScript).
- **Import:** pick multiple files, pick a whole folder, or drag and drop. Each import shows filename, size, detected console, and status.
- **Console detection by file extension,** with manual correction. Ambiguous types (`.bin`, `.iso`, `.cue`, `.zip`) go to "Other consoles" and the app asks which system they belong to when you press Play.
- **Library tools:** search, sort by title, console, date added, or size, favorites and "added this week" filters, grid and list views, and a random-game button.
- **Edit games:** titles, descriptions, console, and custom cover images. Remove games with a confirmation.
- **Automatic cover art:** on import, covers are looked up from the free libretro box-art library, with SteamGridDB as an optional fallback (needs a free API key).
- **Covers match the box:** wide SNES and N64 art gets a wide tile, square PS1 art a square tile, and so on.
- **Play in the browser** through [EmulatorJS](https://emulatorjs.org).
- **Seamless resume:** closing a game saves a save state, and launching it again loads that state.
- **Mobile-friendly player:** full-screen play with no toolbar. A hidden ✕ appears when you hover or tap the top-left corner.
- **Higher 3D resolution** option for N64 and PSP.
- **Themes:** dark and light, with a configurable accent color.
- **Extensible:** add your own consoles (name plus file extensions) in Settings.
- **Local storage:** ROMs, covers, save states, and metadata are kept in your browser's IndexedDB. Nothing is uploaded.

## Supported consoles

| Console | Plays in browser |
|---|---|
| NES, SNES | Yes |
| Master System / Game Gear | Yes |
| Genesis / Mega Drive / 32X | Yes |
| Saturn | Yes (BIOS may be required) |
| Game Boy, Game Boy Color, GBA | Yes |
| Nintendo 64 | Yes |
| PlayStation (PS1) | Yes |
| Nintendo DS | Yes |
| PSP | Experimental (see below) |

Systems with no working browser emulator (Dreamcast, PS2, GameCube, Wii, 3DS) are intentionally not listed. If you import a file for one, it lands in "Other consoles".

## Getting started

1. Download `index.html`.
2. Open it in a modern browser (Chrome, Edge, Firefox, Safari).
3. Click **Import games** and choose your ROM files or a folder, or drop them onto the page.
4. Open a game and press **Play**.

### Run it from a local web server (recommended)

Opening the file directly (`file://`) works for browsing the library, but emulation is more reliable over HTTP. From the folder containing the file:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Playing games

Play loads the EmulatorJS player from `cdn.emulatorjs.org` when you press Play, so you need an internet connection. Your ROM stays in your browser.

- **Offline play:** download an EmulatorJS release, put its `data` folder next to the HTML file, and enter its path (for example `emulatorjs/data/`) in **Settings → Emulator files**.
- **BIOS files:** none are bundled. Saturn and some other systems need your own BIOS, and the player will ask for it.
- **PSP:** needs a cross-origin-isolated page (HTTPS plus special headers). On a plain local server it will probably stay black, and the app warns you first.
- **Speed:** DS, N64, and Saturn can be slow on older phones. iOS versions 18.2 to 18.3 are reported to break browser emulation.
- **PS1 `.bin/.cue`:** the library stores one file per game, so single-file formats (`.chd`, `.pbp`) are the safest choice for PS1 discs.

### Save states and resolution

- Closing a game (or switching away from the tab) saves a state. Launching the game again resumes it. Turn this off in **Settings → Playing**. Use **Reset save state** on a game's details screen to start fresh.
- **Settings → Playing → 3D resolution** sets Native, 2x, or 4x for N64 and PSP. PS1 and DS use software renderers with no resolution boost.

## Cover art

1. **libretro thumbnails (default):** free, no key. Matches by file name, so the standard No-Intro style works best, like `Super Mario World (USA).sfc`. Names with underscores such as `Super_Mario_World__USA_.sfc` are cleaned up automatically.
2. **SteamGridDB (optional fallback):** paste a free API key in **Settings → Cover art**.

SteamGridDB's API does not appear to allow direct browser requests (CORS). If lookups fail, run a small proxy and set its URL in Settings. A local helper, `sgdb-proxy.py`, is included:

```bash
python3 sgdb-proxy.py
# then set the CORS proxy URL to: http://localhost:8787/?url=
```

For use on phones and other devices, you can host the same idea as a free Cloudflare Worker that only forwards to `steamgriddb.com`. Avoid public CORS proxies, since your API key would pass through them.

## Install as an app (PWA)

Cartridge can be installed as a desktop or Android app with its own window and icon, and it works offline after the first load. This needs the page to be served over **HTTPS** (or `localhost`), because browsers only allow installation and service workers there. A single HTML file opened from disk cannot be installed.

The easiest free option is **GitHub Pages**:

1. Upload `index.html`, `manifest.webmanifest`, `sw.js`, and the `icons/` folder to your repository.
2. In the repository, go to **Settings → Pages**, choose your branch, and save.
3. Open `https://YOUR-USER.github.io/YOUR-REPO/` in Chrome or Edge, then use the install icon in the address bar. On Android Chrome use menu → **Install app**. On iPhone and iPad use Share → **Add to Home Screen**.

You can also press **Install** in **Settings → Install app** when the browser offers it. After the first load, the app and any EmulatorJS files you have already used are cached, so games you have launched before can start offline. Your ROMs, covers, and save states live in browser storage on that device and are not part of the hosted site. To ship an update to installed copies, change `V` at the top of `sw.js`.

PSP still needs a cross-origin-isolated page, which GitHub Pages does not provide.

## Privacy and storage

- Games, covers, and save states are stored in your browser's IndexedDB, on your device only.
- Browsers can limit or clear storage, and private windows do not keep it. If a stored file goes missing, import it again.
- Lookups send only a file name or title (never the ROM) to `thumbnails.libretro.com` and, if configured, SteamGridDB.
- Your SteamGridDB key is stored in this browser's localStorage.
- **Settings → Export metadata** saves titles and settings as JSON, without ROM files.

## Project files

| File | Purpose |
|---|---|
| `index.html` | The whole app |
| `sgdb-proxy.py` | Optional local helper for SteamGridDB lookups |
| `manifest.webmanifest` | PWA manifest |
| `sw.js` | Service worker for installing and offline use |
| `icons/` | App icons |

## Known limitations

- Resume and the 3D resolution options rely on EmulatorJS settings that have had limited testing. Please open an issue if they do not behave as described.
- One file per game, so multi-file discs (`.cue` plus `.bin`) are not supported as a single entry.
- Browser emulation performance depends heavily on your device.

## Credits

- [EmulatorJS](https://emulatorjs.org) for in-browser emulation (check its license for your intended use).
- [libretro thumbnails](https://thumbnails.libretro.com) for box art.
- [SteamGridDB](https://www.steamgriddb.com) for optional cover art.

## License

Add your license here (for example MIT). Note that EmulatorJS and its emulator cores have their own licenses, which apply to anything you redistribute with them.
