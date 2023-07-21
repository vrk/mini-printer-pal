
## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## Updating a release

lord god

OK so I could not for the life of me get this to work on CI, so instead, I am creating releases manually via GitHub Releases!

Here are my notes to self on how to do this:

### Prerequisites

- You need latest Xcode & command-line tools
- You need an Apple Developer Account (and have to pay like $100)
- You need to create a Developer ID Application certificate and export it as a `.p12` file ([instructions here](https://til.simonwillison.net/electron/sign-notarize-electron-macos))
- Also need to find your "Team ID" for notarizing later

### 1. Bump version

1. Update the version number to a higher version in:
- `./package.json`
- `./release/app/package.json`

^ The version should be identical in both files.

Also the version must be strictly higher than the previous release, or auto-update will not work.

### 2. Create the packages locally, signed, but not notarized yet

1. Run `npm run package`

Should take like ~3-5 min to finish, and should output x64 and arm64 builds

(note: must have `"notarize": false` in package.json, and separately it seems you need credentials for [code signing](https://www.electron.build/code-signing.html) to work, though a bit unclear - I've messed up my env variables before and it seemed to still sign somehow 🤷‍♀️)


### 3. Create cute dmgs

_Allegedly_ electron-builder supports dmg file customization, but I couldn't get it to work 😐 it didn't respect most of the customization options I sent it

So instead, I am using `https://github.com/LinusU/node-appdmg`

Prereq: `npm install -g appdmg`

1. Manually copy `release/build/mac` and `release/build/mac-arm64` to `release/dmg-assets`
2. `cd release/dmg-assets`
3. `appdmg app-dmg-arm64.json "Mini Printer Pal-0.0.3-arm64.dmg"` <-- update version number accordingly
4. `appdmg app-dmg.json "Mini Printer Pal-0.0.3.dmg"` <-- update version number accordingly

Also manually fix the dmg icons by doing the following:

1. Copy `icon.icns`
2. Right-click -> Get Info on the dmg file from Finder
3. Click the icon itself on the top-left next to the title
4. Paste

### 4. Gather release assets for GitHub Release

1. Just to make things easier, make some temporary directory somewhere, like `release-v0.0.3` (name doesn't matter) and copy over:

- `Mini Printer Pal-0.0.3-arm64.dmg` from `release/dmg-assets`
- `Mini Printer Pal-0.0.3.dmg` from `release/dmg-assets`
- `Mini Printer Pal-0.0.3-arm64-mac.zip` from `release/build`
- `Mini Printer Pal-0.0.3-mac.zip` from `release/build`
- `latest-mac.yml` from `release/build`

### 5. Manually update `latest-mac.yml`

Since I'm manually creating dmgs via step 3, I need to manually edit `latest-mac.yml` with new values

For both `Mini Printer Pal-0.0.3.dmg` and `Mini Printer Pal-0.0.3-arm64.dmg`:

1. `openssl dgst -binary -sha512 Mini\ Printer\ Pal-0.0.3-arm64.dmg | openssl base64 -A` to get the new sha512 value - set this accordingly in latest-mac.yml
2. `stat -f%z "Mini Printer Pal-0.0.3-arm64.dmg` to get the size of the file - set this accordingly in latest-mac.yml

^^ Remember to do this for both dmgs

### 6. Notarize dmgs and zips

So there should be 4 files total, 2 dmgs, 2 zips, and Apple needs to notarize them all

Prereq: `xcrun notarytool store-credentials`

For each zip and dmg: 

1. Run `xcrun notarytool submit "Mini Printer Pal-0.0.3-mac.zip" --keychain-profile <profile name>`

You can check on the status by `xcrun notarytool history --keychain-profile <profile name>`

It SHOULD only take a few minutes, though lol the first time I tried it, it took hoooooooours 🥲

### 7. Create a GitHub Release

1. Go to https://github.com/vrk/mini-printer-pal/releases/new to draft a new release
2. Make sure the tag name matches the version number set in "1. Bump version"
3. Attach all of the release artifacts, which should be:
- `Mini Printer Pal-0.0.3-arm64.dmg`
- `Mini Printer Pal-0.0.3.dmg`
- `Mini Printer Pal-0.0.3-arm64-mac.zip`
- `Mini Printer Pal-0.0.3-mac.zip`
- `latest-mac.yml`
4. GitHub will rename the spaces in the files to `.` -> change those `.`s to `-`s
5. Click "Publish Release" with the defaults (mark as latest, not pre-release)

OK and "that's" "it" you're done!!!!

### Optional 8. Make sure auto-update works???

1. Open an older release & check the version number
2. After a few seconds, should see a notification like:
3. If you quit immediately and restart, the auto-update won't work - soooo just keep the app open for a few min, maybe eat a snack
4. Close Mini Printer Pal
5. Reopen Mini Printer Pal & check the version number <--  should be the updated version!!


### Some misc release stuff

- Under the hood, electron-builder is using [https://github.com/vrk/mini-printer-pal/releases.atom](https://github.com/vrk/mini-printer-pal/releases.atom) as its update feed to know whether there's a new release. AFAICT, `release.atom` is automatically created by GitHub, for every GitHub repository
- You can sorta debug the auto-updater in a dev build if you create a file called `dev-app-update.yml` in the root directory of the repo. It should look like this:

```
owner: vrk
repo: mini-printer-pal
provider: github
updaterCacheDirName: mini-printer-pal-updater
```

and then in the code you also need to set `autoUpdater.forceDevUpdateConfig`

and if that still doesn't work, just modify the electron-updater library directly in `npm_modules` lol