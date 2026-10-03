import React, { useState } from "react";
import {
  Sparkles,
  ChevronRight,
  Clock,
  X,
  Send,
  Loader2,
} from "lucide-react";
import { StudioHeader } from "@/pages/studio/StudioLayout";
import { VENDOR_INSIGHTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const API = "http://localhost:8081";

const STATUS_STYLE = {
  new: "bg-accent/15 text-accent",
  dismissed: "bg-muted text-muted-foreground",
  snoozed: "bg-amber-500/15 text-amber-400",
  acted: "bg-emerald-500/15 text-emerald-400",
};

export default function StudioInsights() {
  const [items, setItems] = useState(VENDOR_INSIGHTS);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [liveData, setLiveData] = useState(null);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  const update = (id, status) =>
    setItems((arr) =>
      arr.map((i) => (i.id === id ? { ...i, status } : i))
    );

  const askGemini = async () => {
    if (!question.trim() || asking) return;

    setAsking(true);
    setAnswer("");
    setLiveData(null);
    setError("");

    try {
      const response = await fetch(`${API}/api/ai/ask`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          text || `AI request failed with status ${response.status}`
        );
      }

      const data = JSON.parse(text);

      if (!data.success) {
        throw new Error(data.answer || "Gemini request failed");
      }

      setAnswer(data.answer || "No answer returned.");
      setLiveData(data.data || null);
    } catch (err) {
      console.error("Gemini request failed:", err);
      setError(
        err.message ||
          "Unable to connect to GALERIE AI. Make sure the backend is running."
      );
    } finally {
      setAsking(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askGemini();
    }
  };

  return (
    <div>
      <StudioHeader
        eyebrow="My Studio"
        title="AI Insights"
        subtitle="Every insight shows evidence + a real action"
      />

      {/* ASK STUDIO */}
      <div className="rounded-3xl glass-strong p-5 mb-6 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 ambient-glow opacity-30" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>

            <div>
              <h2 className="font-display font-600 text-lg text-foreground">
                Ask Studio
              </h2>
              <p className="text-xs text-muted-foreground">
                Ask Gemini about your live GALERIE marketplace data
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something like: How large is my marketplace right now?"
              rows={2}
              className="flex-1 resize-none rounded-2xl glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-accent"
            />

            <button
              onClick={askGemini}
              disabled={asking || !question.trim()}
              className="self-end px-4 py-3 rounded-2xl bg-accent text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {asking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Ask
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground mt-2">
            Press Enter to ask
          </p>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {answer && (
            <div className="mt-4 rounded-2xl glass p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  GALERIE AI
                </span>
              </div>

              <p className="text-sm text-foreground/90 whitespace-pre-line leading-6">
                {answer}
              </p>

              {liveData && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="rounded-xl bg-background/40 p-3">
                    <p className="text-[10px] text-muted-foreground">
                      Products
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {liveData.products ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-background/40 p-3">
                    <p className="text-[10px] text-muted-foreground">
                      Inventory
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {liveData.inventory ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-background/40 p-3">
                    <p className="text-[10px] text-muted-foreground">
                      Orders
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {liveData.orders ?? 0}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* EXISTING INSIGHTS */}
      <div className="space-y-3">
        {items.map((i) => (
          <div
            key={i.id}
            className="rounded-3xl glass-strong p-5 relative overflow-hidden"
          >
            {i.urgent && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 ambient-glow opacity-40" />
            )}

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>

                  <div>
                    <h3 className="font-display font-600 text-base text-foreground leading-tight">
                      {i.title}
                    </h3>

                    {i.urgent && (
                      <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    STATUS_STYLE[i.status]
                  )}
                >
                  {i.status}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-1">
                Evidence:{" "}
                <span className="text-foreground/90">{i.evidence}</span>
              </p>

              <p className="text-xs text-accent mb-4">
                Confidence {i.confidence}%
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => update(i.id, "acted")}
                  className="px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  {i.action}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => update(i.id, "snoozed")}
                  className="px-3 py-2 rounded-full glass text-xs text-foreground/70 hover:text-foreground flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Snooze 24h
                </button>

                <button
                  onClick={() => update(i.id, "dismissed")}
                  className="px-3 py-2 rounded-full glass text-xs text-foreground/70 hover:text-foreground flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Dismiss
                </button>

                <a
                  href={
                    i.page === "inventory"
                      ? "/studio/inventory"
                      : i.page === "reviews"
                      ? "/studio/reviews"
                      : i.page === "trust"
                      ? "/studio/trust"
                      : i.page === "demand"
                      ? "/studio/demand"
                      : "/studio"
                  }
                  className="ml-auto text-xs text-accent hover:underline"
                >
                  See full analysis →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}