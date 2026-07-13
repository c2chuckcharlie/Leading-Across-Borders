import { useState, useEffect } from "react";
import { AppState, DEFAULT_STATE, SCREENS } from "./types";
import { Header } from "./components/Header";
import { StepRenderer } from "./components/StepRenderer";
import { motion, AnimatePresence } from "motion/react";
import { Award, Check } from "lucide-react";

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem("labs_state_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure standard fields exist in case of schema changes
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load local state:", e);
    }
    return DEFAULT_STATE;
  });

  // State update runner that automatically saves to localStorage
  const updateState = (updater: (prev: AppState) => void) => {
    setState((prev) => {
      // Create deep clone or copy state properties appropriately
      const clone = JSON.parse(JSON.stringify(prev)) as AppState;
      updater(clone);
      try {
        localStorage.setItem("labs_state_v1", JSON.stringify(clone));
      } catch (e) {
        console.error("Failed to save local state:", e);
      }
      return clone;
    });
  };

  // Mark visit today on load
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    updateState((prev) => {
      if (!prev.visitDays.includes(today)) {
        prev.visitDays.push(today);
      }
    });
  }, []);

  // Toast notifications states
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; icon: string }>>([]);

  const addToast = (message: string, icon: string = "✅") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleAddXP = (n: number, reason: string) => {
    updateState((prev) => {
      prev.xp += n;
    });
    addToast(`+${n} XP — ${reason}`, "⭐");
  };

  const handleAwardBadge = (name: string, icon: string = "🏅") => {
    updateState((prev) => {
      if (!prev.badges.includes(name)) {
        prev.badges.push(name);
      }
    });
    addToast(`New Badge: ${name}`, icon);
  };

  const handleToggleLang = () => {
    let nextLang: "en" | "zh" | "ja" = "en";
    updateState((prev) => {
      if (prev.lang === "en") {
        nextLang = "ja";
      } else if (prev.lang === "ja") {
        nextLang = "zh";
      } else {
        nextLang = "en";
      }
      prev.lang = nextLang;
    });

    const messages = {
      en: "Switched to English",
      ja: "日本語に切り替えました",
      zh: "切換至 繁體中文",
    };
    addToast(messages[nextLang], "🌐");
  };

  const handleGoToStep = (step: string) => {
    updateState((prev) => {
      prev.currentStep = step;
    });
  };

  const handleNext = () => {
    const currentIndex = SCREENS.indexOf(state.currentStep);
    if (currentIndex >= 0 && currentIndex < SCREENS.length - 1) {
      updateState((prev) => {
        const current = prev.currentStep;
        if (!prev.completedSteps.includes(current)) {
          prev.completedSteps.push(current);
        }
        prev.currentStep = SCREENS[currentIndex + 1];
      });
    }
  };

  const handlePrev = () => {
    const currentIndex = SCREENS.indexOf(state.currentStep);
    if (currentIndex > 0) {
      updateState((prev) => {
        prev.currentStep = SCREENS[currentIndex - 1];
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col font-sans selection:bg-[#E8EFF9] selection:text-[#2E5EAA]">
      {/* Top Header Navigation */}
      <Header state={state} onToggleLang={handleToggleLang} onGoToStep={handleGoToStep} />

      {/* Main Content Card Layout */}
      <main className="flex-grow max-w-[920px] w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <StepRenderer
              state={state}
              updateState={updateState}
              onNext={handleNext}
              onPrev={handlePrev}
              addXP={handleAddXP}
              awardBadge={handleAwardBadge}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast Notification Stack */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2.5 items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1E2233] text-white px-5 py-3 rounded-2xl text-xs font-semibold shadow-xl flex items-center gap-2 pointer-events-auto border border-[#E1DCCF]/20"
            >
              <span className="text-base">{t.icon}</span>
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Elegant footer */}
      <footer className="py-8 text-center text-[10px] text-[#8B90A0] font-mono tracking-wider border-t border-[#E1DCCF] max-w-[920px] w-full mx-auto">
        LEADING ACROSS BORDERS · GOOGLE AI STUDIO STUDYING MODULE · 2026
      </footer>
    </div>
  );
}
