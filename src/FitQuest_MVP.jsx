import { useState, useEffect } from "react";

const D = {
  bg: "#0D0A20", bgDark: "#080618", bgCard: "rgba(255,255,255,.05)",
  bgCardGold: "rgba(245,166,35,.06)", bgCardRed: "rgba(239,68,68,.06)",
  bgCardGreen: "rgba(34,197,94,.06)", bgCardPurple: "rgba(124,58,237,.08)",
  gold: "#F5A623", purple: "#7C3AED", purpleL: "#A855F7",
  green: "#22C55E", red: "#EF4444", cyan: "#06B6D4",
  text: "#EDE8FF", textSec: "#9B85CC", textMuted: "#6B5A8A",
  border: "rgba(255,255,255,.07)", borderGold: "rgba(245,166,35,.25)",
  borderPurple: "rgba(124,58,237,.25)", borderRed: "rgba(239,68,68,.2)",
  borderGreen: "rgba(34,197,94,.2)",
};

const ITEMS = [
  { n: "Iron Sword", i: "⚔️", r: "Common", c: "#6B7280" },
  { n: "Chain Mail", i: "🛡️", r: "Uncommon", c: "#22C55E" },
  { n: "Speed Boots", i: "👟", r: "Rare", c: "#3B82F6" },
  { n: "Dragon Blade", i: "🗡️", r: "Epic", c: "#A855F7" },
  { n: "Excalibur", i: "✨", r: "Legendary", c: "#F5A623" },
  { n: "Health Potion", i: "🧪", r: "Common", c: "#6B7280" },
  { n: "Magic Robe", i: "🔮", r: "Rare", c: "#3B82F6" },
  { n: "Lucky Ring", i: "💍", r: "Uncommon", c: "#22C55E" },
];

const SCREENS = [
  "splash","onboarding","home","workout","boss",
  "lootbox","pet","guild","shop","levelup","spin","map",
];

// ── tiny helpers ──────────────────────────────────────────────────────────────
const Row = ({ children, style = {} }) => (
  <div style={{ display: "flex", alignItems: "center", ...style }}>{children}</div>
);
const Col = ({ children, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", ...style }}>{children}</div>
);

const Pill = ({ children, color, bg }) => (
  <span style={{
    background: bg || color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 99, padding: "2px 9px", fontSize: 10, fontWeight: 700,
  }}>{children}</span>
);

const Card = ({ children, style = {}, gold, red, green, purple }) => {
  const bg = gold ? D.bgCardGold : red ? D.bgCardRed : green ? D.bgCardGreen : purple ? D.bgCardPurple : D.bgCard;
  const border = gold ? D.borderGold : red ? D.borderRed : green ? D.borderGreen : purple ? D.borderPurple : D.border;
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: 14, ...style }}>
      {children}
    </div>
  );
};

const GoldBtn = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    background: "linear-gradient(135deg,#F5A623,#E8900A)", border: "none",
    borderRadius: 12, color: "#fff", fontWeight: 800, cursor: "pointer",
    fontFamily: "inherit", letterSpacing: ".3px", ...style,
  }}>{children}</button>
);

const PurpleBtn = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    background: "linear-gradient(135deg,#7C3AED,#5B21B6)", border: "none",
    borderRadius: 12, color: "#fff", fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", ...style,
  }}>{children}</button>
);

const XpBar = ({ pct }) => (
  <div style={{ height: 6, background: "rgba(255,255,255,.1)", borderRadius: 99, overflow: "hidden" }}>
    <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#7C3AED,#A855F7)", borderRadius: 99 }} />
  </div>
);

const Avatar = ({ initials, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: "linear-gradient(135deg,#7C3AED,#A855F7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: size * 0.32, color: "#fff",
    border: "2px solid rgba(245,166,35,.4)", flexShrink: 0,
  }}>{initials}</div>
);

const StepRing = ({ steps, goal, size }) => {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(steps / goal, 1) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(124,58,237,.2)" strokeWidth={12} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F5A623" strokeWidth={12}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <Col style={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.17, fontWeight: 900, color: D.gold }}>{steps.toLocaleString()}</span>
        <span style={{ fontSize: size * 0.09, color: D.textSec }}>/ {goal.toLocaleString()}</span>
        <span style={{ fontSize: size * 0.09, color: D.green, fontWeight: 700 }}>5.6 km</span>
      </Col>
    </div>
  );
};

const BottomNav = ({ cur, go }) => {
  const items = [
    { id: "home", icon: "⌂", label: "Home" },
    { id: "workout", icon: "⚡", label: "Train" },
    { id: "map", icon: "◉", label: "Map" },
    { id: "guild", icon: "★", label: "Guild" },
    { id: "shop", icon: "◈", label: "Me" },
  ];
  return (
    <Row style={{ borderTop: `1px solid ${D.border}`, background: "#0A0818", flexShrink: 0 }}>
      {items.map(item => (
        <button key={item.id} onClick={() => go(item.id)} style={{
          flex: 1, padding: "8px 0 6px", background: "none", border: "none",
          cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <span style={{ fontSize: 20, color: cur === item.id ? D.gold : D.textMuted }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: cur === item.id ? D.gold : D.textMuted }}>{item.label}</span>
          {cur === item.id && <div style={{ width: 16, height: 2, background: D.gold, borderRadius: 99 }} />}
        </button>
      ))}
    </Row>
  );
};

// ── SCREENS ───────────────────────────────────────────────────────────────────

function SplashScreen({ go }) {
  useEffect(() => { const t = setTimeout(() => go("onboarding"), 2200); return () => clearTimeout(t); }, []);
  return (
    <Col style={{ flex: 1, background: "linear-gradient(180deg,#0D0A20,#1A0D3A)", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
      <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(124,58,237,.2)", border: "2px solid rgba(245,166,35,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, animation: "float 3s ease-in-out infinite" }}>⚔️</div>
      <Col style={{ alignItems: "center", gap: 6 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: D.gold, letterSpacing: 3 }}>PIXONIC</div>
        <div style={{ fontSize: 13, color: D.textSec, fontStyle: "italic" }}>Level Up Your Real Life.</div>
        <div style={{ fontSize: 11, color: D.textMuted }}>Pixonic turns fitness into an epic RPG adventure</div>
      </Col>
      <Row style={{ gap: 6, marginTop: 16 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? D.purple : "#2D1C4A" }} />
        ))}
      </Row>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </Col>
  );
}

function OnboardingScreen({ go }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { icon: "🏃", title: "Walk & Earn XP", sub: "Every step earns XP, gold coins and rare loot. Your daily commute becomes an epic quest.", color: D.cyan },
    { icon: "📷", title: "AI Counts Your Reps", sub: "Camera detects push-ups, squats and more in real time. Your avatar mirrors every move.", color: D.purple },
    { icon: "⚔️", title: "Level Up Your Hero", sub: "Defeat bosses. Unlock maps. Grow your virtual pet companion.", color: D.gold },
    { icon: "🏆", title: "Compete & Conquer", sub: "Guilds, leaderboards and friend challenges. Fitness is better together.", color: D.green },
  ];
  const s = slides[slide];
  return (
    <Col style={{ flex: 1, background: D.bg }}>
      <Col style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 24 }}>
        <div style={{ width: 110, height: 110, borderRadius: 28, background: s.color + "18", border: `1.5px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, animation: "float 3s ease-in-out infinite" }}>{s.icon}</div>
        <Col style={{ alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: s.color, textAlign: "center" }}>{s.title}</div>
          <div style={{ fontSize: 14, color: D.textSec, lineHeight: 1.7, textAlign: "center" }}>{s.sub}</div>
        </Col>
      </Col>
      <Col style={{ padding: "0 24px 32px", gap: 16 }}>
        <Row style={{ justifyContent: "center", gap: 6 }}>
          {slides.map((_, i) => (
            <div key={i} style={{ width: i === slide ? 20 : 6, height: 6, borderRadius: 99, background: i === slide ? s.color : "#2D1C4A", transition: "all .3s" }} />
          ))}
        </Row>
        {slide < 3
          ? <GoldBtn onClick={() => setSlide(v => v + 1)} style={{ width: "100%", padding: 14, fontSize: 15, borderRadius: 14 }}>Next →</GoldBtn>
          : <GoldBtn onClick={() => go("home")} style={{ width: "100%", padding: 14, fontSize: 15, borderRadius: 14 }}>Enter the Quest ⚔️</GoldBtn>
        }
        {slide < 3 && (
          <button onClick={() => go("home")} style={{ background: "none", border: "none", color: D.textMuted, fontSize: 13, cursor: "pointer", alignSelf: "center" }}>Skip</button>
        )}
      </Col>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
    </Col>
  );
}

function HomeScreen({ go }) {
  const [petHappy, setPetHappy] = useState(72);
  const quests = [
    { i: "🚶", t: "Walk 5,000 steps", p: 64, xp: 150, done: false },
    { i: "💪", t: "Complete a workout", p: 100, xp: 200, done: true },
    { i: "⚔️", t: "Deal 100 boss damage", p: 29, xp: 250, done: false },
  ];
  return (
    <Col style={{ flex: 1, background: D.bg, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Header */}
        <Col style={{ background: "linear-gradient(180deg,#1A0D3A,#0D0A20)", padding: "14px 16px 10px" }}>
          <Row style={{ justifyContent: "space-between", marginBottom: 12 }}>
            <Row style={{ gap: 10 }}>
              <Avatar initials="AJ" size={40} />
              <Col>
                <div style={{ fontSize: 11, color: D.textMuted }}>Good morning,</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: D.gold }}>Hero Arjun 👋</div>
              </Col>
            </Row>
            <Row style={{ gap: 10 }}>
              <Row style={{ gap: 4 }}><span style={{ color: D.gold }}>◈</span><span style={{ fontSize: 13, fontWeight: 700, color: D.gold }}>1,240</span></Row>
              <Row style={{ gap: 4 }}><span style={{ color: D.purpleL }}>◆</span><span style={{ fontSize: 13, fontWeight: 700, color: D.purpleL }}>340</span></Row>
            </Row>
          </Row>
          <Row style={{ gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            <Pill color={D.red}>🔥 12 Day Streak</Pill>
            <Pill color={D.purpleL}>⚔️ Level 18</Pill>
            <Pill color={D.gold}>Champion</Pill>
          </Row>
          <XpBar pct={62} />
          <Row style={{ justifyContent: "space-between", marginTop: 3 }}>
            <span style={{ fontSize: 10, color: D.textMuted }}>Level 18</span>
            <span style={{ fontSize: 10, color: D.textMuted }}>62% → Level 19</span>
          </Row>
        </Col>

        <Col style={{ padding: "10px 16px 16px" }}>
          {/* Step Ring */}
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 14px", cursor: "pointer" }}>
            <StepRing steps={7430} goal={10000} size={150} />
          </div>

          {/* Boss Bar */}
          <Card red style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => go("boss")}>
            <Row style={{ justifyContent: "space-between", marginBottom: 8 }}>
              <Row style={{ gap: 6 }}><span style={{ fontSize: 18 }}>☠️</span><span style={{ fontSize: 13, fontWeight: 800, color: D.red }}>Shadow Goblin</span></Row>
              <span style={{ fontSize: 11, color: D.textMuted }}>47h left →</span>
            </Row>
            <div style={{ height: 8, background: "rgba(239,68,68,.15)", borderRadius: 99 }}>
              <div style={{ width: "78%", height: "100%", background: D.red, borderRadius: 99 }} />
            </div>
            <Row style={{ justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 10, color: D.textMuted }}>HP: 2,340 / 3,000</span>
              <span style={{ fontSize: 10, color: D.red, fontWeight: 700 }}>TAP TO BATTLE ⚔️</span>
            </Row>
          </Card>

          {/* Pet + Spin */}
          <Row style={{ gap: 10, marginBottom: 12 }}>
            <Card gold style={{ flex: 1, textAlign: "center", padding: 12, cursor: "pointer" }} onClick={() => go("pet")}>
              <div style={{ fontSize: 32, animation: "float 3s ease-in-out infinite" }}>🐣</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: D.gold, marginTop: 4 }}>Buddy</div>
              <div style={{ height: 4, background: "rgba(255,255,255,.1)", borderRadius: 99, marginTop: 6 }}>
                <div style={{ width: `${petHappy}%`, height: "100%", background: petHappy > 60 ? D.green : D.gold, borderRadius: 99 }} />
              </div>
            </Card>
            <div onClick={() => go("spin")} style={{ flex: 1, background: "rgba(245,166,35,.08)", border: `1.5px solid rgba(245,166,35,.35)`, borderRadius: 14, padding: 12, textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 30 }}>🎡</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: D.gold, marginTop: 4 }}>FREE SPIN!</div>
              <div style={{ fontSize: 9, color: D.textSec }}>Daily reward</div>
            </div>
          </Row>

          {/* Quests */}
          <Row style={{ justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: D.text, textTransform: "uppercase", letterSpacing: .5 }}>⚔️ Daily Quests</div>
            <span onClick={() => alert("All quests screen")} style={{ fontSize: 12, color: D.purpleL, cursor: "pointer", fontWeight: 700 }}>View all →</span>
          </Row>
          {quests.map((q, i) => (
            <Card key={i} style={{ marginBottom: 8 }}>
              <Row style={{ gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{q.i}</div>
                <div style={{ flex: 1 }}>
                  <Row style={{ justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: q.done ? D.green : D.text }}>{q.t}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: D.gold }}>+{q.xp} XP</span>
                  </Row>
                </div>
                {q.done && <span style={{ color: D.green }}>✓</span>}
              </Row>
              <div style={{ height: 4, background: "rgba(255,255,255,.08)", borderRadius: 99 }}>
                <div style={{ width: `${q.p}%`, height: "100%", background: q.done ? D.green : D.purple, borderRadius: 99 }} />
              </div>
            </Card>
          ))}
        </Col>
      </div>
      <BottomNav cur="home" go={go} />
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
    </Col>
  );
}

function WorkoutScreen({ go }) {
  const [reps, setReps] = useState(10);
  return (
    <Col style={{ flex: 1, background: "#080C18" }}>
      <Col style={{ background: "#0A0818", padding: "10px 16px", borderBottom: `1px solid ${D.border}` }}>
        <div style={{ textAlign: "center", fontSize: 12, fontWeight: 900, color: D.gold, letterSpacing: 2 }}>PIXONIC WORKOUT</div>
        <Row style={{ justifyContent: "center", gap: 20, marginTop: 8 }}>
          {[["🔥", "Streak 8"], ["⭐", "XP +120"], ["◈", "Coins +50"]].map(([ic, t]) => (
            <Row key={t} style={{ gap: 4 }}><span style={{ fontSize: 13 }}>{ic}</span><span style={{ fontSize: 11, fontWeight: 700, color: D.text }}>{t}</span></Row>
          ))}
        </Row>
      </Col>
      <div style={{ background: "rgba(124,58,237,.08)", padding: "8px 16px", borderBottom: "1px solid rgba(124,58,237,.2)" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: D.purpleL, textTransform: "uppercase", letterSpacing: 1 }}>PUSH-UPS</div>
        <div style={{ fontSize: 11, color: D.textSec }}>Goal: 20 Reps · AI Tracking Active</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1, borderBottom: `1px solid ${D.border}` }}>
        {[["YOU", "🏋️", "#22C55E", "BODY DETECTED ✓"], ["YOUR AVATAR", "⚔️", "#A855F7", "AVATAR SYNCING"]].map(([label, ic, c, status]) => (
          <Col key={label} style={{ background: label === "YOU" ? "rgba(26,32,48,.8)" : "rgba(18,12,32,.8)", alignItems: "center", justifyContent: "flex-end", padding: 12, borderRight: label === "YOU" ? `1px solid ${D.border}` : "none" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
              <div style={{ width: "100%", height: 120, background: "rgba(10,14,24,.8)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.06)" }}>
                <Col style={{ alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 30 }}>{ic}</div>
                  <div style={{ fontSize: 9, color: c, fontWeight: 700 }}>{status}</div>
                </Col>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: D.text, marginBottom: 6 }}>{label}</div>
            <div style={{ background: "rgba(124,58,237,.3)", borderRadius: 8, padding: "5px 0", color: "#C4B5FD", fontSize: 11, fontWeight: 800, width: "100%", textAlign: "center", border: "1px solid rgba(124,58,237,.4)" }}>{reps} / 20 REPS</div>
          </Col>
        ))}
      </div>
      <Col style={{ padding: "10px 14px", background: "#0A0818", gap: 8 }}>
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Row style={{ gap: 8 }}>
            <span style={{ fontSize: 20 }}>📦</span>
            <Col>
              <div style={{ fontSize: 11, fontWeight: 700, color: D.gold }}>+{reps * 6} XP · ×{reps * 3} coins</div>
              <div style={{ fontSize: 10, color: reps >= 20 ? D.gold : D.green }}>{reps >= 20 ? "SET COMPLETE! 🎉" : "SYNC PERFECT!"}</div>
            </Col>
          </Row>
          <Col style={{ alignItems: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: D.gold, fontFamily: "monospace" }}>00:45</div>
            <div style={{ fontSize: 9, color: D.textMuted }}>Set 2/3</div>
          </Col>
        </Row>
        <Row style={{ gap: 8 }}>
          <PurpleBtn onClick={() => setReps(r => Math.min(20, r + 1))} style={{ flex: 2, padding: 11, fontSize: 12 }}>+ COUNT REP ({reps}/20)</PurpleBtn>
          <button style={{ flex: 1, padding: 11, fontSize: 12, background: "rgba(34,197,94,.2)", border: "1px solid #22C55E", borderRadius: 12, color: D.green, fontWeight: 700, cursor: "pointer" }}>⏸</button>
          <button onClick={() => go("home")} style={{ flex: 1, padding: 11, fontSize: 12, background: "rgba(239,68,68,.2)", border: "1px solid #EF4444", borderRadius: 12, color: D.red, fontWeight: 700, cursor: "pointer" }}>⏹</button>
        </Row>
      </Col>
    </Col>
  );
}

function BossScreen({ go }) {
  return (
    <Col style={{ flex: 1, background: "#080210", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(180deg,#1A0208,#080210)", padding: "20px 16px", textAlign: "center", borderBottom: "1px solid rgba(239,68,68,.15)", position: "relative" }}>
        <button onClick={() => go("home")} style={{ position: "absolute", left: 16, top: 16, background: "none", border: "none", color: D.gold, fontSize: 20, cursor: "pointer", fontWeight: 700 }}>‹</button>
        <div style={{ fontSize: 64, marginBottom: 6 }}>☠️</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: D.red, textTransform: "uppercase", letterSpacing: 2 }}>Shadow Goblin</div>
        <div style={{ fontSize: 11, color: "#FCA5A5", marginBottom: 14 }}>Zone 1 Boss · 47h 23m remaining</div>
        <div style={{ height: 12, background: "rgba(239,68,68,.15)", borderRadius: 99, overflow: "hidden", border: "1px solid rgba(239,68,68,.25)" }}>
          <div style={{ width: "78%", height: "100%", background: "linear-gradient(90deg,#EF4444,#F87171)", borderRadius: 99 }} />
        </div>
        <Row style={{ justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontSize: 11, color: "#FCA5A5" }}>HP: 2,340 / 3,000</span>
          <span style={{ fontSize: 11, color: "#FCA5A5" }}>78% remaining</span>
        </Row>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        <Card red style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: D.red, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>⚔️ Your Damage Today</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: D.text }}>290</div>
          <div style={{ fontSize: 11, color: D.textSec, marginBottom: 12 }}>damage dealt</div>
          <Col style={{ borderTop: "1px solid rgba(239,68,68,.15)", paddingTop: 10, gap: 6 }}>
            {[["👟 Steps ÷ 100", "80 dmg"], ["💪 Reps × 2", "60 dmg"], ["🏃 km × 50", "150 dmg"]].map(([f, v]) => (
              <Row key={f} style={{ justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: D.textSec }}>{f}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: D.text }}>{v}</span>
              </Row>
            ))}
            <Row style={{ justifyContent: "space-between", borderTop: "1px dashed rgba(239,68,68,.2)", paddingTop: 8, marginTop: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: D.text }}>Total</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: D.red }}>290 dmg</span>
            </Row>
          </Col>
        </Card>
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: D.gold, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>👥 Guild Damage</div>
          {[["AJ (You)", 290, "🥇"], ["Rahul", 210, "🥈"], ["Priya", 185, "🥉"], ["Dev", 120, ""], ["Anjali", 90, ""]].map(([n, d, m]) => (
            <Row key={n} style={{ justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${D.border}` }}>
              <Row style={{ gap: 8 }}>
                <Avatar initials={n.slice(0, 2)} size={26} />
                <span style={{ fontSize: 12, color: D.text }}>{m} {n}</span>
              </Row>
              <span style={{ fontSize: 13, fontWeight: 800, color: D.red }}>{d} dmg</span>
            </Row>
          ))}
        </Card>
        <GoldBtn onClick={() => go("workout")} style={{ width: "100%", padding: 13, fontSize: 14 }}>⚡ Exercise to Deal Damage</GoldBtn>
      </div>
    </Col>
  );
}

function LootBoxScreen({ go }) {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    setTimeout(() => setItem(ITEMS[Math.floor(Math.random() * ITEMS.length)]), 1800);
  };
  const reset = () => { setOpen(false); setItem(null); };
  const rarColors = { Common: "#6B7280", Uncommon: "#22C55E", Rare: "#3B82F6", Epic: "#A855F7", Legendary: "#F5A623" };
  return (
    <Col style={{ flex: 1, background: "linear-gradient(180deg,#0A0520,#080214)", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <button onClick={() => go("home")} style={{ position: "absolute", left: 16, top: 16, background: "none", border: "none", color: D.gold, fontSize: 20, cursor: "pointer", fontWeight: 700 }}>‹</button>
      <div style={{ fontSize: 15, fontWeight: 800, color: D.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>RARE CHEST</div>
      {!open && (
        <>
          <div onClick={handleOpen} style={{ fontSize: 90, cursor: "pointer", marginBottom: 16, userSelect: "none", animation: "float 3s ease-in-out infinite" }}>📦</div>
          <div style={{ fontSize: 13, color: D.textMuted }}>Tap chest to open</div>
        </>
      )}
      {open && !item && (
        <>
          <div style={{ fontSize: 80, marginBottom: 16, animation: "pulse 0.5s infinite" }}>💥</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: D.gold }}>Opening...</div>
        </>
      )}
      {item && (
        <Col style={{ width: "100%", gap: 14 }}>
          <Card gold style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{item.i}</div>
            <Pill color={rarColors[item.r]}>{item.r}</Pill>
            <div style={{ fontSize: 18, fontWeight: 900, color: D.text, marginTop: 10 }}>{item.n}</div>
            <div style={{ fontSize: 11, color: D.textMuted, marginTop: 6 }}>Added to inventory ✓</div>
          </Card>
          <GoldBtn onClick={reset} style={{ width: "100%", padding: 13, fontSize: 14 }}>★ Collect!</GoldBtn>
        </Col>
      )}
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </Col>
  );
}

function PetScreen({ go }) {
  const [happy, setHappy] = useState(72);
  return (
    <Col style={{ flex: 1, background: "linear-gradient(180deg,#0A1C0A,#080E08)", overflow: "hidden" }}>
      <Col style={{ background: "rgba(34,197,94,.06)", padding: "20px 16px", textAlign: "center", borderBottom: "1px solid rgba(34,197,94,.1)", position: "relative" }}>
        <button onClick={() => go("home")} style={{ position: "absolute", left: 16, top: 16, background: "none", border: "none", color: D.gold, fontSize: 20, cursor: "pointer", fontWeight: 700 }}>‹</button>
        <div style={{ fontSize: 72, marginBottom: 8, animation: "float 3s ease-in-out infinite" }}>🐣</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: D.gold }}>Buddy</div>
        <Pill color={D.green} style={{ marginTop: 6, display: "inline-block" }}>Stage 2 — Baby 🐥</Pill>
      </Col>
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        <Card style={{ marginBottom: 12 }}>
          <Row style={{ justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: D.gold, textTransform: "uppercase" }}>Happiness</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: D.text }}>{happy}%</span>
          </Row>
          <div style={{ height: 12, background: "rgba(255,255,255,.08)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: `${happy}%`, height: "100%", background: happy > 60 ? "linear-gradient(90deg,#22C55E,#4ADE80)" : D.gold, borderRadius: 99, transition: "width .5s" }} />
          </div>
          <div style={{ fontSize: 11, color: D.textSec }}>{happy > 80 ? "Very happy! +10% XP bonus doubled! 🎉" : happy > 50 ? "Doing well. Keep feeding!" : "Needs attention!"}</div>
        </Card>
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: D.gold, textTransform: "uppercase", marginBottom: 8 }}>Evolution Progress</div>
          <div style={{ fontSize: 11, color: D.textSec, marginBottom: 8 }}>Next: Stage 3 Teen 🐦 at Level 20 + 150k steps</div>
          <div style={{ height: 8, background: "rgba(255,255,255,.08)", borderRadius: 99 }}>
            <div style={{ width: "67%", height: "100%", background: "linear-gradient(90deg,#7C3AED,#A855F7)", borderRadius: 99 }} />
          </div>
        </Card>
        <Card gold style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: D.gold, textTransform: "uppercase", marginBottom: 6 }}>Active Bonus</div>
          <Row style={{ gap: 8 }}><span style={{ color: D.green }}>★</span><span style={{ fontSize: 13, color: D.green, fontWeight: 700 }}>+10% coins from all activities</span></Row>
        </Card>
        <Row style={{ gap: 10 }}>
          <button onClick={() => setHappy(h => Math.min(100, h + 15))} style={{ flex: 1, padding: 12, fontSize: 13, background: "linear-gradient(135deg,#22C55E,#16A34A)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, cursor: "pointer" }}>🍖 Feed (+15)</button>
          <PurpleBtn style={{ flex: 1, padding: 12, fontSize: 13 }}>🎮 Play</PurpleBtn>
        </Row>
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
    </Col>
  );
}

function GuildScreen({ go }) {
  const members = [
    { r: "★", n: "Arjun (You)", s: "12,400", pct: 82 },
    { r: "⚔️", n: "Rahul", s: "11,200", pct: 75 },
    { r: "⚔️", n: "Priya", s: "9,800", pct: 65 },
    { r: "⚔️", n: "Dev", s: "8,100", pct: 54 },
    { r: "", n: "Anjali", s: "7,340", pct: 49 },
    { r: "", n: "Sam", s: "6,200", pct: 41 },
  ];
  return (
    <Col style={{ flex: 1, background: D.bg, overflow: "hidden" }}>
      <Col style={{ background: "linear-gradient(180deg,#0A0820,#0D0A20)", padding: 16, textAlign: "center", borderBottom: `1px solid ${D.border}`, position: "relative" }}>
        <button onClick={() => go("home")} style={{ position: "absolute", left: 16, top: 16, background: "none", border: "none", color: D.gold, fontSize: 20, cursor: "pointer", fontWeight: 700 }}>‹</button>
        <div style={{ fontSize: 36, marginBottom: 6 }}>⚔️</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: D.gold, textTransform: "uppercase", letterSpacing: 1 }}>Warriors of Fitness</div>
        <Pill color={D.purpleL} style={{ display: "inline-block", marginTop: 4 }}>Level 12 Guild Hall</Pill>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 10, color: D.textSec, marginBottom: 4, textTransform: "uppercase" }}>Weekly Quest: 500k steps (67%)</div>
          <div style={{ height: 8, background: "rgba(255,255,255,.08)", borderRadius: 99 }}>
            <div style={{ width: "67%", height: "100%", background: "linear-gradient(90deg,#22C55E,#4ADE80)", borderRadius: 99 }} />
          </div>
        </div>
      </Col>
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        <Row style={{ gap: 8, marginBottom: 14 }}>
          <PurpleBtn style={{ flex: 1, padding: 10, fontSize: 12 }}>💬 Guild Chat</PurpleBtn>
          <GoldBtn style={{ flex: 1, padding: 10, fontSize: 12 }}>+ Invite</GoldBtn>
        </Row>
        <div style={{ fontSize: 12, fontWeight: 800, color: D.text, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Members (20/25)</div>
        <Card>
          {members.map((m, i) => (
            <div key={i} style={{ paddingBottom: 9, marginBottom: i < members.length - 1 ? 9 : 0, borderBottom: i < members.length - 1 ? `1px solid ${D.border}` : "none" }}>
              <Row style={{ justifyContent: "space-between", marginBottom: 5 }}>
                <Row style={{ gap: 8 }}>
                  <Avatar initials={m.n.slice(0, 2)} size={28} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: D.text }}>{m.r} {m.n}</span>
                </Row>
                <span style={{ fontSize: 12, fontWeight: 700, color: D.gold }}>{m.s}</span>
              </Row>
              <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 99 }}>
                <div style={{ width: `${m.pct}%`, height: "100%", background: D.purple, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </Col>
  );
}

function ShopScreen({ go }) {
  return (
    <Col style={{ flex: 1, background: D.bg, overflow: "hidden" }}>
      <Col style={{ background: "linear-gradient(135deg,#1A0D3A,#0D0A20)", padding: 16, borderBottom: `1px solid ${D.border}`, position: "relative" }}>
        <button onClick={() => go("home")} style={{ position: "absolute", left: 16, top: 16, background: "none", border: "none", color: D.gold, fontSize: 20, cursor: "pointer", fontWeight: 700 }}>‹</button>
        <div style={{ textAlign: "center", fontSize: 15, fontWeight: 900, color: D.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Shop</div>
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Row style={{ gap: 14 }}>
            <Row style={{ gap: 4 }}><span style={{ color: D.gold }}>◈</span><span style={{ fontSize: 14, fontWeight: 800, color: D.gold }}>1,240</span></Row>
            <Row style={{ gap: 4 }}><span style={{ color: D.purpleL }}>◆</span><span style={{ fontSize: 14, fontWeight: 800, color: D.purpleL }}>340</span></Row>
          </Row>
          <GoldBtn style={{ padding: "7px 14px", fontSize: 12 }}>+ Buy Gems</GoldBtn>
        </Row>
      </Col>
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        <Card purple style={{ marginBottom: 14 }}>
          <Pill color={D.purpleL} style={{ display: "inline-block", marginBottom: 8 }}>FEATURED</Pill>
          <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Col style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: D.gold }}>FitPass Monthly</div>
              <div style={{ fontSize: 11, color: D.textSec, marginTop: 4, lineHeight: 1.5 }}>2× weekend XP · Exclusive quests · No ads</div>
            </Col>
            <Col style={{ alignItems: "flex-end", gap: 6 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: D.gold }}>₹149</div>
              <div style={{ fontSize: 10, color: D.textMuted }}>/month</div>
              <GoldBtn style={{ padding: "7px 12px", fontSize: 11 }}>Subscribe</GoldBtn>
            </Col>
          </Row>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[{ n: "Starter Pack", i: "◆", p: "₹99", d: "150 gems" }, { n: "Explorer Pack", i: "◆◆", p: "₹499", d: "900 gems + bonus" }, { n: "Hero Skin", i: "⚔️", p: "299 ◆", d: "3 exclusive outfits" }, { n: "Dragon Pet", i: "🐲", p: "199 ◆", d: "2 pet skins" }].map((item, i) => (
            <Card key={i} style={{ textAlign: "center", padding: 12 }}>
              <div style={{ fontSize: 26, color: D.gold, marginBottom: 6 }}>{item.i}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: D.text }}>{item.n}</div>
              <div style={{ fontSize: 10, color: D.textMuted, marginBottom: 8 }}>{item.d}</div>
              <GoldBtn style={{ width: "100%", padding: 7, fontSize: 11 }}>{item.p}</GoldBtn>
            </Card>
          ))}
        </div>
      </div>
    </Col>
  );
}

function LevelUpScreen({ go }) {
  return (
    <Col style={{ flex: 1, background: D.bg, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: D.textSec, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>LEVEL UP!</div>
        <div style={{ width: 110, height: 110, borderRadius: "50%", background: "rgba(245,166,35,.15)", border: "3px solid #F5A623", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "float 3s ease-in-out infinite" }}>
          <Col style={{ alignItems: "center" }}>
            <div style={{ fontSize: 38, fontWeight: 900, color: D.gold }}>19</div>
            <div style={{ fontSize: 10, color: D.textSec }}>LEVEL</div>
          </Col>
        </div>
      </div>
      <Card gold style={{ width: "100%", textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: D.gold }}>Champion → Veteran</div>
        <div style={{ fontSize: 12, color: D.textSec, marginTop: 4 }}>New title unlocked!</div>
      </Card>
      <Card style={{ width: "100%", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: D.gold, textTransform: "uppercase", marginBottom: 10 }}>Stats Gained</div>
        {[["STR", "48→51", D.red], ["STA", "65→68", D.green], ["AGI", "30→32", D.gold], ["FOC", "41→44", D.purpleL]].map(([s, v, c]) => (
          <Row key={s} style={{ justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${D.border}` }}>
            <span style={{ fontSize: 12, color: D.text }}>{s}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: c }}>{v}</span>
          </Row>
        ))}
      </Card>
      <GoldBtn onClick={() => go("home")} style={{ width: "100%", padding: 14, fontSize: 15 }}>★ CONTINUE QUEST</GoldBtn>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </Col>
  );
}

function SpinScreen({ go }) {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState(null);
  const prizes = ["600 XP", "1800 Coins", "300", "160 XP", "2000 Coins", "Speed Boost", "Soccer Ball", "100 Coins"];
  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const pick = Math.floor(Math.random() * 8);
    const newAngle = angle + 360 * 6 + pick * 45 + 22;
    setAngle(newAngle);
    setTimeout(() => { setSpinning(false); setResult(prizes[pick]); }, 3300);
  };
  const segColors = ["rgba(124,58,237,.9)", "rgba(245,166,35,.9)", "rgba(26,106,26,.9)", "rgba(29,78,216,.9)", "rgba(245,166,35,.9)", "rgba(34,197,94,.9)", "rgba(239,68,68,.9)", "rgba(6,182,212,.9)"];
  return (
    <Col style={{ flex: 1, background: "linear-gradient(180deg,#0A0520,#080212)", alignItems: "center", overflow: "hidden" }}>
      <div style={{ background: "rgba(0,0,0,.3)", padding: 12, width: "100%", textAlign: "center", borderBottom: "1px solid rgba(245,166,35,.1)", position: "relative" }}>
        <button onClick={() => go("home")} style={{ position: "absolute", left: 16, top: 12, background: "none", border: "none", color: D.gold, fontSize: 20, cursor: "pointer", fontWeight: 700 }}>‹</button>
        <div style={{ fontSize: 16, fontWeight: 900, color: D.gold, textTransform: "uppercase", letterSpacing: 2 }}>🎡 DAILY SPIN</div>
      </div>
      <Col style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 20 }}>
        <div style={{ position: "relative", width: 220, height: 220 }}>
          <div style={{ width: 220, height: 220, borderRadius: "50%", border: "6px solid #F5A623", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(4,1fr)", transform: `rotate(${angle}deg)`, transition: spinning ? "transform 3.2s cubic-bezier(.17,.67,.12,.99)" : "none" }}>
            {prizes.map((p, i) => (
              <div key={i} style={{ background: segColors[i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff", padding: 4, textAlign: "center", lineHeight: 1.2 }}>{p}</div>
            ))}
          </div>
          <div style={{ position: "absolute", width: 44, height: 44, borderRadius: "50%", background: "#0A0520", border: "3px solid #F5A623", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 900, color: D.gold }}>SPIN</span>
          </div>
          <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", fontSize: 22, color: D.gold, zIndex: 3 }}>▼</div>
        </div>
        {result && (
          <Card gold style={{ textAlign: "center", padding: "14px 24px" }}>
            <div style={{ fontSize: 12, color: D.textSec, marginBottom: 4 }}>YOU WON!</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: D.gold }}>{result}</div>
          </Card>
        )}
        <GoldBtn onClick={handleSpin} style={{ width: 160, padding: 14, fontSize: 15 }}>
          {spinning ? "Spinning..." : result ? "Spin Again!" : "🎡 SPIN!"}
        </GoldBtn>
        <div style={{ fontSize: 12, color: D.textMuted }}>Daily Spin: 3 days streak bonus active</div>
      </Col>
    </Col>
  );
}

function MapScreen({ go }) {
  const zones = [
    { id: 1, n: "Greenfield Village", e: "🌲", s: "active", boss: "Forest Goblin", m: 10, total: 10, c: "#22C55E" },
    { id: 2, n: "Dusty Desert Trails", e: "🏜️", s: "unlocked", boss: "Sand Serpent", m: 5, total: 10, c: "#F5A623" },
    { id: 3, n: "Frostpeak Mountains", e: "🏔️", s: "locked", boss: "Ice Golem", m: 0, total: 10, c: "#6B5A8A" },
    { id: 4, n: "Shadowmere Swamp", e: "🌿", s: "locked", boss: "Swamp Witch", m: 0, total: 10, c: "#6B5A8A" },
    { id: 5, n: "Sunken Sea Ruins", e: "🌊", s: "locked", boss: "Sea Kraken", m: 0, total: 10, c: "#6B5A8A" },
  ];
  return (
    <Col style={{ flex: 1, background: D.bg, overflow: "hidden" }}>
      <div style={{ background: "#0A0818", padding: "12px 16px", borderBottom: `1px solid ${D.border}`, position: "relative", textAlign: "center" }}>
        <button onClick={() => go("home")} style={{ position: "absolute", left: 16, top: 12, background: "none", border: "none", color: D.gold, fontSize: 20, cursor: "pointer", fontWeight: 700 }}>‹</button>
        <div style={{ fontSize: 15, fontWeight: 900, color: D.gold, textTransform: "uppercase", letterSpacing: 1 }}>Adventure Map</div>
        <div style={{ fontSize: 10, color: D.textMuted, marginTop: 2 }}>⚔️ 147,230 total steps · Zone 2 / 8</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        {zones.map(z => (
          <div key={z.id} onClick={() => z.s !== "locked" && go("boss")} style={{
            background: "rgba(255,255,255,.04)", border: `1.5px solid ${z.s === "active" ? z.c + "55" : "rgba(255,255,255,.06)"}`,
            borderRadius: 14, padding: 12, marginBottom: 10, cursor: z.s !== "locked" ? "pointer" : "default",
            opacity: z.s === "locked" ? .55 : 1, transition: "all .2s",
          }}>
            <Row style={{ gap: 10 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: z.c + "22", border: `1px solid ${z.c}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{z.e}</div>
              <Col style={{ flex: 1 }}>
                <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: D.text }}>Zone {z.id}: {z.n}</span>
                  {z.s === "active" && <Pill color={D.green} style={{ fontSize: 9 }}>ACTIVE</Pill>}
                  {z.s === "locked" && <span style={{ fontSize: 16, color: D.textMuted }}>🔒</span>}
                </Row>
                <div style={{ fontSize: 10, color: D.textSec, marginTop: 2 }}>Boss: {z.boss}</div>
                <Row style={{ gap: 6, marginTop: 6 }}>
                  <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,.06)", borderRadius: 99 }}>
                    <div style={{ width: `${z.m / z.total * 100}%`, height: "100%", background: z.c, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 9, color: D.textMuted }}>{z.m}/{z.total}</span>
                </Row>
              </Col>
            </Row>
          </div>
        ))}
      </div>
    </Col>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function FitQuestMVP() {
  const [screen, setScreen] = useState("splash");
  const go = (s) => setScreen(s);

  const screenMap = {
    splash: <SplashScreen go={go} />,
    onboarding: <OnboardingScreen go={go} />,
    home: <HomeScreen go={go} />,
    workout: <WorkoutScreen go={go} />,
    boss: <BossScreen go={go} />,
    lootbox: <LootBoxScreen go={go} />,
    pet: <PetScreen go={go} />,
    guild: <GuildScreen go={go} />,
    shop: <ShopScreen go={go} />,
    levelup: <LevelUpScreen go={go} />,
    spin: <SpinScreen go={go} />,
    map: <MapScreen go={go} />,
  };

  const navLabels = {
    splash: "Splash", onboarding: "Onboarding", home: "Home", workout: "Workout",
    boss: "Boss Battle", lootbox: "Loot Box", pet: "Pet", guild: "Guild",
    shop: "Shop", levelup: "Level Up", spin: "Spin Wheel", map: "Map",
  };

  const screenColors = {
    splash: "#7C3AED", onboarding: "#06B6D4", home: "#22C55E", workout: "#A855F7",
    boss: "#EF4444", lootbox: "#F5A623", pet: "#22C55E", guild: "#A855F7",
    shop: "#F5A623", levelup: "#F5A623", spin: "#F59E0B", map: "#3B82F6",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "20px 12px", background: "var(--color-background-secondary, #0F0A1E)", minHeight: 600 }}>
      {/* Screen nav */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: 420 }}>
        {SCREENS.map(s => {
          const c = screenColors[s];
          const active = screen === s;
          return (
            <button key={s} onClick={() => go(s)} style={{
              padding: "4px 10px", borderRadius: 99, border: `1px solid ${active ? c : "rgba(255,255,255,.1)"}`,
              background: active ? c + "22" : "transparent", color: active ? c : "#6B5A8A",
              fontSize: 11, fontWeight: active ? 700 : 400, cursor: "pointer", fontFamily: "inherit",
            }}>{navLabels[s]}</button>
          );
        })}
      </div>

      {/* Phone frame */}
      <div style={{
        width: 360, minHeight: 700, maxHeight: 780,
        background: "#0D0A20", borderRadius: 32, overflow: "hidden",
        border: "8px solid #1A1530", boxShadow: "0 0 60px rgba(124,58,237,.3)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Notch */}
        <div style={{ height: 26, background: "#0A0818", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 72, height: 4, background: "#1E1840", borderRadius: 99 }} />
        </div>
        {/* Screen */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {screenMap[screen] || screenMap.home}
        </div>
        {/* Home bar */}
        <div style={{ height: 18, background: "#0A0818", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 52, height: 3, background: "#1E1840", borderRadius: 99 }} />
        </div>
      </div>

      <div style={{ fontSize: 11, color: "#4A3870", textAlign: "center" }}>
        Pixonic — Fitness RPG · 12 interactive screens · Built with React
      </div>
    </div>
  );
}
