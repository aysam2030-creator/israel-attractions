## 2024-05-24 - Leaflet DivIcon Caching
**Learning:** Leaflet's `divIcon` instances are often recreated unnecessarily inside React render loops (like mapping over attractions to render `<Marker>`s). This causes severe DOM thrashing because Leaflet has to constantly parse the HTML string and re-attach elements if the icon reference changes.
**Action:** Always extract Leaflet icon creation outside of the render loop and use a `Map` cache keyed by the unique props (e.g. `color`, `isTrip`) to ensure stable object references and prevent React-Leaflet from unnecessarily updating the DOM.
