## 2024-05-25 - Prevent DOM thrashing in react-leaflet Markers
**Learning:** In `react-leaflet`, passing inline generated icons (like `L.divIcon` from `makePin`) to `Marker` components forces the underlying Leaflet instance to be recreated on every render. This leads to severe performance bottlenecks (DOM thrashing) when rendering many markers or updating state frequently.
**Action:** Always cache or memoize Leaflet icon objects (e.g., using a `Map` outside the component) and properties like `pathOptions` to maintain stable object references across React renders.
## 2024-05-25 - MissingResourceException for cordova.variables.gradle
**Learning:** When building the Android app locally or in CI (e.g., via Gradle), a `MissingResourceException` for `cordova.variables.gradle` indicates that Capacitor has not generated the necessary Cordova plugin files. This happens when `npx cap sync android` or `npx cap update android` is skipped before the build step.
**Action:** Always ensure `npx cap update android` or `npx cap sync android` is executed before the build step (e.g., in CI workflows) to generate the required Cordova variables and plugin files.
