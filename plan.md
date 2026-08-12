1. **Fix GitHub Actions Workflow**
   - Update `node-version: "20"` to `"22"` in `.github/workflows/android-build.yml` because Capacitor 8 requires Node.js >= 22.0.0.
   - Update `actions/setup-java@v4` to `v5` and `java-version: "17"` to `"21"` in `.github/workflows/android-build.yml` because Capacitor 8 Android builds require Java 21, and `setup-java@v4` is deprecated.
   - Replace the entire "Stage web bundle into Android assets" step with a simple `npx cap sync android` command. This correctly stages the assets and fixes the missing `cordova.variables.gradle` build error since Capacitor will generate it natively.
2. **Run tests**
   - Verify workflow changes by running actionlint (if possible) or by relying on local build test for Capacitor.
3. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
4. **Submit PR**
