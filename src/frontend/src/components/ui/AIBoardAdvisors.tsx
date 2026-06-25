import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Brain,
  Lightbulb,
  Megaphone,
  Scale,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Advisor {
  id: number;
  name: string;
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  latestInsight: string;
  insightTime: string;
  tags: string[];
}

const ADVISORS: Advisor[] = [
  {
    id: 1,
    name: "ProphetAI",
    role: "Property Strategist",
    icon: TrendingUp,
    color: "text-gold-400",
    bgColor: "bg-gold-900/20",
    latestInsight:
      "SG Highway corridor shows 12% YoY appreciation. Recommend prioritising inventory in Bopal and Prahlad Nagar. Current buyer demand highest in 2BHK segment below ₹70L.",
    insightTime: "8 min ago",
    tags: ["Market", "Pricing", "Inventory"],
  },
  {
    id: 2,
    name: "FinanceAI",
    role: "Finance Advisor",
    icon: BarChart3,
    color: "text-blue-400",
    bgColor: "bg-blue-900/20",
    latestInsight:
      "RBI held repo at 6.5%. Recommend locking commercial loan at current rates before Q3. Cash flow positive for next 90 days. Consider pre-payment of high-cost NBFC tranche.",
    insightTime: "22 min ago",
    tags: ["Finance", "Loans", "Cash Flow"],
  },
  {
    id: 3,
    name: "LexAI",
    role: "Legal Counsel",
    icon: Scale,
    color: "text-purple-400",
    bgColor: "bg-purple-900/20",
    latestInsight:
      "3 RERA filing deadlines this month. PDPB v2.1 compliance update required by July 31. New stamp duty amendment in Gujarat effective August 1 — review all pending agreement-to-sales.",
    insightTime: "1 hr ago",
    tags: ["RERA", "Compliance", "Legal"],
  },
  {
    id: 4,
    name: "BrandAI",
    role: "Marketing Director",
    icon: Megaphone,
    color: "text-green-400",
    bgColor: "bg-green-900/20",
    latestInsight:
      "October-December is peak booking season. Recommend launching Diwali campaign by Sept 15. WhatsApp broadcast to warm leads shows 34% open rate vs. 12% email. Boost social media.",
    insightTime: "3 hr ago",
    tags: ["Campaigns", "Brand", "Season"],
  },
  {
    id: 5,
    name: "ScaleAI",
    role: "Growth Advisor",
    icon: Lightbulb,
    color: "text-amber-400",
    bgColor: "bg-amber-900/20",
    latestInsight:
      "Referral program now generating 18% of new leads. Franchise enquiries up 3x in last 30 days. Academy pilot in Vadodara shows strong demand. Revenue target ₹75L achievable if 2 pending deals close.",
    insightTime: "Today 9am",
    tags: ["Growth", "Franchise", "Academy"],
  },
];

interface AIBoardAdvisorsProps {
  compact?: boolean;
}

export default function AIBoardAdvisors({
  compact = false,
}: AIBoardAdvisorsProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [ariaMessage, setAriaMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { id: number; advisor: string; question: string; response: string }[]
  >([]);

  function handleAsk(advisor: Advisor) {
    if (!ariaMessage.trim()) return;
    const response = `${advisor.name} analysis: Based on current market data and your portfolio, ${ariaMessage.toLowerCase().includes("when") ? "I recommend Q4 2026 as the optimal window." : ariaMessage.toLowerCase().includes("price") ? "Price trend indicates upward movement of 8-12% in next 6 months." : "This aligns with our strategic growth targets for FY2027."}`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        advisor: advisor.role,
        question: ariaMessage,
        response,
      },
    ]);
    setAriaMessage("");
    toast.success(`${advisor.name} responded`);
  }

  if (compact) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {ADVISORS.map((a, i) => (
          <div
            key={a.id}
            className={`${a.bgColor} border border-gold-800/20 rounded-xl p-3 cursor-pointer hover:border-gold-600/40 transition-all`}
            onClick={() => setExpanded(expanded === a.id ? null : a.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setExpanded(expanded === a.id ? null : a.id);
            }}
            role="button"
            tabIndex={0}
            data-ocid={`ai_board.advisor.${i + 1}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-8 h-8 rounded-lg ${a.bgColor} border border-gold-800/30 flex items-center justify-center`}
              >
                <a.icon className={`w-4 h-4 ${a.color}`} />
              </div>
              <div>
                <div className={`text-xs font-bold ${a.color}`}>{a.name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {a.role}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {a.latestInsight}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="ai_board.section">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-5 h-5 text-gold-400" />
        <h2 className="font-serif font-bold text-lg text-gold-400">
          AI Board of Advisors
        </h2>
        <span className="text-xs text-muted-foreground ml-auto">
          {ADVISORS.length} Active Advisors
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ADVISORS.map((a, i) => (
          <div
            key={a.id}
            className={`${a.bgColor} border border-gold-800/20 rounded-2xl overflow-hidden transition-all hover:border-gold-600/30`}
            data-ocid={`ai_board.advisor.item.${i + 1}`}
          >
            {/* Card Header */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${a.bgColor} border border-gold-800/30 flex items-center justify-center flex-shrink-0`}
                >
                  <a.icon className={`w-5 h-5 ${a.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold ${a.color}`}>{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.role}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">
                    Live
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-1 flex-wrap mb-3">
                {a.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${a.bgColor} ${a.color} border-current/30`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Latest Insight */}
              <div className="bg-black/20 rounded-xl p-3 border border-gold-800/10">
                <div className="text-[10px] text-muted-foreground mb-1">
                  Latest Insight · {a.insightTime}
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {a.latestInsight}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className={`flex-1 h-8 text-xs border-gold-800/30 ${a.color} hover:bg-gold-900/20`}
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                data-ocid={`ai_board.advisor.ask_button.${i + 1}`}
              >
                Ask {a.name}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs border-gold-800/30 text-muted-foreground"
                onClick={() => toast.info(`Viewing full ${a.role} report`)}
                data-ocid={`ai_board.advisor.report_button.${i + 1}`}
              >
                Report
              </Button>
            </div>

            {/* Ask Chat Expand */}
            {expanded === a.id && (
              <div className="px-4 pb-4 border-t border-gold-800/20 pt-3">
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-black/30 border border-gold-800/30 rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-600/50"
                    placeholder={`Ask ${a.name}...`}
                    value={ariaMessage}
                    onChange={(e) => setAriaMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAsk(a);
                    }}
                    data-ocid={`ai_board.advisor.chat_input.${i + 1}`}
                  />
                  <Button
                    size="sm"
                    className={`h-7 text-xs bg-primary/20 ${a.color}`}
                    onClick={() => handleAsk(a)}
                    data-ocid={`ai_board.advisor.send_button.${i + 1}`}
                  >
                    Ask
                  </Button>
                </div>
                {chatMessages
                  .filter((m) => m.advisor === a.role)
                  .slice(-2)
                  .map((m) => (
                    <div key={m.id} className="mt-2 space-y-1">
                      <div className="text-[10px] text-muted-foreground">
                        You: {m.question}
                      </div>
                      <div className="text-[10px] text-foreground/80 bg-black/20 rounded-lg p-2">
                        {m.response}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Discussions */}
      {chatMessages.length > 0 && (
        <div className="bg-card/60 border border-gold-800/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gold-400 mb-3">
            Recent Board Discussions
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {chatMessages
              .slice()
              .reverse()
              .map((m) => (
                <div
                  key={m.id}
                  className="text-xs border-b border-gold-800/20 pb-2"
                >
                  <span className="text-gold-400">{m.advisor}:</span>{" "}
                  <span className="text-muted-foreground">{m.question}</span>
                  <div className="text-foreground/70 mt-0.5 pl-2">
                    {m.response}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
