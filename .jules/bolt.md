## 2024-05-18 - Caching Leaflet properties prevents DOM thrashing
**Learning:** React-Leaflet heavily relies on referential equality for object properties (like `icon`, `pathOptions`, and array of positions). Passing new objects inline or creating them inside the render function causes Leaflet to continually teardown and recreate DOM elements on every React render.
**Action:** Always memoize, hoist, or cache Leaflet complex objects (like `L.divIcon`, style options, and coordinate arrays) when passing them to React-Leaflet components to ensure smooth rendering and avoid severe performance penalties.
## 2024-05-18 - Capacitor CLI context requirement
**Learning:** Running `npx cap sync android` inside the `android/` directory fails with "android platform has not been added yet". Capacitor commands expect to be run from the root of the project where `capacitor.config.ts` exists.
**Action:** Always run `cap` commands from the project root.
## 2024-05-18 - Gradle dependency failure due to missing plugin build.gradle
**Learning:** In CI environments where `npx cap sync android` is skipped, the entire `capacitor-cordova-android-plugins` directory may be missing. Dynamically generating just `cordova.variables.gradle` is not enough, as Gradle will fail to resolve the module dependencies (e.g. `Could not resolve project :capacitor-cordova-android-plugins`) because the `build.gradle` defining it as a library module is missing.
**Action:** When working around missing Capacitor plugin directories in Android CI builds, dynamically generate both a minimal `build.gradle` containing `apply plugin: "com.android.library"` and the `cordova.variables.gradle` file.
## 2024-05-18 - Gradle Evaluation Lifecycle for dynamic files
**Learning:** Dynamically generating a missing `build.gradle` file inside `app/build.gradle` is too late in the Gradle lifecycle to properly define a library subproject. `settings.gradle` has already been evaluated and determined the directory is empty.
**Action:** Always place scripts that dynamically generate missing subproject `build.gradle` files inside `settings.gradle` BEFORE assigning the `projectDir` property, ensuring Gradle resolves the dependency structure correctly.
