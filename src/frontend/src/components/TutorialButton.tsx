import { useTutorialEngine } from "@/components/tutorial/TutorialEngine";
import { BookOpen, ChevronRight, HelpCircle, Lightbulb, X } from "lucide-react";
import { useState } from "react";

export default function TutorialButton() {
  const [expanded, setExpanded] = useState(false);
  const ctx = useTutorialEngine();

  const options = [
    {
      id: "quick",
      label: "Quick Tutorial",
      desc: "3–4 key steps",
      icon: <Lightbulb size={15} />,
      action: () => {
        ctx?.openTutorialChoice();
        setExpanded(false);
      },
    },
    {
      id: "full",
      label: "Full Tutorial",
      desc: "Complete walkthrough",
      icon: <BookOpen size={15} />,
      action: () => {
        ctx?.openTutorialChoice();
        setExpanded(false);
      },
    },
    {
      id: "skip",
      label: "Skip All",
      desc: "Dismiss tutorials",
      icon: <X size={15} />,
      action: () => {
        ctx?.openTutorialChoice();
        setExpanded(false);
      },
    },
  ];

  return (
    <div
      className="fixed bottom-6 left-6 z-[100] flex flex-col-reverse items-start gap-2"
      data-ocid="tutorial.floating_button"
    >
      {/* Expanded options */}
      {expanded && (
        <div className="flex flex-col gap-2 mb-1">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={opt.action}
              className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-xl bg-[oklch(0.13_0.015_62)] border border-primary/25 text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all shadow-lg group text-left"
              data-ocid={`tutorial.${opt.id}_button`}
            >
              <span className="shrink-0 text-primary group-hover:scale-110 transition-transform">
                {opt.icon}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground leading-none">
                  {opt.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {opt.desc}
                </p>
              </div>
              <ChevronRight
                size={12}
                className="ml-auto text-muted-foreground/50"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main ? button */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={`w-11 h-11 rounded-full border-2 shadow-lg flex items-center justify-center transition-all duration-200 ${
          expanded
            ? "bg-primary border-primary text-primary-foreground rotate-90 scale-95"
            : "bg-[oklch(0.13_0.015_62)] border-primary/40 text-primary hover:bg-primary/15 hover:border-primary/60 hover:scale-105"
        }`}
        aria-label="Tutorial help"
        data-ocid="tutorial.help_button"
      >
        <HelpCircle size={20} />
      </button>
    </div>
  );
}
