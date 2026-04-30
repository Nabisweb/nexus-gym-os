import { useState, useEffect } from "react";

const STORAGE_KEY = "gymtracker_v5";
const SHEET_ID = "1JwF4EAGJNCkx5Xsea4UbrBrCeOP_YFKxqsPsQh1V9yA";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}`;
const USERS = ["Atleta 1", "Atleta 2"];

const MUSCLES = [
  { id:"petto",     label:"Petto",     color:"#ff8c55" },
  { id:"schiena",   label:"Schiena",   color:"#00e5ff" },
  { id:"gambe",     label:"Gambe",     color:"#7dff9a" },
  { id:"spalle",    label:"Spalle",    color:"#d9a0ff" },
  { id:"bicipiti",  label:"Bicipiti",  color:"#ffe55c" },
  { id:"tricipiti", label:"Tricipiti", color:"#ff7a90" },
  { id:"core",      label:"Core",      color:"#00ffd0" },
  { id:"cardio",    label:"Cardio",    color:"#ffbe5c" },
];

const EXERCISES = {
  petto:     ["Panca Piana","Panca Inclinata","Croci Cavi","Push-Up","Dips","Pec-Deck"],
  schiena:   ["Stacchi","Trazioni","Rematore BB","Lat Machine","Pulley Basso","T-Bar Row"],
  gambe:     ["Squat","Leg Press","Affondi","Romanian Deadlift","Leg Curl","Leg Extension","Calf Raises"],
  spalle:    ["Lento Avanti","Arnold Press","Alzate Laterali","Face Pull","Upright Row"],
  bicipiti:  ["Curl BB","Curl Manubri","Curl Martello","Curl Concentrato","Curl Cavo"],
  tricipiti: ["French Press","Push Down Cavo","Dips Panca","Skull Crusher","Kickback"],
  core:      ["Plank","Crunch","Russian Twist","Leg Raises","Ab Wheel","Mountain Climbers"],
  cardio:    ["Corsa","Tapis Roulant","Cyclette","Vogatore","Salto Corda","HIIT"],
};

const MUSCLE_SVG = {
  petto:     c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><rect width="200" height="120" fill="#060812"/><ellipse cx="60" cy="65" rx="38" ry="28" fill="${c}28" stroke="${c}" stroke-width="2"/><ellipse cx="140" cy="65" rx="38" ry="28" fill="${c}28" stroke="${c}" stroke-width="2"/><line x1="100" y1="20" x2="100" y2="100" stroke="${c}" stroke-width="1.2" opacity="0.6"/><ellipse cx="60" cy="65" rx="20" ry="14" fill="${c}45" stroke="${c}" stroke-width="1"/><ellipse cx="140" cy="65" rx="20" ry="14" fill="${c}45" stroke="${c}" stroke-width="1"/><path d="M100,40 C85,35 70,38 55,45 C48,50 44,57 44,65" stroke="${c}" stroke-width="2" fill="none"/><path d="M100,40 C115,35 130,38 145,45 C152,50 156,57 156,65" stroke="${c}" stroke-width="2" fill="none"/><circle cx="60" cy="65" r="5" fill="${c}"/><circle cx="140" cy="65" r="5" fill="${c}"/></svg>`,
  schiena:   c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><rect width="200" height="120" fill="#060812"/><path d="M100,15 L60,30 L50,70 L65,95 L100,100 L135,95 L150,70 L140,30 Z" fill="${c}22" stroke="${c}" stroke-width="2"/><path d="M100,15 L100,100" stroke="${c}" stroke-width="2" opacity="0.7"/><path d="M65,35 C75,40 90,42 100,42 C110,42 125,40 135,35" stroke="${c}" stroke-width="2.5" fill="none"/><path d="M55,60 C70,65 88,67 100,67 C112,67 130,65 145,60" stroke="${c}" stroke-width="2.5" fill="none"/><circle cx="100" cy="15" r="5" fill="${c}"/></svg>`,
  gambe:     c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><rect width="200" height="120" fill="#060812"/><rect x="62" y="10" width="30" height="55" rx="15" fill="${c}25" stroke="${c}" stroke-width="2"/><rect x="108" y="10" width="30" height="55" rx="15" fill="${c}25" stroke="${c}" stroke-width="2"/><rect x="65" y="68" width="24" height="45" rx="12" fill="${c}20" stroke="${c}" stroke-width="1.5"/><rect x="111" y="68" width="24" height="45" rx="12" fill="${c}20" stroke="${c}" stroke-width="1.5"/><ellipse cx="77" cy="37" rx="10" ry="14" fill="${c}40" stroke="${c}" stroke-width="1"/><ellipse cx="123" cy="37" rx="10" ry="14" fill="${c}40" stroke="${c}" stroke-width="1"/></svg>`,
  spalle:    c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><rect width="200" height="120" fill="#060812"/><ellipse cx="45" cy="55" rx="32" ry="30" fill="${c}25" stroke="${c}" stroke-width="2"/><ellipse cx="155" cy="55" rx="32" ry="30" fill="${c}25" stroke="${c}" stroke-width="2"/><rect x="85" y="20" width="30" height="70" rx="8" fill="${c}18" stroke="${c}" stroke-width="1.2"/><ellipse cx="45" cy="55" rx="16" ry="15" fill="${c}40" stroke="${c}" stroke-width="1.2"/><ellipse cx="155" cy="55" rx="16" ry="15" fill="${c}40" stroke="${c}" stroke-width="1.2"/><circle cx="45" cy="55" r="6" fill="${c}"/><circle cx="155" cy="55" r="6" fill="${c}"/></svg>`,
  bicipiti:  c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><rect width="200" height="120" fill="#060812"/><rect x="55" y="20" width="22" height="80" rx="11" fill="${c}20" stroke="${c}" stroke-width="1.5"/><rect x="123" y="20" width="22" height="80" rx="11" fill="${c}20" stroke="${c}" stroke-width="1.5"/><ellipse cx="66" cy="48" rx="14" ry="22" fill="${c}40" stroke="${c}" stroke-width="2"/><ellipse cx="134" cy="48" rx="14" ry="22" fill="${c}40" stroke="${c}" stroke-width="2"/><ellipse cx="66" cy="45" rx="7" ry="12" fill="${c}65"/><ellipse cx="134" cy="45" rx="7" ry="12" fill="${c}65"/></svg>`,
  tricipiti: c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><rect width="200" height="120" fill="#060812"/><rect x="55" y="20" width="22" height="80" rx="11" fill="${c}20" stroke="${c}" stroke-width="1.5"/><rect x="123" y="20" width="22" height="80" rx="11" fill="${c}20" stroke="${c}" stroke-width="1.5"/><path d="M57,30 C60,50 60,70 62,90 L75,90 C76,70 74,50 77,30 Z" fill="${c}38" stroke="${c}" stroke-width="2"/><path d="M125,30 C128,50 128,70 130,90 L143,90 C144,70 142,50 145,30 Z" fill="${c}38" stroke="${c}" stroke-width="2"/><path d="M58,55 C63,59 71,59 76,55" stroke="${c}" stroke-width="2.5" fill="none"/><path d="M126,55 C131,59 139,59 144,55" stroke="${c}" stroke-width="2.5" fill="none"/></svg>`,
  core:      c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><rect width="200" height="120" fill="#060812"/><rect x="72" y="8" width="56" height="104" rx="8" fill="${c}15" stroke="${c}" stroke-width="1.5"/><line x1="100" y1="8" x2="100" y2="112" stroke="${c}" stroke-width="2" opacity="0.7"/><rect x="74" y="18" width="24" height="18" rx="5" fill="${c}38" stroke="${c}" stroke-width="1.2"/><rect x="102" y="18" width="24" height="18" rx="5" fill="${c}38" stroke="${c}" stroke-width="1.2"/><rect x="74" y="42" width="24" height="18" rx="5" fill="${c}38" stroke="${c}" stroke-width="1.2"/><rect x="102" y="42" width="24" height="18" rx="5" fill="${c}38" stroke="${c}" stroke-width="1.2"/><rect x="74" y="66" width="24" height="18" rx="5" fill="${c}38" stroke="${c}" stroke-width="1.2"/><rect x="102" y="66" width="24" height="18" rx="5" fill="${c}38" stroke="${c}" stroke-width="1.2"/></svg>`,
  cardio:    c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><rect width="200" height="120" fill="#060812"/><path d="M100,88 C58,72 22,52 22,33 C22,18 35,10 50,10 C66,10 82,22 100,40 C118,22 134,10 150,10 C165,10 178,18 178,33 C178,52 142,72 100,88 Z" fill="${c}28" stroke="${c}" stroke-width="2"/><path d="M18,62 L43,62 L54,46 L70,78 L86,28 L97,65 L103,65 L114,48 L130,72 L147,55 L163,55 L182,62" stroke="${c}" stroke-width="3" fill="none"/></svg>`,
};

function svgUrl(id, color) {
  const fn = MUSCLE_SVG[id] ?? MUSCLE_SVG.petto;
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(fn(color))));
}
function muscleById(id) { return MUSCLES.find(m=>m.id===id)||MUSCLES[0]; }
function todayStr() { return new Date().toISOString().split("T")[0]; }
function fmtDate(s) {
  return new Date(s+"T12:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"});
}

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:1000,
      mcp_servers:[{type:"url",url:"https://api.anthropic.com/mcp/gdrive/mcp",name:"gdrive"}],
      messages:[{role:"user",content:prompt}],
    }),
  });
  const data = await res.json();
  return data.content?.find(b=>b.type==="text")?.text||"";
}
async function loadFromSheet() {
  try {
    const raw = await callClaude(`Read Google Sheet ID "${SHEET_ID}". Return ONLY a JSON array (no markdown) with fields: id,data,utente,gruppo,esercizio,serie_num,reps,kg. If empty/header-only return [].`);
    const rows = JSON.parse(raw.replace(/```json|```/g,"").trim());
    const map={};
    rows.forEach(r=>{
      if(!r.id) return;
      if(!map[r.id]) map[r.id]={id:+r.id,date:r.data,utente:+r.utente,muscle:r.gruppo,exercise:r.esercizio,sets:[]};
      map[r.id].sets.push({reps:+r.reps,kg:r.kg?+r.kg:null});
    });
    const all=Object.values(map);
    return {0:all.filter(s=>s.utente===0),1:all.filter(s=>s.utente===1)};
  } catch(e){console.error(e);return null;}
}
async function appendToSheet(session,ui) {
  const rows=session.sets.map((s,i)=>`${session.id},${session.date},${ui},${session.muscle},${session.exercise},${i+1},${s.reps},${s.kg??""}`).join("\n");
  await callClaude(`Append to Google Sheet ID "${SHEET_ID}" (columns: id,data,utente,gruppo,esercizio,serie_num,reps,kg) these rows:\n${rows}\nReply "done".`);
}
async function deleteFromSheet(id) {
  await callClaude(`In Google Sheet ID "${SHEET_ID}" delete all rows where id="${id}". Reply "done".`);
}

function loadLocal(){try{const r=localStorage.getItem(STORAGE_KEY);if(r)return JSON.parse(r);}catch{}return{0:[],1:[]};}
function saveLocal(d){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(d));}catch{}}

// ── DESIGN TOKENS ────────────────────────────────────────
// All text on dark bg — WCAG AA minimum 4.5:1 ratio guaranteed
const C = {
  bg:        "#05060f",
  bgCard:    "rgba(255,255,255,0.07)",
  bgCardHov: "rgba(255,255,255,0.11)",
  border:    "rgba(255,255,255,0.14)",
  borderBright:"rgba(255,255,255,0.25)",
  // Text
  t1: "#ffffff",        // primary — 21:1
  t2: "#dde8f0",        // secondary — ~14:1
  t3: "#aec4d0",        // tertiary — ~8:1
  t4: "#7a9aaa",        // muted labels — ~4.8:1 (still AA)
  // Accent
  cyan:  "#00e5ff",
  cyanD: "#00b8cc",
};

function GlassCard({children,style,onClick,glow}){
  return(
    <div onClick={onClick} style={{
      background:C.bgCard, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
      border:`1px solid ${C.border}`, borderRadius:20,
      boxShadow:glow?`0 0 30px ${glow}22,inset 0 1px 0 rgba(255,255,255,0.1)`:"inset 0 1px 0 rgba(255,255,255,0.08)",
      ...style,
    }}>{children}</div>
  );
}
function SvgBg({id,color,style}){
  return <div style={{backgroundImage:`url("${svgUrl(id,color)}")`,backgroundSize:"cover",backgroundPosition:"center",...style}}/>;
}
function Badge({children,color}){
  return(
    <span style={{
      fontSize:10,fontFamily:"'Orbitron',monospace",fontWeight:800,letterSpacing:1,
      color:color, background:`${color}22`, padding:"3px 10px", borderRadius:20,
      border:`1.5px solid ${color}66`,
    }}>{children}</span>
  );
}
function SyncBadge({status}){
  const M={synced:{c:"#7dff9a",i:"●",t:"SYNC OK"},syncing:{c:"#ffe55c",i:"◌",t:"SYNC…"},error:{c:"#ff7a90",i:"⚠",t:"LOCALE"},idle:{c:C.t4,i:"◎",t:"—"}};
  const s=M[status]||M.idle;
  return <span style={{fontFamily:"'Orbitron',monospace",fontSize:9,fontWeight:800,letterSpacing:2,color:s.c}}>{s.i} {s.t}</span>;
}

export default function App(){
  const [data,setData]=useState(loadLocal);
  const [user,setUser]=useState(0);
  const [view,setView]=useState("home");
  const [step,setStep]=useState(1);
  const [muscle,setMuscle]=useState(null);
  const [exercise,setExercise]=useState("");
  const [customEx,setCustomEx]=useState("");
  const [sets,setSets]=useState([{reps:"",kg:""}]);
  const [logDate,setLogDate]=useState(todayStr());
  const [toast,setToast]=useState(null);
  const [expanded,setExpanded]=useState(null);
  const [delConfirm,setDelConfirm]=useState(null);
  const [sync,setSync]=useState("idle");

  useEffect(()=>{
    setSync("syncing");
    loadFromSheet().then(r=>{if(r){setData(r);saveLocal(r);setSync("synced");}else setSync("error");});
  },[]);

  const sessions=data[user]||[];
  const m=muscle?muscleById(muscle):null;

  function flash(msg,color=C.cyan){setToast({msg,color});setTimeout(()=>setToast(null),2800);}
  function reset(){setStep(1);setMuscle(null);setExercise("");setCustomEx("");setSets([{reps:"",kg:""}]);setLogDate(todayStr());}

  async function save(){
    const ex=customEx.trim()||exercise;
    if(!ex){flash("Scegli un esercizio!","#ff7a90");return;}
    const valid=sets.filter(s=>s.reps!=="");
    if(!valid.length){flash("Almeno una serie!","#ff7a90");return;}
    const session={id:Date.now(),date:logDate,muscle,exercise:ex,sets:valid.map(s=>({reps:+s.reps,kg:s.kg?+s.kg:null}))};
    const nd={...data,[user]:[session,...(data[user]||[])]};
    setData(nd);saveLocal(nd);flash("Salvataggio…","#ffe55c");reset();setView("home");
    setSync("syncing");
    try{await appendToSheet(session,user);setSync("synced");flash("Salvato su Google Sheets ✓","#7dff9a");}
    catch{setSync("error");flash("Salvato solo in locale ⚠","#ffbe5c");}
  }
  async function del(id){
    const nd={...data,[user]:data[user].filter(s=>s.id!==id)};
    setData(nd);saveLocal(nd);setDelConfirm(null);setSync("syncing");
    try{await deleteFromSheet(id);setSync("synced");flash("Eliminata da Sheets ✓","#7dff9a");}
    catch{setSync("error");flash("Eliminata solo in locale ⚠","#ffbe5c");}
  }
  async function manualSync(){
    setSync("syncing");flash("Sincronizzazione…","#ffe55c");
    const r=await loadFromSheet();
    if(r){setData(r);saveLocal(r);setSync("synced");flash("Aggiornato! ✓","#7dff9a");}
    else{setSync("error");flash("Errore sync ⚠","#ff7a90");}
  }

  const grouped={};
  sessions.forEach(s=>{if(!grouped[s.date])grouped[s.date]=[];grouped[s.date].push(s);});
  const dates=Object.keys(grouped).sort((a,b)=>b.localeCompare(a));
  const weekSess=sessions.filter(s=>{
    const d=new Date(s.date+"T12:00:00"),now=new Date();
    const sow=new Date(now);sow.setDate(now.getDate()-now.getDay()+1);sow.setHours(0,0,0,0);
    return d>=sow;
  });
  const totalVol=sessions.reduce((a,s)=>a+s.sets.reduce((b,x)=>b+x.reps*(x.kg||1),0),0);
  const u0=data[0]||[],u1=data[1]||[];

  const CSS=`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Orbitron:wght@500;700;900&family=Share+Tech+Mono&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    @keyframes scan{from{top:-2px}to{top:100vh}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes glow{0%,100%{box-shadow:0 0 16px rgba(0,229,255,.15)}50%{box-shadow:0 0 36px rgba(0,229,255,.38)}}
    @keyframes tin{from{opacity:0;transform:translate(-50%,16px)}to{opacity:1;transform:translate(-50%,0)}}
    input,button{font-family:'Rajdhani',sans-serif;}
    input:focus{outline:none!important;border-color:#00e5ff!important;box-shadow:0 0 0 3px rgba(0,229,255,.2)!important;}
    input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
    input[type=date]::-webkit-calendar-picker-indicator{filter:invert(1) sepia(1) saturate(5) hue-rotate(175deg);cursor:pointer;opacity:.9;}
    input::placeholder{color:#5a7888;font-weight:600;}
    ::-webkit-scrollbar{width:2px;} ::-webkit-scrollbar-thumb{background:rgba(0,229,255,.25);border-radius:4px;}
    .mc{transition:all .2s;cursor:pointer;} .mc:hover{transform:scale(1.04);box-shadow:0 6px 24px rgba(0,0,0,.5)!important;}
    .ei{transition:all .15s;cursor:pointer;} .ei:hover{border-color:#00e5ff!important;background:rgba(0,229,255,.08)!important;}
    .nb{transition:color .2s;cursor:pointer;} .nb:hover{color:#00e5ff!important;}
    .db{transition:all .15s;} .db:hover{color:#ff7a90!important;}
    .sr{animation:up .18s ease both;}
    .btn-main{transition:opacity .15s;} .btn-main:hover{opacity:.85;}
    .ghost{transition:all .15s;} .ghost:hover{border-color:rgba(0,229,255,.45)!important;color:#00e5ff!important;}
  `;

  const NAV=[{id:"home",icon:"⌂",lbl:"BASE"},{id:"log",icon:"＋",lbl:"LOG"},{id:"history",icon:"◫",lbl:"STORICO"},{id:"compare",icon:"⇆",lbl:"VS"}];

  // ── INPUT STYLE ──────────────────────────────────────
  const inp={
    width:"100%",background:"rgba(255,255,255,0.09)",
    border:`1px solid ${C.borderBright}`,borderRadius:12,
    padding:"13px 16px",color:C.t1,fontSize:17,fontWeight:700,
  };

  return(
    <>
      <style>{CSS}</style>

      {/* HUD */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,229,255,.007) 4px)"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(0,229,255,.35),transparent)",animation:"scan 9s linear infinite"}}/>
        {["tl","tr","bl","br"].map(c=>(
          <div key={c} style={{position:"absolute",
            top:c[0]==="t"?0:"auto",bottom:c[0]==="b"?0:"auto",
            left:c[1]==="l"?0:"auto",right:c[1]==="r"?0:"auto",
            width:40,height:40,
            borderTop:c[0]==="t"?"1.5px solid rgba(0,229,255,.4)":"none",
            borderBottom:c[0]==="b"?"1.5px solid rgba(0,229,255,.4)":"none",
            borderLeft:c[1]==="l"?"1.5px solid rgba(0,229,255,.4)":"none",
            borderRight:c[1]==="r"?"1.5px solid rgba(0,229,255,.4)":"none",
          }}/>
        ))}
      </div>

      <div style={{minHeight:"100vh",background:C.bg,color:C.t1,fontFamily:"'Rajdhani',sans-serif",maxWidth:480,margin:"0 auto",position:"relative",paddingBottom:92,zIndex:1}}>

        {/* ── HEADER ── */}
        <div style={{position:"sticky",top:0,zIndex:30,background:"rgba(5,6,15,.98)",backdropFilter:"blur(30px)",borderBottom:"1.5px solid rgba(0,229,255,.18)",padding:"16px 20px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,color:C.t4,letterSpacing:5,marginBottom:4,fontWeight:700}}>◈ NEXUS GYM OS</div>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:20,fontWeight:900,color:C.t1,letterSpacing:1}}>{USERS[user].toUpperCase()}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
              <SyncBadge status={sync}/>
              <button className="ghost" onClick={manualSync} style={{
                background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.3)",
                borderRadius:8,padding:"5px 12px",color:C.cyan,cursor:"pointer",
                fontFamily:"'Orbitron',monospace",fontSize:9,letterSpacing:2,fontWeight:800,
              }}>↻ SYNC</button>
            </div>
          </div>

          {/* Sheet link */}
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:12,padding:"8px 13px",borderRadius:10,background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)"}}>
            <span style={{fontSize:15}}>📊</span>
            <a href={SHEET_URL} target="_blank" rel="noopener noreferrer" style={{
              fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:C.cyan,
              letterSpacing:1,textDecoration:"none",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:700,
            }}>Google Sheets — Apri foglio dati ↗</a>
          </div>

          <div style={{display:"flex",gap:8}}>
            {USERS.map((u,i)=>(
              <button key={i} onClick={()=>{setUser(i);setView("home");}} style={{
                flex:1,padding:"10px 0",fontFamily:"'Orbitron',monospace",fontSize:10,fontWeight:800,letterSpacing:2,
                border:`1.5px solid ${i===user?"rgba(0,229,255,.7)":C.border}`,borderRadius:11,
                background:i===user?"rgba(0,229,255,.14)":"rgba(255,255,255,.05)",
                color:i===user?C.cyan:C.t3,cursor:"pointer",transition:"all .2s",
                boxShadow:i===user?"0 0 16px rgba(0,229,255,.22)":"none",
              }}>{u.toUpperCase()}</button>
            ))}
          </div>
        </div>

        {/* ════════ HOME ════════ */}
        {view==="home"&&(
          <div style={{padding:"24px 20px 0",animation:"up .3s ease"}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,letterSpacing:4,color:C.t4,marginBottom:13,fontWeight:700}}>◈ STATISTICHE</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:26}}>
              {[
                {lbl:"SETTIMANA",val:weekSess.length,unit:"sessioni",c:"#00e5ff"},
                {lbl:"TOTALE",val:sessions.length,unit:"allenamenti",c:"#ff8c55"},
                {lbl:"VOLUME",val:totalVol>999?`${(totalVol/1000).toFixed(1)}K`:totalVol,unit:"kg · reps",c:"#7dff9a"},
                {lbl:"MUSCOLI",val:[...new Set(sessions.map(s=>s.muscle))].length,unit:"zone allenate",c:"#d9a0ff"},
              ].map(({lbl,val,unit,c})=>(
                <GlassCard key={lbl} glow={c} style={{padding:"17px 18px"}}>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,color:c,letterSpacing:2,marginBottom:7,fontWeight:800}}>{lbl}</div>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:32,fontWeight:900,color:C.t1,lineHeight:1}}>{val}</div>
                  <div style={{fontSize:13,color:C.t3,marginTop:5,fontWeight:600}}>{unit}</div>
                </GlassCard>
              ))}
            </div>

            <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,letterSpacing:4,color:C.t4,marginBottom:13,fontWeight:700}}>◈ SESSIONI RECENTI</div>

            {sync==="syncing"&&sessions.length===0?(
              <GlassCard style={{padding:44,textAlign:"center"}}>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:12,color:C.cyan,letterSpacing:3,animation:"pulse 1s infinite",fontWeight:700}}>CARICAMENTO DATI…</div>
              </GlassCard>
            ):sessions.length===0?(
              <GlassCard style={{padding:44,textAlign:"center"}}>
                <div style={{fontSize:36,opacity:.25,marginBottom:14}}>◌</div>
                <div style={{color:C.t3,fontSize:16,fontWeight:700,lineHeight:1.6}}>Nessun allenamento.<br/>Premi + per iniziare.</div>
              </GlassCard>
            ):sessions.slice(0,4).map((s,idx)=>{
              const mu=muscleById(s.muscle);
              return(
                <GlassCard key={s.id} glow={mu.color} style={{marginBottom:10,overflow:"hidden",display:"flex",alignItems:"stretch",animation:`up ${.1+idx*.07}s ease both`}}>
                  <div style={{width:78,flexShrink:0,position:"relative"}}>
                    <SvgBg id={mu.id} color={mu.color} style={{position:"absolute",inset:0}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(5,6,15,0) 20%,rgba(5,6,15,.8) 100%)"}}/>
                  </div>
                  <div style={{padding:"14px 15px",flex:1}}>
                    <div style={{fontWeight:800,fontSize:17,color:C.t1,letterSpacing:.3,marginBottom:6}}>{s.exercise}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:5}}>
                      <Badge color={mu.color}>{mu.label.toUpperCase()}</Badge>
                      <span style={{fontSize:13,color:C.t3,fontWeight:600}}>{fmtDate(s.date)}</span>
                    </div>
                    <div style={{fontSize:14,color:C.t3,fontWeight:600}}>
                      <span style={{color:C.t2,fontWeight:700}}>{s.sets.length}</span> serie ·{" "}
                      <span style={{color:C.t2,fontWeight:700}}>{s.sets.reduce((a,x)=>a+x.reps,0)}</span> reps
                      {s.sets[0]?.kg&&<> · <span style={{color:C.t2,fontWeight:700}}>{Math.max(...s.sets.map(x=>x.kg||0))}kg</span> max</>}
                    </div>
                  </div>
                </GlassCard>
              );
            })}

            {sessions.length>4&&(
              <button className="ghost" onClick={()=>setView("history")} style={{
                width:"100%",padding:13,background:"rgba(0,229,255,.05)",border:`1.5px solid rgba(0,229,255,.2)`,
                borderRadius:12,color:C.t3,cursor:"pointer",fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:3,marginTop:6,fontWeight:700,
              }}>VEDI TUTTO STORICO →</button>
            )}

            <button className="btn-main" onClick={()=>{reset();setView("log");}} style={{
              width:"100%",marginTop:16,padding:18,
              background:"linear-gradient(135deg,rgba(0,229,255,.18),rgba(0,229,255,.06))",
              border:"1.5px solid rgba(0,229,255,.5)",borderRadius:16,color:C.t1,
              cursor:"pointer",fontFamily:"'Orbitron',monospace",fontSize:13,fontWeight:900,letterSpacing:3,
              animation:"glow 3s infinite",
            }}>＋ NUOVO ALLENAMENTO</button>
          </div>
        )}

        {/* ════════ LOG ════════ */}
        {view==="log"&&(
          <div style={{padding:"24px 20px 0",animation:"up .25s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
              <button onClick={()=>{if(step===1){setView("home");reset();}else setStep(s=>s-1);}} style={{
                background:"rgba(255,255,255,.08)",border:`1.5px solid ${C.borderBright}`,borderRadius:10,
                padding:"9px 15px",color:C.t2,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",fontSize:16,fontWeight:700,
              }}>←</button>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,letterSpacing:3,color:C.t4,marginBottom:7,fontWeight:700}}>PASSO {step} / 3</div>
                <div style={{display:"flex",gap:6}}>
                  {[1,2,3].map(i=>(
                    <div key={i} style={{flex:1,height:4,borderRadius:4,background:i<=step?"#00e5ff":"rgba(255,255,255,.12)",boxShadow:i<=step?"0 0 10px #00e5ffaa":"none",transition:"all .3s"}}/>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 1 */}
            {step===1&&(
              <>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:12,letterSpacing:3,color:C.t1,marginBottom:16,fontWeight:900}}>GRUPPO MUSCOLARE</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {MUSCLES.map(mu=>(
                    <div key={mu.id} className="mc" onClick={()=>{setMuscle(mu.id);setExercise("");setCustomEx("");setStep(2);}} style={{
                      borderRadius:16,overflow:"hidden",height:112,position:"relative",
                      border:`1.5px solid ${muscle===mu.id?mu.color:C.border}`,
                      boxShadow:muscle===mu.id?`0 0 24px ${mu.color}55`:"0 2px 12px rgba(0,0,0,.5)",
                    }}>
                      <SvgBg id={mu.id} color={mu.color} style={{position:"absolute",inset:0}}/>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(5,6,15,.92) 0%,rgba(5,6,15,.18) 100%)"}}/>
                      {muscle===mu.id&&<div style={{position:"absolute",inset:0,background:`${mu.color}20`}}/>}
                      <div style={{position:"absolute",bottom:10,left:12,fontFamily:"'Orbitron',monospace",fontSize:11,fontWeight:900,
                        color:"#ffffff",letterSpacing:1,textShadow:`0 1px 6px rgba(0,0,0,1), 0 0 14px ${mu.color}`}}>
                        {mu.label.toUpperCase()}</div>
                      <div style={{position:"absolute",top:8,right:8,width:9,height:9,borderRadius:"50%",background:mu.color,boxShadow:`0 0 9px ${mu.color}`,animation:"pulse 2s infinite"}}/>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step===2&&m&&(
              <>
                <div style={{borderRadius:18,overflow:"hidden",height:125,position:"relative",marginBottom:22,border:`1.5px solid ${m.color}60`}}>
                  <SvgBg id={m.id} color={m.color} style={{position:"absolute",inset:0}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(5,6,15,.9),rgba(5,6,15,.25))"}}/>
                  <div style={{position:"absolute",bottom:16,left:20}}>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,color:m.color,letterSpacing:3,marginBottom:5,fontWeight:800}}>GRUPPO SELEZIONATO</div>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:24,fontWeight:900,color:"#ffffff",textShadow:`0 2px 8px rgba(0,0,0,.9),0 0 20px ${m.color}`}}>
                      {m.label.toUpperCase()}</div>
                  </div>
                </div>

                <div style={{marginBottom:20}}>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:3,color:C.t3,marginBottom:9,fontWeight:800}}>📅 DATA ALLENAMENTO</div>
                  <input type="date" value={logDate} onChange={e=>setLogDate(e.target.value)} style={{...inp,color:C.cyan,background:"rgba(0,229,255,.08)",border:`1.5px solid rgba(0,229,255,.35)`}}/>
                </div>

                <div style={{fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:3,color:C.t3,marginBottom:11,fontWeight:800}}>ESERCIZIO</div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
                  {(EXERCISES[m.id]||[]).map(ex=>(
                    <div key={ex} className="ei" onClick={()=>{setExercise(ex);setCustomEx("");}} style={{
                      padding:"13px 16px",borderRadius:12,
                      border:`1.5px solid ${exercise===ex?m.color:C.border}`,
                      background:exercise===ex?`${m.color}16`:"rgba(255,255,255,.04)",
                      display:"flex",justifyContent:"space-between",alignItems:"center",
                    }}>
                      <span style={{fontWeight:700,fontSize:17,color:exercise===ex?C.t1:C.t2}}>{ex}</span>
                      {exercise===ex&&<span style={{color:m.color,fontSize:17,fontWeight:900}}>◈</span>}
                    </div>
                  ))}
                </div>

                <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,letterSpacing:3,color:C.t4,marginBottom:9,fontWeight:700}}>ESERCIZIO PERSONALIZZATO</div>
                <input value={customEx} onChange={e=>{setCustomEx(e.target.value);setExercise("");}} placeholder="Scrivi nome esercizio…" style={inp}/>

                <button onClick={()=>{if(exercise||customEx.trim())setStep(3);}} style={{
                  width:"100%",marginTop:17,padding:15,
                  background:(exercise||customEx.trim())?`linear-gradient(135deg,${m.color}28,${m.color}0c)`:"rgba(255,255,255,.04)",
                  border:`1.5px solid ${(exercise||customEx.trim())?`${m.color}65`:C.border}`,
                  borderRadius:14,cursor:"pointer",fontFamily:"'Orbitron',monospace",fontSize:12,letterSpacing:3,fontWeight:900,
                  color:(exercise||customEx.trim())?C.t1:C.t4,transition:"all .2s",
                }}>AVANTI →</button>
              </>
            )}

            {/* STEP 3 */}
            {step===3&&m&&(
              <>
                <div style={{borderRadius:14,padding:"14px 16px",marginBottom:22,background:`${m.color}12`,border:`1.5px solid ${m.color}40`,display:"flex",gap:13,alignItems:"center"}}>
                  <div style={{width:48,height:48,borderRadius:11,overflow:"hidden",border:`1.5px solid ${m.color}60`,flexShrink:0}}>
                    <SvgBg id={m.id} color={m.color} style={{width:"100%",height:"100%"}}/>
                  </div>
                  <div>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,color:m.color,letterSpacing:2,fontWeight:800,marginBottom:3}}>{m.label.toUpperCase()}</div>
                    <div style={{fontWeight:800,fontSize:18,color:C.t1}}>{customEx||exercise}</div>
                    <div style={{fontSize:14,color:C.t3,fontWeight:700,marginTop:2}}>{fmtDate(logDate)}</div>
                  </div>
                </div>

                <div style={{fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:3,color:C.t3,marginBottom:14,fontWeight:800}}>SERIE</div>

                {sets.map((s,i)=>(
                  <div key={i} className="sr" style={{display:"flex",gap:10,marginBottom:11,alignItems:"center",animationDelay:`${i*.05}s`}}>
                    <div style={{width:36,height:36,borderRadius:9,flexShrink:0,background:`${m.color}18`,border:`1.5px solid ${m.color}45`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Orbitron',monospace",fontSize:13,color:m.color,fontWeight:900}}>{i+1}</div>
                    <input type="number" placeholder="Reps" value={s.reps} onChange={e=>{const n=[...sets];n[i].reps=e.target.value;setSets(n);}} style={inp}/>
                    <input type="number" placeholder="Kg" value={s.kg} onChange={e=>{const n=[...sets];n[i].kg=e.target.value;setSets(n);}} style={inp}/>
                    {sets.length>1&&(
                      <button onClick={()=>setSets(sets.filter((_,j)=>j!==i))} className="db" style={{
                        background:"rgba(255,122,144,.1)",border:"1.5px solid rgba(255,122,144,.35)",borderRadius:9,
                        color:"rgba(255,122,144,.7)",cursor:"pointer",fontSize:21,padding:"5px 10px",
                      }}>×</button>
                    )}
                  </div>
                ))}

                <button className="ghost" onClick={()=>setSets([...sets,{reps:"",kg:""}])} style={{
                  width:"100%",padding:13,background:"rgba(255,255,255,.05)",border:`1.5px dashed ${C.border}`,
                  borderRadius:12,color:C.t3,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",fontSize:13,letterSpacing:1,marginBottom:16,fontWeight:700,
                }}>＋ AGGIUNGI SERIE</button>

                <button className="btn-main" onClick={save} style={{
                  width:"100%",padding:18,background:`linear-gradient(135deg,${m.color}25,${m.color}0a)`,
                  border:`1.5px solid ${m.color}60`,borderRadius:16,cursor:"pointer",
                  fontFamily:"'Orbitron',monospace",fontSize:13,fontWeight:900,letterSpacing:3,color:C.t1,
                  boxShadow:`0 0 30px ${m.color}28`,animation:"glow 3s infinite",
                }}>⊕ SALVA SU GOOGLE SHEETS</button>
              </>
            )}
          </div>
        )}

        {/* ════════ HISTORY ════════ */}
        {view==="history"&&(
          <div style={{padding:"24px 20px 0",animation:"up .25s ease"}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,letterSpacing:4,color:C.t4,marginBottom:16,fontWeight:700}}>◈ STORICO COMPLETO</div>
            {dates.length===0?(
              <GlassCard style={{padding:44,textAlign:"center"}}>
                <div style={{color:C.t3,fontSize:16,fontFamily:"'Share Tech Mono',monospace",letterSpacing:2,fontWeight:700}}>// NESSUN DATO</div>
              </GlassCard>
            ):dates.map(date=>(
              <div key={date}>
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:2,color:C.t3,
                  padding:"14px 4px 9px",borderBottom:`1.5px solid rgba(0,229,255,.12)`,marginBottom:10,fontWeight:700}}>
                  {fmtDate(date).toUpperCase()}</div>
                {grouped[date].map(s=>{
                  const mu=muscleById(s.muscle);
                  const isExp=expanded===s.id;
                  return(
                    <GlassCard key={s.id} glow={mu.color} style={{marginBottom:9,overflow:"hidden"}}>
                      <div style={{display:"flex",alignItems:"stretch"}}>
                        <div onClick={()=>setExpanded(isExp?null:s.id)} style={{width:66,flexShrink:0,cursor:"pointer",position:"relative"}}>
                          <SvgBg id={mu.id} color={mu.color} style={{position:"absolute",inset:0}}/>
                          <div style={{position:"absolute",inset:0,background:`${mu.color}22`}}/>
                        </div>
                        <div onClick={()=>setExpanded(isExp?null:s.id)} style={{padding:"13px 14px",flex:1,cursor:"pointer"}}>
                          <div style={{fontWeight:800,fontSize:17,color:C.t1,marginBottom:6}}>{s.exercise}</div>
                          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
                            <Badge color={mu.color}>{mu.label.toUpperCase()}</Badge>
                          </div>
                          <div style={{fontSize:13,color:C.t3,fontWeight:600}}>
                            <span style={{color:C.t2,fontWeight:700}}>{s.sets.length}</span> serie ·{" "}
                            <span style={{color:C.t2,fontWeight:700}}>{s.sets.reduce((a,x)=>a+x.reps,0)}</span> reps
                            {s.sets[0]?.kg&&<> · <span style={{color:C.t2,fontWeight:700}}>{Math.max(...s.sets.map(x=>x.kg||0))}kg</span></>}
                            <span style={{color:C.t4,marginLeft:8,fontSize:12}}>{fmtDate(s.date)}</span>
                          </div>
                        </div>
                        <button onClick={()=>setDelConfirm(s.id)} className="db" style={{background:"none",border:"none",color:"rgba(255,122,144,.35)",cursor:"pointer",fontSize:17,padding:"0 15px"}}>🗑</button>
                      </div>
                      {isExp&&(
                        <div style={{borderTop:`1.5px solid rgba(255,255,255,.09)`,padding:"13px 16px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(74px,1fr))",gap:9}}>
                          {s.sets.map((set,i)=>(
                            <div key={i} style={{background:`${mu.color}14`,border:`1.5px solid ${mu.color}35`,borderRadius:11,padding:"10px 8px",textAlign:"center"}}>
                              <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,color:mu.color,letterSpacing:1,marginBottom:4,fontWeight:800}}>S{i+1}</div>
                              <div style={{fontWeight:900,fontSize:20,color:C.t1}}>{set.reps}</div>
                              <div style={{fontSize:13,color:C.t3,fontWeight:700,marginTop:2}}>{set.kg?`${set.kg} kg`:"BW"}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* ════════ COMPARE ════════ */}
        {view==="compare"&&(
          <div style={{padding:"24px 20px 0",animation:"up .25s ease"}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,letterSpacing:4,color:C.t4,marginBottom:16,fontWeight:700}}>◈ ANALISI COMPARATIVA</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,marginBottom:24,alignItems:"center"}}>
              {[0,1].map(i=>{
                const s=i===0?u0:u1;
                const vol=s.reduce((a,x)=>a+x.sets.reduce((b,y)=>b+y.reps*(y.kg||1),0),0);
                const c=i===0?"#00e5ff":"#ff8c55";
                return(
                  <GlassCard key={i} glow={c} style={{padding:"17px 15px",textAlign:i===0?"left":"right"}}>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,color:c,letterSpacing:2,marginBottom:8,fontWeight:800}}>{USERS[i].toUpperCase()}</div>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:34,fontWeight:900,color:C.t1,lineHeight:1}}>{s.length}</div>
                    <div style={{fontSize:14,color:C.t3,marginBottom:8,fontWeight:700,marginTop:3}}>sessioni</div>
                    <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:15,color:c,fontWeight:700}}>{vol>999?`${(vol/1000).toFixed(1)}K`:vol}</div>
                    <div style={{fontSize:13,color:C.t3,fontWeight:600}}>vol. totale</div>
                  </GlassCard>
                );
              })}
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:14,fontWeight:900,color:C.t4,textAlign:"center"}}>VS</div>
            </div>

            <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,letterSpacing:3,color:C.t4,marginBottom:14,fontWeight:700}}>SESSIONI PER MUSCOLO</div>
            {MUSCLES.map(mu=>{
              const c0=u0.filter(s=>s.muscle===mu.id).length;
              const c1=u1.filter(s=>s.muscle===mu.id).length;
              if(c0===0&&c1===0)return null;
              const max=Math.max(c0,c1,1);
              return(
                <div key={mu.id} style={{marginBottom:17}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:32,height:32,borderRadius:8,overflow:"hidden",border:`1.5px solid ${mu.color}50`,flexShrink:0}}>
                        <SvgBg id={mu.id} color={mu.color} style={{width:"100%",height:"100%"}}/>
                      </div>
                      <span style={{fontWeight:800,fontSize:16,color:C.t1}}>{mu.label}</span>
                    </div>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:13,color:C.t2,fontWeight:700}}>{c0} — {c1}</span>
                  </div>
                  {[{c:c0,col:"#00e5ff"},{c:c1,col:"#ff8c55"}].map(({c,col},i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:col,flexShrink:0}}/>
                      <div style={{flex:1,height:7,background:"rgba(255,255,255,.1)",borderRadius:4,overflow:"hidden"}}>
                        <div style={{width:`${(c/max)*100}%`,height:"100%",background:`linear-gradient(to right,${col},${col}99)`,borderRadius:4,transition:"width .6s ease",boxShadow:`0 0 7px ${col}`}}/>
                      </div>
                      <span style={{fontSize:13,color:C.t2,fontWeight:700,minWidth:16,textAlign:"right"}}>{c}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ── NAV ── */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,
          background:"rgba(5,6,15,.99)",backdropFilter:"blur(30px)",borderTop:"1.5px solid rgba(0,229,255,.15)",
          display:"flex",padding:"10px 0 8px",zIndex:30}}>
          {NAV.map(n=>(
            <button key={n.id} className="nb" onClick={()=>{if(n.id==="log")reset();setView(n.id);}} style={{
              flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,
              background:"none",border:"none",cursor:"pointer",padding:"4px 0",
              color:view===n.id?C.cyan:C.t4,
            }}>
              <span style={{fontSize:19,lineHeight:1}}>{n.icon}</span>
              <span style={{fontFamily:"'Orbitron',monospace",fontSize:8,letterSpacing:2,fontWeight:800,color:view===n.id?C.cyan:C.t4}}>{n.lbl}</span>
              {view===n.id&&<div style={{width:22,height:2.5,borderRadius:2,background:C.cyan,boxShadow:`0 0 10px ${C.cyan}`,marginTop:2}}/>}
            </button>
          ))}
        </div>

        {/* ── DELETE CONFIRM ── */}
        {delConfirm&&(
          <div onClick={()=>setDelConfirm(null)} style={{position:"fixed",inset:0,background:"rgba(5,6,15,.93)",backdropFilter:"blur(14px)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:28}}>
            <GlassCard onClick={e=>e.stopPropagation()} style={{padding:28,width:"100%",maxWidth:320}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:12,color:"#ff7a90",letterSpacing:2,marginBottom:10,fontWeight:900}}>⚠ CONFERMA ELIMINAZIONE</div>
              <div style={{color:C.t2,fontSize:15,marginBottom:24,fontWeight:600,lineHeight:1.6}}>
                La sessione verrà eliminata da Google Sheets e dal dispositivo. Questa azione non è reversibile.
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setDelConfirm(null)} style={{flex:1,padding:13,background:"rgba(255,255,255,.07)",border:`1.5px solid ${C.borderBright}`,borderRadius:12,color:C.t2,cursor:"pointer",fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:2,fontWeight:700}}>ANNULLA</button>
                <button onClick={()=>del(delConfirm)} style={{flex:1,padding:13,background:"rgba(255,122,144,.14)",border:"1.5px solid rgba(255,122,144,.5)",borderRadius:12,color:"#ff7a90",cursor:"pointer",fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:2,fontWeight:700}}>ELIMINA</button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── TOAST ── */}
        {toast&&(
          <div style={{position:"fixed",bottom:100,left:"50%",background:"rgba(5,6,15,.99)",border:`1.5px solid ${toast.color}60`,
            color:toast.color,padding:"12px 26px",borderRadius:30,fontFamily:"'Orbitron',monospace",fontSize:11,letterSpacing:2,fontWeight:800,
            zIndex:99,boxShadow:`0 0 24px ${toast.color}33`,animation:"tin .22s ease",backdropFilter:"blur(20px)",
          }}>{toast.msg}</div>
        )}
      </div>
    </>
  );
}
