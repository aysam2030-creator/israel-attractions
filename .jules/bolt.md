## 2024-05-18 - Caching Leaflet Icons inside React Loops
**Learning:** In react-leaflet, passing inline objects to the \`eventHandlers\` prop inside loops combined with calling \`L.divIcon\` dynamically creates new object references on every render, leading to unnecessary Leaflet DOM manipulation and marker updates.
**Action:** Always cache dynamically generated objects like \`L.divIcon\` outside the render loop (e.g., using a global \`Map\`) and extract the Leaflet element into its own \`React.memo\` component to prevent map thrashing.
