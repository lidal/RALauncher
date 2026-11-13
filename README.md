# Arcade Shelf

A controller-first launcher for RetroArch on iPad and iPhone. Pick a console, flick through your games as box art, press a button and RetroArch starts the game.

![Consoles](docs/ipad-consoles.png)
![Games](docs/ipad-games.png)

## Set up

1. Open the launcher's page in Safari, then **Share › Add to Home Screen**.
2. Open it from the Home Screen, tap **Choose playlists**, go to **On My iPad › RetroArch › playlists** and select all the `.lpl` files.
3. Optional: tap **Save artwork offline** so the box art is there without internet.

Tap **Update library** whenever you add games in RetroArch.

## Controls

| | Controller | Touch |
|---|---|---|
| Browse | D-pad / left stick | Swipe or flick |
| Open / play | Bottom face button | Tap the front item |
| Back | Right face button | ‹ in the top left |
| Jump to next letter | L / R (or up / down) | |
| Save artwork offline | Left face button | Button at the bottom |

## Come back here when you leave RetroArch

iOS also counts pulling down Control Center as RetroArch "closing", so the automation runs a shortcut that first checks RetroArch really is gone.

**1. Get the shortcut:** [Back to Arcade Shelf](https://www.icloud.com/shortcuts/d054cdb1502243bba798543ed64d9a7e). Or build it yourself (Shortcuts › **+**):

1. **Get Current App**
2. **If** *Current App* **is not** *RetroArch*
3. Inside the If: **Open URLs** `webapp://lidal.github.io/RALauncher`
4. **End If**

The `webapp://` prefix opens the Home Screen app rather than Safari. If you host the launcher elsewhere, put your own address after `webapp://`.

**2. Make the automation:** Shortcuts › Automation › New Automation › **App** › **RetroArch**, tick **Is Closed** only, **Run Immediately**. Then add **Run Shortcut** and pick the shortcut from step 1.

## Good to know

- Works offline once installed. Art you've looked at is kept, and **Save artwork offline** fetches the rest.
- Box art and screenshots come from the [libretro thumbnail server](https://thumbnails.libretro.com) and match on the game names in your playlists.
- New versions install themselves the next time you switch back to the app. To publish one, run `tools/bump-version.sh` before pushing.

## Credits

- System icons: RetroArch's Retrosystem theme from [libretro/retroarch-assets](https://github.com/libretro/retroarch-assets), CC BY 4.0. See `img/systems/CREDITS.md`.
- The screenshots show open-source homebrew, with each game's title screen standing in for box art: [Tobu Tobu Girl](https://github.com/SimonLarsen/tobutobugirl) (Tangram Games; MIT, art CC BY 4.0), [Libbet and the Magic Floor](https://github.com/pinobatch/libbet) (Damian Yerrick; zlib), [µCity](https://github.com/AntonioND/ucity) (Antonio Niño Díaz; GPL-3.0+).
