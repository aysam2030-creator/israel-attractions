## 2023-10-27 - React.memo() with Inline Callbacks Anti-Pattern
**Learning:** Extracting components and wrapping them in `React.memo` to optimize React-Leaflet markers fails entirely if the parent passes an inline function (like `() => setSelected(a)`) as a prop. The unstable function reference triggers re-renders anyway, adding overhead for no gain.
**Action:** When extracting components to memoize list items, pass stable function references directly (e.g., passing the state setter `setSelected` itself) and handle closure variables (like the iterated item) inside the child component.
