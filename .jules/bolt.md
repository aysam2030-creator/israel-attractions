## 2024-10-24 - React-Leaflet DivIcon DOM Thrashing
**Learning:** In react-leaflet, re-creating `L.divIcon` instances on every render inside map loops defeats the library's internal memoization because the icon reference constantly changes. This causes React-Leaflet to unnecessarily re-render and re-mount DOM nodes for every marker on the map during any state update (e.g., changing active tabs or dragging the map).
**Action:** When working with dynamically styled `L.divIcon` instances (like markers with changing colors or trip numbers), always extract a caching mechanism (like an external `Map` indexed by the dynamic properties) to return the same exact `L.DivIcon` object reference across renders for identical parameter combinations.

## 2024-10-24 - Capacitor 8.x CI Requirements & Android Tools Deprecation
**Learning:** Capacitor 8.x Android builds require a modern toolchain, specifically Node 22 (for CLI/plugin synchronization) and Java 21 (for Gradle `compileDebugJavaWithJavac`). Furthermore, the `tools` package in the Android SDK Manager is obsolete and its inclusion in `android-actions/setup-android@v3` causes immediate build failures.
**Action:** Always ensure CI environments match Capacitor 8.x minimum requirements (Node 22, Java 21) and scrub deprecated packages like `tools` from setup-android configurations to prevent unpredictable workflow crashes.
