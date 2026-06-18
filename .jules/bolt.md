## 2024-06-18 - Leaflet Map Marker Performance Optimization
**Learning:** In a React app using `react-leaflet`, recreating leaflet property objects (like `L.divIcon`, `pathOptions`, and event handlers) on every render causes severe performance bottlenecks due to DOM thrashing as Leaflet recreates DOM nodes.
**Action:** Always cache or extract `L.divIcon` instances, use stable constants for polyline `pathOptions`, and wrap react-leaflet map markers in `React.memo` with memoized props (`useMemo` for positions and eventHandlers) to ensure stable references across renders.

## 2024-06-18 - CI Build Fix for Capacitor
**Learning:** The Android build pipeline uses JDK 17, but newer Capacitor 8 dependencies (like `@capacitor/android@8.3.1`) require JDK 21. Attempting to build with JDK 17 causes `invalid source release: 21` errors. Additionally, standard CI steps might run node/java setups that conflict with the actual `@capacitor/android` runtime requirements.
**Action:** Always verify the Java sourceCompatibility requirements in Capacitor Android dependencies match the CI pipeline's installed Java version. When fixing CI pipeline issues for Capacitor projects failing with `invalid source release: 21`, bump the `setup-java` action to version 21.
