import React, { useState, useEffect } from "react";
import { AppState, VocabCard, MapLink, EnglishCoachItem, QualityItem, SCREENS, LOCALES } from "../types";
import { SORT_CHIPS, DISCOVERY_QUESTIONS, CONCEPTS, MAP_NODES, REFLECTION_SENTENCE_PROMPTS, FINAL_REFLECTION_FIELDS } from "../data";
import {
  BookOpen,
  Award,
  Flame,
  Globe,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  Download,
  Sparkles,
  Plus,
  Trash,
  PenTool,
  BarChart2,
  Check,
  Eye,
  BookMarked,
  UserCheck,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StepRendererProps {
  state: AppState;
  updateState: (updater: (prev: AppState) => void) => void;
  onNext: () => void;
  onPrev: () => void;
  addXP: (n: number, reason: string) => void;
  awardBadge: (name: string, icon: string) => void;
}

export const StepRenderer: React.FC<StepRendererProps> = ({
  state,
  updateState,
  onNext,
  onPrev,
  addXP,
  awardBadge,
}) => {
  const { lang, currentStep, name, confidence, vocab, criticalQs, englishCoach, quality } = state;
  const loc = LOCALES[lang];

  // Local loading / error states for API actions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Concept Map interaction states
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Final Report Preview states
  const [showPreview, setShowPreview] = useState(false);
  const [previewText, setPreviewText] = useState("");

  const todayStr = new Date().toLocaleDateString(
    lang === "zh" ? "zh-TW" : lang === "ja" ? "ja-JP" : "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  );

  // Calculate words written helper
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Helper to call backend APIs
  const callAPI = async (endpoint: string, body: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(loc.errorGeneric);
      const data = await res.json();
      setLoading(false);
      return data;
    } catch (err: any) {
      console.error(err);
      setError(err.message || loc.errorGeneric);
      setLoading(false);
      return null;
    }
  };

  // 1. Welcome Screen View
  const renderWelcome = () => {
    return (
      <div className="text-center py-10 px-4 max-w-xl mx-auto">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-6xl block mb-6"
        >
          🌍
        </motion.span>
        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1E2233] leading-tight mb-4 tracking-tight">
          {loc.welcomeTitle}
        </h2>
        <p className="text-[#5B6178] text-base leading-relaxed mb-8 max-w-prose mx-auto">
          {loc.welcomeDesc}
        </p>

        <div className="flex flex-col gap-4 max-w-sm mx-auto bg-white p-6 rounded-2xl border border-[#E1DCCF] shadow-sm">
          <input
            type="text"
            className="w-full px-4 py-3 border border-[#E1DCCF] rounded-xl text-base focus:outline-none focus:border-[#2E5EAA] focus:ring-1 focus:ring-[#2E5EAA] transition"
            placeholder={loc.namePlaceholder}
            value={name}
            onChange={(e) =>
              updateState((prev) => {
                prev.name = e.target.value;
              })
            }
          />
          <button
            onClick={() => {
              if (!name.trim()) return;
              updateState((prev) => {
                if (!prev.completedSteps.includes("welcome")) {
                  prev.completedSteps.push("welcome");
                }
              });
              addXP(10, "Learning profile created!");
              onNext();
            }}
            disabled={!name.trim()}
            className="w-full bg-[#2E5EAA] hover:bg-[#204a88] text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {loc.beginJourney}
          </button>
        </div>
      </div>
    );
  };

  // 2. Dashboard View
  const renderDashboard = () => {
    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2 flex items-center gap-1.5">
          <BookMarked className="w-3.5 h-3.5" /> {loc.missionTitle}
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2233] mb-4 leading-tight">
          {loc.missionSubtitle}
        </h2>
        <p className="text-[#5B6178] text-sm mb-6">
          {name
            ? loc.welcomeBack.replace("{name}", name)
            : loc.welcomeGuest}{" "}
          {loc.missionHeader}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E1DCCF]">
            <span className="block text-[10px] uppercase tracking-wider text-[#8B90A0] font-mono mb-1">
              {loc.dateLabel}
            </span>
            <span className="text-xs font-semibold text-[#1E2233]">{todayStr}</span>
          </div>
          <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E1DCCF]">
            <span className="block text-[10px] uppercase tracking-wider text-[#8B90A0] font-mono mb-1">
              {loc.timeLabel}
            </span>
            <span className="text-xs font-semibold text-[#1E2233]">35–45 min</span>
          </div>
          <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E1DCCF]">
            <span className="block text-[10px] uppercase tracking-wider text-[#8B90A0] font-mono mb-1">
              {loc.courseLabel}
            </span>
            <span className="text-xs font-semibold text-[#1E2233]">Leading Across Borders</span>
          </div>
          <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E1DCCF]">
            <span className="block text-[10px] uppercase tracking-wider text-[#8B90A0] font-mono mb-1">
              {loc.instructorLabel}
            </span>
            <span className="text-xs font-semibold text-[#1E2233]">{loc.instructorVal}</span>
          </div>
        </div>

        <h3 className="font-serif font-semibold text-lg text-[#1E2233] mb-3">{loc.objectivesTitle}</h3>
        <ul className="space-y-2 mb-6">
          {[loc.obj1, loc.obj2, loc.obj3, loc.obj4].map((obj, index) => (
            <li key={index} className="flex gap-2.5 items-start text-xs text-[#5B6178]">
              <span className="w-5 h-5 rounded-full bg-[#E8EFF9] text-[#2E5EAA] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>

        <div className="border-l-4 border-[#C9871E] bg-[#FBF0DB] rounded-r-xl p-4 text-xs font-serif italic text-[#6B4A15] mb-6">
          {loc.quoteText}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("dashboard")) {
                  prev.completedSteps.push("dashboard");
                }
              });
              onNext();
            }}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition"
          >
            {loc.next}
          </button>
        </div>
      </div>
    );
  };

  // 3. Confidence Check-in View
  const renderConfidence = () => {
    const moods = [
      { key: "very", emoji: "😊", text: loc.veryConfident },
      { key: "ready", emoji: "🙂", text: loc.ready },
      { key: "unsure", emoji: "😐", text: loc.unsure },
      { key: "help", emoji: "😟", text: loc.needHelp },
    ];

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" /> {loc.confidenceTitle}
        </div>
        <p className="text-[#5B6178] text-xs mb-6">{loc.confidenceDesc}</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {moods.map((m) => (
            <button
              key={m.key}
              onClick={() => {
                updateState((prev) => {
                  prev.confidence = m.key;
                });
              }}
              className={`flex flex-col items-center p-5 rounded-2xl border-2 transition ${
                confidence === m.key
                  ? "border-[#2E5EAA] bg-[#E8EFF9]"
                  : "border-[#E1DCCF] bg-[#FAF9F5] hover:bg-[#F1EFE8]"
              }`}
            >
              <span className="text-4xl mb-2">{m.emoji}</span>
              <span className="text-xs font-semibold text-[#1E2233]">{m.text}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              if (!confidence) return;
              updateState((prev) => {
                if (!prev.completedSteps.includes("confidence")) {
                  prev.completedSteps.push("confidence");
                }
              });
              addXP(10, "Checked in successfully!");
              onNext();
            }}
            disabled={!confidence}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loc.next}
          </button>
        </div>
      </div>
    );
  };

  // 4. Reflection Warmup View
  const renderWarmup = () => {
    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" /> {loc.warmupTitle}
        </div>
        <p className="text-[#5B6178] text-xs mb-6">{loc.warmupDesc}</p>

        <div className="flex flex-col gap-4 mb-6">
          <div className="bg-[#F8EAE8] border border-[#E1DCCF] rounded-2xl p-4">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#B4514A]">
              🚨 {loc.ladderPoor}
            </span>
            <p className="text-xs text-[#1E2233] mt-1 font-serif">{loc.poorVal}</p>
          </div>
          <div className="bg-[#FBF0DB] border border-[#E1DCCF] rounded-2xl p-4">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#C9871E]">
              💡 {loc.ladderGood}
            </span>
            <p className="text-xs text-[#1E2233] mt-1 font-serif">{loc.goodVal}</p>
          </div>
          <div className="bg-[#E3F5EE] border border-[#E1DCCF] rounded-2xl p-4">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1F9E7C]">
              🎓 {loc.ladderExcellent}
            </span>
            <p className="text-xs text-[#1E2233] mt-1 font-serif">{loc.excellentVal}</p>
          </div>
        </div>

        <p className="text-[#5B6178] text-xs leading-relaxed mb-6 italic">{loc.academicDesc}</p>

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("warmup")) {
                  prev.completedSteps.push("warmup");
                }
              });
              addXP(15, "Completed onboarding!");
              awardBadge("Curious Learner", "🌱");
              onNext();
            }}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1"
          >
            {loc.startTask1} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  // 5. Task 1: Behavior Sort (Overview)
  const renderT1Overview = () => {
    const remaining = SORT_CHIPS.filter((c) => !state.sortPlacements[c.id]);
    const managerChips = SORT_CHIPS.filter((c) => state.sortPlacements[c.id] === "manager");
    const leaderChips = SORT_CHIPS.filter((c) => state.sortPlacements[c.id] === "leader");

    const handleSort = (chipId: string, col: "manager" | "leader") => {
      updateState((prev) => {
        prev.sortPlacements[chipId] = col;
      });
      // award 5 XP for sorting correctly
      const c = SORT_CHIPS.find((chip) => chip.id === chipId);
      if (c && c.correctCol === col) {
        addXP(5, `Sorted behavior correctly!`);
      } else {
        addXP(2, `Placed behavior chip`);
      }
    };

    const handleReset = () => {
      updateState((prev) => {
        prev.sortPlacements = {};
      });
    };

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2">
          {loc.overviewTitle}
        </div>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-6">{loc.overviewDesc}</p>

        <h3 className="font-serif font-semibold text-base text-[#1E2233] mb-2">{loc.outcomesTitle}</h3>
        <ul className="list-disc pl-5 text-xs text-[#5B6178] mb-6 space-y-1">
          <li>{loc.outcome1}</li>
          <li>{loc.outcome2}</li>
        </ul>

        <hr className="border-[#E1DCCF] mb-6" />

        <div className="flex justify-between items-center mb-3">
          <h3 className="font-serif font-semibold text-base text-[#1E2233]">{loc.sortTitle}</h3>
          {Object.keys(state.sortPlacements).length > 0 && (
            <button onClick={handleReset} className="text-xs text-[#B4514A] hover:underline font-semibold flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
        <p className="text-[#8B90A0] text-xs mb-4">{loc.sortDesc}</p>

        {/* Behavior source shelf */}
        <div className="min-h-[100px] border border-dashed border-[#E1DCCF] rounded-2xl p-4 bg-[#FAF9F5] mb-6 flex flex-wrap gap-2 items-center justify-center">
          {remaining.length === 0 ? (
            <span className="text-xs text-[#1F9E7C] font-semibold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> {loc.allSorted}
            </span>
          ) : (
            remaining.map((c) => (
              <div key={c.id} className="bg-white border border-[#E1DCCF] rounded-xl p-2.5 shadow-sm text-xs text-[#1E2233] flex flex-col gap-2 max-w-[200px]">
                <span className="font-medium">{lang === "zh" ? c.textZh : lang === "ja" ? c.textJa : c.textEn}</span>
                <div className="flex gap-1 justify-end">
                  <button
                    onClick={() => handleSort(c.id, "manager")}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#C9871E] hover:bg-[#FBF0DB] px-1.5 py-0.5 rounded border border-[#E1DCCF]"
                  >
                    Manager
                  </button>
                  <button
                    onClick={() => handleSort(c.id, "leader")}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#2E5EAA] hover:bg-[#E8EFF9] px-1.5 py-0.5 rounded border border-[#E1DCCF]"
                  >
                    Leader
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Manager Column */}
          <div className="border border-[#E1DCCF] rounded-2xl p-4 bg-[#FAF9F5]">
            <h4 className="font-mono text-xs uppercase font-bold text-[#C9871E] tracking-wider mb-3">
              💼 {loc.managerColumn}
            </h4>
            <div className="space-y-2 min-h-[120px]">
              {managerChips.map((c) => (
                <div
                  key={c.id}
                  onClick={() =>
                    updateState((prev) => {
                      delete prev.sortPlacements[c.id];
                    })
                  }
                  className="bg-white border border-[#E1DCCF] rounded-xl p-2.5 text-xs text-[#1E2233] cursor-pointer hover:bg-[#F8EAE8] hover:border-[#B4514A] transition"
                >
                  {lang === "zh" ? c.textZh : lang === "ja" ? c.textJa : c.textEn}
                </div>
              ))}
            </div>
          </div>

          {/* Leader Column */}
          <div className="border border-[#E1DCCF] rounded-2xl p-4 bg-[#FAF9F5]">
            <h4 className="font-mono text-xs uppercase font-bold text-[#2E5EAA] tracking-wider mb-3">
              ⚡ {loc.leaderColumn}
            </h4>
            <div className="space-y-2 min-h-[120px]">
              {leaderChips.map((c) => (
                <div
                  key={c.id}
                  onClick={() =>
                    updateState((prev) => {
                      delete prev.sortPlacements[c.id];
                    })
                  }
                  className="bg-white border border-[#E1DCCF] rounded-xl p-2.5 text-xs text-[#1E2233] cursor-pointer hover:bg-[#F8EAE8] hover:border-[#B4514A] transition"
                >
                  {lang === "zh" ? c.textZh : lang === "ja" ? c.textJa : c.textEn}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("t1-overview")) {
                  prev.completedSteps.push("t1-overview");
                }
              });
              onNext();
            }}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition"
          >
            {loc.continueReading}
          </button>
        </div>
      </div>
    );
  };

  // 6. Task 1: Article Reading
  const renderT1Read = () => {
    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> {loc.readingTitle}
        </div>
        <hr className="border-[#E1DCCF] my-4" />

        <div className="prose text-xs text-[#1E2233] leading-relaxed font-serif space-y-4 max-h-[420px] overflow-y-auto pr-2 mb-6">
          <p className="font-bold text-sm">Course reading — original material prepared for this module.</p>
          <p>
            For most of the twentieth century, a good manager was someone who kept the machine running: plan the work,
            assign the tasks, watch the metrics, fix what breaks. That job mattered, and in many ways it still does.
            But a manager's core question is usually <em>"how do we do this well?"</em> — a question about execution
            inside a system that already exists.
          </p>
          <p>
            Leadership asks a different question: <em>"should we be doing this at all, and what should come next?"</em> A
            leader looks at the same system a manager protects and asks whether it still serves its purpose. That shift
            — from protecting a process to questioning it — is uncomfortable, because it means giving up some of the
            certainty that made management feel safe.
          </p>
          <p>
            Artificial intelligence is accelerating this shift. When software can already plan the work, watch the
            metrics, and even suggest the fix, the manager's traditional toolkit becomes less scarce and less valuable.
            What remains scarce is <strong>judgment</strong>: knowing which problems are worth solving, whose voices are
            missing from the room, and what a decision will mean for people in a different culture, market, or
            generation than your own.
          </p>
          <p>
            This is why "global AI leadership" is not simply "management plus technology." It is the ability to hold
            three things at once:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Technical fluency</strong> (understanding what AI can and cannot responsibly do),
            </li>
            <li>
              <strong>Cultural fluency</strong> (recognizing that trust, hierarchy, and communication mean different
              things in Tokyo, São Paulo, and Berlin),
            </li>
            <li>
              <strong>Ethical fluency</strong> (asking who benefits and who is put at risk by a given system, before it
              is built rather than after it fails).
            </li>
          </ul>
          <p>
            None of this makes management obsolete. Every organization still needs people who make the daily work
            function. But the leaders who will matter most over the next decade are the ones who can move fluidly
            between the two modes — executing with discipline, and periodically stepping back to ask whether the system
            they are executing still deserves to exist.
          </p>
        </div>

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("t1-read")) {
                  prev.completedSteps.push("t1-read");
                }
              });
              addXP(10, "Finished Reading!");
              onNext();
            }}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition"
          >
            {loc.readNextBtn}
          </button>
        </div>
      </div>
    );
  };

  // 7. Task 1: Socratic AI Discovery
  const renderT1Summary = () => {
    const handleExplore = async (idx: number, question: string) => {
      setLoading(true);
      const data = await callAPI("/api/ai/discovery", { question, idx, lang });
      if (data && data.text) {
        updateState((prev) => {
          prev.summaryAnswers[idx] = data.text;
        });
        addXP(10, "AI Discovery interaction!");
      }
      setLoading(false);
    };

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2">
          {loc.discoveryTitle}
        </div>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-6">{loc.discoveryDesc}</p>

        {error && <div className="p-3 bg-[#F8EAE8] border border-[#E1DCCF] text-[#B4514A] text-xs rounded-xl mb-4">{error}</div>}

        <div className="space-y-4 mb-6">
          {DISCOVERY_QUESTIONS.map((item, idx) => {
            const qText = lang === "zh" ? item.zh : lang === "ja" ? item.ja : item.en;
            const answer = state.summaryAnswers[idx];

            return (
              <div key={idx} className="bg-[#FAF9F5] border border-[#E1DCCF] rounded-2xl p-4">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-xs font-semibold text-[#2E5EAA] font-serif">{qText}</span>
                  {!answer && (
                    <button
                      onClick={() => handleExplore(idx, qText)}
                      disabled={loading}
                      className="bg-white border border-[#E1DCCF] hover:bg-[#E8EFF9] text-[#2E5EAA] px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1 disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" /> Explore
                    </button>
                  )}
                </div>

                {answer !== undefined && (
                  <div className="mt-3">
                    <span className="block text-[9px] text-[#8B90A0] font-mono uppercase mb-1">
                      🤖 AI COACH RESPONSE (EDITABLE)
                    </span>
                    {/* CRITICAL FIX: Editable field for AI response */}
                    <textarea
                      rows={3}
                      className="w-full text-xs text-[#5B6178] p-2 border border-[#E1DCCF] bg-white rounded-lg focus:outline-none focus:border-[#2E5EAA] font-serif"
                      value={answer}
                      onChange={(e) =>
                        updateState((prev) => {
                          prev.summaryAnswers[idx] = e.target.value;
                        })
                      }
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[9px] text-[#1F9E7C] font-mono">✓ saved to state</span>
                      <button
                        onClick={() => handleExplore(idx, qText)}
                        disabled={loading}
                        className="text-[9px] text-[#2E5EAA] hover:underline flex items-center gap-0.5"
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> {loc.regenerate}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {loading && (
          <div className="flex justify-center items-center gap-2 text-xs text-[#2E5EAA] font-mono py-4">
            <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-[#2E5EAA] rounded-full animate-spin" />
            {loc.loading}
          </div>
        )}

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("t1-summary")) {
                  prev.completedSteps.push("t1-summary");
                }
              });
              onNext();
            }}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition"
          >
            {loc.summaryNextBtn}
          </button>
        </div>
      </div>
    );
  };

  // 8. Task 1: Vocab Builder
  const renderT1Vocab = () => {
    const handleGenerateVocab = async () => {
      setLoading(true);
      const data = await callAPI("/api/ai/vocab", { lang });
      if (data && data.vocab) {
        updateState((prev) => {
          prev.vocab = data.vocab;
        });
        addXP(25, "Generated 10 vocabulary cards!");
      }
      setLoading(false);
    };

    // Keep track of card expansion index
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2">
          {loc.vocabTitle}
        </div>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-6">{loc.vocabDesc}</p>

        {error && <div className="p-3 bg-[#F8EAE8] border border-[#E1DCCF] text-[#B4514A] text-xs rounded-xl mb-4">{error}</div>}

        {!vocab ? (
          <div className="text-center py-12 bg-[#FAF9F5] border border-dashed border-[#E1DCCF] rounded-2xl">
            <button
              onClick={handleGenerateVocab}
              disabled={loading}
              className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-3 rounded-xl font-bold text-xs transition inline-flex items-center gap-2 shadow"
            >
              {loading && <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-white rounded-full animate-spin" />}
              <Sparkles className="w-4 h-4" /> {loc.vocabBtn}
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <p className="text-[10px] text-[#8B90A0] uppercase font-mono italic">{loc.vocabTip}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vocab.map((v, i) => {
                const isExpanded = expandedCard === i;

                return (
                  <div
                    key={i}
                    className={`bg-white border transition rounded-2xl p-4 shadow-sm cursor-pointer ${
                      isExpanded ? "border-[#2E5EAA] ring-1 ring-[#2E5EAA]" : "border-[#E1DCCF] hover:bg-[#FAF9F5]"
                    }`}
                    onClick={() => setExpandedCard(isExpanded ? null : i)}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <span className="font-serif font-bold text-sm text-[#2E5EAA] block">{v.word}</span>
                        <span className="font-mono text-[10px] text-[#8B90A0]">{v.pronunciation}</span>
                      </div>
                      <span className="text-[9px] bg-[#E8EFF9] text-[#2E5EAA] px-1.5 py-0.5 rounded font-mono uppercase">
                        No. {i + 1}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-[#5B6178] font-medium leading-normal">
                      <strong>Def:</strong> {v.simple_def}
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-3 border-t border-[#E1DCCF] space-y-3 cursor-default"
                        onClick={(e) => e.stopPropagation()} // Stop propagation so clicking inside textareas won't close card!
                      >
                        {/* CRITICAL FIX: Editable vocabulary properties */}
                        <div>
                          <label className="block font-mono text-[9px] text-[#8B90A0] uppercase mb-1">
                            {loc.vocabWordLabel}
                          </label>
                          <input
                            type="text"
                            className="w-full text-xs p-1 border border-[#E1DCCF] rounded"
                            value={v.word}
                            onChange={(e) => {
                              updateState((prev) => {
                                if (prev.vocab) prev.vocab[i].word = e.target.value;
                              });
                            }}
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[9px] text-[#8B90A0] uppercase mb-1">
                            {loc.vocabSimpleDefLabel}
                          </label>
                          <input
                            type="text"
                            className="w-full text-xs p-1 border border-[#E1DCCF] rounded"
                            value={v.simple_def}
                            onChange={(e) => {
                              updateState((prev) => {
                                if (prev.vocab) prev.vocab[i].simple_def = e.target.value;
                              });
                            }}
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[9px] text-[#8B90A0] uppercase mb-1">
                            {loc.vocabBusDefLabel}
                          </label>
                          <textarea
                            rows={2}
                            className="w-full text-xs p-1 border border-[#E1DCCF] rounded"
                            value={v.business_def}
                            onChange={(e) => {
                              updateState((prev) => {
                                if (prev.vocab) prev.vocab[i].business_def = e.target.value;
                              });
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-mono text-[9px] text-[#8B90A0] uppercase mb-1">
                              {loc.vocabZhLabel}
                            </label>
                            <input
                              type="text"
                              className="w-full text-xs p-1 border border-[#E1DCCF] rounded"
                              value={v.chinese}
                              onChange={(e) => {
                                updateState((prev) => {
                                  if (prev.vocab) prev.vocab[i].chinese = e.target.value;
                                });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[9px] text-[#8B90A0] uppercase mb-1">
                              {loc.vocabJaLabel}
                            </label>
                            <input
                              type="text"
                              className="w-full text-xs p-1 border border-[#E1DCCF] rounded"
                              value={v.japanese}
                              onChange={(e) => {
                                updateState((prev) => {
                                  if (prev.vocab) prev.vocab[i].japanese = e.target.value;
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-[9px] text-[#8B90A0] uppercase mb-1">
                            {loc.vocabExLabel}
                          </label>
                          <textarea
                            rows={2}
                            className="w-full text-xs p-1 border border-[#E1DCCF] rounded font-serif italic"
                            value={v.example}
                            onChange={(e) => {
                              updateState((prev) => {
                                if (prev.vocab) prev.vocab[i].example = e.target.value;
                              });
                            }}
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[9px] text-[#B4514A] uppercase mb-1">
                            {loc.vocabMistakeLabel}
                          </label>
                          <textarea
                            rows={2}
                            className="w-full text-xs p-1 border border-[#E1DCCF] rounded bg-[#F8EAE8]"
                            value={v.mistake}
                            onChange={(e) => {
                              updateState((prev) => {
                                if (prev.vocab) prev.vocab[i].mistake = e.target.value;
                              });
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleGenerateVocab}
                disabled={loading}
                className="text-xs text-[#2E5EAA] hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate Vocab List
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center gap-2 text-xs text-[#2E5EAA] font-mono py-4">
            <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-[#2E5EAA] rounded-full animate-spin" />
            {loc.loading}
          </div>
        )}

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("t1-vocab")) {
                  prev.completedSteps.push("t1-vocab");
                }
              });
              onNext();
            }}
            disabled={!vocab}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loc.vocabNextBtn}
          </button>
        </div>
      </div>
    );
  };

  // 9. Task 1: Leadership Concepts
  const renderT1Concepts = () => {
    const [expandedConcept, setExpandedConcept] = useState<number | null>(null);

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2">
          {loc.conceptsTitle}
        </div>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-6">{loc.conceptsDesc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {CONCEPTS.map((c, i) => {
            const isExpanded = expandedConcept === i;
            const name = lang === "zh" ? c.nameZh : lang === "ja" ? c.nameJa : c.nameEn;
            const body = lang === "zh" ? c.bodyZh : lang === "ja" ? c.bodyJa : c.bodyEn;

            return (
              <div
                key={i}
                className={`border p-5 rounded-2xl cursor-pointer transition ${
                  isExpanded ? "bg-[#E3F5EE] border-[#1F9E7C] shadow-sm" : "bg-[#FAF9F5] border-[#E1DCCF] hover:bg-[#F1EFE8]"
                }`}
                onClick={() => setExpandedConcept(isExpanded ? null : i)}
              >
                <h4 className="font-serif font-semibold text-sm text-[#0F6B52] flex justify-between items-center">
                  <span>{name}</span>
                  <Info className="w-4 h-4 text-[#1F9E7C]" />
                </h4>
                <p className="text-[10px] text-[#1F9E7C] font-mono mt-1">Tap to read details</p>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-xs leading-relaxed text-[#1E2233] font-serif border-t border-[#1F9E7C] pt-2"
                  >
                    {body}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("t1-concepts")) {
                  prev.completedSteps.push("t1-concepts");
                }
              });
              onNext();
            }}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition"
          >
            {loc.conceptsNextBtn}
          </button>
        </div>
      </div>
    );
  };

  // 10. Task 1: Critical Thinking (Questions + hints)
  const renderT1Critical = () => {
    const handleGenerateQs = async () => {
      setLoading(true);
      const data = await callAPI("/api/ai/critical", { lang });
      if (data && data.critical) {
        updateState((prev) => {
          prev.criticalQs = data.critical;
        });
        addXP(20, "Critical questions generated!");
      } else {
        // Fallback default critical questions if API fails or for offline mock
        updateState((prev) => {
          prev.criticalQs = [
            "What assumption does the author make about the speed of AI adoption across global markets?",
            "How might Tokyo and Berlin leadership styles differ in embracing Socratic coaching?",
            "Is management truly distinct from leadership in an AI-driven enterprise?",
            "What ethical risks arise when AI decides which metrics to watch?",
            "How does cultural fluency impact the success of remote team collaborations?"
          ];
        });
      }
      setLoading(false);
    };

    const handleGetHint = async (idx: number, qText: string) => {
      setLoading(true);
      const answerSoFar = state.criticalAnswers[idx] || "";
      const data = await callAPI("/api/ai/critical-hint", { question: qText, answerSoFar, lang });
      if (data && data.text) {
        updateState((prev) => {
          prev.criticalHints[idx] = data.text;
        });
        addXP(5, "Leveraged Socratic Hint");
      }
      setLoading(false);
    };

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2">
          {loc.criticalTitle}
        </div>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-6">{loc.criticalDesc}</p>

        {error && <div className="p-3 bg-[#F8EAE8] border border-[#E1DCCF] text-[#B4514A] text-xs rounded-xl mb-4">{error}</div>}

        {!criticalQs ? (
          <div className="text-center py-12 bg-[#FAF9F5] border border-dashed border-[#E1DCCF] rounded-2xl">
            <button
              onClick={handleGenerateQs}
              disabled={loading}
              className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-3 rounded-xl font-bold text-xs transition inline-flex items-center gap-2 shadow"
            >
              {loading && <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-white rounded-full animate-spin" />}
              <Sparkles className="w-4 h-4" /> {loc.criticalBtn}
            </button>
          </div>
        ) : (
          <div className="space-y-6 mb-6">
            {criticalQs.map((q, idx) => {
              const answer = state.criticalAnswers[idx] || "";
              const hint = state.criticalHints[idx];

              return (
                <div key={idx} className="bg-[#FAF9F5] border border-[#E1DCCF] rounded-2xl p-4 shadow-sm">
                  <div className="flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#E8EFF9] text-[#2E5EAA] font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-grow">
                      {/* CRITICAL FIX: Socratic Questions themselves are editable textareas if desired */}
                      <span className="block font-mono text-[9px] text-[#8B90A0] uppercase mb-1">
                        Socratic Question (Editable)
                      </span>
                      <textarea
                        rows={2}
                        className="w-full text-xs font-semibold text-[#1E2233] p-1.5 border border-[#E1DCCF] bg-white rounded-lg focus:outline-none focus:border-[#2E5EAA] font-serif mb-2"
                        value={q}
                        onChange={(e) => {
                          updateState((prev) => {
                            if (prev.criticalQs) prev.criticalQs[idx] = e.target.value;
                          });
                        }}
                      />

                      <textarea
                        rows={3}
                        className="w-full p-3 border border-[#E1DCCF] rounded-xl text-xs font-serif bg-white text-[#1E2233] focus:outline-none focus:ring-1 focus:ring-[#2E5EAA] focus:border-[#2E5EAA]"
                        placeholder="Answer in English..."
                        value={answer}
                        onChange={(e) => {
                          updateState((prev) => {
                            prev.criticalAnswers[idx] = e.target.value;
                          });
                        }}
                      />

                      <div className="flex justify-between items-center mt-2">
                        <button
                          onClick={() => handleGetHint(idx, q)}
                          disabled={loading}
                          className="text-[10px] text-[#2E5EAA] font-semibold hover:underline flex items-center gap-1"
                        >
                          <Lightbulb className="w-3.5 h-3.5" /> {loc.getHint}
                        </button>
                        {answer.trim().length > 0 && (
                          <span className="text-[10px] text-[#1F9E7C] font-mono">
                            ✓ {countWords(answer)} words written
                          </span>
                        )}
                      </div>

                      {hint && (
                        <div className="mt-3 bg-[#E8EFF9] border border-[#E1DCCF] rounded-xl p-3">
                          <span className="block font-mono text-[9px] text-[#2E5EAA] uppercase mb-1">
                            🤖 AI Coach Hint (Editable)
                          </span>
                          {/* CRITICAL FIX: Hints are fully editable */}
                          <textarea
                            rows={2}
                            className="w-full text-xs text-[#5B6178] p-1.5 border border-[#E1DCCF] bg-white rounded-lg focus:outline-none focus:border-[#2E5EAA] font-serif"
                            value={hint}
                            onChange={(e) => {
                              updateState((prev) => {
                                prev.criticalHints[idx] = e.target.value;
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center gap-2 text-xs text-[#2E5EAA] font-mono py-4">
            <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-[#2E5EAA] rounded-full animate-spin" />
            {loc.loading}
          </div>
        )}

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("t1-critical")) {
                  prev.completedSteps.push("t1-critical");
                }
              });
              awardBadge("Critical Thinker", "🧠");
              onNext();
            }}
            disabled={!criticalQs}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loc.criticalNextBtn}
          </button>
        </div>
      </div>
    );
  };

  // 11. Task 1: Connect the dots (Map nodes)
  const renderT1Connect = () => {
    const handleNodeClick = (nodeId: string) => {
      if (!selectedNode) {
        setSelectedNode(nodeId);
      } else if (selectedNode === nodeId) {
        setSelectedNode(null);
      } else {
        // Form link
        const exists = state.mapLinks.some(
          (l) => (l.a === selectedNode && l.b === nodeId) || (l.a === nodeId && l.b === selectedNode)
        );
        if (!exists) {
          updateState((prev) => {
            prev.mapLinks.push({ a: selectedNode, b: nodeId });
          });
          addXP(10, "Mapped conceptual relationship!");
        }
        setSelectedNode(null);
      }
    };

    const handleRemoveLink = (index: number) => {
      updateState((prev) => {
        prev.mapLinks.splice(index, 1);
      });
    };

    const handleAskMapFeedback = async () => {
      const connectionsText = state.mapLinks
        .map((l) => {
          const nodeA = MAP_NODES.find((n) => n.id === l.a);
          const nodeB = MAP_NODES.find((n) => n.id === l.b);
          return `${nodeA?.labelEn} - ${nodeB?.labelEn}`;
        })
        .join("; ");

      setLoading(true);
      const data = await callAPI("/api/ai/concept-map", { connections: [connectionsText], lang });
      if (data && data.text) {
        updateState((prev) => {
          prev.mapFeedback = data.text;
        });
        addXP(15, "Reviewed leadership concept map!");
      }
      setLoading(false);
    };

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2">
          {loc.connectTitle}
        </div>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-6">{loc.connectDesc}</p>

        {error && <div className="p-3 bg-[#F8EAE8] border border-[#E1DCCF] text-[#B4514A] text-xs rounded-xl mb-4">{error}</div>}

        {/* Dynamic Concept Map Stage */}
        <div className="relative h-[280px] sm:h-[320px] bg-[#FAF9F5] border border-[#E1DCCF] rounded-2xl overflow-hidden mb-6 select-none">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {state.mapLinks.map((link, idx) => {
              const nodeA = MAP_NODES.find((n) => n.id === link.a);
              const nodeB = MAP_NODES.find((n) => n.id === link.b);
              if (!nodeA || !nodeB) return null;
              return (
                <line
                  key={idx}
                  x1={`${nodeA.x}%`}
                  y1={`${nodeA.y}%`}
                  x2={`${nodeB.x}%`}
                  y2={`${nodeB.y}%`}
                  stroke="#1F9E7C"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
              );
            })}
          </svg>

          {/* Interactive Nodes */}
          {MAP_NODES.map((node) => {
            const label = lang === "zh" ? node.labelZh : lang === "ja" ? node.labelJa : node.labelEn;
            const isSelected = selectedNode === node.id;
            const isLinked = state.mapLinks.some((l) => l.a === node.id || l.b === node.id);

            return (
              <motion.button
                key={node.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNodeClick(node.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center min-w-[90px] text-center border-2 ${
                  isSelected
                    ? "bg-[#C9871E] border-[#C9871E] text-white"
                    : isLinked
                    ? "bg-[#E3F5EE] border-[#1F9E7C] text-[#0F6B52]"
                    : "bg-white border-[#E1DCCF] text-[#1E2233]"
                }`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Created links listing */}
        {state.mapLinks.length > 0 && (
          <div className="mb-6">
            <h4 className="font-mono text-[10px] text-[#8B90A0] uppercase font-bold tracking-wider mb-2">
              CONNECTIONS CREATED
            </h4>
            <div className="flex flex-wrap gap-2">
              {state.mapLinks.map((l, idx) => {
                const nodeA = MAP_NODES.find((n) => n.id === l.a);
                const nodeB = MAP_NODES.find((n) => n.id === l.b);
                const labelA = lang === "zh" ? nodeA?.labelZh : lang === "ja" ? nodeA?.labelJa : nodeA?.labelEn;
                const labelB = lang === "zh" ? nodeB?.labelZh : lang === "ja" ? nodeB?.labelJa : nodeB?.labelEn;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#E1DCCF] rounded-full px-3 py-1 text-xs text-[#1E2233]"
                  >
                    <span>
                      {labelA} ↔ {labelB}
                    </span>
                    <button onClick={() => handleRemoveLink(idx)} className="text-[#B4514A] hover:text-red-700 p-0.5">
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Coach Map Feedback Area */}
        {state.mapLinks.length >= 2 && (
          <div className="mb-6">
            <button
              onClick={handleAskMapFeedback}
              disabled={loading}
              className="bg-[#F1EFE8] border border-[#E1DCCF] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2E5EAA]" /> {loc.askMapFeedback}
            </button>

            {state.mapFeedback && (
              <div className="mt-3 bg-[#E3F5EE] border border-[#1F9E7C] rounded-2xl p-4">
                <span className="block font-mono text-[9px] text-[#0F6B52] uppercase mb-1">
                  🤖 AI Coach Map Feedback (Editable)
                </span>
                {/* CRITICAL FIX: Map feedback editable textarea */}
                <textarea
                  rows={3}
                  className="w-full text-xs text-[#5B6178] p-1.5 border border-[#1F9E7C] bg-white rounded-lg focus:outline-none focus:border-[#1F9E7C] font-serif"
                  value={state.mapFeedback}
                  onChange={(e) => {
                    updateState((prev) => {
                      prev.mapFeedback = e.target.value;
                    });
                  }}
                />
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center gap-2 text-xs text-[#2E5EAA] font-mono py-4">
            <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-[#2E5EAA] rounded-full animate-spin" />
            {loc.loading}
          </div>
        )}

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("t1-connect")) {
                  prev.completedSteps.push("t1-connect");
                }
              });
              awardBadge("Culture Bridge", "🌉");
              onNext();
            }}
            disabled={state.mapLinks.length < 3}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loc.connectNextBtn}
          </button>
        </div>
      </div>
    );
  };

  // 12. Task 1: Reflection Builder
  const renderT1Reflection = () => {
    const handleGetCoaching = async (key: string, pText: string) => {
      setLoading(true);
      const sentence = state.reflection[key];
      const data = await callAPI("/api/ai/sentence-coach", { sentence, stepKey: key, promptText: pText, lang });
      if (data && data.text) {
        updateState((prev) => {
          prev.reflectionFeedback[key] = data.text;
        });
        addXP(10, `Socratic coaching on ${key}`);
      }
      setLoading(false);
    };

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2">
          {loc.reflTitle}
        </div>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-6">{loc.reflDesc}</p>

        {error && <div className="p-3 bg-[#F8EAE8] border border-[#E1DCCF] text-[#B4514A] text-xs rounded-xl mb-4">{error}</div>}

        <div className="space-y-6 mb-6">
          {REFLECTION_SENTENCE_PROMPTS.map((pr) => {
            const pText = lang === "zh" ? pr.zh : lang === "ja" ? pr.ja : pr.en;
            const val = state.reflection[pr.key] || "";
            const fb = state.reflectionFeedback[pr.key];

            return (
              <div key={pr.key} className="bg-[#FAF9F5] border border-[#E1DCCF] rounded-2xl p-4 shadow-sm">
                <label className="block text-xs font-semibold text-[#1E2233] mb-2">{pText}</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-[#E1DCCF] rounded-xl text-xs font-serif bg-white text-[#1E2233] focus:outline-none focus:ring-1 focus:ring-[#2E5EAA] focus:border-[#2E5EAA]"
                  placeholder="Type your sentence here..."
                  value={val}
                  onChange={(e) => {
                    updateState((prev) => {
                      prev.reflection[pr.key] = e.target.value;
                    });
                  }}
                />

                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={() => handleGetCoaching(pr.key, pText)}
                    disabled={loading}
                    className="bg-white border border-[#E1DCCF] hover:bg-[#E8EFF9] text-[#2E5EAA] px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <PenTool className="w-3.5 h-3.5 text-[#2E5EAA]" /> {loc.liveCoachingBtn}
                  </button>
                  {val.trim().length > 0 && (
                    <span className="text-[10px] text-[#1F9E7C] font-mono">
                      ✓ {countWords(val)} words written
                    </span>
                  )}
                </div>

                {fb && (
                  <div className="mt-3 bg-[#E3F5EE] border border-[#1F9E7C] rounded-xl p-3">
                    <span className="block font-mono text-[9px] text-[#0F6B52] uppercase mb-1">
                      🤖 AI COACH FEEDBACK (EDITABLE)
                    </span>
                    {/* CRITICAL FIX: Reflection coaching feedback is editable */}
                    <textarea
                      rows={2}
                      className="w-full text-xs text-[#5B6178] p-1.5 border border-[#1F9E7C] bg-white rounded-lg focus:outline-none focus:border-[#1F9E7C] font-serif"
                      value={fb}
                      onChange={(e) => {
                        updateState((prev) => {
                          prev.reflectionFeedback[pr.key] = e.target.value;
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {loading && (
          <div className="flex justify-center items-center gap-2 text-xs text-[#2E5EAA] font-mono py-4">
            <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-[#2E5EAA] rounded-full animate-spin" />
            {loc.loading}
          </div>
        )}

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              const fullText = Object.values(state.reflection).join(" ");
              updateState((prev) => {
                prev.wordsWritten += countWords(fullText);
                if (!prev.completedSteps.includes("t1-reflection")) {
                  prev.completedSteps.push("t1-reflection");
                }
              });
              addXP(20, "Completed reflection builder draft!");
              onNext();
            }}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition"
          >
            {loc.reflNextBtn}
          </button>
        </div>
      </div>
    );
  };

  // 13. Task 1: English Coach View
  const renderT1English = () => {
    const fullText = Object.values(state.reflection).filter(Boolean).join(" ");

    const handleRunEnglishReview = async () => {
      setLoading(true);
      const data = await callAPI("/api/ai/english-coach", { fullText, lang });
      if (data && data.coaching) {
        updateState((prev) => {
          prev.englishCoach = data.coaching;
        });
        addXP(20, "English reviewed by Socratic AI coach!");
      }
      setLoading(false);
    };

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2">
          {loc.englishTitle}
        </div>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-4">{loc.englishDesc}</p>

        <div className="bg-[#FAF9F5] border border-[#E1DCCF] rounded-2xl p-4 font-serif text-xs text-[#1E2233] mb-6 shadow-inner max-h-[120px] overflow-y-auto">
          {fullText || <em>(No draft text built yet. Go back to step 8)</em>}
        </div>

        {error && <div className="p-3 bg-[#F8EAE8] border border-[#E1DCCF] text-[#B4514A] text-xs rounded-xl mb-4">{error}</div>}

        {!englishCoach ? (
          <div className="text-center py-8">
            <button
              onClick={handleRunEnglishReview}
              disabled={loading || !fullText}
              className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-3 rounded-xl font-bold text-xs transition inline-flex items-center gap-2 shadow"
            >
              {loading && <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-white rounded-full animate-spin" />}
              <Sparkles className="w-4 h-4" /> {loc.reviewBtn}
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {englishCoach.map((item, idx) => (
              <div key={idx} className="border border-[#E1DCCF] rounded-2xl p-4 bg-[#FAF9F5] shadow-sm">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#2E5EAA] block mb-2">
                  ✍️ {item.category}
                </span>

                {item.has_issue ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-[#F8EAE8] p-2.5 rounded-lg text-xs">
                        <span className="block font-mono text-[9px] uppercase font-semibold text-[#B4514A] mb-1">
                          {loc.beforeLabel}
                        </span>
                        {/* CRITICAL FIX: editable suggestion before */}
                        <input
                          type="text"
                          className="w-full text-xs p-1 border border-[#E1DCCF] rounded bg-white font-serif"
                          value={item.before}
                          onChange={(e) => {
                            updateState((prev) => {
                              if (prev.englishCoach) prev.englishCoach[idx].before = e.target.value;
                            });
                          }}
                        />
                      </div>
                      <div className="bg-[#E3F5EE] p-2.5 rounded-lg text-xs">
                        <span className="block font-mono text-[9px] uppercase font-semibold text-[#1F9E7C] mb-1">
                          {loc.afterLabel}
                        </span>
                        {/* CRITICAL FIX: editable suggestion after */}
                        <input
                          type="text"
                          className="w-full text-xs p-1 border border-[#E1DCCF] rounded bg-white font-serif"
                          value={item.after}
                          onChange={(e) => {
                            updateState((prev) => {
                              if (prev.englishCoach) prev.englishCoach[idx].after = e.target.value;
                            });
                          }}
                        />
                      </div>
                    </div>
                    {/* CRITICAL FIX: editable coaching explanation */}
                    <div>
                      <span className="block font-mono text-[9px] text-[#8B90A0] uppercase mb-1">
                        Coach Explanation (Editable)
                      </span>
                      <textarea
                        rows={2}
                        className="w-full text-xs text-[#5B6178] p-1.5 border border-[#E1DCCF] bg-white rounded-lg focus:outline-none focus:border-[#2E5EAA] font-serif"
                        value={item.explanation}
                        onChange={(e) => {
                          updateState((prev) => {
                            if (prev.englishCoach) prev.englishCoach[idx].explanation = e.target.value;
                          });
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* CRITICAL FIX: editable praise note */}
                    <textarea
                      rows={2}
                      className="w-full text-xs text-[#1F9E7C] p-1.5 border border-[#1F9E7C] bg-white rounded-lg focus:outline-none font-serif"
                      value={item.explanation}
                      onChange={(e) => {
                        updateState((prev) => {
                          if (prev.englishCoach) prev.englishCoach[idx].explanation = e.target.value;
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={handleRunEnglishReview}
                disabled={loading}
                className="text-xs text-[#2E5EAA] hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-run English coach
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center gap-2 text-xs text-[#2E5EAA] font-mono py-4">
            <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-[#2E5EAA] rounded-full animate-spin" />
            {loc.loading}
          </div>
        )}

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("t1-english")) {
                  prev.completedSteps.push("t1-english");
                }
              });
              awardBadge("Confident Writer", "✍️");
              onNext();
            }}
            disabled={!englishCoach}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loc.englishNextBtn}
          </button>
        </div>
      </div>
    );
  };

  // 14. Task 1: MBA Quality Check & Radar Chart
  const renderT1Quality = () => {
    const fullText = Object.values(state.reflection).filter(Boolean).join(" ");

    const handleRunQualityReview = async () => {
      setLoading(true);
      const data = await callAPI("/api/ai/quality-check", { fullText, lang });
      if (data && data.quality) {
        updateState((prev) => {
          prev.quality = data.quality;
        });
        addXP(30, "Completed MBA Reflection Quality rating!");
      }
      setLoading(false);
    };

    // Radar chart helper
    const drawRadar = (items: QualityItem[]) => {
      const n = items.length;
      const R = 75;
      const cx = 100;
      const cy = 100;

      const pts = items.map((it, i) => {
        const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
        const r = R * (it.score / 100);
        return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
      });

      const axisPts = items.map((_, i) => {
        const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
        return [cx + R * Math.cos(ang), cy + R * Math.sin(ang)];
      });

      const polyPointsStr = pts.map((p) => p.join(",")).join(" ");

      const axesLines = axisPts.map((p, idx) => (
        <line key={idx} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="#E1DCCF" strokeWidth="1" />
      ));

      const ringScales = [0.25, 0.5, 0.75, 1];
      const rings = ringScales.map((f, ringIdx) => {
        const ringPts = items
          .map((_, i) => {
            const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
            return [cx + R * f * Math.cos(ang), cy + R * f * Math.sin(ang)].join(",");
          })
          .join(" ");
        return <polygon key={ringIdx} points={ringPts} fill="none" stroke="#E1DCCF" strokeWidth="0.5" />;
      });

      return (
        <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto block">
          {rings}
          {axesLines}
          {pts.length > 0 && <polygon points={polyPointsStr} fill="rgba(46,94,170,0.2)" stroke="#2E5EAA" strokeWidth="2" />}
        </svg>
      );
    };

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2">
          {loc.qualityTitle}
        </div>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-6">{loc.qualityDesc}</p>

        {error && <div className="p-3 bg-[#F8EAE8] border border-[#E1DCCF] text-[#B4514A] text-xs rounded-xl mb-4">{error}</div>}

        {!quality ? (
          <div className="text-center py-8">
            <button
              onClick={handleRunQualityReview}
              disabled={loading || !fullText}
              className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-3 rounded-xl font-bold text-xs transition inline-flex items-center gap-2 shadow"
            >
              {loading && <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-white rounded-full animate-spin" />}
              <Sparkles className="w-4 h-4" /> {loc.qualityBtn}
            </button>
          </div>
        ) : (
          <div className="space-y-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center bg-[#FAF9F5] p-6 rounded-2xl border border-[#E1DCCF]">
              <div className="flex-shrink-0">{drawRadar(quality)}</div>
              <div className="flex-grow space-y-3 w-full">
                {quality.map((q, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between font-mono text-[10px] uppercase font-bold text-[#1E2233] mb-1">
                      <span>{q.category}</span>
                      <span className="text-[#2E5EAA]">{q.score} / 100</span>
                    </div>
                    {/* CRITICAL FIX: Feedback details are editable */}
                    <textarea
                      rows={1}
                      className="w-full text-xs text-[#5B6178] p-1 border border-[#E1DCCF] bg-white rounded focus:outline-none focus:border-[#2E5EAA] font-serif"
                      value={q.feedback}
                      onChange={(e) => {
                        updateState((prev) => {
                          if (prev.quality) prev.quality[idx].feedback = e.target.value;
                        });
                      }}
                    />
                    <div className="w-full h-1.5 bg-[#E1DCCF] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#2E5EAA]" style={{ width: `${q.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleRunQualityReview}
                disabled={loading}
                className="text-xs text-[#2E5EAA] hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-run quality scan
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center gap-2 text-xs text-[#2E5EAA] font-mono py-4">
            <span className="w-4 h-4 border-2 border-[#E1DCCF] border-t-[#2E5EAA] rounded-full animate-spin" />
            {loc.loading}
          </div>
        )}

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("t1-quality")) {
                  prev.completedSteps.push("t1-quality");
                }
              });
              awardBadge("MBA Ready", "🎓");
              onNext();
            }}
            disabled={!quality}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loc.qualityNextBtn}
          </button>
        </div>
      </div>
    );
  };

  // 15. Final Reflection Questions Screen
  const renderFinalReflection = () => {
    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-[#2E5EAA] font-mono text-xs uppercase font-bold tracking-[0.1em] mb-2 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5" /> {loc.finalTitle}
        </div>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-6">{loc.finalDesc}</p>

        <div className="space-y-6 mb-6">
          {FINAL_REFLECTION_FIELDS.map((f) => {
            const promptText = lang === "zh" ? f.zh : lang === "ja" ? f.ja : f.en;
            const val = state.finalReflection[f.key] || "";

            return (
              <div key={f.key} className="bg-[#FAF9F5] border border-[#E1DCCF] rounded-2xl p-4 shadow-sm">
                <label className="block text-xs font-semibold text-[#1E2233] mb-2 leading-relaxed">{promptText}</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-[#E1DCCF] rounded-xl text-xs font-serif bg-white text-[#1E2233] focus:outline-none focus:ring-1 focus:ring-[#2E5EAA] focus:border-[#2E5EAA]"
                  placeholder="Answer here..."
                  value={val}
                  onChange={(e) => {
                    updateState((prev) => {
                      prev.finalReflection[f.key] = e.target.value;
                    });
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
          <button
            onClick={() => {
              updateState((prev) => {
                if (!prev.completedSteps.includes("final")) {
                  prev.completedSteps.push("final");
                }
              });
              addXP(30, "Completed final reflections!");
              onNext();
            }}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition"
          >
            {loc.finalNextBtn}
          </button>
        </div>
      </div>
    );
  };

  // 16. Export Report & Formatted Preview Screen
  const renderExport = () => {
    // Generate Report content based on actual states (user inputs + AI suggestions + edits)
    const generateReportBody = () => {
      const lines: string[] = [];
      lines.push(`===================================================`);
      lines.push(`     LEADING ACROSS BORDERS — LEARNING REPORT      `);
      lines.push(`===================================================`);
      lines.push(`Student: ${name || "(Not provided)"}`);
      lines.push(`Date: ${todayStr} | Generated at: ${new Date().toLocaleTimeString()}`);
      lines.push(`Language Prefererence: ${lang === "zh" ? "Traditional Chinese (繁體中文)" : lang === "ja" ? "Japanese (日本語)" : "English"}`);
      lines.push(`Total XP: ${state.xp} | Continuous Days: ${state.visitDays.length}`);
      lines.push(`Badges Earned: ${state.badges.join(", ") || "None yet"}`);
      lines.push(`Confidence Level Checked-in: ${confidence || "Ready"}`);
      lines.push(`\n---------------------------------------------------`);
      lines.push(`1. WARM-UP EXERCISE: BEHAVIOR SORT PLACEMENT`);
      lines.push(`---------------------------------------------------`);
      SORT_CHIPS.forEach((chip) => {
        const placement = state.sortPlacements[chip.id] || "Unsorted";
        lines.push(`Behavior: "${lang === "zh" ? chip.textZh : lang === "ja" ? chip.textJa : chip.textEn}"`);
        lines.push(`- Placed under: ${placement.toUpperCase()} (Correct category: ${chip.correctCol.toUpperCase()})`);
      });

      lines.push(`\n---------------------------------------------------`);
      lines.push(`2. AI DISCOVERY EXPLORATIONS (SOCRATIC DISCUSSION)`);
      lines.push(`---------------------------------------------------`);
      DISCOVERY_QUESTIONS.forEach((item, idx) => {
        const qText = lang === "zh" ? item.zh : lang === "ja" ? item.ja : item.en;
        const ans = state.summaryAnswers[idx] || "Not explored";
        lines.push(`Question: ${qText}`);
        lines.push(`AI Coach Exploration (Editable): "${ans}"\n`);
      });

      if (vocab && vocab.length) {
        lines.push(`\n---------------------------------------------------`);
        lines.push(`3. ADVANCED BUSINESS VOCABULARY MEMORIZED`);
        lines.push(`---------------------------------------------------`);
        vocab.forEach((v, idx) => {
          lines.push(`${idx + 1}. WORD: "${v.word}" (${v.pronunciation})`);
          lines.push(`   - Simple Definition: ${v.simple_def}`);
          lines.push(`   - Business Meaning: ${v.business_def}`);
          lines.push(`   - Traditional Chinese: ${v.chinese} | Japanese: ${v.japanese}`);
          lines.push(`   - Context Example: "${v.example}"`);
          lines.push(`   - Common Mistake to Avoid: ${v.mistake}\n`);
        });
      }

      if (criticalQs && criticalQs.length) {
        lines.push(`\n---------------------------------------------------`);
        lines.push(`4. CRITICAL THINKING SOCRATIC RESPONSES`);
        lines.push(`---------------------------------------------------`);
        criticalQs.forEach((q, idx) => {
          const ans = state.criticalAnswers[idx] || "(No response written)";
          const hint = state.criticalHints[idx] || "No hint requested";
          lines.push(`Socratic Question: ${q}`);
          lines.push(`Hint Requested: ${hint}`);
          lines.push(`Your Response Draft: "${ans}"\n`);
        });
      }

      lines.push(`\n---------------------------------------------------`);
      lines.push(`5. CONCEPT MAP RELATIONSHIPS DRAFTED`);
      lines.push(`---------------------------------------------------`);
      if (state.mapLinks.length) {
        state.mapLinks.forEach((l) => {
          const nodeA = MAP_NODES.find((n) => n.id === l.a);
          const nodeB = MAP_NODES.find((n) => n.id === l.b);
          lines.push(`Link: ${nodeA?.labelEn} ↔ ${nodeB?.labelEn}`);
        });
        lines.push(`AI Coach Map Socratic Feedback: "${state.mapFeedback || "No feedback requested"}"`);
      } else {
        lines.push("No map relations drawn.");
      }

      lines.push(`\n---------------------------------------------------`);
      lines.push(`6. EXCEL-GRADE REFLECTION BUILDER OUTPUT (BY SENTENCE)`);
      lines.push(`---------------------------------------------------`);
      REFLECTION_SENTENCE_PROMPTS.forEach((pr) => {
        const sentence = state.reflection[pr.key] || "(No sentence drafted)";
        const fb = state.reflectionFeedback[pr.key] || "No coaching requested";
        lines.push(`Prompt: ${lang === "zh" ? pr.zh : lang === "ja" ? pr.ja : pr.en}`);
        lines.push(`Sentence Draft: "${sentence}"`);
        lines.push(`Coaching Feedback: "${fb}"\n`);
      });

      if (englishCoach && englishCoach.length) {
        lines.push(`\n---------------------------------------------------`);
        lines.push(`7. ENGLISH COACH POLISHING RECOMMENDATIONS`);
        lines.push(`---------------------------------------------------`);
        englishCoach.forEach((item) => {
          lines.push(`Category: [${item.category.toUpperCase()}]`);
          if (item.has_issue) {
            lines.push(`   - Draft phrase: "${item.before}"`);
            lines.push(`   - Proposed improvement: "${item.after}"`);
          }
          lines.push(`   - Coach critique explanation: ${item.explanation}\n`);
        });
      }

      if (quality && quality.length) {
        lines.push(`\n---------------------------------------------------`);
        lines.push(`8. MBA GRADUATE QUALITY COMPREHENSIVE GRADES`);
        lines.push(`---------------------------------------------------`);
        quality.forEach((q) => {
          lines.push(`- Category: [${q.category.toUpperCase()}] | Score: ${q.score}/100`);
          lines.push(`  Feedback commentary: "${q.feedback}"`);
        });
      }

      lines.push(`\n---------------------------------------------------`);
      lines.push(`9. FINAL REFLECTIONS & SYNTHESIS`);
      lines.push(`---------------------------------------------------`);
      FINAL_REFLECTION_FIELDS.forEach((f) => {
        const qText = lang === "zh" ? f.zh : lang === "ja" ? f.ja : f.en;
        const val = state.finalReflection[f.key] || "(No response provided)";
        lines.push(`Question: ${qText}`);
        lines.push(`Response: "${val}"\n`);
      });

      lines.push(`===================================================`);
      lines.push(`Report generated successfully. Thank you for studying!`);
      lines.push(`===================================================`);

      return lines.join("\n");
    };

    const handlePreviewReport = () => {
      const text = generateReportBody();
      setPreviewText(text);
      setShowPreview(true);
    };

    const handleDownloadReport = (format: "txt" | "md") => {
      const text = showPreview ? previewText : generateReportBody();
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leading-across-borders-report.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addXP(20, `Downloaded report successfully in .${format}!`);
    };

    return (
      <div className="bg-white border border-[#E1DCCF] rounded-3xl p-6 sm:p-8 shadow-sm max-w-xl mx-auto text-center">
        <motion.span
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          className="text-6xl block mb-4"
        >
          🎓
        </motion.span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2233] mb-2 leading-tight">
          {loc.exportTitle}
        </h2>
        <p className="text-[#5B6178] text-xs leading-relaxed mb-6 max-w-md mx-auto">{loc.exportDesc}</p>

        <div className="flex flex-wrap justify-center gap-3">
          {state.badges.map((b, idx) => (
            <span key={idx} className="bg-[#FBF0DB] text-[#6B4A15] text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold border border-[#E1DCCF]">
              🏅 {b}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 max-w-sm mx-auto mt-8">
          <button
            onClick={handlePreviewReport}
            className="bg-[#2E5EAA] hover:bg-[#204a88] text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
          >
            <Eye className="w-4 h-4" /> {loc.previewBtn}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDownloadReport("md")}
              className="bg-[#FAF9F5] border border-[#E1DCCF] hover:bg-[#F1EFE8] text-[#1E2233] py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-[#5B6178]" /> .md
            </button>
            <button
              onClick={() => handleDownloadReport("txt")}
              className="bg-[#FAF9F5] border border-[#E1DCCF] hover:bg-[#F1EFE8] text-[#1E2233] py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-[#5B6178]" /> .txt
            </button>
          </div>
        </div>

        <div className="flex justify-start mt-8">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {loc.prev}
          </button>
        </div>

        {/* Formatted On-Screen Preview Modal (Fully editable!) */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#1E2233]/40 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white border border-[#E1DCCF] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
              >
                <div className="bg-[#FAF9F5] border-b border-[#E1DCCF] p-4 flex justify-between items-center flex-shrink-0">
                  <h3 className="font-serif font-semibold text-sm text-[#1E2233] flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#2E5EAA]" /> {loc.editReport}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadReport("txt")}
                      className="text-xs bg-[#2E5EAA] text-white hover:bg-[#204a88] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-xs bg-[#FAF9F5] border border-[#E1DCCF] hover:bg-[#F1EFE8] text-[#1E2233] px-3 py-1.5 rounded-lg font-bold"
                    >
                      {loc.closePreview}
                    </button>
                  </div>
                </div>

                <div className="flex-grow p-6 overflow-y-auto bg-[#1E2233] text-white">
                  {/* CRITICAL FIX: The entire report preview is editable directly inside a textarea! */}
                  <textarea
                    rows={22}
                    className="w-full text-xs font-mono bg-transparent text-green-400 border-none resize-none focus:outline-none leading-relaxed h-full"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                  />
                </div>
                <div className="bg-[#FAF9F5] border-t border-[#E1DCCF] p-3 text-center text-[10px] text-[#8B90A0] font-mono">
                  Modify the report above directly to custom-tailor your submission.
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Dispatch rendering based on currentStep
  switch (currentStep) {
    case "welcome":
      return renderWelcome();
    case "dashboard":
      return renderDashboard();
    case "confidence":
      return renderConfidence();
    case "warmup":
      return renderWarmup();
    case "t1-overview":
      return renderT1Overview();
    case "t1-read":
      return renderT1Read();
    case "t1-summary":
      return renderT1Summary();
    case "t1-vocab":
      return renderT1Vocab();
    case "t1-concepts":
      return renderT1Concepts();
    case "t1-critical":
      return renderT1Critical();
    case "t1-connect":
      return renderT1Connect();
    case "t1-reflection":
      return renderT1Reflection();
    case "t1-english":
      return renderT1English();
    case "t1-quality":
      return renderT1Quality();
    case "final":
      return renderFinalReflection();
    case "export":
      return renderExport();
    default:
      return renderWelcome();
  }
};
