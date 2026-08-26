
## 2024-11-20 - React-Leaflet Marker Thrashing
**Learning:** In react-leaflet, passing inline objects to `eventHandlers` or generating new Leaflet elements (`L.divIcon`) inside render loops creates new object references on every render. This forces `react-leaflet` to needlessly unbind and rebind event listeners, and reconstruct DOM nodes for every map marker, causing severe performance bottlenecks. Using `React.memo` around `Marker` components and caching `L.divIcon` instances externally completely eliminates this overhead.
**Action:** Always extract Leaflet child elements into memoized subcomponents, use `useMemo` for their props/event-handlers, and aggressively cache Leaflet instances like `L.divIcon` using an external `Map` keyed by arguments.
