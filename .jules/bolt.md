## 2024-06-21 - React-Leaflet Props Reference Stability
**Learning:** In `react-leaflet`, passing inline objects (like `pathOptions={{ color: "#a78bfa", weight: 4 }}`) to map components or recreating Leaflet objects (like `L.divIcon()`) on every render can cause severe performance issues because it constantly triggers Leaflet layer updates due to changing object references.
**Action:** Always extract static options objects (like `pathOptions`) to constants outside the component, and memoize or cache dynamically generated Leaflet objects (like `L.divIcon` instances).
## 2024-06-21 - Android CI build failure fix for ignored Capacitor plugins
**Learning:** CI builds can fail trying to read `cordova.variables.gradle` if `capacitor-cordova-android-plugins` is not present (e.g. because `npx cap sync android` wasn't run on CI or the directory is gitignored).
**Action:** Always dynamically create a minimal `build.gradle` and `cordova.variables.gradle` inside `android/settings.gradle` for the `capacitor-cordova-android-plugins` directory before it gets referenced by Gradle, ensuring the build succeeds without the need for manual Capacitor syncs on CI.
