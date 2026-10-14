## 2024-05-24 - Leaflet DivIcon Caching
**Learning:** Leaflet's `divIcon` instances are often recreated unnecessarily inside React render loops (like mapping over attractions to render `<Marker>`s). This causes severe DOM thrashing because Leaflet has to constantly parse the HTML string and re-attach elements if the icon reference changes.
**Action:** Always extract Leaflet icon creation outside of the render loop and use a `Map` cache keyed by the unique props (e.g. `color`, `isTrip`) to ensure stable object references and prevent React-Leaflet from unnecessarily updating the DOM.
## 2024-05-24 - Capacitor CI Fixes
**Learning:** Capacitor requires a `cap sync` command to run *after* the web assets are built. If `cap sync` isn't run on the CI server, Capacitor will not generate the required native plugin configuration files (like `cordova.variables.gradle`) inside the `android/` directory, causing the `assembleDebug` Gradle task to fail with a "Could not read script... as it does not exist" error.
**Action:** Always ensure `npx cap sync android` (or iOS) is included in the CI workflow directly after `npm run build`.
