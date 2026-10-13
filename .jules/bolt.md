## 2024-10-13 - React-Leaflet DOM Thrashing with dynamic icons
**Learning:** Returning a new `L.divIcon` instance on every render causes `react-leaflet` to tear down and recreate the DOM node for every marker because the object reference changes, leading to severe DOM thrashing in large lists.
**Action:** Cache dynamically generated Leaflet objects like `L.divIcon` instances using an external `Map` with a composite key based on their parameters, rather than recreating them inside a render loop.
