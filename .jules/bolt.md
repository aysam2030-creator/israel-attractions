## 2026-05-11 - O(n²) to O(n) Message Lookup Optimization
**Learning:** Found an O(n²) operation inside the render loop of Chat.tsx where it was doing `messages.find((x) => x.id === m.replyTo)` and `searchResults.some((s) => s.id === m.id)` for every message rendered. This causes significant CPU spike and lag when the chat history or search results grow.
**Action:** Replaced O(N) array search inside `.map()` with an O(1) hash map lookup (`messageMap`) and a Set (`searchResultIds`) to optimize performance for large chat threads.
