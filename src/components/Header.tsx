import React from "react";
import { AppState, TRAIL_GROUPS, LOCALES, SCREENS, T1_STEPS } from "../types";
import { motion } from "motion/react";

interface HeaderProps {
  state: AppState;
  onToggleLang: () => void;
  onGoToStep: (step: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onToggleLang, onGoToStep }) => {
  const { lang, xp, badges, currentStep, completedSteps, name } = state;
  const loc = LOCALES[lang];

  // Calculate streak based on daily visits
  const getStreak = () => {
    const days = [...state.visitDays].sort();
    if (days.length === 0) return 0;
    let streak = 1;
    for (let i = days.length - 1; i > 0; i--) {
      const d1 = new Date(days[i]).getTime();
      const d0 = new Date(days[i - 1]).getTime();
      // Difference of 1 day in ms is 86400000
      if (d1 - d0 === 86400000) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = getStreak();

  // Helper to determine active/done/locked state for groups
  const getGroupStatus = (groupKey: string) => {
    if (groupKey === "welcome") {
      return completedSteps.includes("welcome") ? "done" : currentStep === "welcome" ? "active" : "done";
    }
    if (groupKey === "dashboard") {
      return completedSteps.includes("dashboard") ? "done" : currentStep === "dashboard" ? "active" : "locked";
    }
    if (groupKey === "confidence") {
      return completedSteps.includes("confidence") ? "done" : currentStep === "confidence" ? "active" : "locked";
    }
    if (groupKey === "warmup") {
      return completedSteps.includes("warmup") ? "done" : currentStep === "warmup" ? "active" : "locked";
    }
    if (groupKey === "task1") {
      const allT1Done = T1_STEPS.every((s) => completedSteps.includes(s));
      const hasStartedT1 = T1_STEPS.some((s) => s === currentStep || completedSteps.includes(s));
      if (allT1Done) return "done";
      if (hasStartedT1) return "active";
      return completedSteps.includes("warmup") ? "active" : "locked";
    }
    if (groupKey === "final") {
      return completedSteps.includes("final") ? "done" : currentStep === "final" ? "active" : "locked";
    }
    if (groupKey === "export") {
      return currentStep === "export" ? "active" : completedSteps.includes("final") ? "active" : "locked";
    }
    return "locked";
  };

  const handleGroupClick = (groupKey: string, status: string) => {
    if (status === "locked") return;
    if (groupKey === "welcome") onGoToStep("welcome");
    if (groupKey === "dashboard") onGoToStep("dashboard");
    if (groupKey === "confidence") onGoToStep("confidence");
    if (groupKey === "warmup") onGoToStep("warmup");
    if (groupKey === "task1") {
      // Find the first uncompleted step in Task 1, or default to the current active Task 1 step
      const uncompleted = T1_STEPS.find((s) => !completedSteps.includes(s));
      onGoToStep(uncompleted || "t1-overview");
    }
    if (groupKey === "final") onGoToStep("final");
    if (groupKey === "export") onGoToStep("export");
  };

  return (
    <header className="sticky top-0 z-40 bg-[rgba(250,249,245,0.92)] backdrop-blur-md border-b border-[#E1DCCF]">
      <div className="max-w-[920px] mx-auto p-4 flex flex-col gap-3">
        {/* Top brand row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onGoToStep("welcome")}>
            <div className="w-9 h-9 rounded-xl bg-[#2E5EAA] flex items-center justify-center text-white font-serif font-bold text-lg">
              LB
            </div>
            <div>
              <h1 className="font-serif font-semibold text-base leading-tight tracking-wide text-[#1E2233]">
                {loc.appTitle}
              </h1>
              <span className="text-[10px] font-sans font-medium uppercase tracking-[0.06em] text-[#8B90A0]">
                {loc.appSubTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-[#E1DCCF] rounded-full px-3 py-1 text-xs font-mono text-[#5B6178]">
                ⭐ <span className="text-[#1E2233] font-semibold">{xp}</span> {loc.xpLabel}
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-[#E1DCCF] rounded-full px-3 py-1 text-xs font-mono text-[#5B6178]">
                🔥 <span className="text-[#1E2233] font-semibold">{streak}</span> {loc.daysStreak}
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-[#E1DCCF] rounded-full px-3 py-1 text-xs font-mono text-[#5B6178]">
                🏅 <span className="text-[#1E2233] font-semibold">{badges.length}</span> {loc.badgesEarned}
              </div>
            </div>

            <button
              onClick={onToggleLang}
              className="text-xs bg-[#F1EFE8] hover:bg-[#E1DCCF] text-[#1E2233] px-3 py-1.5 rounded-lg border border-[#E1DCCF] font-semibold transition"
              id="lang-toggle"
            >
              🌐 {loc.langButton}
            </button>
          </div>
        </div>

        {/* Passport Route Journey Trail */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none justify-between">
          {TRAIL_GROUPS.map((g, i) => {
            const status = getGroupStatus(g.key);
            const label = lang === "zh" ? g.labelZh : lang === "ja" ? g.labelJa : g.labelEn;

            return (
              <React.Fragment key={g.key}>
                <div
                  onClick={() => handleGroupClick(g.key, status)}
                  className={`flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 group`}
                >
                  <motion.div
                    whileHover={status !== "locked" ? { scale: 1.1 } : {}}
                    whileTap={status !== "locked" ? { scale: 0.95 } : {}}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 transition-all relative ${
                      status === "done"
                        ? "bg-[#1F9E7C] border-[#1F9E7C] text-white"
                        : status === "active"
                        ? "bg-[#E8EFF9] border-[#2E5EAA] text-[#2E5EAA] shadow-sm font-semibold"
                        : "bg-white border-[#E1DCCF] text-[#C7C2B4] cursor-not-allowed"
                    }`}
                  >
                    {status === "done" ? "✓" : g.icon}

                    {/* Passport stamp decoration for active/done */}
                    {status === "active" && (
                      <span className="absolute inset-[-4px] border border-dashed border-[#2E5EAA] rounded-full animate-pulse pointer-events-none" />
                    )}
                  </motion.div>
                  <span
                    className={`text-[9px] font-medium leading-none text-center select-none ${
                      status === "active"
                        ? "text-[#2E5EAA] font-bold"
                        : status === "done"
                        ? "text-[#1F9E7C]"
                        : "text-[#8B90A0]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < TRAIL_GROUPS.length - 1 && (
                  <div
                    className={`h-[2px] flex-grow mx-1 min-w-[12px] sm:min-w-[20px] transition-colors duration-300 ${
                      status === "done" ? "bg-[#1F9E7C]" : "bg-[#E1DCCF]"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
