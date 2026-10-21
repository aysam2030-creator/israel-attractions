## 2024-10-21 - Cache Map Pins
**Learning:** React Leaflet reconstructs `L.divIcon` objects inside maps every render if they aren't cached, causing severe DOM thrashing on large arrays of markers.
**Action:** Use an external Map cache to store and retrieve div icons based on a composite key of their creation parameters.
