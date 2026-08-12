1. **Memoize Leaflet Markers in `src/App.tsx`**
   - At the bottom of `src/App.tsx` (after line 689), add a new component `MemoizedMarker`:
     ```tsx
     interface MemoizedMarkerProps {
       a: Attraction;
       icon: L.DivIcon;
       lang: Lang;
       onSelect: (a: Attraction) => void;
     }

     const MemoizedMarker = memo(({ a, icon, lang, onSelect }: MemoizedMarkerProps) => {
       const onClick = useCallback(() => onSelect(a), [a, onSelect]);
       return (
         <Marker position={[a.lat, a.lng]} icon={icon} eventHandlers={{ click: onClick }}>
           <Popup>
             <div className="popup">
               <strong>{a.name[lang]}</strong>
               <div className="popup-city">{a.city[lang]}</div>
             </div>
           </Popup>
         </Marker>
       );
     });
     ```
   - Update imports on line 1 to include `memo` and `useCallback`: `import { useEffect, useMemo, useRef, useState, memo, useCallback } from "react";`.
   - Wrap `setSelected` into a stable callback inside `App` by adding the following right after `const [selected, setSelected] = useState<Attraction | null>(null);` (line 111):
     `const handleSelect = useCallback((a: Attraction) => setSelected(a), []);`
   - Replace the `mapAttractions.map` block (lines 534-552) with:
     ```tsx
                   {mapAttractions.map((a) => (
                     <MemoizedMarker
                       key={a.id}
                       a={a}
                       lang={lang}
                       icon={makePin(
                         REGION_COLORS[a.region],
                         tripIds.includes(a.id),
                         tab === "trip" ? tripIds.indexOf(a.id) + 1 : undefined
                       )}
                       onSelect={handleSelect}
                     />
                   ))}
     ```
2. **Add a cache for `makePin` in `src/App.tsx`**
   - Replace the `makePin` function in `src/App.tsx` (lines 22-31) with:
     ```tsx
     const pinCache = new Map<string, L.DivIcon>();
     function makePin(color: string, isTrip: boolean, step?: number) {
       const key = `${color}-${isTrip}-${step ?? ""}`;
       if (pinCache.has(key)) return pinCache.get(key)!;
       const stepHtml = step !== undefined ? `<div class="pin-step">${step}</div>` : "";
       const icon = L.divIcon({
         className: "custom-pin",
         html: `<div class="pin ${isTrip ? "pin-trip" : ""}" style="--pin:${color}"><div class="pin-inner"></div>${stepHtml}</div>`,
         iconSize: [28, 36],
         iconAnchor: [14, 34],
         popupAnchor: [0, -32],
       });
       pinCache.set(key, icon);
       return icon;
     }
     ```
3. **Verify correct extraction**
   - Run `git diff src/App.tsx` to verify the cache mapping and component extraction were applied successfully.
4. **Run testing and verification**
   - Run `npm run lint`
   - Run `npx tsc -b`
   - Run `npm run build`
5. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
6. **Submit the PR**
   - Submit the PR with the title '⚡ Bolt: Optimize map markers rendering'.
