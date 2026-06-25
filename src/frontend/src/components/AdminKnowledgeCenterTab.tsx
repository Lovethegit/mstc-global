import type React from "react";
import { useState } from "react";
import { EXTENDED_AGENTS_5 } from "./AIManagerData_Agents5";

const knowledgeTopics = [
  {
    domain: "MSTC GLOBAL",
    topics: ["Company history", "Services overview", "Contact details"],
  },
  {
    domain: "Ahmedabad Real Estate",
    topics: ["Locality prices", "Builder profiles", "Market trends"],
  },
  {
    domain: "Gujarat Law",
    topics: ["Stamp duty", "Registration", "RERA rules"],
  },
  {
    domain: "Indian Tax",
    topics: ["Capital gains", "Section 80C", "TDS rules"],
  },
  {
    domain: "Home Loans",
    topics: ["Eligibility", "Bank rates", "PMAY scheme"],
  },
];

const mockAnswers: Record<string, string> = {
  "stamp duty":
    "Stamp duty in Gujarat is 4.9% for male buyers and 3.9% for female buyers. It is calculated on the higher of market value or agreement value. Additional 1% registration charges apply on top.",
  "rera rules":
    "Gujarat RERA is administered by the Gujarat Real Estate Regulatory Authority. All projects above 500 sqm or 8 units must be RERA registered. Builders must update construction progress quarterly on the RERA portal.",
  "pmay scheme":
    "PMAY (Pradhan Mantri Awas Yojana) provides home loan interest subsidy of up to \u20b92.67L for EWS/LIG categories. For MIG categories, up to \u20b92.35L subsidy is available.",
  "capital gains":
    "Long-term capital gains on property (held >24 months) are now taxed at 12.5% without indexation (post Budget 2024). Short-term gains are taxed at your income tax slab rate. Section 54 exemption available on reinvestment.",
  "bank rates":
    "Current home loan rates in Ahmedabad: SBI 8.50% p.a., HDFC 8.65% p.a., ICICI 8.75% p.a., Axis 8.75% p.a. Rates are floating and linked to repo rate.",
  eligibility:
    "Home loan eligibility is typically 60x your monthly net income. For a \u20b985L loan, you need approximately \u20b91.42L/month net income. CIBIL score above 750 recommended for best rates.",
};

const AdminKnowledgeCenterTab: React.FC = () => {
  const knowledgeAgents = EXTENDED_AGENTS_5.filter(
    (a) => a.tier === "knowledge",
  );
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    const lower = query.toLowerCase();
    const found = Object.entries(mockAnswers).find(([key]) =>
      lower.includes(key),
    );
    setAnswer(
      found
        ? found[1]
        : `The MSTC Knowledge AI is processing your query about "${query}". For personalized guidance, please contact MSTC GLOBAL at +91 9512609016 or mstc.gbl@gmail.com.`,
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-bold text-[#c9a84c]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Knowledge Intelligence Center
        </h2>
        <p className="text-gray-400 text-sm">
          {knowledgeAgents.length} knowledge AI agents covering Ahmedabad real
          estate, Gujarat law, tax, and MSTC operations
        </p>
      </div>

      <div className="bg-gray-900/60 border border-[#c9a84c]/20 rounded-xl p-5">
        <h3 className="text-[#c9a84c] font-semibold text-sm mb-3">
          Ask the Knowledge AI
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Ask about stamp duty, RERA, capital gains, home loans..."
            className="flex-1 bg-gray-800/60 border border-gray-700/40 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2.5 bg-[#c9a84c] text-[#06090f] rounded-lg text-sm font-semibold hover:bg-[#c9a84c]/90 transition-colors"
          >
            Ask
          </button>
        </div>
        {answer && (
          <div className="mt-3 bg-gray-800/40 rounded-lg p-4 border border-[#c9a84c]/10">
            <div className="text-gray-400 text-xs mb-1">
              Knowledge AI Response
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{answer}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {knowledgeTopics.map((kt) => (
          <div
            key={kt.domain}
            className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-4"
          >
            <h4 className="text-[#c9a84c] font-semibold text-sm mb-2">
              {kt.domain}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {kt.topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setQuery(t);
                    setAnswer("");
                  }}
                  className="text-xs bg-gray-800 border border-gray-700/40 rounded-lg px-2 py-1 text-gray-300 hover:border-[#c9a84c]/40 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-white font-semibold text-sm mb-3">
          Knowledge Intelligence Agents ({knowledgeAgents.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {knowledgeAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-gray-900/60 border border-gray-700/30 rounded-lg p-3"
            >
              <div className="text-[#c9a84c] text-xs font-medium">
                {agent.name}
              </div>
              <div className="text-gray-500 text-xs mt-1">{agent.domain}</div>
              <div className="text-gray-600 text-xs mt-1 truncate">
                {agent.lastAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminKnowledgeCenterTab;
