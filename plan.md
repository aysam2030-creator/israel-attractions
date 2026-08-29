1. **Optimize React-Leaflet Markers in `src/App.tsx`**
   - Import `memo` from `react` on line 1.
   - Refactor `makePin` (around line 22) to use an external `Map` as a cache (`pinCache`), avoiding the creation of new `L.divIcon` instances on every render.
   - Extract the inline `<Marker>` component (around line 534) into a new `memo`-ized component named `AttractionMarker`. This will also memoize the `eventHandlers` prop to prevent Leaflet from re-attaching event listeners on every render.
   - Replace the inline `<Marker>` mapping with `<AttractionMarker>` passing the necessary stable props.

2. **Verify Changes**
   - Run `pnpm lint` or `npm run lint` to check for linter errors.
   - Run `npx tsc -b` to verify TypeScript types.
   - Run `npm run build` to ensure the project builds correctly.

3. **Complete pre-commit steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

4. **Submit Pull Request**
   - Create a PR with a descriptive title and body outlining the What, Why, Impact, and Measurement of the optimization.
