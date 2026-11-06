## 2024-11-06 - Capacitor 8 CI Workflow Issues
**Learning:** Capacitor 8.x requires Node >= 22 and Java 21 for Android builds. Additionally, the native configuration generation (e.g., `cordova.variables.gradle`) must be run using `npx cap sync android` after building the web assets.
**Action:** Update the GitHub Actions workflow to use Node 22, Java 21, and insert `npx cap sync android` after `npm run build`.
