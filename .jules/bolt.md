## 2024-03-XX - Leaflet Marker Instantiation in React loops
**Learning:** Creating instances like `L.divIcon` inline within a mapping function creates new object references on every render, triggering expensive DOM operations and excessive re-renders in react-leaflet.
**Action:** Extract map elements to memoized wrapper components or cache static map elements externally (like icons using a `Map` based on a composite key) to preserve object references.

## 2024-03-XX - Passing Evaluated Values vs. Complex References
**Learning:** Passing complex objects or arrays (like `tripIds={tripIds}`) directly into children inside a map forces React to bypass shallow comparison optimizations.
**Action:** Pass evaluated primitives (e.g. `isTrip={tripIds.includes(a.id)}`) to allow React.memo to successfully bail out of renders.
