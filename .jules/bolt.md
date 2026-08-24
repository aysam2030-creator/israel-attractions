## 2024-10-24 - Optimize React-Leaflet Map Renders
**Learning:** In react-leaflet, inline objects/functions passed as props (like `eventHandlers` or `L.divIcon` instances for markers) cause expensive child component re-renders because their object references change on every parent render cycle, leading to severe DOM thrashing.
**Action:** Extract map elements (like `<Marker>`) into separate `React.memo()` components. Use `useMemo` or external `Map` caches to stabilize prop references (e.g., caching dynamically generated `L.divIcon` instances by a stringified key).
## 2024-10-24 - Fix Capacitor 8.x CI Requirements
**Learning:** Capacitor 8.x requires Node 22 and Java 21 for Android builds. Failing to update these versions in the GitHub actions workflow causes confusing build errors. Furthermore, missing `npx cap sync android` in CI will lead to missing `capacitor-cordova-android-plugins` files, causing Gradle to fail.
**Action:** Always verify CI workflows use `actions/setup-node` with Node 22+ and `actions/setup-java@v5` with Java 21 when building Capacitor 8.x apps. Always ensure `npx cap sync android` runs before `gradlew assembleDebug`.
