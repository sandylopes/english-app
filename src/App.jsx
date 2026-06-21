import { useState, useEffect } from "react";

const DAILY_TASKS = [
  { id: "podcast", icon: "🎧", label: "Podcast + transcrição", xp: 10, duration: "15 min" },
  { id: "speak",   icon: "🎙️", label: "Grave e ouça a si mesma", xp: 15, duration: "20 min" },
  { id: "read",    icon: "📖", label: "Leitura técnica", xp: 10, duration: "20 min", days: [1,2,4,5] },
  { id: "write",   icon: "✍️", label: "Escrita profissional", xp: 15, duration: "15 min", days: [1,3,5] },
  { id: "vocab",   icon: "🧠", label: "Vocabulário / Anki", xp: 8,  duration: "10 min" },
];

const PHASES = [
  { id: 1, label: "Fase 1", title: "Fluência Funcional", level: "B2 → C1", months: "Meses 1–6",  color: "#1a6fa8", totalDays: 180 },
  { id: 2, label: "Fase 2", title: "Autoridade Profissional", level: "C1 → C1+", months: "Meses 7–12", color: "#0e6655", totalDays: 180 },
  { id: 3, label: "Fase 3", title: "Domínio C2", level: "C1+ → C2", months: "Meses 13–18", color: "#6c3483", totalDays: 180 },
];

const ACHIEVEMENTS = [
  { id: "first_day",   icon: "⭐", label: "Primeiro dia!",    condition: (s) => s >= 1 },
  { id: "week",        icon: "🔥", label: "7 dias seguidos",  condition: (s) => s >= 7 },
  { id: "fortnight",   icon: "💎", label: "14 dias seguidos", condition: (s) => s >= 14 },
  { id: "month",       icon: "👑", label: "30 dias seguidos", condition: (s) => s >= 30 },
  { id: "warrior",     icon: "⚡", label: "60 dias seguidos", condition: (s) => s >= 60 },
];

function pad(n) { return String(n).padStart(2, "0"); }

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function getTodayDayOfWeek() {
  return new Date().getDay(); // 0=Sun,1=Mon,...
}

function getTasksForToday(allTasks) {
  const dow = getTodayDayOfWeek();
  return allTasks.filter(t => !t.days || t.days.includes(dow));
}

// ── Storage helpers ──────────────────────────────────────────────────────────
async function load(key) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}
async function save(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}

// ── Sub-components ───────────────────────────────────────────────────────────

function FlameIcon({ size = 32, dim = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2C16 2 22 9 22 15C22 18.3 20.5 20.5 18.5 22C19 20 18.5 17.5 16.5 16C17 18 16 20.5 14 22C11.5 20.5 10 18 10 15C10 11 13 7 16 2Z"
        fill={dim ? "#ccc" : "#FF9500"} />
      <path d="M16 14C16 14 19 17 19 20C19 22.2 17.7 24 16 24C14.3 24 13 22.2 13 20C13 17 16 14 16 14Z"
        fill={dim ? "#ddd" : "#FF3B00"} />
    </svg>
  );
}

function XPBadge({ xp }) {
  return (
    <span style={{
      background: "linear-gradient(135deg,#f6d365,#fda085)",
      color: "#7a3600", fontSize: 11, fontWeight: 800,
      borderRadius: 20, padding: "2px 8px", letterSpacing: 0.5,
    }}>+{xp} XP</span>
  );
}

function ProgressRing({ pct, color, size = 60 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#e8eaed" strokeWidth={7} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={7} fill="none"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: "stroke-dasharray 0.5s ease" }} />
    </svg>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home"); // home | plan | achievements
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [phase, setPhase] = useState(1);
  const [daysDone, setDaysDone] = useState(0);
  const [history, setHistory] = useState({});   // { "2025-06-20": ["podcast","speak",...] }
  const [todayChecked, setTodayChecked] = useState([]);
  const [justEarned, setJustEarned] = useState(null);
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  const today = todayStr();
  const todayTasks = getTasksForToday(DAILY_TASKS);
  const todayDoneCount = todayChecked.length;
  const todayTotal = todayTasks.length;
  const todayPct = todayTotal ? Math.round((todayDoneCount / todayTotal) * 100) : 0;
  const allDoneToday = todayDoneCount === todayTotal;

  // ── Load from storage ──
  useEffect(() => {
    (async () => {
      const stored = await load("eng_state");
      if (stored) {
        setStreak(stored.streak || 0);
        setTotalXP(stored.totalXP || 0);
        setPhase(stored.phase || 1);
        setDaysDone(stored.daysDone || 0);
        setHistory(stored.history || {});
        setTodayChecked(stored.history?.[today] || []);
      }
      setLoading(false);
    })();
  }, []);

  // ── Persist whenever state changes ──
  useEffect(() => {
    if (loading) return;
    save("eng_state", { streak, totalXP, phase, daysDone, history });
  }, [streak, totalXP, phase, daysDone, history, loading]);

  // ── Check a task ──
  function toggleTask(taskId) {
    const task = DAILY_TASKS.find(t => t.id === taskId);
    let newChecked;
    let xpDelta = 0;

    if (todayChecked.includes(taskId)) {
      newChecked = todayChecked.filter(id => id !== taskId);
      xpDelta = -task.xp;
    } else {
      newChecked = [...todayChecked, taskId];
      xpDelta = task.xp;
      setJustEarned({ id: taskId, xp: task.xp });
      setTimeout(() => setJustEarned(null), 1200);
    }

    const newHistory = { ...history, [today]: newChecked };
    const prevChecked = todayChecked;
    setTodayChecked(newChecked);
    setHistory(newHistory);
    setTotalXP(x => Math.max(0, x + xpDelta));

    // Check if all tasks just completed
    if (newChecked.length === todayTasks.length && prevChecked.length < todayTasks.length) {
      // Update streak
      const newStreak = checkAndUpdateStreak(newHistory);
      // Check for new achievements
      const unlocked = ACHIEVEMENTS.find(a => !ACHIEVEMENTS.slice(0, ACHIEVEMENTS.indexOf(a)).some(prev => prev.condition(streak)) && a.condition(newStreak));
      if (unlocked && unlocked.condition(newStreak) && !unlocked.condition(streak)) {
        setNewAchievement(unlocked);
        setTimeout(() => setNewAchievement(null), 3000);
      }
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 1800);
    }
  }

  function checkAndUpdateStreak(hist) {
    const yest = yesterdayStr();
    const hadYesterday = hist[yest] && hist[yest].length === getTasksForToday(DAILY_TASKS).length;
    const newStreak = hadYesterday ? streak + 1 : streak === 0 ? 1 : 1;
    setStreak(newStreak);

    const today_tasks = DAILY_TASKS.filter(t => !t.days || t.days.includes(getTodayDayOfWeek()));
    const isNewDay = !(history[today] && history[today].length === today_tasks.length);
    if (isNewDay) setDaysDone(d => d + 1);
    return newStreak;
  }

  const currentPhase = PHASES.find(p => p.id === phase);
  const phaseProgress = Math.min(100, Math.round((daysDone / currentPhase.totalDays) * 100));
  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.condition(streak));

  // Last 7 days activity
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    const dow = ["D","S","T","Q","Q","S","S"][d.getDay()];
    const done = history[key];
    const full = done && done.length >= 2;
    return { key, dow, full, partial: done && done.length > 0 && !full };
  });

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#f7f8fa" }}>
        <div style={{ fontSize:32 }}>⏳</div>
      </div>
    );
  }

  // ── HOME SCREEN ──────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{ background:"#f7f8fa", minHeight:"100vh", maxWidth:420, margin:"0 auto", fontFamily:"'Segoe UI',system-ui,sans-serif", paddingBottom:80 }}>

      {/* Celebration overlay */}
      {celebrating && (
        <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
          <div style={{ fontSize:72, animation:"pop 0.4s ease" }}>🎉</div>
          <style>{`@keyframes pop{0%{transform:scale(0)}60%{transform:scale(1.3)}100%{transform:scale(1)}}`}</style>
        </div>
      )}

      {/* Achievement toast */}
      {newAchievement && (
        <div style={{
          position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
          background:"#1a1a2e", color:"white", padding:"12px 24px", borderRadius:50,
          zIndex:200, fontWeight:700, fontSize:14, display:"flex", gap:8, alignItems:"center",
          boxShadow:"0 8px 32px rgba(0,0,0,0.3)"
        }}>
          {newAchievement.icon} {newAchievement.label} desbloqueado!
        </div>
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1a1a2e,#0f3460)", padding:"20px 20px 24px", color:"white" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:12, color:"#7ec8e3", fontWeight:700, letterSpacing:2 }}>ENGLISH COACH</div>
            <div style={{ fontSize:20, fontWeight:800, marginTop:2 }}>Bom dia, Sandy! 👋</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <FlameIcon size={28} dim={streak === 0} />
              <span style={{ fontSize:26, fontWeight:900, color: streak > 0 ? "#FF9500" : "#888" }}>{streak}</span>
            </div>
            <div style={{ fontSize:10, color:"#7ec8e3", letterSpacing:1 }}>DIAS SEGUIDOS</div>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:20, padding:"10px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, color:"#a8c8e8", fontWeight:700, letterSpacing:1 }}>XP TOTAL</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#fda085" }}>{totalXP.toLocaleString()}</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#a8c8e8", fontWeight:700, letterSpacing:1 }}>FASE ATUAL</div>
            <div style={{ fontSize:13, fontWeight:800, color:"white", marginTop:2 }}>{currentPhase.level}</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#a8c8e8", fontWeight:700, letterSpacing:1 }}>DIAS</div>
            <div style={{ fontSize:22, fontWeight:900, color:"white" }}>{daysDone}</div>
          </div>
        </div>
      </div>

      {/* 7-day streak bar */}
      <div style={{ background:"white", padding:"14px 20px", borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#555", letterSpacing:1 }}>ÚLTIMOS 7 DIAS</span>
          <span style={{ fontSize:12, color:"#888" }}>{last7.filter(d => d.full).length}/7 completos</span>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {last7.map((d, i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{
                width:"100%", aspectRatio:"1", borderRadius:8,
                background: d.full ? "#FF9500" : d.partial ? "#FFD580" : "#f0f0f0",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, transition:"background 0.3s",
                boxShadow: d.full ? "0 2px 8px #FF950066" : "none"
              }}>
                {d.full ? "🔥" : d.partial ? "⚡" : ""}
              </div>
              <span style={{ fontSize:10, fontWeight:700, color: d.full ? "#FF9500" : "#aaa" }}>{d.dow}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's tasks */}
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#1a1a1a" }}>Atividades de hoje</div>
            <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{todayDoneCount} de {todayTotal} concluídas</div>
          </div>
          <div style={{ position:"relative" }}>
            <ProgressRing pct={todayPct} color={allDoneToday ? "#30c060" : currentPhase.color} size={52} />
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color: allDoneToday ? "#30c060" : currentPhase.color }}>
              {todayPct}%
            </div>
          </div>
        </div>

        {allDoneToday && (
          <div style={{ background:"linear-gradient(135deg,#30c060,#20a050)", borderRadius:12, padding:"14px 18px", marginBottom:16, color:"white", display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:28 }}>🏆</span>
            <div>
              <div style={{ fontWeight:800, fontSize:15 }}>Dia completo!</div>
              <div style={{ fontSize:12, opacity:.85, marginTop:2 }}>Sua streak continua — você é incrível!</div>
            </div>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {todayTasks.map(task => {
            const done = todayChecked.includes(task.id);
            const isJust = justEarned?.id === task.id;
            return (
              <button key={task.id} onClick={() => toggleTask(task.id)} style={{
                background:"white", border:`2px solid ${done ? currentPhase.color : "#e8eaed"}`,
                borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"center", gap:14,
                cursor:"pointer", textAlign:"left", transition:"all 0.2s",
                boxShadow: done ? `0 2px 12px ${currentPhase.color}33` : "0 1px 4px rgba(0,0,0,0.06)",
                transform: isJust ? "scale(0.97)" : "scale(1)",
              }}>
                {/* Checkbox */}
                <div style={{
                  width:28, height:28, borderRadius:50, border:`2.5px solid ${done ? currentPhase.color : "#ccc"}`,
                  background: done ? currentPhase.color : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s"
                }}>
                  {done && <span style={{ color:"white", fontSize:15, lineHeight:1 }}>✓</span>}
                </div>
                <span style={{ fontSize:22, flexShrink:0 }}>{task.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color: done ? "#555" : "#1a1a1a", textDecoration: done ? "line-through" : "none" }}>
                    {task.label}
                  </div>
                  <div style={{ fontSize:12, color:"#aaa", marginTop:2 }}>{task.duration}</div>
                </div>
                <XPBadge xp={task.xp} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase progress */}
      <div style={{ margin:"20px 16px 0", background:"white", borderRadius:14, padding:"16px 18px", border:"1px solid #eee" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#888", letterSpacing:1 }}>{currentPhase.months.toUpperCase()}</div>
            <div style={{ fontSize:15, fontWeight:800, color:"#1a1a1a" }}>{currentPhase.title}</div>
          </div>
          <div style={{ fontSize:22, fontWeight:900, color: currentPhase.color }}>{phaseProgress}%</div>
        </div>
        <div style={{ background:"#f0f0f0", borderRadius:20, height:8, overflow:"hidden" }}>
          <div style={{
            width:`${phaseProgress}%`, height:"100%",
            background:`linear-gradient(90deg, ${currentPhase.color}, ${currentPhase.color}aa)`,
            borderRadius:20, transition:"width 0.5s ease"
          }}/>
        </div>
        <div style={{ fontSize:12, color:"#aaa", marginTop:8 }}>{daysDone} de {currentPhase.totalDays} dias · {currentPhase.level}</div>
      </div>

      {/* Achievements preview */}
      <div style={{ margin:"16px 16px 0", background:"white", borderRadius:14, padding:"16px 18px", border:"1px solid #eee" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a" }}>Conquistas</div>
          <button onClick={() => setScreen("achievements")} style={{ background:"none", border:"none", color:currentPhase.color, fontSize:13, fontWeight:700, cursor:"pointer" }}>
            Ver todas →
          </button>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {ACHIEVEMENTS.map(a => {
            const unlocked = a.condition(streak);
            return (
              <div key={a.id} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{
                  width:42, height:42, borderRadius:12,
                  background: unlocked ? "linear-gradient(135deg,#f6d365,#fda085)" : "#f0f0f0",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
                  filter: unlocked ? "none" : "grayscale(1)", opacity: unlocked ? 1 : 0.5,
                  boxShadow: unlocked ? "0 2px 8px #fda08566" : "none"
                }}>{a.icon}</div>
                <div style={{ fontSize:9, fontWeight:700, color: unlocked ? "#888" : "#ccc", textAlign:"center", lineHeight:1.3 }}>{a.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:420, background:"white",
        borderTop:"1px solid #e8eaed", display:"flex", padding:"8px 0 12px",
        zIndex:50
      }}>
        {[
          { id:"home", icon:"🏠", label:"Início" },
          { id:"plan", icon:"📋", label:"Plano" },
          { id:"achievements", icon:"🏆", label:"Conquistas" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setScreen(tab.id)} style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2,
            background:"none", border:"none", cursor:"pointer",
            color: screen === tab.id ? currentPhase.color : "#aaa",
          }}>
            <span style={{ fontSize:22 }}>{tab.icon}</span>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:0.5 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ── PLAN SCREEN ───────────────────────────────────────────────────────────
  if (screen === "plan") return (
    <div style={{ background:"#f7f8fa", minHeight:"100vh", maxWidth:420, margin:"0 auto", fontFamily:"'Segoe UI',system-ui,sans-serif", paddingBottom:80 }}>
      <div style={{ background:"linear-gradient(135deg,#1a1a2e,#0f3460)", padding:"20px 20px 28px", color:"white" }}>
        <div style={{ fontSize:12, color:"#7ec8e3", fontWeight:700, letterSpacing:2, marginBottom:6 }}>SEU PLANO COMPLETO</div>
        <div style={{ fontSize:22, fontWeight:800 }}>De B2 a C2</div>
        <div style={{ fontSize:13, color:"#a8c8e8", marginTop:4 }}>18 meses · 3 fases · fluência internacional</div>
      </div>

      <div style={{ padding:"20px 16px 0" }}>
        {PHASES.map(p => (
          <div key={p.id} style={{ background:"white", borderRadius:14, padding:"16px 18px", marginBottom:14, border:`1px solid ${p.color}33` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:p.color, letterSpacing:2 }}>{p.months.toUpperCase()}</div>
                <div style={{ fontSize:17, fontWeight:800, color:"#1a1a1a", marginTop:2 }}>{p.title}</div>
                <div style={{ fontSize:13, color:"#888", marginTop:2 }}>{p.level}</div>
              </div>
              <div style={{
                width:36, height:36, borderRadius:50, background:`${p.color}22`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16, fontWeight:900, color:p.color
              }}>{p.id}</div>
            </div>
            {p.id === phase && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#888", marginBottom:4 }}>
                  <span>Progresso</span><span>{phaseProgress}%</span>
                </div>
                <div style={{ background:"#f0f0f0", borderRadius:20, height:8 }}>
                  <div style={{ width:`${phaseProgress}%`, height:"100%", background:p.color, borderRadius:20, transition:"width 0.5s" }}/>
                </div>
                <div style={{ marginTop:8, padding:"8px 12px", background:`${p.color}11`, borderRadius:8, fontSize:12, color:p.color, fontWeight:600 }}>
                  ✅ Fase atual — {daysDone} de {p.totalDays} dias
                </div>
              </div>
            )}
            {p.id < phase && (
              <div style={{ padding:"8px 12px", background:"#e8f8f0", borderRadius:8, fontSize:12, color:"#20a050", fontWeight:600 }}>✅ Concluída</div>
            )}
            {p.id > phase && (
              <div style={{ padding:"8px 12px", background:"#f0f0f0", borderRadius:8, fontSize:12, color:"#aaa", fontWeight:600 }}>🔒 Bloqueada</div>
            )}
          </div>
        ))}

        {/* Weekly plan */}
        <div style={{ background:"white", borderRadius:14, padding:"16px 18px", marginBottom:14, border:"1px solid #eee" }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#1a1a1a", marginBottom:12 }}>📅 Rotina semanal</div>
          {[
            { day:"Seg – Sex", tasks:["🎧 Podcast + transcrição","🎙️ Grave e ouça"] },
            { day:"Seg / Qua / Sex", tasks:["📖 Leitura técnica"] },
            { day:"Seg / Qua / Sex", tasks:["✍️ Escrita profissional"] },
            { day:"Todo dia", tasks:["🧠 Vocabulário / Anki"] },
          ].map((r, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:10 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#888", width:80, paddingTop:2, flexShrink:0 }}>{r.day}</div>
              <div>{r.tasks.map(t => <div key={t} style={{ fontSize:13, color:"#333", lineHeight:1.7 }}>{t}</div>)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:"white", borderTop:"1px solid #e8eaed", display:"flex", padding:"8px 0 12px", zIndex:50 }}>
        {[{ id:"home",icon:"🏠",label:"Início" },{ id:"plan",icon:"📋",label:"Plano" },{ id:"achievements",icon:"🏆",label:"Conquistas" }].map(tab => (
          <button key={tab.id} onClick={() => setScreen(tab.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", color: screen === tab.id ? "#1a6fa8" : "#aaa" }}>
            <span style={{ fontSize:22 }}>{tab.icon}</span>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:0.5 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ── ACHIEVEMENTS SCREEN ───────────────────────────────────────────────────
  return (
    <div style={{ background:"#f7f8fa", minHeight:"100vh", maxWidth:420, margin:"0 auto", fontFamily:"'Segoe UI',system-ui,sans-serif", paddingBottom:80 }}>
      <div style={{ background:"linear-gradient(135deg,#1a1a2e,#0f3460)", padding:"20px 20px 28px", color:"white" }}>
        <div style={{ fontSize:12, color:"#7ec8e3", fontWeight:700, letterSpacing:2, marginBottom:6 }}>CONQUISTAS</div>
        <div style={{ fontSize:22, fontWeight:800 }}>Suas medalhas 🏅</div>
        <div style={{ fontSize:13, color:"#a8c8e8", marginTop:4 }}>{unlockedAchievements.length} de {ACHIEVEMENTS.length} desbloqueadas</div>
      </div>

      {/* Streak hero */}
      <div style={{ margin:"20px 16px 0", background:"white", borderRadius:16, padding:"24px 20px", border:"1px solid #eee", textAlign:"center" }}>
        <FlameIcon size={64} dim={streak === 0} />
        <div style={{ fontSize:48, fontWeight:900, color: streak > 0 ? "#FF9500" : "#ccc", lineHeight:1, marginTop:8 }}>{streak}</div>
        <div style={{ fontSize:14, color:"#888", marginTop:4 }}>dias de streak atual</div>
        <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:16 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:900, color:"#1a1a2e" }}>{totalXP.toLocaleString()}</div>
            <div style={{ fontSize:11, color:"#aaa", fontWeight:700 }}>XP TOTAL</div>
          </div>
          <div style={{ width:1, background:"#eee" }}/>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:900, color:"#1a1a2e" }}>{daysDone}</div>
            <div style={{ fontSize:11, color:"#aaa", fontWeight:700 }}>DIAS ATIVOS</div>
          </div>
          <div style={{ width:1, background:"#eee" }}/>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:900, color:"#1a1a2e" }}>{unlockedAchievements.length}</div>
            <div style={{ fontSize:11, color:"#aaa", fontWeight:700 }}>MEDALHAS</div>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 16px 0" }}>
        {ACHIEVEMENTS.map(a => {
          const unlocked = a.condition(streak);
          const streakNeeded = [1,7,14,30,60][ACHIEVEMENTS.indexOf(a)];
          const pct = Math.min(100, Math.round((streak / streakNeeded) * 100));
          return (
            <div key={a.id} style={{
              background:"white", borderRadius:14, padding:"16px 18px", marginBottom:12,
              border:`1px solid ${unlocked ? "#fda08566" : "#eee"}`,
              display:"flex", gap:14, alignItems:"center",
              opacity: unlocked ? 1 : 0.7,
            }}>
              <div style={{
                width:52, height:52, borderRadius:14, flexShrink:0,
                background: unlocked ? "linear-gradient(135deg,#f6d365,#fda085)" : "#f5f5f5",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:26,
                filter: unlocked ? "none" : "grayscale(1)",
                boxShadow: unlocked ? "0 4px 12px #fda08544" : "none"
              }}>{a.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:800, color: unlocked ? "#1a1a1a" : "#888" }}>{a.label}</div>
                {unlocked ? (
                  <div style={{ fontSize:12, color:"#30c060", fontWeight:700, marginTop:3 }}>✅ Desbloqueada!</div>
                ) : (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#aaa", marginTop:6, marginBottom:4 }}>
                      <span>Streak necessário: {streakNeeded} dias</span>
                      <span>{pct}%</span>
                    </div>
                    <div style={{ background:"#f0f0f0", borderRadius:20, height:6 }}>
                      <div style={{ width:`${pct}%`, height:"100%", background:"#fda085", borderRadius:20 }}/>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:"white", borderTop:"1px solid #e8eaed", display:"flex", padding:"8px 0 12px", zIndex:50 }}>
        {[{ id:"home",icon:"🏠",label:"Início" },{ id:"plan",icon:"📋",label:"Plano" },{ id:"achievements",icon:"🏆",label:"Conquistas" }].map(tab => (
          <button key={tab.id} onClick={() => setScreen(tab.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", color: screen === tab.id ? "#1a6fa8" : "#aaa" }}>
            <span style={{ fontSize:22 }}>{tab.icon}</span>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:0.5 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
