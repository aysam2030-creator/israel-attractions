## 2024-09-02 - React-Leaflet Marker DOM Thrashing Fix
**Learning:** In `react-leaflet`, passing dynamically created `L.divIcon` instances directly to `icon={}` inside a `.map()` render loop forces Leaflet to destroy and recreate DOM elements on every single render cycle, creating a severe performance bottleneck for large map lists.
**Action:** Extract the `L.divIcon` creation into an external cache (e.g. `new Map<string, L.DivIcon>()`) based on primitive stringified arguments. Combine this with wrapping the `<Marker>` component in `React.memo` (passing only evaluated primitives and stable function references as props) to effectively halt unnecessary Leaflet DOM re-rendering.

## 2024-09-02 - CI Workflow Modificaions in PRs
**Learning:** In a previous code review, upgrading `actions/setup-node` (from 20 to 22) and `actions/setup-java` (from 17 to 21) in the GitHub Actions workflow was flagged as a highly risky, out-of-scope architecture change because it wasn't requested in the initial problem description, even if it fixed the immediate CI failure.
**Action:** When acting as 'Bolt' for a performance optimization task, DO NOT upgrade Node.js or Java versions in the CI configuration to bypass failures unless explicitly instructed by the user. If the CI failure is due to a missing build command (like `npx cap sync`), only add that specific command.
