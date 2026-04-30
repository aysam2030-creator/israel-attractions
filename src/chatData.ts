import { type Attraction } from "./data/attractions";

export type MessageKind =
  | { type: "text"; text: string }
  | { type: "attraction"; attractionId: string }
  | { type: "trip"; tripIds: string[]; name?: string }
  | { type: "image"; dataUrl: string; caption?: string }
  | { type: "voice"; dataUrl: string; durationSec: number }
  | { type: "system"; text: string };

export interface Message {
  id: string;
  groupId: string;
  userId: string;
  ts: number;
  kind: MessageKind;
  reactions?: Record<string, string[]>; // emoji -> userIds
  replyTo?: string; // message id
  editedAt?: number;
  deleted?: boolean;
  seenBy?: string[]; // userIds who saw it
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  online?: boolean;
  lastSeen?: number;
}

export interface Group {
  id: string;
  name: string;
  emoji: string;
  memberIds: string[];
  createdAt: number;
}

export const DEFAULT_USERS: User[] = [
  { id: "u-aysam", name: "Aysam", avatar: "🦊", color: "#a78bfa", online: true },
  { id: "u-sara",  name: "Sara",  avatar: "🌸", color: "#ec4899", online: true },
  { id: "u-omar",  name: "Omar",  avatar: "⚡", color: "#22d3ee", online: false, lastSeen: Date.now() - 1000 * 60 * 30 },
  { id: "u-noa",   name: "Noa",   avatar: "🌿", color: "#34d399", online: true },
  { id: "u-yosef", name: "Yosef", avatar: "🎯", color: "#fbbf24", online: false, lastSeen: Date.now() - 1000 * 60 * 60 * 2 },
];

export const DEFAULT_GROUPS: Group[] = [
  {
    id: "g-family",
    name: "Family Trip 🇮🇱",
    emoji: "👨‍👩‍👧‍👦",
    memberIds: ["u-aysam", "u-sara", "u-noa"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "g-eilat",
    name: "Eilat Crew",
    emoji: "🏖️",
    memberIds: ["u-aysam", "u-omar", "u-yosef"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "g-history",
    name: "History Buffs",
    emoji: "🏛️",
    memberIds: ["u-aysam", "u-sara", "u-omar", "u-noa", "u-yosef"],
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
];

const SEED: Message[] = [
  {
    id: "m1",
    groupId: "g-family",
    userId: "u-sara",
    ts: Date.now() - 1000 * 60 * 60 * 5,
    kind: { type: "text", text: "Guys, who's in for next weekend? 🙌" },
    reactions: { "❤️": ["u-noa", "u-aysam"] },
  },
  {
    id: "m2",
    groupId: "g-family",
    userId: "u-noa",
    ts: Date.now() - 1000 * 60 * 60 * 4,
    kind: { type: "text", text: "Yes! North? Bahá'í gardens are stunning right now" },
  },
  {
    id: "m3",
    groupId: "g-family",
    userId: "u-noa",
    ts: Date.now() - 1000 * 60 * 60 * 4 + 60_000,
    kind: { type: "attraction", attractionId: "haifa-bahai" },
  },
  {
    id: "m4",
    groupId: "g-family",
    userId: "u-aysam",
    ts: Date.now() - 1000 * 60 * 60 * 3,
    kind: { type: "text", text: "I'm in 🔥" },
    reactions: { "🔥": ["u-sara", "u-noa"] },
  },
  {
    id: "m5",
    groupId: "g-eilat",
    userId: "u-omar",
    ts: Date.now() - 1000 * 60 * 60 * 6,
    kind: { type: "text", text: "Eilat trip — who wants to plan?" },
  },
  {
    id: "m6",
    groupId: "g-eilat",
    userId: "u-yosef",
    ts: Date.now() - 1000 * 60 * 60 * 5,
    kind: { type: "attraction", attractionId: "eilat-coral" },
  },
  {
    id: "m7",
    groupId: "g-eilat",
    userId: "u-yosef",
    ts: Date.now() - 1000 * 60 * 60 * 5 + 30_000,
    kind: { type: "text", text: "Coral reef is non-negotiable 🐠" },
    reactions: { "🐠": ["u-omar"], "👍": ["u-aysam"] },
  },
  {
    id: "m8",
    groupId: "g-history",
    userId: "u-sara",
    ts: Date.now() - 1000 * 60 * 60 * 2,
    kind: { type: "attraction", attractionId: "masada" },
  },
  {
    id: "m9",
    groupId: "g-history",
    userId: "u-sara",
    ts: Date.now() - 1000 * 60 * 60 * 2 + 30_000,
    kind: { type: "text", text: "Sunrise hike. Who's brave enough? ⛰️" },
  },
];

const STORAGE = {
  messages: "chat:messages",
  groups: "chat:groups",
  users: "chat:users",
  me: "chat:me",
  reads: "chat:reads",
};

export function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE.messages);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(STORAGE.messages, JSON.stringify(SEED));
  return SEED;
}
export function saveMessages(m: Message[]) {
  localStorage.setItem(STORAGE.messages, JSON.stringify(m));
}

export function loadGroups(): Group[] {
  try {
    const raw = localStorage.getItem(STORAGE.groups);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(STORAGE.groups, JSON.stringify(DEFAULT_GROUPS));
  return DEFAULT_GROUPS;
}
export function saveGroups(g: Group[]) {
  localStorage.setItem(STORAGE.groups, JSON.stringify(g));
}

export function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE.users);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(STORAGE.users, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function loadMe(): string {
  return localStorage.getItem(STORAGE.me) || "u-aysam";
}
export function saveMe(id: string) {
  localStorage.setItem(STORAGE.me, id);
}

export function loadReads(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.reads) || "{}");
  } catch { return {}; }
}
export function saveReads(r: Record<string, number>) {
  localStorage.setItem(STORAGE.reads, JSON.stringify(r));
}

export function newMessage(
  groupId: string,
  userId: string,
  kind: MessageKind,
  replyTo?: string
): Message {
  return {
    id: "m-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    groupId,
    userId,
    ts: Date.now(),
    kind,
    replyTo,
    seenBy: [userId],
  };
}

export function formatTs(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const diffDays = Math.floor((now.getTime() - ts) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: "short" }) + " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString();
}

export function dateSeparatorLabel(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dayDiff = Math.floor((startOfDay(now) - startOfDay(d)) / (1000 * 60 * 60 * 24));
  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Yesterday";
  if (dayDiff < 7) return d.toLocaleDateString([], { weekday: "long" });
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}

export function lastSeenLabel(u?: User): string {
  if (!u) return "";
  if (u.online) return "online";
  if (!u.lastSeen) return "offline";
  const diff = Date.now() - u.lastSeen;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

export function summarizeTrip(
  ids: string[],
  attractions: Attraction[],
  lang: "en" | "he" | "ar"
): string {
  const names = ids
    .map((id) => attractions.find((a) => a.id === id)?.name[lang])
    .filter((x): x is string => Boolean(x));
  if (names.length === 0) return "";
  if (names.length <= 3) return names.join(" → ");
  return `${names.slice(0, 2).join(" → ")} → +${names.length - 2}`;
}

export function searchMessages(messages: Message[], query: string): Message[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return messages.filter((m) => {
    if (m.kind.type === "text") return m.kind.text.toLowerCase().includes(q);
    if (m.kind.type === "image" && m.kind.caption) return m.kind.caption.toLowerCase().includes(q);
    if (m.kind.type === "system") return m.kind.text.toLowerCase().includes(q);
    return false;
  });
}

export const QUICK_REACTIONS = ["❤️", "😂", "🔥", "👍", "😮", "😢"];
