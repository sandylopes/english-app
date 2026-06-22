import { useState, useEffect } from "react";

// ── WORD BANK ─────────────────────────────────────────────────────────────────
const WORDS = [
  // Engineering & Reliability
  { id:"w01", word:"Throughput",      pt:"Rendimento / Vazão",        cat:"⚙️ Engineering",
    def:"The amount of material or items processed by a system in a given time.",
    sentence:"We increased throughput by 18% after optimizing the pump schedule.",
    tip:"Use when discussing production capacity or process efficiency." },
  { id:"w02", word:"Downtime",        pt:"Tempo de parada",           cat:"⚙️ Engineering",
    def:"A period when equipment or a system is not operational.",
    sentence:"Unplanned downtime cost the plant over $80K last quarter.",
    tip:"Always specify: planned vs. unplanned downtime." },
  { id:"w03", word:"Root cause",      pt:"Causa raiz",                cat:"⚙️ Engineering",
    def:"The fundamental reason an event or failure occurred.",
    sentence:"The root cause analysis revealed a lubrication failure in the bearing.",
    tip:"Say 'root cause analysis' (RCA) in formal engineering meetings." },
  { id:"w04", word:"Failure mode",    pt:"Modo de falha",             cat:"⚙️ Engineering",
    def:"The specific way in which something fails to perform its intended function.",
    sentence:"We mapped all failure modes for the heat exchanger before the shutdown.",
    tip:"Part of FMEA — Failure Mode and Effects Analysis." },
  { id:"w05", word:"Uptime",          pt:"Tempo de operação",         cat:"⚙️ Engineering",
    def:"The time during which a system is operational and available.",
    sentence:"Our target is 98.5% uptime for the critical digestion circuit.",
    tip:"Opposite of downtime. Uptime % = KPI for reliability teams." },
  { id:"w06", word:"Redundancy",      pt:"Redundância",               cat:"⚙️ Engineering",
    def:"Having backup components so a system keeps running if one part fails.",
    sentence:"We added redundancy to the cooling system to prevent single-point failures.",
    tip:"'Built-in redundancy' is the natural phrase engineers use." },
  { id:"w07", word:"Workaround",      pt:"Solução alternativa / Contorno", cat:"⚙️ Engineering",
    def:"A temporary solution used until the real fix is implemented.",
    sentence:"We used a workaround to keep production running during the repair.",
    tip:"Common in ops meetings: 'Is there a workaround while we wait for the part?'" },
  { id:"w08", word:"Commissioning",   pt:"Comissionamento",           cat:"⚙️ Engineering",
    def:"The process of testing and verifying a system before full operation.",
    sentence:"The commissioning team completed all pre-startup checks on Monday.",
    tip:"Say 'pre-commissioning' for checks before the system is energized." },
  { id:"w09", word:"Retrofitting",    pt:"Modernização / Adaptação",  cat:"⚙️ Engineering",
    def:"Adding new technology or features to an existing older system.",
    sentence:"We're retrofitting the older pumps with vibration sensors.",
    tip:"'Retrofit project' is very common in industrial engineering." },
  { id:"w10", word:"Compliance",      pt:"Conformidade",              cat:"⚙️ Engineering",
    def:"Acting in accordance with rules, regulations, or standards.",
    sentence:"All electrical panels must be in compliance with NR-10 requirements.",
    tip:"'Non-compliance' = when something doesn't meet the standard." },

  // Management & Leadership
  { id:"w11", word:"Deliverable",     pt:"Entregável",                cat:"👔 Management",
    def:"A specific output or result that must be produced by a given deadline.",
    sentence:"The main deliverable for this sprint is the updated asset hierarchy.",
    tip:"Always ask: 'What's the deliverable and when is it due?'" },
  { id:"w12", word:"Accountability",  pt:"Responsabilização",         cat:"👔 Management",
    def:"Being responsible for the results of your actions or decisions.",
    sentence:"We need clearer accountability across teams for maintenance KPIs.",
    tip:"'Hold someone accountable' = cobrar/responsabilizar alguém." },
  { id:"w13", word:"Stakeholder",     pt:"Parte interessada",         cat:"👔 Management",
    def:"Anyone with an interest in or affected by a project or decision.",
    sentence:"I'll align expectations with all stakeholders before the presentation.",
    tip:"'Key stakeholders' = the most important ones. Use this in every project." },
  { id:"w14", word:"Buy-in",          pt:"Adesão / Apoio",            cat:"👔 Management",
    def:"Agreement and support from people who need to be involved or affected.",
    sentence:"We need buy-in from the operations team before rolling out the new system.",
    tip:"'Get buy-in' = conseguir o apoio das pessoas. Critical for any change." },
  { id:"w15", word:"Scope creep",     pt:"Desvio de escopo",          cat:"👔 Management",
    def:"Uncontrolled expansion of a project's requirements beyond the original plan.",
    sentence:"Scope creep delayed the project by three weeks and exceeded the budget.",
    tip:"Always define scope clearly at the start to avoid scope creep." },
  { id:"w16", word:"Trade-off",       pt:"Compensação / Escolha entre",cat:"👔 Management",
    def:"A balance between two desirable but incompatible features.",
    sentence:"There's a trade-off between response time and system reliability here.",
    tip:"'The trade-off is...' is one of the most useful phrases in meetings." },
  { id:"w17", word:"Benchmark",       pt:"Referência de desempenho",  cat:"👔 Management",
    def:"A standard or point of reference for evaluating performance.",
    sentence:"Our MTBF is below the industry benchmark for similar equipment.",
    tip:"'Benchmark against' = comparar com. Very common in engineering reports." },
  { id:"w18", word:"Escalate",        pt:"Escalar / Elevar",          cat:"👔 Management",
    def:"To refer a problem to a higher level of authority for resolution.",
    sentence:"If we can't resolve this by Friday, we'll need to escalate to the director.",
    tip:"'Don't be afraid to escalate' — essential phrase for international teams." },
  { id:"w19", word:"Bandwidth",       pt:"Capacidade disponível",     cat:"👔 Management",
    def:"The time and capacity a person or team has available for work.",
    sentence:"I don't have the bandwidth to take on that project this month.",
    tip:"'I don't have the bandwidth' = Não tenho capacidade agora. Very common." },
  { id:"w20", word:"Low-hanging fruit",pt:"Resultados fáceis",        cat:"👔 Management",
    def:"Tasks or goals that are easy to achieve and produce quick results.",
    sentence:"Let's start with the low-hanging fruit before tackling the bigger issues.",
    tip:"Always start presentations with low-hanging fruit — it builds momentum." },

  // Meetings & Communication
  { id:"w21", word:"Action item",     pt:"Ação pendente / Tarefa",    cat:"💬 Meetings",
    def:"A specific task assigned to someone during or after a meeting.",
    sentence:"The action item from today's meeting is to send the updated report by Thursday.",
    tip:"At the end of every meeting: 'Let's confirm the action items.'" },
  { id:"w22", word:"Touch base",      pt:"Fazer contato rápido",      cat:"💬 Meetings",
    def:"To briefly connect with someone to check in or share updates.",
    sentence:"Can we touch base tomorrow to review the inspection results?",
    tip:"'Let's touch base' = 'Vamos nos falar rapidinho'. Very informal and common." },
  { id:"w23", word:"Loop in",         pt:"Incluir alguém",            cat:"💬 Meetings",
    def:"To include someone in a conversation or email chain.",
    sentence:"Please loop in the safety team before we finalize the shutdown plan.",
    tip:"'I'll loop you in' = 'Vou te incluir na conversa.'" },
  { id:"w24", word:"Heads up",        pt:"Aviso prévio",              cat:"💬 Meetings",
    def:"An advance warning or notice about something.",
    sentence:"Just a heads up — the inspection team will arrive on Monday morning.",
    tip:"'Just a heads up...' = 'Só para avisar...' Perfect for emails." },
  { id:"w25", word:"Deep dive",       pt:"Análise profunda",          cat:"💬 Meetings",
    def:"A thorough and detailed examination of a subject.",
    sentence:"We'll do a deep dive into the heat exchanger performance data next week.",
    tip:"'Let's do a deep dive on this' = great phrase for technical reviews." },
  { id:"w26", word:"Take away",       pt:"Conclusão / Lição",         cat:"💬 Meetings",
    def:"The key point or lesson learned from a meeting or presentation.",
    sentence:"The main takeaway from the audit is that we need better documentation.",
    tip:"Always end presentations: 'The key takeaway here is...'." },
  { id:"w27", word:"Push back",       pt:"Questionar / Resistir",     cat:"💬 Meetings",
    def:"To resist or challenge a proposed idea or decision.",
    sentence:"The engineering team pushed back on the aggressive timeline.",
    tip:"'I need to push back on that' = professional way to disagree." },
  { id:"w28", word:"Circle back",     pt:"Retomar o assunto depois",  cat:"💬 Meetings",
    def:"To return to a topic or person at a later time.",
    sentence:"We don't have the data yet — let's circle back on this next week.",
    tip:"Use to park a topic without dismissing it: 'Let's circle back on that.'" },
  { id:"w29", word:"Ballpark",        pt:"Estimativa aproximada",     cat:"💬 Meetings",
    def:"A rough estimate or approximate figure.",
    sentence:"Can you give me a ballpark figure for the repair cost?",
    tip:"'What's the ballpark?' = 'Qual a estimativa?' Very casual and common." },
  { id:"w30", word:"Debrief",         pt:"Reunião pós-evento",        cat:"💬 Meetings",
    def:"A meeting to discuss what happened and what was learned after an event.",
    sentence:"We held a debrief after the unplanned shutdown to review the response.",
    tip:"'Post-mortem' is the engineering version of debrief for failures." },

  // Strategic Language
  { id:"w31", word:"Leverage",        pt:"Alavancar / Usar a favor",  cat:"🎯 Strategy",
    def:"To use something to its maximum advantage.",
    sentence:"We can leverage the PI System data to predict failures before they happen.",
    tip:"'Leverage our strengths' = usar nossos pontos fortes a nosso favor." },
  { id:"w32", word:"Bottleneck",      pt:"Gargalo",                   cat:"🎯 Strategy",
    def:"A point where flow is restricted, limiting overall system performance.",
    sentence:"The bottleneck in our process is the clarification stage — it limits throughput.",
    tip:"'Identify the bottleneck' is always the first step in process improvement." },
  { id:"w33", word:"Roadmap",         pt:"Plano de ação / Roteiro",   cat:"🎯 Strategy",
    def:"A strategic plan that outlines steps and milestones toward a goal.",
    sentence:"I presented the reliability improvement roadmap to the leadership team.",
    tip:"'Product roadmap' in tech. 'Maintenance roadmap' in engineering." },
  { id:"w34", word:"Milestone",       pt:"Marco / Etapa",             cat:"🎯 Strategy",
    def:"A significant event or achievement in a project timeline.",
    sentence:"Completing the NR-10 audit is a key milestone for Q3.",
    tip:"'Hit a milestone' = atingir um marco. 'Miss a milestone' = não entregar." },
  { id:"w35", word:"Contingency",     pt:"Contingência",              cat:"🎯 Strategy",
    def:"A plan for dealing with an unexpected event or emergency.",
    sentence:"We need a contingency plan in case the supplier can't deliver on time.",
    tip:"'Contingency budget' = reserva para imprevistos. Always have one." },
  { id:"w36", word:"Turnaround",      pt:"Prazo de retorno / Parada programada", cat:"🎯 Strategy",
    def:"The time taken to complete a process, or a major scheduled maintenance stop.",
    sentence:"The next plant turnaround is scheduled for October — 14 days.",
    tip:"In oil & gas / mining: 'turnaround' = parada geral programada." },
  { id:"w37", word:"Scalable",        pt:"Escalável",                 cat:"🎯 Strategy",
    def:"Able to be expanded or adapted to handle growth or increased demand.",
    sentence:"The GPA system is scalable — we can add new areas without reworking the model.",
    tip:"'Build something scalable' is a key phrase in tech and engineering projects." },
  { id:"w38", word:"Streamline",      pt:"Otimizar / Simplificar",    cat:"🎯 Strategy",
    def:"To make a process more efficient by removing unnecessary steps.",
    sentence:"We streamlined the work order process, reducing paperwork by 40%.",
    tip:"'Streamline operations' = tornar as operações mais eficientes." },
  { id:"w39", word:"Proactive",       pt:"Proativo",                  cat:"🎯 Strategy",
    def:"Taking action to prevent problems rather than reacting after they occur.",
    sentence:"A proactive maintenance approach reduces emergency repairs significantly.",
    tip:"'Proactive vs. reactive' — the core debate in reliability engineering." },
  { id:"w40", word:"Pivotal",         pt:"Fundamental / Decisivo",    cat:"🎯 Strategy",
    def:"Of crucial importance; a turning point.",
    sentence:"The data quality improvement was pivotal to the success of the GPA project.",
    tip:"Stronger than 'important'. Use it for truly decisive moments or decisions." },

  // Advanced Professional English
  { id:"w41", word:"Articulate",      pt:"Expressar claramente",      cat:"✨ Advanced",
    def:"To express an idea clearly and effectively in words.",
    sentence:"She articulated the technical risk in a way the board could understand.",
    tip:"'Articulate your point' = express yourself clearly. A key leadership skill." },
  { id:"w42", word:"Nuance",          pt:"Detalhe sutil / Matiz",     cat:"✨ Advanced",
    def:"A subtle difference or distinction in meaning, expression, or sound.",
    sentence:"There's an important nuance between reliability and availability as metrics.",
    tip:"'The nuance here is...' = 'O detalhe importante aqui é...' Very C1+ phrase." },
  { id:"w43", word:"Synthesize",      pt:"Sintetizar",                cat:"✨ Advanced",
    def:"To combine information from multiple sources into a coherent whole.",
    sentence:"I synthesized the findings from three departments into one report.",
    tip:"'Synthesize data' = combinar dados de várias fontes. Sounds very professional." },
  { id:"w44", word:"Holistic",        pt:"Holístico / Abrangente",    cat:"✨ Advanced",
    def:"Considering all parts of something as interconnected rather than in isolation.",
    sentence:"We need a holistic approach to asset management, not just reactive fixes.",
    tip:"'A holistic view' = ver o quadro completo. Common in management discussions." },
  { id:"w45", word:"Ambiguity",       pt:"Ambiguidade",               cat:"✨ Advanced",
    def:"The quality of being open to more than one interpretation; uncertainty.",
    sentence:"Leadership means making decisions even in the face of ambiguity.",
    tip:"'Comfortable with ambiguity' = a key trait mentioned in leadership interviews." },
  { id:"w46", word:"Sustainable",     pt:"Sustentável",               cat:"✨ Advanced",
    def:"Able to be maintained at a certain rate or level over the long term.",
    sentence:"The current pace of manual inspections is not sustainable at scale.",
    tip:"Beyond environmental: 'a sustainable workload', 'a sustainable process'." },
  { id:"w47", word:"Concession",      pt:"Concessão",                 cat:"✨ Advanced",
    def:"Something given up or agreed to in order to reach a compromise.",
    sentence:"We made a concession on the deadline in exchange for more resources.",
    tip:"In negotiation: 'What concessions can we make?' = O que podemos ceder?" },
  { id:"w48", word:"Mitigation",      pt:"Mitigação",                 cat:"✨ Advanced",
    def:"Action taken to reduce the severity or impact of a risk or problem.",
    sentence:"Our risk mitigation plan includes adding sensors and redundant systems.",
    tip:"'Risk mitigation' is essential vocabulary for any engineering manager." },
  { id:"w49", word:"Alignment",       pt:"Alinhamento",               cat:"✨ Advanced",
    def:"Agreement and understanding between parties on goals or approach.",
    sentence:"Before the project starts, we need full alignment across all departments.",
    tip:"'Are we aligned?' = 'Estamos alinhados?' Key question in any meeting." },
  { id:"w50", word:"Cascade",         pt:"Cascatear",                 cat:"✨ Advanced",
    def:"To pass information or decisions progressively through levels of a hierarchy.",
    sentence:"The CEO's strategy needs to cascade down to every team by end of month.",
    tip:"'Cascade the information' = repassar as informações em cascata para as equipes." },
];

// ── SPACED REPETITION ENGINE ──────────────────────────────────────────────────
const EASE_INIT = 2.5;
const EASE_MIN  = 1.3;
const INTERVALS = { again:1, hard: i=>Math.max(1,Math.round(i*1.2)), good:(i,e)=>Math.round(i*e), easy:(i,e)=>Math.round(i*e*1.3) };

function daysFromNow(n) {
  const d = new Date(); d.setDate(d.getDate()+n);
  return d.toISOString().slice(0,10);
}
function today() { return new Date().toISOString().slice(0,10); }
function isOverdue(dueDate) { return dueDate <= today(); }

function initCard(wordId) {
  return { wordId, interval:1, ease:EASE_INIT, due:today(), status:"new", reps:0 };
}

function rateCard(card, rating) { // rating: 'again'|'hard'|'good'|'easy'
  const { interval, ease } = card;
  let newInterval, newEase;
  if(rating==="again") { newInterval=1; newEase=Math.max(EASE_MIN, ease-0.2); }
  else if(rating==="hard")  { newInterval=INTERVALS.hard(interval);       newEase=Math.max(EASE_MIN, ease-0.15); }
  else if(rating==="good")  { newInterval=INTERVALS.good(interval, ease); newEase=ease; }
  else                       { newInterval=INTERVALS.easy(interval, ease); newEase=Math.min(ease+0.15, 3.0); }
  const newStatus = newInterval>=21?"mastered": newInterval>=7?"review":"learning";
  return { ...card, interval:newInterval, ease:newEase, due:daysFromNow(newInterval), status:newStatus, reps:card.reps+1 };
}

// ── STORAGE ───────────────────────────────────────────────────────────────────
async function load(k) { try { const r=localStorage.getItem(k); return r?JSON.parse(r):null; } catch { return null; } }
async function save(k,v) { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} }

function pad(n) { return String(n).padStart(2,"0"); }
function todayStr() { const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function yesterdayStr() { const d=new Date(); d.setDate(d.getDate()-1); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function getTodayDow() { return new Date().getDay(); }

const DAILY_TASKS = [
  { id:"podcast", icon:"🎧", label:"Podcast + transcrição", xp:10, duration:"15 min" },
  { id:"speak",   icon:"🎙️", label:"Grave e ouça a si mesma", xp:15, duration:"20 min" },
  { id:"read",    icon:"📖", label:"Leitura técnica", xp:10, duration:"20 min", days:[1,2,4,5] },
  { id:"write",   icon:"✍️", label:"Escrita profissional", xp:15, duration:"15 min", days:[1,3,5] },
  { id:"vocab",   icon:"🧠", label:"Vocabulário / Revisão", xp:8,  duration:"10 min" },
];
function getTasksForToday(all) { const d=getTodayDow(); return all.filter(t=>!t.days||t.days.includes(d)); }

const PHASES = [
  { id:1, title:"Fluência Funcional",      level:"B2→C1",  color:"#1a6fa8", months:"Meses 1–6",  totalDays:180 },
  { id:2, title:"Autoridade Profissional", level:"C1→C1+", color:"#0e6655", months:"Meses 7–12", totalDays:180 },
  { id:3, title:"Domínio C2",              level:"C1+→C2", color:"#6c3483", months:"Meses 13–18",totalDays:180 },
];
const ACHIEVEMENTS = [
  { id:"a1", icon:"⭐", label:"Primeiro dia!",    condition:s=>s>=1 },
  { id:"a2", icon:"🔥", label:"7 dias seguidos",  condition:s=>s>=7 },
  { id:"a3", icon:"💎", label:"14 dias seguidos", condition:s=>s>=14 },
  { id:"a4", icon:"👑", label:"30 dias seguidos", condition:s=>s>=30 },
  { id:"a5", icon:"⚡", label:"60 dias seguidos", condition:s=>s>=60 },
];

const CAT_COLORS = { "⚙️ Engineering":"#b7410e", "👔 Management":"#1a6fa8", "💬 Meetings":"#0e6655", "🎯 Strategy":"#6c3483", "✨ Advanced":"#c0392b" };

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function Flame({ size=32, dim=false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2C16 2 22 9 22 15C22 18.3 20.5 20.5 18.5 22C19 20 18.5 17.5 16.5 16C17 18 16 20.5 14 22C11.5 20.5 10 18 10 15C10 11 13 7 16 2Z" fill={dim?"#ccc":"#FF9500"}/>
      <path d="M16 14C16 14 19 17 19 20C19 22.2 17.7 24 16 24C14.3 24 13 22.2 13 20C13 17 16 14 16 14Z" fill={dim?"#ddd":"#FF3B00"}/>
    </svg>
  );
}
function Ring({ pct, color, size=52 }) {
  const r=(size-8)/2, c=2*Math.PI*r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#e8eaed" strokeWidth={7} fill="none"/>
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={7} fill="none"
        strokeDasharray={`${(pct/100)*c} ${c}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:"stroke-dasharray .5s"}}/>
    </svg>
  );
}

// ── VOCAB SCREEN ──────────────────────────────────────────────────────────────
const NEW_PER_DAY = 5;

function VocabScreen({ cards, setCards, onXP }) {
  const [view, setView] = useState("dashboard"); // dashboard | session | browse
  const [queue, setQueue] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [step, setStep] = useState("recall"); // recall | understand | write | compare | done
  const [userSentence, setUserSentence] = useState("");
  const [sessionStats, setSessionStats] = useState({ done:0, again:0 });

  // Compute stats
  const allIds = WORDS.map(w=>w.id);
  const cardMap = {};
  cards.forEach(c=>{ cardMap[c.wordId]=c; });

  const newCount      = WORDS.filter(w=>!cardMap[w.id]).length;
  const dueReviews    = cards.filter(c=>c.status!=="new"&&isOverdue(c.due));
  const learningCount = cards.filter(c=>c.status==="learning").length;
  const masteredCount = cards.filter(c=>c.status==="mastered").length;
  const totalStudied  = cards.length;

  // How many new words to introduce today
  function buildQueue() {
    const due = cards.filter(c=>isOverdue(c.due)).map(c=>({...cardMap[c.wordId], ...c, isNew:false}));
    // Grab new words not yet seen
    const unseenWords = WORDS.filter(w=>!cardMap[w.id]).slice(0, NEW_PER_DAY);
    const newCards = unseenWords.map(w=>({...w, ...initCard(w.id), isNew:true}));
    const combined = [...due.map(c=>({...WORDS.find(w=>w.id===c.wordId),...c})), ...newCards];
    return combined;
  }

  function startSession() {
    const q = buildQueue();
    if(q.length===0) return;
    setQueue(q); setQIdx(0); setStep("recall"); setUserSentence(""); setSessionStats({done:0,again:0}); setView("session");
  }

  function handleRate(rating) {
    const current = queue[qIdx];
    const existing = cardMap[current.id] || initCard(current.id);
    const updated = rateCard(existing, rating);
    // Update cards array
    const newCards = cards.filter(c=>c.wordId!==current.id);
    newCards.push(updated);
    setCards(newCards);
    onXP(rating==="again"?2:rating==="hard"?5:rating==="good"?8:12);
    setSessionStats(s=>({done:s.done+1, again:s.again+(rating==="again"?1:0)}));
    // Next card
    if(qIdx+1 >= queue.length) { setStep("done"); }
    else { setQIdx(i=>i+1); setStep("recall"); setUserSentence(""); }
  }

  const current = queue[qIdx] || null;
  const catColor = current ? (CAT_COLORS[current.cat]||"#1a6fa8") : "#1a6fa8";

  // ── DASHBOARD ──
  if(view==="dashboard") return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#0f3460)", padding:"20px 20px 24px", color:"white"}}>
        <div style={{fontSize:11, color:"#7ec8e3", fontWeight:700, letterSpacing:2, marginBottom:4}}>VOCABULÁRIO</div>
        <div style={{fontSize:22, fontWeight:800}}>Ultra-Aprendizado 🧠</div>
        <div style={{fontSize:13, color:"#a8c8e8", marginTop:4}}>Feynman · Repetição Espaçada · Escrita Ativa</div>
      </div>

      {/* Stats */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:1, background:"#eee", margin:"0"}}>
        {[
          {v:newCount, l:"Para ver", c:"#555"},
          {v:dueReviews.length, l:"Para revisar", c:"#FF9500"},
          {v:learningCount, l:"Aprendendo", c:"#1a6fa8"},
          {v:masteredCount, l:"Dominadas", c:"#30c060"},
        ].map(({v,l,c})=>(
          <div key={l} style={{background:"white", padding:"14px 8px", textAlign:"center"}}>
            <div style={{fontSize:24, fontWeight:900, color:c}}>{v}</div>
            <div style={{fontSize:10, color:"#aaa", fontWeight:700, marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{padding:"16px 16px 0"}}>
        {/* Start session */}
        {buildQueue().length > 0 ? (
          <button onClick={startSession} style={{width:"100%", background:"linear-gradient(135deg,#1a1a2e,#0f3460)", border:"none", borderRadius:16, padding:"18px", color:"white", cursor:"pointer", marginBottom:12}}>
            <div style={{fontSize:28, marginBottom:6}}>▶️</div>
            <div style={{fontSize:17, fontWeight:800}}>Iniciar sessão de estudo</div>
            <div style={{fontSize:13, color:"#a8c8e8", marginTop:4}}>
              {dueReviews.length} revisões + {Math.min(NEW_PER_DAY, newCount)} palavras novas
            </div>
          </button>
        ) : (
          <div style={{background:"linear-gradient(135deg,#30c060,#20a050)", borderRadius:16, padding:"18px", color:"white", textAlign:"center", marginBottom:12}}>
            <div style={{fontSize:28, marginBottom:4}}>✅</div>
            <div style={{fontSize:16, fontWeight:800}}>Dia completo!</div>
            <div style={{fontSize:13, opacity:.85, marginTop:4}}>Volte amanhã para novas palavras.</div>
          </div>
        )}

        {/* Progress bar */}
        <div style={{background:"white", borderRadius:14, padding:"16px 18px", border:"1px solid #eee", marginBottom:12}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:8}}>
            <div style={{fontSize:14, fontWeight:800, color:"#1a1a1a"}}>Progresso geral</div>
            <div style={{fontSize:14, fontWeight:800, color:"#1a6fa8"}}>{totalStudied}/{WORDS.length}</div>
          </div>
          <div style={{background:"#f0f0f0", borderRadius:20, height:10, overflow:"hidden"}}>
            <div style={{width:`${Math.round((totalStudied/WORDS.length)*100)}%`, height:"100%", background:"linear-gradient(90deg,#1a6fa8,#6c3483)", borderRadius:20, transition:"width .5s"}}/>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", marginTop:10, gap:8}}>
            {[{c:"#FF9500",l:"Novas"},{c:"#1a6fa8",l:"Aprendendo"},{c:"#6c3483",l:"Revisão"},{c:"#30c060",l:"Dominadas"}].map(({c,l})=>(
              <div key={l} style={{display:"flex", alignItems:"center", gap:4}}>
                <div style={{width:8,height:8,borderRadius:2,background:c,flexShrink:0}}/>
                <span style={{fontSize:10,color:"#aaa",fontWeight:700}}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Browse all words */}
        <button onClick={()=>setView("browse")} style={{width:"100%", background:"white", border:"1px solid #e8eaed", borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", marginBottom:20}}>
          <span style={{fontSize:22}}>📚</span>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:14, fontWeight:700, color:"#1a1a1a"}}>Ver todas as palavras</div>
            <div style={{fontSize:12, color:"#aaa", marginTop:1}}>{WORDS.length} palavras em 5 categorias</div>
          </div>
          <span style={{marginLeft:"auto", color:"#ccc", fontSize:20}}>›</span>
        </button>
      </div>
    </div>
  );

  // ── SESSION DONE ──
  if(step==="done") return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif", padding:"40px 20px", textAlign:"center"}}>
      <div style={{fontSize:64, marginBottom:16}}>🎉</div>
      <div style={{fontSize:24, fontWeight:900, color:"#1a1a1a", marginBottom:8}}>Sessão completa!</div>
      <div style={{fontSize:15, color:"#888", marginBottom:24}}>
        {sessionStats.done} palavras estudadas · {sessionStats.done - sessionStats.again} acertos
      </div>
      <div style={{background:"white", borderRadius:16, padding:"20px", border:"1px solid #eee", marginBottom:20, textAlign:"left"}}>
        <div style={{fontSize:13, fontWeight:700, color:"#555", marginBottom:12}}>📊 RESULTADO DA SESSÃO</div>
        {[
          {l:"Palavras estudadas", v:sessionStats.done, c:"#1a1a1a"},
          {l:"Acertos", v:sessionStats.done-sessionStats.again, c:"#30c060"},
          {l:"Para repetir", v:sessionStats.again, c:"#e74c3c"},
        ].map(({l,v,c})=>(
          <div key={l} style={{display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f5f5f5"}}>
            <span style={{fontSize:14, color:"#555"}}>{l}</span>
            <span style={{fontSize:16, fontWeight:800, color:c}}>{v}</span>
          </div>
        ))}
      </div>
      <button onClick={()=>{setView("dashboard");setQueue([]);setQIdx(0);}} style={{width:"100%", background:"linear-gradient(135deg,#1a1a2e,#0f3460)", border:"none", borderRadius:14, padding:"16px", color:"white", fontSize:15, fontWeight:800, cursor:"pointer"}}>
        ← Voltar ao painel
      </button>
    </div>
  );

  // ── BROWSE ──
  if(view==="browse") {
    const cats = [...new Set(WORDS.map(w=>w.cat))];
    return (
      <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
        <div style={{background:"linear-gradient(135deg,#1a1a2e,#0f3460)", padding:"16px 20px", display:"flex", alignItems:"center", gap:10}}>
          <button onClick={()=>setView("dashboard")} style={{background:"rgba(255,255,255,.15)", border:"none", color:"white", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontWeight:700}}>‹</button>
          <div style={{fontSize:16, fontWeight:800, color:"white"}}>Todas as palavras</div>
        </div>
        <div style={{padding:"12px 16px 20px"}}>
          {cats.map(cat=>(
            <div key={cat} style={{marginBottom:16}}>
              <div style={{fontSize:11, fontWeight:700, color:CAT_COLORS[cat]||"#888", letterSpacing:2, marginBottom:8, paddingLeft:4}}>{cat.toUpperCase()}</div>
              {WORDS.filter(w=>w.cat===cat).map(w=>{
                const c=cardMap[w.id];
                const statusColor = !c?"#ddd":c.status==="mastered"?"#30c060":c.status==="review"?"#6c3483":c.status==="learning"?"#1a6fa8":"#FF9500";
                const statusLabel = !c?"Não vista":c.status==="mastered"?"✅ Dominada":c.status==="review"?"🔄 Revisão":c.status==="learning"?"📖 Aprendendo":"🆕 Nova";
                return (
                  <div key={w.id} style={{background:"white", borderRadius:12, padding:"12px 14px", marginBottom:8, border:"1px solid #eee"}}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:15, fontWeight:800, color:"#1a1a1a"}}>{w.word}</div>
                        <div style={{fontSize:12, color:"#888", marginTop:2}}>{w.pt}</div>
                      </div>
                      <span style={{fontSize:10, fontWeight:700, color:statusColor, background:`${statusColor}18`, padding:"3px 8px", borderRadius:20}}>{statusLabel}</span>
                    </div>
                    <div style={{fontSize:12, color:"#555", marginTop:8, lineHeight:1.5, fontStyle:"italic", borderTop:"1px solid #f5f5f5", paddingTop:8}}>"{w.sentence}"</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── SESSION ──
  if(!current) return null;

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:"100vh", background:"#f7f8fa"}}>
      {/* Session header */}
      <div style={{background:`linear-gradient(135deg,${catColor},#1a1a2e)`, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <button onClick={()=>setView("dashboard")} style={{background:"rgba(255,255,255,.15)", border:"none", color:"white", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontWeight:700, fontSize:14}}>✕</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:13, fontWeight:800, color:"white"}}>{qIdx+1} / {queue.length}</div>
          <div style={{background:"rgba(255,255,255,.2)", borderRadius:20, height:4, width:120, marginTop:4}}>
            <div style={{width:`${((qIdx+1)/queue.length)*100}%`, height:"100%", background:"white", borderRadius:20}}/>
          </div>
        </div>
        <div style={{fontSize:11, color:"rgba(255,255,255,.7)", fontWeight:700}}>{current.isNew?"🆕 NOVA":"🔄 REVISÃO"}</div>
      </div>

      <div style={{padding:"20px 16px"}}>

        {/* STEP 1: RECALL */}
        {step==="recall" && (
          <div>
            <div style={{background:"white", borderRadius:20, padding:"28px 24px", textAlign:"center", marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}>
              <div style={{fontSize:11, fontWeight:700, color:catColor, letterSpacing:2, marginBottom:12}}>{current.cat}</div>
              <div style={{fontSize:36, fontWeight:900, color:"#1a1a1a", marginBottom:8}}>{current.word}</div>
              <div style={{background:`${catColor}12`, borderRadius:12, padding:"10px 16px", fontSize:13, color:catColor, fontWeight:600, display:"inline-block"}}>
                Você sabe o que significa?
              </div>
            </div>
            <div style={{background:"#fffbeb", borderRadius:14, padding:"14px 16px", marginBottom:16, fontSize:13, color:"#7a5c00", lineHeight:1.6}}>
              <strong>🧠 Técnica Feynman:</strong> Antes de ver a definição, tente explicar a palavra para si mesma em português simples. Se conseguir, você realmente entende!
            </div>
            <button onClick={()=>setStep("understand")} style={{width:"100%", background:`linear-gradient(135deg,${catColor},#1a1a2e)`, border:"none", borderRadius:14, padding:"16px", color:"white", fontSize:15, fontWeight:800, cursor:"pointer"}}>
              Ver definição →
            </button>
          </div>
        )}

        {/* STEP 2: UNDERSTAND */}
        {step==="understand" && (
          <div>
            <div style={{background:"white", borderRadius:20, padding:"24px 20px", marginBottom:14, boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}>
              <div style={{fontSize:11, fontWeight:700, color:catColor, letterSpacing:2, marginBottom:8}}>{current.cat}</div>
              <div style={{fontSize:28, fontWeight:900, color:"#1a1a1a", marginBottom:4}}>{current.word}</div>
              <div style={{fontSize:15, color:"#e74c3c", fontWeight:700, marginBottom:12}}>🇧🇷 {current.pt}</div>
              <div style={{fontSize:14, color:"#333", lineHeight:1.7, marginBottom:14, paddingBottom:14, borderBottom:"1px solid #f5f5f5"}}>
                📖 {current.def}
              </div>
              <div style={{background:`${catColor}10`, borderRadius:10, padding:"12px 14px", marginBottom:10}}>
                <div style={{fontSize:11, fontWeight:700, color:catColor, marginBottom:4}}>EXEMPLO</div>
                <div style={{fontSize:14, color:"#333", lineHeight:1.6, fontStyle:"italic"}}>"{current.sentence}"</div>
              </div>
              <div style={{background:"#f7f8fa", borderRadius:10, padding:"10px 14px"}}>
                <div style={{fontSize:11, fontWeight:700, color:"#888", marginBottom:4}}>💡 DICA DE USO</div>
                <div style={{fontSize:13, color:"#555", lineHeight:1.5}}>{current.tip}</div>
              </div>
            </div>
            <button onClick={()=>setStep("write")} style={{width:"100%", background:`linear-gradient(135deg,${catColor},#1a1a2e)`, border:"none", borderRadius:14, padding:"16px", color:"white", fontSize:15, fontWeight:800, cursor:"pointer"}}>
              ✍️ Agora escreva uma frase →
            </button>
          </div>
        )}

        {/* STEP 3: WRITE */}
        {step==="write" && (
          <div>
            <div style={{background:"white", borderRadius:16, padding:"16px 18px", marginBottom:14, border:`1px solid ${catColor}44`}}>
              <div style={{fontSize:24, fontWeight:900, color:"#1a1a1a"}}>{current.word}</div>
              <div style={{fontSize:13, color:"#888", marginTop:2}}>{current.pt}</div>
            </div>
            <div style={{background:"#fffbeb", borderRadius:14, padding:"12px 16px", marginBottom:14, fontSize:13, color:"#7a5c00", lineHeight:1.6}}>
              🖊️ <strong>Escreva uma frase em inglês</strong> usando essa palavra. Use contexto do seu trabalho — quanto mais real, melhor para memorizar!
            </div>
            <textarea
              value={userSentence}
              onChange={e=>setUserSentence(e.target.value)}
              placeholder={`Escreva uma frase usando "${current.word}"...`}
              style={{width:"100%", border:`2px solid ${userSentence.trim()?"#1a6fa8":"#e8eaed"}`, borderRadius:14, padding:"14px 16px", fontSize:15, lineHeight:1.6, minHeight:100, outline:"none", fontFamily:"inherit", boxSizing:"border-box", resize:"none", background:"white", transition:"border-color .2s"}}
            />
            <button
              onClick={()=>setStep("compare")}
              disabled={!userSentence.trim()}
              style={{width:"100%", background:userSentence.trim()?`linear-gradient(135deg,${catColor},#1a1a2e)`:"#e8eaed", border:"none", borderRadius:14, padding:"16px", color:userSentence.trim()?"white":"#aaa", fontSize:15, fontWeight:800, cursor:userSentence.trim()?"pointer":"default", marginTop:12, transition:"all .2s"}}>
              Ver correção →
            </button>
          </div>
        )}

        {/* STEP 4: COMPARE */}
        {step==="compare" && (
          <div>
            {/* User sentence */}
            <div style={{background:"white", borderRadius:14, padding:"16px 18px", marginBottom:12, border:"1px solid #e8eaed"}}>
              <div style={{fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, marginBottom:6}}>SUA FRASE</div>
              <div style={{fontSize:15, color:"#1a1a1a", lineHeight:1.6, fontStyle:"italic"}}>"{userSentence}"</div>
            </div>

            {/* Model sentence */}
            <div style={{background:`${catColor}10`, borderRadius:14, padding:"16px 18px", marginBottom:12, border:`1px solid ${catColor}30`}}>
              <div style={{fontSize:11, fontWeight:700, color:catColor, letterSpacing:1, marginBottom:6}}>FRASE MODELO</div>
              <div style={{fontSize:15, color:"#1a1a1a", lineHeight:1.6, fontStyle:"italic"}}>"{current.sentence}"</div>
            </div>

            {/* Tips */}
            <div style={{background:"#f7f8fa", borderRadius:14, padding:"14px 16px", marginBottom:16, fontSize:13, color:"#555", lineHeight:1.6}}>
              <strong>💡 Lembre-se:</strong> {current.tip}
            </div>

            <div style={{fontSize:13, fontWeight:700, color:"#555", textAlign:"center", marginBottom:10}}>Como foi?</div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8}}>
              {[
                {r:"again", label:"Errei",    emoji:"😞", bg:"#e74c3c"},
                {r:"hard",  label:"Difícil",  emoji:"😐", bg:"#e67e22"},
                {r:"good",  label:"Bom!",     emoji:"😊", bg:"#1a6fa8"},
                {r:"easy",  label:"Fácil!",   emoji:"🤩", bg:"#30c060"},
              ].map(({r,label,emoji,bg})=>(
                <button key={r} onClick={()=>handleRate(r)} style={{background:bg, border:"none", borderRadius:12, padding:"12px 4px", color:"white", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4}}>
                  <span style={{fontSize:20}}>{emoji}</span>
                  <span style={{fontSize:11, fontWeight:800}}>{label}</span>
                </button>
              ))}
            </div>
            <div style={{marginTop:10, fontSize:11, color:"#aaa", textAlign:"center", lineHeight:1.5}}>
              Sua avaliação agenda a próxima revisão automaticamente.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── COACH PROMPTS ─────────────────────────────────────────────────────────────
const PROMPTS = [
  { icon:"✍️", label:"Corrija meu inglês",    color:"#1a6fa8",
    text:`Act as my English coach. I'm a B2 Brazilian engineer/manager aiming for C2. Correct my English below and explain each mistake kindly:\n\n"[ESCREVA SEU TEXTO AQUI]"` },
  { icon:"💬", label:"Praticar conversação",  color:"#0e6655",
    text:`Act as my English conversation partner. I'm a B2 engineer learning professional English for international work. Start a conversation about a technical or management topic. Gently correct my mistakes inline.` },
  { icon:"🎤", label:"Treinar apresentação",  color:"#b7410e",
    text:`Act as my English presentation coach. I'll present a topic to you in English. Give feedback on structure, vocabulary, and clarity. Topic: [ESCREVA O TÓPICO]` },
  { icon:"💼", label:"Simular entrevista",    color:"#1a5276",
    text:`Act as an interviewer for a Senior Reliability Engineer / Engineering Manager position at a European company. Conduct a mock interview in English. Ask one question at a time and give feedback. Start now.` },
];

function CoachTab() {
  const [copied, setCopied] = useState(null);
  function copy(text, i) {
    navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(i); setTimeout(()=>setCopied(null),2000);
  }
  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#0f3460)", padding:"20px 20px 24px", color:"white"}}>
        <div style={{fontSize:11, color:"#7ec8e3", fontWeight:700, letterSpacing:2, marginBottom:4}}>COACH</div>
        <div style={{fontSize:20, fontWeight:800}}>Praticar com IA 🤖</div>
        <div style={{fontSize:13, color:"#a8c8e8", marginTop:4, lineHeight:1.5}}>Copie um prompt → cole no Claude.ai → pratique!</div>
      </div>
      <div style={{padding:"16px 16px 0"}}>
        <div style={{background:"#fffbeb", border:"1px solid #f6d365", borderRadius:12, padding:"12px 14px", marginBottom:14, fontSize:13, color:"#7a5c00", lineHeight:1.5}}>
          💡 <strong>Como usar:</strong> Toque em Copiar → abra o chat do Claude.ai → cole e personalize!
        </div>
        {PROMPTS.map((p,i)=>(
          <div key={i} style={{background:"white", borderRadius:14, padding:"14px 16px", marginBottom:10, border:"1px solid #eee", boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:10}}>
              <div style={{width:40,height:40,borderRadius:12,background:`${p.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{p.icon}</div>
              <div style={{fontSize:15,fontWeight:800,color:"#1a1a1a"}}>{p.label}</div>
            </div>
            <button onClick={()=>copy(p.text,i)} style={{width:"100%",background:copied===i?"#e8f5e9":`${p.color}12`,border:`1.5px solid ${copied===i?"#30c060":p.color}`,borderRadius:10,padding:"10px",cursor:"pointer",fontSize:13,fontWeight:700,color:copied===i?"#20a050":p.color,transition:"all .2s"}}>
              {copied===i?"✅ Copiado!":"📋 Copiar prompt"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]     = useState("home");
  const [streak, setStreak]     = useState(0);
  const [totalXP, setTotalXP]   = useState(0);
  const [daysDone, setDaysDone] = useState(0);
  const [history, setHistory]   = useState({});
  const [checked, setChecked]   = useState([]);
  const [vocabCards, setVocabCards] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [newAch, setNewAch]     = useState(null);

  const phase = 1;
  const today2     = todayStr();
  const todayTasks = getTasksForToday(DAILY_TASKS);
  const doneCount  = checked.length;
  const pct        = todayTasks.length?Math.round((doneCount/todayTasks.length)*100):0;
  const allDone    = doneCount===todayTasks.length;
  const cp         = PHASES.find(p=>p.id===phase);
  const phPct      = Math.min(100,Math.round((daysDone/cp.totalDays)*100));
  const unlocked   = ACHIEVEMENTS.filter(a=>a.condition(streak));

  useEffect(()=>{
    (async()=>{
      const s=await load("eng_v4");
      if(s){ setStreak(s.streak||0); setTotalXP(s.xp||0); setDaysDone(s.days||0); setHistory(s.hist||{}); setChecked(s.hist?.[today2]||[]); setVocabCards(s.vocab||[]); }
      setLoading(false);
    })();
  },[]);

  useEffect(()=>{
    if(loading) return;
    save("eng_v4",{streak,xp:totalXP,days:daysDone,hist:history,vocab:vocabCards});
  },[streak,totalXP,daysDone,history,vocabCards,loading]);

  function addXP(n) { setTotalXP(x=>x+n); }

  function toggle(taskId) {
    const task=DAILY_TASKS.find(t=>t.id===taskId);
    const isOn=checked.includes(taskId);
    const newChecked=isOn?checked.filter(x=>x!==taskId):[...checked,taskId];
    const newHist={...history,[today2]:newChecked};
    setChecked(newChecked); setHistory(newHist);
    setTotalXP(x=>Math.max(0,x+(isOn?-task.xp:task.xp)));
    if(!isOn&&newChecked.length===todayTasks.length&&checked.length<todayTasks.length){
      const hadYest=newHist[yesterdayStr()]?.length>=2;
      const ns=hadYest?streak+1:1; setStreak(ns);
      const a=ACHIEVEMENTS.find(a=>a.condition(ns)&&!a.condition(streak));
      if(a){setNewAch(a);setTimeout(()=>setNewAch(null),3000);}
      setDaysDone(d=>d+1); setCelebrating(true); setTimeout(()=>setCelebrating(false),1800);
    }
  }

  const last7=Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    const key=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    const done=history[key];
    return {dow:["D","S","T","Q","Q","S","S"][d.getDay()],full:done&&done.length>=2,partial:done&&done.length>0&&done.length<2};
  });

  // vocab due count for badge
  const cardMap={}; vocabCards.forEach(c=>{cardMap[c.wordId]=c;});
  const vocabDueCount = vocabCards.filter(c=>isOverdue(c.due)).length + Math.min(5, WORDS.filter(w=>!cardMap[w.id]).length);

  const TABS=[{id:"home",icon:"🏠",label:"Início"},{id:"vocab",icon:"📚",label:"Vocab"},{id:"coach",icon:"🤖",label:"Coach"},{id:"achievements",icon:"🏆",label:"Conquistas"}];
  const NAV=(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,background:"white",borderTop:"1px solid #e8eaed",display:"flex",padding:"8px 0 14px",zIndex:50}}>
      {TABS.map(t=>(
        <button key={t.id} onClick={()=>setScreen(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",color:screen===t.id?cp.color:"#aaa",position:"relative"}}>
          <span style={{fontSize:20}}>{t.icon}</span>
          {t.id==="vocab"&&vocabDueCount>0&&<div style={{position:"absolute",top:0,right:"50%",marginRight:-16,background:"#e74c3c",color:"white",borderRadius:50,fontSize:9,fontWeight:900,padding:"1px 5px",minWidth:16,textAlign:"center"}}>{vocabDueCount}</div>}
          <span style={{fontSize:9,fontWeight:700,letterSpacing:.3}}>{t.label}</span>
        </button>
      ))}
    </div>
  );

  if(loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontSize:32}}>⏳</div>;

  if(screen==="vocab") return (
    <div style={{background:"#f7f8fa",minHeight:"100vh",maxWidth:420,margin:"0 auto",paddingBottom:80,overflowY:"auto"}}>
      <VocabScreen cards={vocabCards} setCards={setVocabCards} onXP={addXP}/>
      {NAV}
    </div>
  );
  if(screen==="coach") return (
    <div style={{background:"#f7f8fa",minHeight:"100vh",maxWidth:420,margin:"0 auto",paddingBottom:80,overflowY:"auto"}}>
      <CoachTab/>{NAV}
    </div>
  );
  if(screen==="achievements") return (
    <div style={{background:"#f7f8fa",minHeight:"100vh",maxWidth:420,margin:"0 auto",fontFamily:"'Segoe UI',system-ui,sans-serif",paddingBottom:80}}>
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#0f3460)",padding:"20px 20px 28px",color:"white"}}>
        <div style={{fontSize:11,color:"#7ec8e3",fontWeight:700,letterSpacing:2,marginBottom:6}}>CONQUISTAS</div>
        <div style={{fontSize:22,fontWeight:800}}>Suas medalhas 🏅</div>
        <div style={{fontSize:13,color:"#a8c8e8",marginTop:4}}>{unlocked.length}/{ACHIEVEMENTS.length} desbloqueadas</div>
      </div>
      <div style={{margin:"20px 16px 0",background:"white",borderRadius:16,padding:"24px 20px",textAlign:"center",border:"1px solid #eee"}}>
        <Flame size={60} dim={streak===0}/>
        <div style={{fontSize:48,fontWeight:900,color:streak>0?"#FF9500":"#ccc",lineHeight:1,marginTop:8}}>{streak}</div>
        <div style={{fontSize:13,color:"#888",marginTop:4}}>dias de streak</div>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:16}}>
          {[{v:totalXP.toLocaleString(),l:"XP TOTAL"},{v:daysDone,l:"DIAS ATIVOS"},{v:vocabCards.filter(c=>c.status==="mastered").length,l:"PALAVRAS DOMINADAS"}].map(({v,l})=>(
            <div key={l} style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:900,color:"#1a1a2e"}}>{v}</div><div style={{fontSize:9,color:"#aaa",fontWeight:700}}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 16px 0"}}>
        {ACHIEVEMENTS.map((a,i)=>{
          const done=a.condition(streak); const need=[1,7,14,30,60][i]; const p2=Math.min(100,Math.round((streak/need)*100));
          return (
            <div key={a.id} style={{background:"white",borderRadius:14,padding:"16px 18px",marginBottom:12,border:`1px solid ${done?"#fda08566":"#eee"}`,display:"flex",gap:14,alignItems:"center"}}>
              <div style={{width:50,height:50,borderRadius:14,flexShrink:0,background:done?"linear-gradient(135deg,#f6d365,#fda085)":"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,filter:done?"none":"grayscale(1)",opacity:done?1:.6}}>{a.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:800,color:done?"#1a1a1a":"#888"}}>{a.label}</div>
                {done?<div style={{fontSize:12,color:"#30c060",fontWeight:700,marginTop:3}}>✅ Desbloqueada!</div>:(
                  <div><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#aaa",marginTop:5,marginBottom:3}}><span>{need} dias necessários</span><span>{p2}%</span></div><div style={{background:"#f0f0f0",borderRadius:20,height:6}}><div style={{width:`${p2}%`,height:"100%",background:"#fda085",borderRadius:20}}/></div></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {NAV}
    </div>
  );

  // HOME
  return (
    <div style={{background:"#f7f8fa",minHeight:"100vh",maxWidth:420,margin:"0 auto",fontFamily:"'Segoe UI',system-ui,sans-serif",paddingBottom:80}}>
      {celebrating&&<div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",fontSize:80}}>🎉</div>}
      {newAch&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#1a1a2e",color:"white",padding:"12px 24px",borderRadius:50,zIndex:200,fontWeight:700,fontSize:14,display:"flex",gap:8,alignItems:"center",boxShadow:"0 8px 32px rgba(0,0,0,.3)"}}>{newAch.icon} {newAch.label} desbloqueado!</div>}
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#0f3460)",padding:"20px 20px 22px",color:"white"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div><div style={{fontSize:11,color:"#7ec8e3",fontWeight:700,letterSpacing:2}}>ENGLISH COACH</div><div style={{fontSize:20,fontWeight:800,marginTop:2}}>Bom dia, Sandy! 👋</div></div>
          <div style={{textAlign:"center"}}><div style={{display:"flex",alignItems:"center",gap:4}}><Flame size={26} dim={streak===0}/><span style={{fontSize:24,fontWeight:900,color:streak>0?"#FF9500":"#888"}}>{streak}</span></div><div style={{fontSize:9,color:"#7ec8e3",letterSpacing:1}}>DIAS SEGUIDOS</div></div>
        </div>
        <div style={{background:"rgba(255,255,255,.1)",borderRadius:16,padding:"10px 16px",display:"flex",justifyContent:"space-between"}}>
          <div><div style={{fontSize:10,color:"#a8c8e8",fontWeight:700,letterSpacing:1}}>XP TOTAL</div><div style={{fontSize:20,fontWeight:900,color:"#fda085"}}>{totalXP.toLocaleString()}</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#a8c8e8",fontWeight:700,letterSpacing:1}}>FASE</div><div style={{fontSize:13,fontWeight:800,color:"white",marginTop:2}}>{cp.level}</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#a8c8e8",fontWeight:700,letterSpacing:1}}>PALAVRAS</div><div style={{fontSize:20,fontWeight:900,color:"white"}}>{vocabCards.filter(c=>c.status==="mastered").length}</div></div>
        </div>
      </div>
      <div style={{background:"white",padding:"14px 20px",borderBottom:"1px solid #f0f0f0"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:11,fontWeight:700,color:"#888",letterSpacing:1}}>ÚLTIMOS 7 DIAS</span><span style={{fontSize:11,color:"#aaa"}}>{last7.filter(d=>d.full).length}/7</span></div>
        <div style={{display:"flex",gap:6}}>
          {last7.map((d,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:"100%",aspectRatio:"1",borderRadius:8,background:d.full?"#FF9500":d.partial?"#FFD580":"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:d.full?"0 2px 8px #FF950066":"none"}}>{d.full?"🔥":d.partial?"⚡":""}</div>
              <span style={{fontSize:10,fontWeight:700,color:d.full?"#FF9500":"#bbb"}}>{d.dow}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"14px 16px 0"}}>
        <button onClick={()=>setScreen("vocab")} style={{width:"100%",background:"linear-gradient(135deg,#1a1a2e,#0f3460)",border:"none",borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",color:"white",marginBottom:14}}>
          <span style={{fontSize:26}}>📚</span>
          <div style={{textAlign:"left"}}><div style={{fontSize:15,fontWeight:800}}>Estudar vocabulário</div><div style={{fontSize:12,color:"#a8c8e8",marginTop:1}}>{vocabDueCount} palavras aguardando hoje</div></div>
          {vocabDueCount>0&&<div style={{marginLeft:"auto",background:"#e74c3c",color:"white",borderRadius:50,fontSize:12,fontWeight:900,padding:"3px 9px"}}>{vocabDueCount}</div>}
        </button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontSize:15,fontWeight:800,color:"#1a1a1a"}}>Atividades de hoje</div><div style={{fontSize:12,color:"#888",marginTop:1}}>{doneCount}/{todayTasks.length} concluídas</div></div>
          <div style={{position:"relative"}}><Ring pct={pct} color={allDone?"#30c060":cp.color}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:allDone?"#30c060":cp.color}}>{pct}%</div></div>
        </div>
        {allDone&&<div style={{background:"linear-gradient(135deg,#30c060,#20a050)",borderRadius:12,padding:"14px 18px",marginBottom:12,color:"white",display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:26}}>🏆</span><div><div style={{fontWeight:800}}>Dia completo!</div><div style={{fontSize:12,opacity:.85,marginTop:1}}>Streak mantida! 🔥</div></div></div>}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
          {todayTasks.map(task=>{
            const done=checked.includes(task.id);
            return (
              <button key={task.id} onClick={()=>toggle(task.id)} style={{background:"white",border:`2px solid ${done?cp.color:"#e8eaed"}`,borderRadius:14,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",textAlign:"left",boxShadow:done?`0 2px 10px ${cp.color}33`:"0 1px 3px rgba(0,0,0,.05)",transition:"all .2s"}}>
                <div style={{width:26,height:26,borderRadius:50,border:`2.5px solid ${done?cp.color:"#ccc"}`,background:done?cp.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>{done&&<span style={{color:"white",fontSize:14}}>✓</span>}</div>
                <span style={{fontSize:20,flexShrink:0}}>{task.icon}</span>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:done?"#888":"#1a1a1a",textDecoration:done?"line-through":"none"}}>{task.label}</div><div style={{fontSize:11,color:"#bbb",marginTop:1}}>{task.duration}</div></div>
                <span style={{background:"linear-gradient(135deg,#f6d365,#fda085)",color:"#7a3600",fontSize:11,fontWeight:800,borderRadius:20,padding:"2px 8px",flexShrink:0}}>+{task.xp}XP</span>
              </button>
            );
          })}
        </div>
      </div>
      {NAV}
    </div>
  );
}
