## 2024-10-16 - Prevent React-Leaflet DOM Thrashing
**Learning:** Recreating `L.divIcon` instances on every render inside `mapAttractions.map()` causes React-Leaflet to constantly update DOM nodes, leading to severe performance degradation when panning/zooming.
**Action:** Cache `L.divIcon` instances outside the render loop using a `Map` based on a composite key of their parameters.

## 2024-10-16 - CI Build Fixes
**Learning:** Obsolete package 'tools' inside `android-actions/setup-android@v3` will cause a build fail. Node 20 is deprecated and node 22 is required. `setup-java` deprecation warnings should not be upgraded to v5 since it doesn't exist yet, but Capacitor 8.x Android requires Java 21, and `npx cap sync android` needs to be called after web bundle is built.
**Action:** Update Node version to 22, update Java version to 21 for capacitor 8.x, remove obsolete 'tools' package and add `npx cap sync android` in CI workflows.
