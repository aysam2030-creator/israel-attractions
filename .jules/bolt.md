## 2024-06-19 - React-Leaflet Marker Thrashing
**Learning:** In `react-leaflet`, passing inline objects to `eventHandlers` (e.g. `eventHandlers={{ click: () => setSelected(a) }}`) inside a `.map` loop creates new object references on every render. Combined with dynamic `L.divIcon` creation, this causes massive DOM thrashing and memory bloat on every App state change.
**Action:** Always extract Leaflet elements like `<Marker>` into their own `memo`-ized components, pass stable props (like raw state setters), and externally cache `L.DivIcon` instances using a `Map` keyed by their dynamic properties.

## 2024-06-19 - GitHub Actions CI Setup Deprecations
**Learning:** Capacitor 8.x projects require modern build tools. In CI, Node.js v20 and Java v17 are being deprecated, causing warnings and eventual breakage. Additionally, the obsolete `tools` package in `android-actions/setup-android@v3` will cause exit code 1 if included. Finally, Capacitor native plugins require `npx cap sync android` to run in CI *after* building the web bundle so native files are generated.
**Action:** Always upgrade Node to at least v22, upgrade `setup-java` to v5 and Java to v21, remove the `tools` package from Android setups, and insert `npx cap sync` in the build step.
