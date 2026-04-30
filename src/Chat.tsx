import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  type Group,
  type Message,
  type User,
  type MessageKind,
  formatTs,
  dateSeparatorLabel,
  loadGroups,
  loadMe,
  loadMessages,
  loadUsers,
  loadReads,
  saveReads,
  newMessage,
  saveGroups,
  saveMe,
  saveMessages,
  searchMessages,
  summarizeTrip,
  QUICK_REACTIONS,
} from "./chatData";
import { attractions, type Attraction } from "./data/attractions";
import { type Lang } from "./i18n";
import { totalRouteDistance } from "./utils";
import { supabase, SUPABASE_ENABLED } from "./supabase";
import { takePhotoAsDataUrl, IS_NATIVE, buzz } from "./native";

interface ChatProps {
  lang: Lang;
  tripIds: string[];
  onOpenAttraction: (a: Attraction) => void;
  onImportTrip: (ids: string[]) => void;
}

export default function Chat({ lang, tripIds, onOpenAttraction, onImportTrip }: ChatProps) {
  const [users, setUsers] = useState<User[]>(loadUsers());
  const [groups, setGroups] = useState<Group[]>(loadGroups());
  const [messages, setMessages] = useState<Message[]>(loadMessages());
  const [me, setMe] = useState<string>(loadMe());
  const [activeGroupId, setActiveGroupId] = useState<string>(() => loadGroups()[0]?.id || "");
  const [draft, setDraft] = useState("");
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [reads, setReads] = useState<Record<string, number>>(loadReads());
  const [recording, setRecording] = useState(false);
  const [recordingDur, setRecordingDur] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const recordStartRef = useRef<number>(0);
  const typingTimerRef = useRef<number | null>(null);

  // ---- Persistence ----
  useEffect(() => saveMessages(messages), [messages]);
  useEffect(() => saveGroups(groups), [groups]);
  useEffect(() => saveMe(me), [me]);
  useEffect(() => saveReads(reads), [reads]);

  // ---- Supabase realtime sync (only when env vars present) ----
  useEffect(() => {
    if (!SUPABASE_ENABLED || !supabase) return;
    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload) => {
        const row = (payload.new || payload.old) as { id: string; group_id: string; user_id: string; ts: number; kind: MessageKind; reactions?: Record<string, string[]>; reply_to?: string; edited_at?: number; deleted?: boolean };
        if (payload.eventType === "DELETE") {
          setMessages((c) => c.filter((m) => m.id !== row.id));
          return;
        }
        const msg: Message = {
          id: row.id,
          groupId: row.group_id,
          userId: row.user_id,
          ts: row.ts,
          kind: row.kind,
          reactions: row.reactions,
          replyTo: row.reply_to,
          editedAt: row.edited_at,
          deleted: row.deleted,
        };
        setMessages((c) => {
          const idx = c.findIndex((m) => m.id === msg.id);
          if (idx >= 0) {
            const copy = [...c];
            copy[idx] = msg;
            return copy;
          }
          return [...c, msg];
        });
      })
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, []);

  const pushRemote = useCallback(async (m: Message) => {
    if (!SUPABASE_ENABLED || !supabase) return;
    await supabase.from("messages").upsert({
      id: m.id, group_id: m.groupId, user_id: m.userId, ts: m.ts,
      kind: m.kind, reactions: m.reactions || {}, reply_to: m.replyTo || null,
      edited_at: m.editedAt || null, deleted: m.deleted || false,
    });
  }, []);

  // ---- Derived ----
  const userMap = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users]);
  const activeGroup = groups.find((g) => g.id === activeGroupId);
  const groupMessages = useMemo(
    () => messages.filter((m) => m.groupId === activeGroupId).sort((a, b) => a.ts - b.ts),
    [messages, activeGroupId]
  );

  const searchResults = useMemo(
    () => (searchQuery ? searchMessages(groupMessages, searchQuery) : []),
    [groupMessages, searchQuery]
  );

  // Mark as read on group change
  useEffect(() => {
    if (activeGroupId) {
      setReads((r) => ({ ...r, [activeGroupId]: Date.now() }));
    }
  }, [activeGroupId, groupMessages.length]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeGroupId, groupMessages.length]);

  // ---- Simulated typing + presence (only matters when no Supabase) ----
  useEffect(() => {
    if (SUPABASE_ENABLED) return;
    // randomly toggle some users online once per 8s
    const t = setInterval(() => {
      setUsers((curr) =>
        curr.map((u) =>
          u.id === me ? { ...u, online: true } : { ...u, online: Math.random() > 0.4, lastSeen: u.online ? u.lastSeen : Date.now() - Math.random() * 1000 * 60 * 60 }
        )
      );
    }, 8000);
    return () => clearInterval(t);
  }, [me]);

  // Simulate someone typing 30% of the time after you send (just for vibe)
  const simulateReply = useCallback(() => {
    if (SUPABASE_ENABLED) return;
    if (!activeGroup) return;
    const others = activeGroup.memberIds.filter((id) => id !== me);
    if (others.length === 0) return;
    if (Math.random() > 0.5) return;
    const responder = others[Math.floor(Math.random() * others.length)];
    setTypingUsers((c) => [...c.filter((x) => x !== responder), responder]);
    setTimeout(() => {
      setTypingUsers((c) => c.filter((x) => x !== responder));
      const replies = ["nice 👍", "🔥", "let's do it", "I'm in!", "haha", "for sure", "love it ❤️", "👀"];
      const text = replies[Math.floor(Math.random() * replies.length)];
      const msg = newMessage(activeGroup.id, responder, { type: "text", text });
      setMessages((c) => [...c, msg]);
      pushRemote(msg);
    }, 1500 + Math.random() * 1500);
  }, [activeGroup, me, pushRemote]);

  // ---- Send actions ----
  const send = (kind: MessageKind) => {
    if (!activeGroup) return;
    const msg = newMessage(activeGroup.id, me, kind, replyTo?.id);
    setMessages((curr) => [...curr, msg]);
    setReplyTo(null);
    pushRemote(msg);
    simulateReply();
  };

  const sendText = () => {
    const text = draft.trim();
    if (!text) return;
    if (editingId) {
      setMessages((c) =>
        c.map((m) =>
          m.id === editingId && m.kind.type === "text"
            ? { ...m, kind: { type: "text", text }, editedAt: Date.now() }
            : m
        )
      );
      const edited = messages.find((m) => m.id === editingId);
      if (edited) pushRemote({ ...edited, kind: { type: "text", text }, editedAt: Date.now() });
      setEditingId(null);
      setDraft("");
      return;
    }
    send({ type: "text", text });
    setDraft("");
  };

  const handleType = (v: string) => {
    setDraft(v);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {}, 1000);
  };

  const shareAttraction = (id: string) => {
    send({ type: "attraction", attractionId: id });
    setShowShareSheet(false);
  };

  const shareTrip = () => {
    if (tripIds.length === 0) return;
    send({ type: "trip", tripIds: [...tripIds] });
    setShowShareSheet(false);
  };

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      send({ type: "image", dataUrl });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleImageButton = async () => {
    if (IS_NATIVE) {
      const dataUrl = await takePhotoAsDataUrl();
      if (dataUrl) {
        await buzz();
        send({ type: "image", dataUrl });
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
    if (item) {
      const file = item.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = () => send({ type: "image", dataUrl: reader.result as string });
        reader.readAsDataURL(file);
        e.preventDefault();
      }
    }
  };

  // ---- Voice recording ----
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recordChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const dur = Math.round((Date.now() - recordStartRef.current) / 1000);
          send({ type: "voice", dataUrl, durationSec: Math.max(1, dur) });
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      recordStartRef.current = Date.now();
      setRecording(true);
      setRecordingDur(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordingDur(Math.round((Date.now() - recordStartRef.current) / 1000));
      }, 250);
    } catch (err) {
      alert("Microphone permission needed for voice notes");
    }
  };

  const stopRecording = (cancel = false) => {
    if (!mediaRecorderRef.current) return;
    if (cancel) mediaRecorderRef.current.ondataavailable = null as never;
    mediaRecorderRef.current.stop();
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setRecording(false);
    setRecordingDur(0);
  };

  // ---- Reactions ----
  const toggleReaction = (msgId: string, emoji: string) => {
    setMessages((curr) =>
      curr.map((m) => {
        if (m.id !== msgId) return m;
        const reactions = { ...(m.reactions || {}) };
        const list = reactions[emoji] || [];
        if (list.includes(me)) {
          reactions[emoji] = list.filter((u) => u !== me);
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          reactions[emoji] = [...list, me];
        }
        const updated = { ...m, reactions };
        pushRemote(updated);
        return updated;
      })
    );
    setReactionPickerFor(null);
  };

  const startReply = (m: Message) => {
    setReplyTo(m);
    setEditingId(null);
    inputRef.current?.focus();
  };

  const startEdit = (m: Message) => {
    if (m.kind.type !== "text") return;
    setEditingId(m.id);
    setDraft(m.kind.text);
    setReplyTo(null);
    inputRef.current?.focus();
  };

  const deleteMessage = (id: string) => {
    setMessages((c) =>
      c.map((m) => (m.id === id ? { ...m, deleted: true, kind: { type: "text", text: "" } } : m))
    );
    const m = messages.find((x) => x.id === id);
    if (m) pushRemote({ ...m, deleted: true });
  };

  const previewOf = (m?: Message): string => {
    if (!m) return "—";
    const u = userMap[m.userId];
    const prefix = u ? `${u.name}: ` : "";
    if (m.deleted) return prefix + "⊘ deleted";
    if (m.kind.type === "text") return prefix + m.kind.text;
    if (m.kind.type === "attraction") {
      const a = attractions.find((x) => x.id === (m.kind as { attractionId: string }).attractionId);
      return prefix + "📍 " + (a?.name[lang] || "Place");
    }
    if (m.kind.type === "trip") return prefix + "🗺 Trip";
    if (m.kind.type === "image") return prefix + "📷 Photo";
    if (m.kind.type === "voice") return prefix + "🎤 Voice " + m.kind.durationSec + "s";
    return m.kind.text;
  };

  const lastMsg = (gid: string) => {
    const list = messages.filter((m) => m.groupId === gid).sort((a, b) => b.ts - a.ts);
    return list[0];
  };

  const unreadCount = (gid: string) => {
    if (gid === activeGroupId) return 0;
    const lastRead = reads[gid] || 0;
    return messages.filter((m) => m.groupId === gid && m.userId !== me && m.ts > lastRead).length;
  };

  const createGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    const g: Group = {
      id: "g-" + Math.random().toString(36).slice(2, 8),
      name,
      emoji: "💬",
      memberIds: [me, ...users.filter((u) => u.id !== me).slice(0, 2).map((u) => u.id)],
      createdAt: Date.now(),
    };
    setGroups((c) => [...c, g]);
    setActiveGroupId(g.id);
    setNewGroupName("");
    setShowNewGroup(false);
  };

  const cancelReplyOrEdit = () => {
    setReplyTo(null);
    setEditingId(null);
    setDraft("");
  };

  // Group messages with date separators
  const renderItems = useMemo(() => {
    const items: Array<{ type: "sep"; label: string; key: string } | { type: "msg"; m: Message; showAuthor: boolean; key: string }> = [];
    let prevDate = "";
    let prevUser = "";
    let prevTs = 0;
    groupMessages.forEach((m) => {
      const dayLabel = dateSeparatorLabel(m.ts);
      if (dayLabel !== prevDate) {
        items.push({ type: "sep", label: dayLabel, key: "sep-" + m.id });
        prevDate = dayLabel;
        prevUser = "";
      }
      const showAuthor = prevUser !== m.userId || m.ts - prevTs > 5 * 60_000;
      items.push({ type: "msg", m, showAuthor, key: m.id });
      prevUser = m.userId;
      prevTs = m.ts;
    });
    return items;
  }, [groupMessages]);

  return (
    <div className="chat">
      <aside className="chat-list">
        <div className="chat-list-header">
          <h3>💬 Groups</h3>
          <button className="chat-new" onClick={() => setShowNewGroup(true)} aria-label="new group">＋</button>
        </div>

        <div className="me-picker">
          <span className="me-label">You:</span>
          <select value={me} onChange={(e) => setMe(e.target.value)} className="me-select">
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.avatar} {u.name}</option>
            ))}
          </select>
          <div className={"presence-dot" + (userMap[me]?.online ? " online" : "")} />
        </div>

        {!SUPABASE_ENABLED && (
          <div className="chat-banner">
            <span>📡 Local mode</span>
            <button onClick={() => setShowInfo(true)} className="banner-link">Enable cloud</button>
          </div>
        )}

        <div className="chat-groups">
          {groups.map((g) => {
            const lm = lastMsg(g.id);
            const unread = unreadCount(g.id);
            return (
              <button
                key={g.id}
                className={"chat-group" + (activeGroupId === g.id ? " active" : "")}
                onClick={() => setActiveGroupId(g.id)}
              >
                <div className="chat-group-emoji">{g.emoji}</div>
                <div className="chat-group-info">
                  <div className="chat-group-row">
                    <div className="chat-group-name">{g.name}</div>
                    {lm && <div className="chat-group-ts">{formatTs(lm.ts)}</div>}
                  </div>
                  <div className="chat-group-bottom">
                    <div className="chat-group-preview">{previewOf(lm)}</div>
                    {unread > 0 && <div className="unread-badge">{unread > 99 ? "99+" : unread}</div>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="chat-main">
        {activeGroup ? (
          <>
            <header className="chat-header">
              <div className="chat-header-emoji">{activeGroup.emoji}</div>
              <div className="chat-header-text">
                <div className="chat-header-name">{activeGroup.name}</div>
                <div className="chat-header-members">
                  {activeGroup.memberIds.length} members ·{" "}
                  {activeGroup.memberIds.filter((id) => userMap[id]?.online).length} online
                </div>
              </div>
              <button
                className="chat-icon-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="search"
                title="Search messages"
              >🔎</button>
            </header>

            {searchOpen && (
              <div className="chat-search-bar">
                <input
                  className="chat-search-input"
                  placeholder="Search messages…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <span className="chat-search-count">
                  {searchQuery ? `${searchResults.length} match${searchResults.length === 1 ? "" : "es"}` : ""}
                </span>
                <button className="chat-icon-btn" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>×</button>
              </div>
            )}

            <div className="chat-thread" ref={scrollRef}>
              {renderItems.map((item) => {
                if (item.type === "sep") {
                  return (
                    <div key={item.key} className="day-separator">
                      <span>{item.label}</span>
                    </div>
                  );
                }
                const m = item.m;
                const u = userMap[m.userId];
                const isMe = m.userId === me;
                const isHighlighted = searchQuery && searchResults.some((s) => s.id === m.id);
                const replied = m.replyTo ? messages.find((x) => x.id === m.replyTo) : null;
                return (
                  <ChatBubble
                    key={item.key}
                    msg={m}
                    user={u}
                    isMe={isMe}
                    showAuthor={item.showAuthor}
                    lang={lang}
                    highlighted={Boolean(isHighlighted)}
                    repliedTo={replied || null}
                    repliedUser={replied ? userMap[replied.userId] : undefined}
                    members={users}
                    me={me}
                    onOpenAttraction={onOpenAttraction}
                    onImportTrip={onImportTrip}
                    onReply={() => startReply(m)}
                    onEdit={() => startEdit(m)}
                    onDelete={() => deleteMessage(m.id)}
                    onReact={(e) => toggleReaction(m.id, e)}
                    onPickerOpen={() => setReactionPickerFor(reactionPickerFor === m.id ? null : m.id)}
                    pickerOpen={reactionPickerFor === m.id}
                    onLightbox={(url) => setLightbox(url)}
                    onJumpToReply={(id) => {
                      const el = document.querySelector<HTMLElement>(`[data-msg-id="${id}"]`);
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                      el?.classList.add("flash");
                      setTimeout(() => el?.classList.remove("flash"), 1500);
                    }}
                  />
                );
              })}
              {groupMessages.length === 0 && (
                <div className="chat-empty">
                  <div className="chat-empty-emoji">✨</div>
                  <div>Say hi to {activeGroup.name}</div>
                </div>
              )}
              {typingUsers.length > 0 && (
                <div className="typing-row">
                  <div className="typing-bubble">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                  <span className="typing-text">
                    {typingUsers.map((id) => userMap[id]?.name).filter(Boolean).join(", ")} typing…
                  </span>
                </div>
              )}
            </div>

            {(replyTo || editingId) && (
              <div className="reply-bar">
                <div className="reply-bar-content">
                  <div className="reply-bar-label">
                    {editingId ? "✏️ Editing" : `↩ Replying to ${userMap[replyTo!.userId]?.name}`}
                  </div>
                  <div className="reply-bar-text">
                    {editingId
                      ? "Edit your message"
                      : (replyTo!.kind.type === "text" ? replyTo!.kind.text : previewOf(replyTo!))}
                  </div>
                </div>
                <button className="chat-icon-btn" onClick={cancelReplyOrEdit}>×</button>
              </div>
            )}

            {recording ? (
              <footer className="chat-input-row recording">
                <button className="rec-cancel" onClick={() => stopRecording(true)}>×</button>
                <div className="rec-status">
                  <div className="rec-dot" />
                  <span>Recording… {Math.floor(recordingDur / 60)}:{(recordingDur % 60).toString().padStart(2, "0")}</span>
                </div>
                <button className="rec-stop" onClick={() => stopRecording()}>➤</button>
              </footer>
            ) : (
              <footer className="chat-input-row">
                <button
                  className="chat-share-btn"
                  onClick={() => setShowShareSheet(!showShareSheet)}
                  aria-label="share"
                >＋</button>
                <button
                  className="chat-icon-btn-mid"
                  onClick={handleImageButton}
                  aria-label="image"
                  title={IS_NATIVE ? "Take photo" : "Send photo"}
                >📷</button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onPickImage}
                />
                <input
                  ref={inputRef}
                  className="chat-input"
                  value={draft}
                  onChange={(e) => handleType(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendText()}
                  onPaste={onPaste}
                  placeholder={editingId ? "Edit message…" : "Message…"}
                />
                {draft.trim() ? (
                  <button className="chat-send" onClick={sendText} aria-label="send">➤</button>
                ) : (
                  <button
                    className="chat-icon-btn-mid mic"
                    onClick={startRecording}
                    aria-label="voice"
                    title="Hold to record voice"
                  >🎤</button>
                )}

                {showShareSheet && (
                  <div className="share-sheet">
                    <div className="share-sheet-title">Share</div>
                    {tripIds.length > 0 && (
                      <button className="share-option" onClick={shareTrip}>
                        <span className="share-icon">🗺</span>
                        <div>
                          <div className="share-name">Share my trip</div>
                          <div className="share-sub">{tripIds.length} stops</div>
                        </div>
                      </button>
                    )}
                    <div className="share-divider">Attractions</div>
                    <div className="share-grid">
                      {attractions.slice(0, 12).map((a) => (
                        <button
                          key={a.id}
                          className="share-pick"
                          onClick={() => shareAttraction(a.id)}
                          style={{ backgroundImage: `url(${a.image})` }}
                          title={a.name[lang]}
                        >
                          <span className="share-pick-name">{a.name[lang]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </footer>
            )}
          </>
        ) : (
          <div className="chat-empty">
            <div className="chat-empty-emoji">💬</div>
            <div>Pick a group to start</div>
          </div>
        )}

        {showNewGroup && (
          <div className="modal" onClick={() => setShowNewGroup(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3>New Group</h3>
              <input
                className="modal-input"
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createGroup()}
                autoFocus
              />
              <div className="modal-actions">
                <button className="btn-ghost" onClick={() => setShowNewGroup(false)}>Cancel</button>
                <button className="btn-primary" onClick={createGroup} disabled={!newGroupName.trim()}>Create</button>
              </div>
            </div>
          </div>
        )}

        {showInfo && (
          <div className="modal" onClick={() => setShowInfo(false)}>
            <div className="modal-card large" onClick={(e) => e.stopPropagation()}>
              <h3>📡 Enable Cloud Chat</h3>
              <p style={{ fontSize: 13, color: "#95a0b3", lineHeight: 1.5 }}>
                Right now chat is saved locally in your browser.<br />
                For real-time multi-device chat, set up a free Supabase project:
              </p>
              <ol style={{ fontSize: 13, color: "#d2d8e3", paddingInlineStart: 18, lineHeight: 1.7 }}>
                <li>Sign up at <strong>supabase.com</strong> (free, no card)</li>
                <li>Create a project, copy the URL & anon key</li>
                <li>Run the SQL in <code>src/supabase.ts</code></li>
                <li>Create <code>.env.local</code> with your keys</li>
                <li>Restart <code>npm run dev</code></li>
              </ol>
              <div className="modal-actions">
                <button className="btn-primary" onClick={() => setShowInfo(false)}>Got it</button>
              </div>
            </div>
          </div>
        )}

        {lightbox && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" />
            <button className="lightbox-close">×</button>
          </div>
        )}
      </main>
    </div>
  );
}

interface BubbleProps {
  msg: Message;
  user?: User;
  isMe: boolean;
  showAuthor: boolean;
  lang: Lang;
  highlighted: boolean;
  repliedTo: Message | null;
  repliedUser?: User;
  members: User[];
  me: string;
  onOpenAttraction: (a: Attraction) => void;
  onImportTrip: (ids: string[]) => void;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReact: (emoji: string) => void;
  onPickerOpen: () => void;
  pickerOpen: boolean;
  onLightbox: (url: string) => void;
  onJumpToReply: (id: string) => void;
}

function ChatBubble(props: BubbleProps) {
  const { msg, user, isMe, showAuthor, lang, highlighted, repliedTo, repliedUser,
    onOpenAttraction, onImportTrip, onReply, onEdit, onDelete, onReact, onPickerOpen,
    pickerOpen, onLightbox, onJumpToReply, me } = props;

  const reactions = msg.reactions || {};
  const reactionEntries = Object.entries(reactions).filter(([_, ids]) => ids.length > 0);

  return (
    <div
      className={"bubble-row" + (isMe ? " me" : "") + (highlighted ? " highlighted" : "")}
      data-msg-id={msg.id}
    >
      {!isMe && showAuthor && user && (
        <div className="bubble-avatar" style={{ background: user.color }}>
          {user.avatar}
          {user.online && <div className="avatar-presence" />}
        </div>
      )}
      {!isMe && !showAuthor && <div className="bubble-avatar-spacer" />}

      <div className="bubble-stack">
        {!isMe && showAuthor && user && (
          <div className="bubble-author" style={{ color: user.color }}>{user.name}</div>
        )}

        <div className="bubble-wrap">
          <BubbleContent
            msg={msg}
            isMe={isMe}
            lang={lang}
            repliedTo={repliedTo}
            repliedUser={repliedUser}
            onOpenAttraction={onOpenAttraction}
            onImportTrip={onImportTrip}
            onLightbox={onLightbox}
            onJumpToReply={onJumpToReply}
          />

          <div className="bubble-actions">
            <button className="bubble-action" onClick={onPickerOpen} title="React">😊</button>
            <button className="bubble-action" onClick={onReply} title="Reply">↩</button>
            {isMe && msg.kind.type === "text" && !msg.deleted && (
              <button className="bubble-action" onClick={onEdit} title="Edit">✏️</button>
            )}
            {isMe && !msg.deleted && (
              <button className="bubble-action" onClick={onDelete} title="Delete">🗑</button>
            )}
          </div>

          {pickerOpen && (
            <div className="reaction-picker">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className="reaction-pick"
                  onClick={() => onReact(emoji)}
                >{emoji}</button>
              ))}
            </div>
          )}
        </div>

        {reactionEntries.length > 0 && (
          <div className="reactions-row">
            {reactionEntries.map(([emoji, ids]) => (
              <button
                key={emoji}
                className={"reaction" + (ids.includes(me) ? " reaction-mine" : "")}
                onClick={() => onReact(emoji)}
                title={ids.length + " reaction" + (ids.length === 1 ? "" : "s")}
              >
                <span>{emoji}</span>
                <span className="reaction-count">{ids.length}</span>
              </button>
            ))}
          </div>
        )}

        <div className="bubble-meta">
          <span className="bubble-time">{formatTs(msg.ts)}</span>
          {msg.editedAt && <span className="bubble-edited">· edited</span>}
          {isMe && !msg.deleted && <span className="bubble-ticks" title="sent">✓✓</span>}
        </div>
      </div>
    </div>
  );
}

function BubbleContent({
  msg, isMe, lang, repliedTo, repliedUser, onOpenAttraction, onImportTrip, onLightbox, onJumpToReply,
}: {
  msg: Message; isMe: boolean; lang: Lang;
  repliedTo: Message | null;
  repliedUser?: User;
  onOpenAttraction: (a: Attraction) => void;
  onImportTrip: (ids: string[]) => void;
  onLightbox: (url: string) => void;
  onJumpToReply: (id: string) => void;
}) {
  const replyHeader = repliedTo ? (
    <button
      className="reply-quote"
      onClick={() => onJumpToReply(repliedTo.id)}
    >
      <span className="reply-quote-author" style={{ color: repliedUser?.color }}>
        ↩ {repliedUser?.name || "Unknown"}
      </span>
      <span className="reply-quote-text">
        {repliedTo.kind.type === "text" ? repliedTo.kind.text : "📎 attachment"}
      </span>
    </button>
  ) : null;

  if (msg.deleted) {
    return <div className={"bubble bubble-deleted" + (isMe ? " bubble-me" : "")}>⊘ Message deleted</div>;
  }

  if (msg.kind.type === "text") {
    return (
      <div className={"bubble" + (isMe ? " bubble-me" : "")}>
        {replyHeader}
        <div className="bubble-text">{msg.kind.text}</div>
      </div>
    );
  }

  if (msg.kind.type === "image") {
    return (
      <button
        className={"bubble bubble-image" + (isMe ? " bubble-me" : "")}
        onClick={() => onLightbox((msg.kind as { dataUrl: string }).dataUrl)}
      >
        {replyHeader}
        <img src={msg.kind.dataUrl} alt="" />
        {msg.kind.caption && <div className="bubble-caption">{msg.kind.caption}</div>}
      </button>
    );
  }

  if (msg.kind.type === "voice") {
    return (
      <div className={"bubble bubble-voice" + (isMe ? " bubble-me" : "")}>
        {replyHeader}
        <VoicePlayer dataUrl={msg.kind.dataUrl} duration={msg.kind.durationSec} isMe={isMe} />
      </div>
    );
  }

  if (msg.kind.type === "attraction") {
    const a = attractions.find((x) => x.id === (msg.kind as { attractionId: string }).attractionId);
    if (!a) return <div className="bubble">📍 (deleted)</div>;
    return (
      <button
        className={"bubble bubble-card" + (isMe ? " bubble-me" : "")}
        onClick={() => onOpenAttraction(a)}
      >
        {replyHeader}
        <div className="bubble-card-img" style={{ backgroundImage: `url(${a.image})` }}>
          <span className="bubble-card-pin">📍</span>
        </div>
        <div className="bubble-card-body">
          <div className="bubble-card-title">{a.name[lang]}</div>
          <div className="bubble-card-sub">{a.city[lang]}</div>
          <div className="bubble-card-cta">Tap to open →</div>
        </div>
      </button>
    );
  }

  if (msg.kind.type === "trip") {
    const ids = msg.kind.tripIds;
    const summary = summarizeTrip(ids, attractions, lang);
    const points = ids
      .map((id) => attractions.find((a) => a.id === id))
      .filter((x): x is Attraction => Boolean(x));
    const dist = Math.round(totalRouteDistance(points));
    return (
      <div className={"bubble bubble-trip" + (isMe ? " bubble-me" : "")}>
        {replyHeader}
        <div className="bubble-trip-header">
          <span className="bubble-trip-icon">🗺</span>
          <div>
            <div className="bubble-card-title">Shared Trip</div>
            <div className="bubble-card-sub">{ids.length} stops · {dist} km</div>
          </div>
        </div>
        <div className="bubble-trip-list">{summary}</div>
        <button className="bubble-trip-import" onClick={() => onImportTrip(ids)}>
          ⭐ Use this trip
        </button>
      </div>
    );
  }

  return <div className="bubble bubble-system">{(msg.kind as { text: string }).text}</div>;
}

function VoicePlayer({ dataUrl, duration, isMe }: { dataUrl: string; duration: number; isMe: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.currentTime / (a.duration || duration));
    const onEnd = () => { setPlaying(false); setProgress(0); };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
    };
  }, [duration]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  };

  // Generate fake waveform bars
  const bars = useMemo(() => Array.from({ length: 22 }, () => 0.3 + Math.random() * 0.7), []);
  const playedIdx = Math.floor(bars.length * progress);

  return (
    <div className="voice-player">
      <button className="voice-play" onClick={toggle}>{playing ? "⏸" : "▶"}</button>
      <div className="voice-wave">
        {bars.map((h, i) => (
          <span
            key={i}
            className={"voice-bar" + (i <= playedIdx ? " voice-bar-played" : "")}
            style={{ height: `${h * 100}%`, background: isMe ? "rgba(255,255,255,0.85)" : "var(--accent-2)" }}
          />
        ))}
      </div>
      <span className="voice-time">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}</span>
      <audio ref={audioRef} src={dataUrl} preload="metadata" />
    </div>
  );
}
