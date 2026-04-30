import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { attractions, type Attraction, type Category, type Region } from "./data/attractions";
import { t, type Lang, type Strings, RTL_LANGS, LANGS } from "./i18n";
import { distanceKm, totalRouteDistance } from "./utils";
import Chat from "./Chat";
import { setupStatusBar, getCurrentPosition, nativeShare, IS_NATIVE } from "./native";
import "./App.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function makePin(color: string, isTrip: boolean, step?: number) {
  const stepHtml = step !== undefined ? `<div class="pin-step">${step}</div>` : "";
  return L.divIcon({
    className: "custom-pin",
    html: `<div class="pin ${isTrip ? "pin-trip" : ""}" style="--pin:${color}"><div class="pin-inner"></div>${stepHtml}</div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    popupAnchor: [0, -32],
  });
}

const REGION_COLORS: Record<Region, string> = {
  north: "#22d3ee",
  center: "#a78bfa",
  jerusalem: "#fbbf24",
  coast: "#34d399",
  deadsea: "#60a5fa",
  south: "#f472b6",
};

const ALL_REGIONS: Region[] = ["north", "center", "jerusalem", "coast", "deadsea", "south"];
const ALL_CATEGORIES: Category[] = ["nature", "history", "religious", "beach", "city", "museum", "family"];

const CAT_EMOJI: Record<Category, string> = {
  nature: "🌿", history: "🏛️", religious: "✡️", beach: "🏖️",
  city: "🌆", museum: "🎨", family: "👨‍👩‍👧",
};
const REGION_EMOJI: Record<Region, string> = {
  north: "⛰️", center: "🏙️", jerusalem: "🕍",
  south: "🏜️", deadsea: "🧂", coast: "🌊",
};

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 12, { duration: 1.0 });
  }, [target, map]);
  return null;
}

type Tab = "explore" | "trip" | "chat";

// Simple "open now" check using common-pattern detection on the hours string
function isOpenNow(hoursEn: string): boolean {
  const h = hoursEn.toLowerCase();
  if (h.includes("24/7") || h.includes("always")) return true;
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  // grab last "HH:MM-HH:MM" pattern (close enough for the demo)
  const matches = h.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g);
  if (!matches || matches.length === 0) return false;
  const last = matches[matches.length - 1];
  const m = last.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!m) return false;
  const open = +m[1] + +m[2] / 60;
  const close = +m[3] + +m[4] / 60;
  return hour >= open && hour <= close;
}

// Encode/decode trip IDs for sharing URLs
function encodeTrip(ids: string[]): string {
  return btoa(unescape(encodeURIComponent(ids.join(","))));
}
function decodeTrip(s: string): string[] {
  try { return decodeURIComponent(escape(atob(s))).split(",").filter(Boolean); }
  catch { return []; }
}

// Cluster trip into N "days" by simple greedy nearest-neighbor + region
function splitByDays(list: Attraction[], days: number): Attraction[][] {
  if (days <= 1 || list.length <= 1) return [list];
  const out: Attraction[][] = Array.from({ length: days }, () => []);
  const perDay = Math.ceil(list.length / days);
  list.forEach((a, i) => out[Math.floor(i / perDay)].push(a));
  return out.filter((d) => d.length > 0);
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const s = localStorage.getItem("lang") as Lang | null;
    return s && LANGS.includes(s) ? s : "en";
  });
  const [tab, setTab] = useState<Tab>("explore");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [familyOnly, setFamilyOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [selected, setSelected] = useState<Attraction | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [tripIds, setTripIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("trip") || "[]"); }
    catch { return []; }
  });
  const [tripDays, setTripDays] = useState(1);
  const [drivingKm, setDrivingKm] = useState<number | null>(null);
  const [drivingMin, setDrivingMin] = useState<number | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const importedRef = useRef(false);

  const T = t[lang];
  const dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";

  const [nearMe, setNearMe] = useState(false);
  const [myPos, setMyPos] = useState<{ lat: number; lng: number } | null>(null);

  // Native init
  useEffect(() => { setupStatusBar(); }, []);

  // Import trip from URL once
  useEffect(() => {
    if (importedRef.current) return;
    const url = new URL(window.location.href);
    const tripParam = url.searchParams.get("trip");
    if (tripParam) {
      const ids = decodeTrip(tripParam).filter((id) => attractions.some((a) => a.id === id));
      if (ids.length > 0) {
        setTripIds(ids);
        setTab("trip");
        setShareToast(`Imported trip with ${ids.length} stops 🎉`);
        setTimeout(() => setShareToast(null), 3500);
      }
      url.searchParams.delete("trip");
      window.history.replaceState({}, "", url.toString());
      importedRef.current = true;
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [dir, lang]);

  useEffect(() => {
    localStorage.setItem("trip", JSON.stringify(tripIds));
  }, [tripIds]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = attractions.filter((a) => {
      if (region !== "all" && a.region !== region) return false;
      if (category !== "all" && !a.categories.includes(category)) return false;
      if (familyOnly && !a.familyFriendly) return false;
      if (freeOnly && !a.freeEntry) return false;
      if (openNow && !isOpenNow(a.hours.en)) return false;
      if (q) {
        const hay = `${a.name.en} ${a.name.he} ${a.name.ar} ${a.city.en} ${a.city.he} ${a.city.ar} ${a.description.en} ${a.description.he} ${a.description.ar}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (nearMe && myPos) {
      list = [...list].sort((a, b) => distanceKm(myPos, a) - distanceKm(myPos, b)).slice(0, 12);
    }
    return list;
  }, [search, region, category, familyOnly, freeOnly, openNow, nearMe, myPos]);

  const toggleNearMe = async () => {
    if (nearMe) { setNearMe(false); return; }
    const pos = await getCurrentPosition();
    if (pos) {
      setMyPos(pos);
      setNearMe(true);
      setFlyTarget([pos.lat, pos.lng]);
    } else {
      setShareToast("Location unavailable. Permission denied?");
      setTimeout(() => setShareToast(null), 2500);
    }
  };

  const tripAttractions = useMemo(
    () => tripIds.map((id) => attractions.find((a) => a.id === id)).filter(Boolean) as Attraction[],
    [tripIds]
  );
  const tripDistance = useMemo(() => totalRouteDistance(tripAttractions), [tripAttractions]);
  const tripByDay = useMemo(() => splitByDays(tripAttractions, tripDays), [tripAttractions, tripDays]);

  // Fetch driving distance via OSRM
  useEffect(() => {
    if (tripAttractions.length < 2) {
      setDrivingKm(null);
      setDrivingMin(null);
      return;
    }
    const coords = tripAttractions.map((a) => `${a.lng},${a.lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;
    let cancelled = false;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const route = data?.routes?.[0];
        if (route) {
          setDrivingKm(Math.round(route.distance / 1000));
          setDrivingMin(Math.round(route.duration / 60));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [tripAttractions]);

  const onPick = (a: Attraction) => {
    setSelected(a);
    setFlyTarget([a.lat, a.lng]);
  };

  const toggleTrip = (id: string) => {
    setTripIds((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  };

  const moveTrip = (id: string, d: -1 | 1) => {
    setTripIds((c) => {
      const i = c.indexOf(id);
      if (i < 0) return c;
      const j = i + d;
      if (j < 0 || j >= c.length) return c;
      const copy = [...c];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const importTrip = (ids: string[]) => {
    setTripIds(ids);
    setTab("trip");
    setShareToast(`Trip imported · ${ids.length} stops`);
    setTimeout(() => setShareToast(null), 2500);
  };

  const shareTrip = async () => {
    if (tripIds.length === 0) return;
    const url = `${window.location.origin}${window.location.pathname}?trip=${encodeTrip(tripIds)}`;
    const text = `Check out my Israel trip: ${tripIds.length} stops`;
    try {
      const shared = await nativeShare(text, url, "My Israel Trip");
      if (!shared) {
        await navigator.clipboard.writeText(url);
        setShareToast("Trip link copied to clipboard 📋");
        setTimeout(() => setShareToast(null), 2500);
      }
    } catch {
      // user cancelled
    }
  };

  const clearFilters = () => {
    setSearch(""); setRegion("all"); setCategory("all");
    setFamilyOnly(false); setFreeOnly(false); setOpenNow(false);
    setNearMe(false);
  };

  const visibleList = tab === "explore" ? filtered : tripAttractions;
  const mapAttractions = tab === "explore" ? filtered : tripAttractions;
  const tripPath: [number, number][] = tripAttractions.map((a) => [a.lat, a.lng]);

  const filterCount =
    (region !== "all" ? 1 : 0) + (category !== "all" ? 1 : 0) +
    (familyOnly ? 1 : 0) + (freeOnly ? 1 : 0) +
    (openNow ? 1 : 0) + (nearMe ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="app" dir={dir} data-lang={lang}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <header className="header">
        <div className="brand">
          <div className="brand-logo">🇮🇱</div>
          <div className="brand-text">
            <h1>{T.appTitle}</h1>
            <p>{T.subtitle}</p>
          </div>
        </div>
        <div className="lang-switch">
          {LANGS.map((l) => (
            <button
              key={l}
              className={"lang-pill" + (lang === l ? " active" : "")}
              onClick={() => setLang(l)}
            >
              {t[l].langName}
            </button>
          ))}
        </div>
      </header>

      <nav className="tabs">
        <button className={"tab" + (tab === "explore" ? " active" : "")} onClick={() => setTab("explore")}>
          <span className="tab-icon">🧭</span> {T.explore}
        </button>
        <button className={"tab" + (tab === "trip" ? " active" : "")} onClick={() => setTab("trip")}>
          <span className="tab-icon">⭐</span> {T.tripCount(tripIds.length)}
        </button>
        <button className={"tab" + (tab === "chat" ? " active" : "")} onClick={() => setTab("chat")}>
          <span className="tab-icon">💬</span> Chat
        </button>
      </nav>

      {tab === "chat" ? (
        <Chat
          lang={lang}
          tripIds={tripIds}
          onOpenAttraction={(a) => { setTab("explore"); setSelected(a); setFlyTarget([a.lat, a.lng]); }}
          onImportTrip={importTrip}
        />
      ) : (
        <div className="layout">
          <aside className="sidebar">
            {tab === "explore" && (
              <div className="filters">
                <div className="search-wrap">
                  <span className="search-icon">🔎</span>
                  <input
                    type="text"
                    className="search"
                    placeholder={T.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="search-clear" onClick={() => setSearch("")}>×</button>
                  )}
                </div>

                <div className="chip-row">
                  <button
                    className={"chip" + (region === "all" ? " chip-active" : "")}
                    onClick={() => setRegion("all")}
                  >
                    ✨ {T.allRegions}
                  </button>
                  {ALL_REGIONS.map((r) => (
                    <button
                      key={r}
                      className={"chip" + (region === r ? " chip-active" : "")}
                      onClick={() => setRegion(region === r ? "all" : r)}
                      style={region === r ? { ["--chip" as never]: REGION_COLORS[r] } : undefined}
                    >
                      {REGION_EMOJI[r]} {T.region[r]}
                    </button>
                  ))}
                </div>

                <div className="chip-row">
                  <button
                    className={"chip chip-sm" + (category === "all" ? " chip-active" : "")}
                    onClick={() => setCategory("all")}
                  >
                    {T.allCategories}
                  </button>
                  {ALL_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      className={"chip chip-sm" + (category === c ? " chip-active" : "")}
                      onClick={() => setCategory(category === c ? "all" : c)}
                    >
                      {CAT_EMOJI[c]} {T.category[c]}
                    </button>
                  ))}
                </div>

                <div className="toggle-row">
                  <button
                    className={"toggle" + (familyOnly ? " toggle-on" : "")}
                    onClick={() => setFamilyOnly(!familyOnly)}
                  >
                    👨‍👩‍👧 {T.familyOnly}
                  </button>
                  <button
                    className={"toggle" + (freeOnly ? " toggle-on" : "")}
                    onClick={() => setFreeOnly(!freeOnly)}
                  >
                    💸 {T.freeOnly}
                  </button>
                  <button
                    className={"toggle" + (openNow ? " toggle-on" : "")}
                    onClick={() => setOpenNow(!openNow)}
                  >
                    🟢 {T.openNow}
                  </button>
                  <button
                    className={"toggle" + (nearMe ? " toggle-on" : "")}
                    onClick={toggleNearMe}
                    title={IS_NATIVE ? "GPS" : "Browser geolocation"}
                  >
                    📍 Near me
                  </button>
                </div>

                <div className="filter-meta">
                  <span className="result-count">{T.results(filtered.length)}</span>
                  {filterCount > 0 && (
                    <button className="clear" onClick={clearFilters}>
                      ✕ {T.clear} · {filterCount}
                    </button>
                  )}
                </div>
              </div>
            )}

            {tab === "trip" && tripAttractions.length > 0 && (
              <div className="trip-summary">
                <div className="trip-stats-row">
                  <div className="trip-stat">
                    <div className="trip-stat-label">{T.tripStops}</div>
                    <div className="trip-stat-value">{tripAttractions.length}</div>
                  </div>
                  <div className="trip-stat">
                    <div className="trip-stat-label">{T.totalDistance}</div>
                    <div className="trip-stat-value">
                      {Math.round(tripDistance)} <span className="trip-stat-unit">{T.km}</span>
                    </div>
                  </div>
                  {drivingKm !== null && (
                    <div className="trip-stat">
                      <div className="trip-stat-label">🚗 {T.driving}</div>
                      <div className="trip-stat-value">
                        {drivingKm} <span className="trip-stat-unit">{T.km}</span>
                      </div>
                      {drivingMin !== null && (
                        <div className="trip-stat-sub">{T.about} {Math.floor(drivingMin / 60)}h {drivingMin % 60}m</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="trip-actions-bar">
                  <div className="days-picker">
                    <label className="days-label">{T.days}:</label>
                    {[1, 2, 3, 4, 5].map((d) => (
                      <button
                        key={d}
                        className={"days-pill" + (tripDays === d ? " days-pill-on" : "")}
                        onClick={() => setTripDays(d)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <button className="share-trip-btn" onClick={shareTrip}>
                    🔗 {T.share}
                  </button>
                </div>
              </div>
            )}

            <div className="list">
              {tab === "trip" && tripAttractions.length === 0 && (
                <div className="empty">
                  <div className="empty-icon">🗺️</div>
                  <div>{T.emptyTrip}</div>
                </div>
              )}
              {tab === "explore" && filtered.length === 0 && (
                <div className="empty">
                  <div className="empty-icon">🔍</div>
                  <div>{T.noResults}</div>
                </div>
              )}

              {tab === "trip" && tripDays > 1 && tripByDay.length > 1
                ? tripByDay.map((day, dIdx) => (
                    <div key={dIdx} className="day-group">
                      <div className="day-header">
                        <span className="day-pill">{T.day} {dIdx + 1}</span>
                        <span className="day-count">{day.length} {T.stops}</span>
                      </div>
                      {day.map((a) => (
                        <AttractionCard
                          key={a.id}
                          a={a}
                          T={T}
                          lang={lang}
                          isSelected={selected?.id === a.id}
                          onPick={() => onPick(a)}
                          isInTrip={tripIds.includes(a.id)}
                          onToggleTrip={() => toggleTrip(a.id)}
                          tab={tab}
                          stepNum={tripIds.indexOf(a.id) + 1}
                          onMove={(d) => moveTrip(a.id, d)}
                        />
                      ))}
                    </div>
                  ))
                : visibleList.map((a) => (
                    <AttractionCard
                      key={a.id}
                      a={a}
                      T={T}
                      lang={lang}
                      isSelected={selected?.id === a.id}
                      onPick={() => onPick(a)}
                      isInTrip={tripIds.includes(a.id)}
                      onToggleTrip={() => toggleTrip(a.id)}
                      tab={tab}
                      stepNum={tab === "trip" ? tripIds.indexOf(a.id) + 1 : undefined}
                      onMove={(d) => moveTrip(a.id, d)}
                    />
                  ))}
            </div>
          </aside>

          <main className="map-wrap">
            <MapContainer center={[31.5, 34.9]} zoom={8} className="map" scrollWheelZoom zoomControl={false}>
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-tiles"
              />
              {mapAttractions.map((a) => (
                <Marker
                  key={a.id}
                  position={[a.lat, a.lng]}
                  icon={makePin(
                    REGION_COLORS[a.region],
                    tripIds.includes(a.id),
                    tab === "trip" ? tripIds.indexOf(a.id) + 1 : undefined
                  )}
                  eventHandlers={{ click: () => setSelected(a) }}
                >
                  <Popup>
                    <div className="popup">
                      <strong>{a.name[lang]}</strong>
                      <div className="popup-city">{a.city[lang]}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {tab === "trip" && tripPath.length > 1 && (
                <Polyline
                  positions={tripPath}
                  pathOptions={{ color: "#a78bfa", weight: 4, opacity: 0.85, dashArray: "8 8" }}
                />
              )}
              <FlyTo target={flyTarget} />
            </MapContainer>

            {selected && (
              <div className="detail" dir={dir}>
                <button className="detail-close" onClick={() => setSelected(null)}>×</button>
                <div className="detail-img" style={{ backgroundImage: `url(${selected.image})` }}>
                  <div className="detail-img-overlay" />
                  <button
                    className={"fav-btn fav-detail" + (tripIds.includes(selected.id) ? " fav-on" : "")}
                    onClick={() => toggleTrip(selected.id)}
                  >
                    {tripIds.includes(selected.id) ? "★" : "☆"}
                  </button>
                </div>
                <div className="detail-body">
                  <h2>{selected.name[lang]}</h2>
                  <div className="detail-city">📍 {selected.city[lang]}</div>
                  <div className="detail-tags">
                    <span
                      className="tag tag-region"
                      style={{
                        background: REGION_COLORS[selected.region] + "30",
                        borderColor: REGION_COLORS[selected.region] + "80",
                        color: REGION_COLORS[selected.region],
                      }}
                    >
                      {REGION_EMOJI[selected.region]} {T.region[selected.region]}
                    </span>
                    {selected.categories.map((c) => (
                      <span key={c} className="tag tag-cat">
                        {CAT_EMOJI[c]} {T.category[c]}
                      </span>
                    ))}
                    {isOpenNow(selected.hours.en) && (
                      <span className="tag tag-open">🟢 {T.openNow}</span>
                    )}
                  </div>
                  <p className="detail-desc">{selected.description[lang]}</p>
                  <div className="detail-info">
                    <div className="info-row">
                      <div className="info-label">🕒 {T.hours}</div>
                      <div className="info-value">{selected.hours[lang]}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">💰 {T.price}</div>
                      <div className="info-value">{selected.price[lang]}</div>
                    </div>
                  </div>
                  <div className="detail-actions">
                    <button
                      className={"btn-trip" + (tripIds.includes(selected.id) ? " btn-trip-on" : "")}
                      onClick={() => toggleTrip(selected.id)}
                    >
                      {tripIds.includes(selected.id) ? `✓ ${T.removeFromTrip}` : `+ ${T.addToTrip}`}
                    </button>
                    <a
                      className="btn-maps"
                      href={`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      🗺 {T.openMaps}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {shareToast && <div className="toast">{shareToast}</div>}
    </div>
  );
}

interface CardProps {
  a: Attraction;
  T: Strings;
  lang: Lang;
  isSelected: boolean;
  onPick: () => void;
  isInTrip: boolean;
  onToggleTrip: () => void;
  tab: Tab;
  stepNum?: number;
  onMove?: (d: -1 | 1) => void;
}
function AttractionCard({
  a, T, lang, isSelected, onPick, isInTrip, onToggleTrip, tab, stepNum, onMove,
}: CardProps) {
  return (
    <div className={"card" + (isSelected ? " active" : "")} onClick={onPick}>
      {tab === "trip" && stepNum && stepNum > 0 && (
        <div className="card-step">{stepNum}</div>
      )}
      <div className="card-img" style={{ backgroundImage: `url(${a.image})` }}>
        <div className="card-img-overlay" />
        <button
          className={"fav-btn" + (isInTrip ? " fav-on" : "")}
          onClick={(e) => { e.stopPropagation(); onToggleTrip(); }}
        >
          {isInTrip ? "★" : "☆"}
        </button>
        <span className="card-region-badge" style={{ background: REGION_COLORS[a.region] }}>
          {REGION_EMOJI[a.region]} {T.region[a.region]}
        </span>
      </div>
      <div className="card-body">
        <div className="card-title">{a.name[lang]}</div>
        <div className="card-city">📍 {a.city[lang]}</div>
        <div className="card-tags">
          {a.freeEntry && <span className="tag tag-free">💸 {T.free}</span>}
          {a.familyFriendly && <span className="tag tag-family">👨‍👩‍👧 {T.family}</span>}
          {a.categories.slice(0, 2).map((c) => (
            <span key={c} className="tag tag-cat">{CAT_EMOJI[c]} {T.category[c]}</span>
          ))}
          {isOpenNow(a.hours.en) && <span className="tag tag-open">🟢</span>}
        </div>
        {tab === "trip" && onMove && (
          <div className="trip-actions" onClick={(e) => e.stopPropagation()}>
            <button className="trip-mini" onClick={() => onMove(-1)}>↑</button>
            <button className="trip-mini" onClick={() => onMove(1)}>↓</button>
            <button className="trip-mini trip-remove" onClick={onToggleTrip}>🗑</button>
          </div>
        )}
      </div>
    </div>
  );
}
