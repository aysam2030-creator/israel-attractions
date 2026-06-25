## 2026-06-25 - Memoizing react-leaflet Objects
**Learning:** In React Leaflet, re-creating objects like `L.divIcon` or inline arrays (e.g. polyline positions) during renders causes the map library to rapidly destroy and re-create DOM nodes, leading to severe visual thrashing and lag.
**Action:** When working with Leaflet properties such as markers and polylines, always cache `L.divIcon` instances in a `Map` (since they are external to React's lifecycle) and memoize coordinate arrays and options objects with `useMemo` or external constants.

## 2026-06-25 - Fixing Capacitor Android CI invalid source release
**Learning:** Capacitor 5+ sometimes auto-generates `android/app/capacitor.build.gradle` with `JavaVersion.VERSION_21` which fails on GitHub Actions CI using Java 17.
**Action:** When fixing CI, explicitly append a compileOptions block to `android/app/build.gradle` setting Java 17 and also use sed to replace VERSION_21 with VERSION_17 in `android/app/capacitor.build.gradle`.
