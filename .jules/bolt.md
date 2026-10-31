## 2024-10-31 - React-Leaflet DOM Thrashing with Dynamic Icons
**Learning:** In react-leaflet, passing a dynamically generated object like `L.divIcon` to a `<Marker>` inside a map loop causes severe DOM thrashing. Because the object reference changes on every render, react-leaflet removes and recreates the marker's DOM nodes entirely.
**Action:** Always cache Leaflet objects using an external `Map` based on a composite key of their parameters when rendering inside functional components to ensure reference stability.
