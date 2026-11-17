# SRB Countdown PWA

A responsive, installable countdown timer built with HTML, CSS and vanilla JavaScript.

## Features
- Full-screen countdown to a selected local time
- Automatically targets tomorrow if today's selected time has passed
- Pause / resume, change time and fullscreen controls
- Animated interface with inline SVG vector icons
- Optional finish chime and vibration (where supported)
- Offline caching with a service worker
- Installable on supported phones and desktop browsers

## Publish on GitHub Pages
1. Create a new GitHub repository, for example `srb-countdown`.
2. Upload **all files and folders** from this project. Keep `index.html` in the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/(root)`, then Save.
6. Wait for the Pages URL to appear. Open it over HTTPS.

## Install
- **Android / Chrome:** Open the published URL → browser menu → Install app / Add to Home screen.
- **iPhone / Safari:** Open the URL → Share → Add to Home Screen.
- **PC / Chrome or Edge:** Open the URL → install icon in the address bar, or browser menu → Install SRB Countdown.

## Notes
- The app uses your device's local time.
- The app must be served from HTTPS (GitHub Pages provides HTTPS) or localhost for PWA installation and service-worker support.
- Google Fonts are optional; if offline, the app falls back to system fonts.
