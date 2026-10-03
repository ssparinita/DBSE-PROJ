import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, X, Bell, Mic, Send, StopCircle, ChevronRight, Command, Volume2 } from "lucide-react";
import { VENDOR_INSIGHTS, VENDOR_DEMAND, VENDOR_TRUST, getProduct, getVendor } from "@/lib/mockData";
import { formatINR, formatINRCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

// Page-aware suggested prompts
const PROMPTS_BY_PAGE = {
  "/studio": ["What needs my attention today?", "How is my trust score?", "Which products need restocking?"],
  "/studio/reviews": ["Explain the flagged reviews", "Which reviews need a reply?"],
  "/studio/inventory": ["Which items run out this month?", "What should I restock first?"],
  "/studio/trust": ["Why did my trust score change?", "What is the fastest way to gain points?"],
  "/studio/demand": ["Which products will spike next month?", "How accurate was last quarter's forecast?"],
  "/studio/orders": ["Which orders ship today?", "Are there any refund requests?"],
  "/studio/insights": ["What changed this week?", "Which products are at inventory risk?"],
};
const ALWAYS = ["Which products are seeing increased demand?", "What should I restock?", "What changed this week?"];

// Lightweight grounded answer engine from mock data (no LLM in the demo).
function answer(question, page) {
  const q = question.toLowerCase();
  if (q.includes("trust")) {
    return {
      insight: `Your trust score is ${VENDOR_TRUST.score}/100 (${VENDOR_TRUST.standing}).`,
      numbers: [`Score ${VENDOR_TRUST.score}`, `Verified reviews 78%`, `First response 3.1h`],
      recommendation: "Cut first response from 3.1h to 2h to add ~1.5 points.",
      confidence: 88,
      link: "/studio/trust",
    };
  }
  if (q.includes("restock") || q.includes("run out") || q.includes("inventory") || q.includes("stock")) {
    const critical = VENDOR_DEMAND.filter((d) => d.cover <= 9).sort((a, b) => a.cover - b.cover);
    return {
      insight: `${critical.length} products are at inventory risk.`,
      numbers: critical.map((d) => `${getProduct(d.product).name}: ${d.cover}d cover`),
      recommendation: `Restock ${getProduct(critical[0]?.product).name} first — only ${critical[0]?.cover} days of cover left.`,
      confidence: 91,
      link: "/studio/inventory",
    };
  }
  if (q.includes("demand") || q.includes("spike")) {
    const high = VENDOR_DEMAND.filter((d) => d.level === "High");
    return {
      insight: `${high.length} products show high demand this month.`,
      numbers: high.map((d) => `${getProduct(d.product).name}: forecast ${d.forecast}`),
      recommendation: "Sony WH-1000XM5 demand is up 22% — consider a featured placement.",
      confidence: 84,
      link: "/studio/demand",
    };
  }
  if (q.includes("review") || q.includes("flag")) {
    const flagged = VENDOR_INSIGHTS.find((i) => i.id === "i2");
    return {
      insight: flagged.title,
      numbers: ["2 flagged reviews", "0.94 text similarity", "1-day-old accounts"],
      recommendation: "Open the flagged reviews and confirm or dismiss each in moderation.",
      confidence: 87,
      link: "/studio/reviews",
    };
  }
  if (q.includes("attention") || q.includes("today") || q.includes("changed")) {
    return {
      insight: "3 items need your attention today.",
      numbers: VENDOR_INSIGHTS.filter((i) => i.urgent || i.status === "new").map((i) => i.title),
      recommendation: "Start with the Galaxy Buds2 Pro stock-out (4 days of cover).",
      confidence: 90,
      link: "/studio",
    };
  }
  return {
    insight: "I analyzed your studio data.",
    numbers: [`Revenue ${formatINRCompact(1842300)} (last 30d)`, `Trust ${VENDOR_TRUST.score}/100`, `${VENDOR_INSIGHTS.length} open insights`],
    recommendation: "Focus on inventory risk and response time this week.",
    confidence: 80,
    link: "/studio",
  };
}

export default function AssistantDock() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thread, setThread] = useState([]);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dismissedUrgent, setDismissedUrgent] = useState(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("galerie-dismissed-urgent") || "[]");
  });
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  const page = location.pathname;
  const prompts = useMemo(() => [...(PROMPTS_BY_PAGE[page] || PROMPTS_BY_PAGE["/studio"]), ...ALWAYS].slice(0, 5), [page]);
  const unread = VENDOR_INSIGHTS.filter((i) => i.status === "new").length;
  const urgent = VENDOR_INSIGHTS.filter((i) => i.urgent && !dismissedUrgent.includes(i.id));

  // Ctrl+K command palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") { setOpen(false); setPaletteOpen(false); setBellOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread, thinking]);

  // Speech recognition support
  const speechSupported = typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  const ask = (question, fromVoice = false) => {
    if (!question.trim()) return;
    setThread((t) => [...t, { role: "user", text: question }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const res = answer(question, page);
      setThread((t) => [...t, { role: "assistant", ...res }]);
      setThinking(false);
      if (fromVoice && voiceOn) speak(res.insight + " " + res.recommendation);
    }, 900);
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const stopAll = () => {
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setListening(false);
    setSpeaking(false);
  };

  const toggleMic = () => {
  if (!speechSupported) {
    alert(
      "Voice input is not supported in this browser. Please use Google Chrome."
    );
    return;
  }

  if (listening) {
    try {
      recognitionRef.current?.stop();
    } catch {}

    setListening(false);
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition is not available.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("🎙️ GALERIE voice recognition started");
    setListening(true);
    setTranscript("");
  };

  recognition.onresult = (event) => {
    let text = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {
      text += event.results[i][0].transcript;
    }

    text = text.trim();

    setTranscript(text);

    const lastResult =
      event.results[event.results.length - 1];

    if (lastResult.isFinal && text) {
      setInput(text);
      setListening(false);
      setTranscript("");

      ask(text, true);
    }
  };

  recognition.onerror = (event) => {
    console.error(
      "🎙️ GALERIE speech recognition error:",
      event.error
    );

    setListening(false);

    if (event.error === "not-allowed") {
      alert(
        "Microphone permission was blocked. Allow microphone access for localhost and try again."
      );
    } else if (event.error === "audio-capture") {
      alert(
        "No microphone was detected. Check your microphone and browser permissions."
      );
    } else if (event.error === "no-speech") {
      console.log("No speech detected.");
    }
  };

  recognition.onend = () => {
    console.log("🎙️ GALERIE voice recognition ended");
    setListening(false);
    recognitionRef.current = null;
  };

  recognitionRef.current = recognition;

  try {
    recognition.start();
  } catch (error) {
    console.error(
      "Could not start speech recognition:",
      error
    );
    setListening(false);
  }
};

  const dismissUrgent = (id) => {
    const next = [...dismissedUrgent, id];
    setDismissedUrgent(next);
    localStorage.setItem("galerie-dismissed-urgent", JSON.stringify(next));
  };

  const waveformActive = listening || thinking || speaking;

  return (
    <>
      {/* Urgent alert popups */}
      <div className="fixed bottom-24 right-4 md:right-6 z-40 flex flex-col gap-3 w-[330px] max-w-[calc(100vw-2rem)]">
        {urgent.map((insight) => (
          <div key={insight.id} className="relative rounded-3xl glass-strong overflow-hidden glow-violet animate-float-up">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 ambient-glow" />
            <button onClick={() => dismissUrgent(insight.id)} className="absolute top-3 right-3 z-20 h-7 w-7 rounded-full glass flex items-center justify-center text-foreground/60 hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="relative z-10 p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">Urgent</span>
              </div>
              <h4 className="font-display font-600 text-base text-foreground mb-1.5">{insight.title}</h4>
              <p className="text-xs text-muted-foreground mb-3">Evidence: {insight.evidence}</p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-full bg-accent text-white text-xs font-semibold flex items-center gap-1">
                  {insight.action} <ChevronRight className="w-3 h-3" />
                </button>
                <button onClick={() => dismissUrgent(insight.id)} className="px-3 py-1.5 rounded-full glass text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating buttons */}
      <div className="fixed bottom-5 right-4 md:right-6 z-40 flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setBellOpen((o) => !o)}
            className="h-12 w-12 rounded-full glass-strong flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>
          )}
          {bellOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setBellOpen(false)} />
              <div className="absolute bottom-14 right-0 w-80 glass-strong rounded-3xl p-3 z-40 animate-float-up">
                <p className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Top insights</p>
                {VENDOR_INSIGHTS.map((i) => (
                  <div key={i.id} className="px-2 py-2.5 rounded-2xl hover:bg-foreground/5">
                    <p className="text-sm text-foreground font-medium leading-tight">{i.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{i.evidence}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="h-14 px-5 rounded-full glass-strong glow-violet flex items-center gap-2.5 text-foreground hover:scale-[1.02] transition-transform"
        >
          <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold">Ask Studio</span>
          <span className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md glass text-[10px] text-muted-foreground">
            <Command className="w-2.5 h-2.5" />K
          </span>
        </button>
      </div>

      {/* Assistant popup */}
      {open && (
        <div className="fixed bottom-24 right-4 md:right-6 z-40 w-[380px] max-w-[calc(100vw-2rem)]">
          <div className="relative rounded-[28px] glass-strong overflow-hidden glow-violet animate-float-up" style={{ animation: "float-up 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 ambient-glow" />
            <div className="relative z-10 flex flex-col max-h-[70vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-600 text-base text-foreground leading-none">Ask your Studio</h3>
                    <p className="text-[11px] text-muted-foreground mt-1">Answers from your live orders, stock & reviews</p>
                  </div>
                </div>
                <button onClick={() => { setOpen(false); stopAll(); }} className="h-8 w-8 rounded-full glass flex items-center justify-center text-foreground/60 hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs + voice toggle */}
              <div className="flex items-center justify-between px-5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full border border-accent/50 text-accent text-xs font-semibold">Assistant</span>
                  <span className="px-3 py-1.5 rounded-full glass text-muted-foreground text-xs font-medium">Insights ({VENDOR_INSIGHTS.length})</span>
                </div>
                <button onClick={() => setVoiceOn((v) => !v)} className={cn("flex items-center gap-1.5 text-[11px] font-medium", voiceOn ? "text-accent" : "text-muted-foreground")}>
                  <Volume2 className="w-3.5 h-3.5" /> Voice {voiceOn ? "on" : "off"}
                </button>
              </div>

              {/* Thread / suggestions */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-3 space-y-3 no-scrollbar">
                {thread.length === 0 && (
                  <div className="space-y-2">
                    {prompts.map((p) => (
                      <button key={p} onClick={() => ask(p)} className="w-full text-left px-4 py-3 rounded-2xl glass text-sm text-foreground/80 hover:text-foreground hover:border-accent/40 transition-colors">
                        {p}
                      </button>
                    ))}
                  </div>
                )}
                {thread.map((m, i) => (
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-accent text-white text-sm">{m.text}</div>
                    </div>
                  ) : (
                    <div key={i} className="rounded-2xl glass p-4 space-y-2.5">
                      <p className="text-sm text-foreground font-medium leading-relaxed">{m.insight}</p>
                      {m.numbers?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {m.numbers.map((n, j) => (
                            <span key={j} className="px-2.5 py-1 rounded-lg bg-foreground/5 text-[11px] text-muted-foreground font-medium">{n}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-accent">→ {m.recommendation}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-muted-foreground">Confidence {m.confidence}%</span>
                        <a href={m.link} className="text-[11px] text-accent hover:underline">See full analysis →</a>
                      </div>
                    </div>
                  )
                ))}
                {thinking && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                    Thinking…
                  </div>
                )}
              </div>

              {/* Waveform */}
              {waveformActive && (
                <div className="px-5 py-2">
                  <div className="flex items-center gap-1.5 h-10 px-3 rounded-2xl glass">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-full bg-gradient-to-t from-accent/40 to-accent"
                        style={{
                          height: listening || speaking ? "100%" : "20%",
                          animation: listening || speaking ? `wave 0.8s ease-in-out ${i * 40}ms infinite` : "none",
                          transform: thinking ? "scaleY(0.15)" : undefined,
                          transformOrigin: "center",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center mt-1.5">
                    {listening ? (transcript || "Listening…") : thinking ? "Thinking…" : speaking ? "Speaking…" : ""}
                  </p>
                </div>
              )}

              {/* Input */}
              <div className="p-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && ask(input)}
                    placeholder="Ask about sales, stock, categories…"
                    className="flex-1 px-4 py-3 rounded-full glass text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent/50 transition-colors"
                  />
                  {speechSupported && (
                    <button
                      onClick={toggleMic}
                      className={cn("h-11 w-11 rounded-full flex items-center justify-center transition-all shrink-0", listening ? "bg-accent animate-pulse-glow" : "bg-accent/80")}
                      title={listening ? "Stop" : "Speak"}
                    >
                      {listening ? <StopCircle className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                    </button>
                  )}
                  <button onClick={() => ask(input)} className="h-11 w-11 rounded-full bg-accent flex items-center justify-center shrink-0 hover:bg-accent/90 transition-colors">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                {(listening || speaking) && (
                  <button onClick={stopAll} className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground py-1">Stop</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Command palette */}
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onAsk={(q) => { setOpen(true); ask(q); }} />}
    </>
  );
}

const PALETTE_PAGES = [
  { label: "Studio Overview", to: "/studio" },
  { label: "Products", to: "/studio/products" },
  { label: "Inventory", to: "/studio/inventory" },
  { label: "Orders", to: "/studio/orders" },
  { label: "Revenue", to: "/studio/revenue" },
  { label: "Trust & Reputation", to: "/studio/trust" },
  { label: "Demand Intelligence", to: "/studio/demand" },
  { label: "Review Integrity", to: "/studio/reviews" },
  { label: "AI Insights", to: "/studio/insights" },
];

function CommandPalette({ onClose, onAsk }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const filtered = PALETTE_PAGES.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-float-up">
        <div className="rounded-3xl glass-strong overflow-hidden glow-violet">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 ambient-glow" />
          <div className="relative z-10 p-4">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && q) { onAsk(q); onClose(); } }}
              placeholder="Ask a question or jump to a page…"
              className="w-full px-4 py-3 rounded-2xl glass text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent/50"
            />
            <div className="mt-3 max-h-64 overflow-y-auto no-scrollbar">
              <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">Jump to</p>
              {filtered.map((p) => (
                <button
                  key={p.to}
                  onClick={() => { navigate(p.to); onClose(); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-foreground/5 text-sm text-foreground/80 hover:text-foreground flex items-center justify-between"
                >
                  {p.label} <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
              {q && (
                <button onClick={() => { onAsk(q); onClose(); }} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-foreground/5 text-sm text-accent flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4" /> Ask: "{q}"
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}