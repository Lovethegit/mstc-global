import type { OpenAIMessage } from "@/types/chat";

export type AIProvider = "openai" | "gemini" | "claude" | "caffeine";

export interface AISettings {
  activeProvider: AIProvider;
  openaiKey?: string;
  geminiKey?: string;
  claudeKey?: string;
  personality?: string;
  language?: string;
  tone?: string;
}

const STORAGE_KEY = "mstc_ai_settings";

export function getAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AISettings>;
      return {
        activeProvider: parsed.activeProvider ?? "caffeine",
        openaiKey: parsed.openaiKey ?? "",
        geminiKey: parsed.geminiKey ?? "",
        claudeKey: parsed.claudeKey ?? "",
        personality: parsed.personality ?? "professional",
        language: parsed.language ?? "en",
        tone: parsed.tone ?? "warm",
      };
    }
  } catch {
    /* ignore parse errors */
  }
  return {
    activeProvider: "caffeine",
    personality: "professional",
    language: "en",
    tone: "warm",
  };
}

function saveSettings(settings: AISettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

// ── Provider-specific callers ────────────────────────────────────────────────

async function callOpenAI(
  history: OpenAIMessage[],
  apiKey: string,
): Promise<string> {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: history,
      max_tokens: 700,
      temperature: 0.7,
    }),
  });
  if (!resp.ok) throw new Error(`OpenAI HTTP ${resp.status}`);
  const data = (await resp.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content ?? "";
}

async function callGemini(
  history: OpenAIMessage[],
  apiKey: string,
): Promise<string> {
  // Gemini expects contents array with role mapping
  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : m.role,
    parts: [{ text: m.content }],
  }));

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 700,
          temperature: 0.7,
        },
      }),
    },
  );
  if (!resp.ok) throw new Error(`Gemini HTTP ${resp.status}`);
  const data = (await resp.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callClaude(
  history: OpenAIMessage[],
  apiKey: string,
): Promise<string> {
  const systemMsg = history.find((m) => m.role === "system");
  const messages = history
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 700,
      temperature: 0.7,
      system: systemMsg?.content ?? "",
      messages,
    }),
  });
  if (!resp.ok) throw new Error(`Claude HTTP ${resp.status}`);
  const data = (await resp.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  return data.content?.[0]?.text ?? "";
}

// ── Built-in smart fallback ──────────────────────────────────────────────────

const MSTC_KNOWLEDGE_BASE = `You are MSTC VIRTUAL ASSISTANT — the complete virtual staff of MSTC GLOBAL, a premier diversified conglomerate headquartered in Ahmedabad, Gujarat, India. You act as receptionist, sales agent, property consultant, finance advisor, legal guide, event coordinator, CSR advisor, media & tourism guide, and customer support — all in one.

COMPANY INFO:
- Name: MSTC GLOBAL
- MD: Love Vijaybhai Parekh
- Address: 5, ShwetShikhar Society, Shantivan, Ahmedabad, Gujarat, India
- Mobile & WhatsApp: +91 9512609016
- Office: +91 079-26638800
- Email: mstc.gbl@gmail.com
- Website: https://mstcglobal-kh8.caffeine.xyz

8 SERVICE DIVISIONS:
1. INFRASTRUCTURE & PROPERTY — Residential/commercial/industrial construction; project management; township development; land acquisition; building approvals; AMC/AUDA regulations.
2. RERA & PR CONSULTING — RERA registration for promoters (Form REP-1, 30-60 days) and agents (Form REA-1, within 90 days); GujRERA compliance; quarterly progress reports.
3. PURCHASE / RENT / REDEVELOPMENT — Property search; residential & commercial rentals; rental agreements; society redevelopment (70% consent, architect NOC, RERA approval); FSI guidance; stamp duty registration.
4. FINANCE & INVESTMENT — Home loans 6.5-9% interest; business loans; equity/VC funding; EMI calculation; MSME loans; NRI investment; SIP/mutual funds; property taxation.
5. MUSIC & CULTURAL SERVICES — Artist management; music production; concert coordination; folk, classical & contemporary genres; Garba/Dandiya events; music competitions.
6. HOSPITALITY & EVENTS — Venue booking; wedding management; corporate events; conferences; product launches; catering; team outings; annual dinners; MICE.
7. NGO & CSR INITIATIVES — Section 8 company registration; CSR fund management (2% net profit mandate); Form CSR-1; social impact programs; volunteer coordination; 80G tax exemption; FCRA registration.
8. MEDIA / SPORTS / TOURISM — Sports event management (cricket, kabaddi, athletics); Gujarat travel itineraries (Rann of Kutch, Gir, Somnath, Dwarka, Statue of Unity); media production; athlete management.

KEY FACTS:
- RERA registration: 30-60 days, Form REP-1, architect certificate, land title, project layout plan, balance sheet, auditor certificate. Portal: rera.gujarat.gov.in
- Home loan processing: 7-15 working days after complete documents. LTV up to 75-90%.
- Redevelopment: society resolution (70%+ consent) → architect NOC → municipal approval → RERA registration → individual consent letters → TDR/FSI calculation.
- CSR compliance: Companies with turnover ≥ Rs.1000 Cr OR net profit ≥ Rs.5 Cr OR net worth ≥ Rs.500 Cr must spend 2% net profit on CSR.
- Section 8 company: minimum 2 directors, MOA/AOA filing, Form INC-12 to MCA, 80G + 12A registrations.
- Rental agreement Gujarat stamp duty: 0.25% of (total rent + deposit). Registration mandatory for leases >11 months.
- EMI formula: P × r × (1+r)^n / ((1+r)^n - 1).
- Gujarat property stamp duty: 4.9% of property value; registration: 1% (max Rs.30,000).
- PMAY: EWS ≤ Rs.3L, LIG ≤ Rs.6L, MIG-I ≤ Rs.12L, MIG-II ≤ Rs.18L.

NAVIGATION:
- /services/infrastructure
- /services/rera-consulting, /services/rera-consulting/promoter-registration, /services/rera-consulting/agent-compliance
- /services/purchase-rent, /services/purchase-rent/residential-rent, /services/purchase-rent/commercial-rent, /services/purchase-rent/redevelopment
- /services/finance, /services/finance/home-loans, /services/finance/business-loans, /services/finance/equity-funding
- /services/music-cultural, /services/music-cultural/artist-management, /services/music-cultural/music-production
- /services/hospitality-events, /services/hospitality-events/venue-booking, /services/hospitality-events/corporate-events
- /services/ngo-csr, /services/ngo-csr/csr-fund-management, /services/ngo-csr/social-impact
- /services/media-sports-tourism, /services/media-sports-tourism/sports-events, /services/media-sports-tourism/travel-itineraries
- /properties (Property Portal)
- /blog (Blog & News)

RULES:
1. Be warm, professional, and genuinely helpful.
2. Give COMPLETE, SPECIFIC answers. Never say "please contact us" as your only answer — always answer first, then offer contact if needed.
3. Respond in the SAME LANGUAGE the user writes in: English, Gujarati, or Hindi.
4. After answering, include 1-3 relevant page links in this exact format: [LINKS: label1|/path1, label2|/path2]
5. When recommending properties, include: [PROPERTY_SEARCH: yes]
6. Every 3rd message or when user seems stuck: [SHOW_CONTACT: yes]
7. If you cannot resolve after 3 exchanges on the same topic: [ESCALATE: yes]
8. Use bullet points for lists. Use Rs. or ₹ for Indian Rupees.
9. End answers with an engaging follow-up like "What else can I help you with?"
10. You can answer ANY question — general knowledge, calculations, explanations — not just MSTC topics.`;

async function callCaffeineAI(history: OpenAIMessage[]): Promise<string> {
  // Caffeine AI uses the platform's http-outcalls extension
  // This is a smart built-in fallback that uses the platform AI
  try {
    const resp = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    if (!resp.ok) throw new Error(`Caffeine AI HTTP ${resp.status}`);
    const data = (await resp.json()) as { response?: string };
    if (data.response) return data.response;
  } catch {
    /* fallback to local knowledge */
  }

  // Ultimate fallback: generate a response from the knowledge base
  const userMsg = history.filter((m) => m.role === "user").pop()?.content ?? "";

  return generateKnowledgeResponse(userMsg);
}

function generateKnowledgeResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  // Service detection
  if (msg.includes("rera") || msg.includes("registration")) {
    return "MSTC provides complete RERA registration support in Gujarat.\n\n**For Promoters:**\n- Form REP-1\n- Architect certificate\n- Land title document\n- Project layout plan\n- Balance sheet & auditor certificate\n- Timeline: 30-60 days\n\n**For Agents:**\n- Form REA-1\n- Must file within 90 days of first transaction\n\nGujRERA Portal: rera.gujarat.gov.in\n\n[LINKS: RERA & PR Consulting|/services/rera-consulting, Promoter Registration|/services/rera-consulting/promoter-registration]\n\nWhat else can I help you with?";
  }

  if (
    msg.includes("home loan") ||
    msg.includes("loan") ||
    msg.includes("emi")
  ) {
    return "Current home loan interest rates range from **6.5% to 9%** per annum.\n\n**Required Documents:**\n- 3 months salary slips\n- Form 16\n- 6 months bank statements\n- Property documents\n- ID & address proof\n\n**Processing Time:** 7-15 working days after complete documents.\n\nLTV ratio: up to 75-90% depending on loan amount.\n\n[LINKS: Finance & Investment|/services/finance, Home Loans|/services/finance/home-loans]\n\nWhat else can I help you with?";
  }

  if (
    msg.includes("property") ||
    msg.includes("rent") ||
    msg.includes("buy") ||
    msg.includes("sale")
  ) {
    return "MSTC GLOBAL offers complete property solutions in Ahmedabad:\n\n- Residential & commercial property search\n- Rental agreements & tenant management\n- Property purchase assistance\n- Society redevelopment consulting\n- Stamp duty & registration guidance\n\n[PROPERTY_SEARCH: yes]\n\n[LINKS: Property Portal|/properties, Purchase/Rent Services|/services/purchase-rent]\n\nWhat else can I help you with?";
  }

  if (
    msg.includes("event") ||
    msg.includes("wedding") ||
    msg.includes("venue")
  ) {
    return "MSTC manages premium events in Ahmedabad:\n\n- Wedding planning & management\n- Corporate events & conferences\n- Venue booking & shortlisting\n- Catering coordination\n- AV setup & decoration\n- Product launches & team outings\n\n[LINKS: Hospitality & Events|/services/hospitality-events, Venue Booking|/services/hospitality-events/venue-booking]\n\nWhat else can I help you with?";
  }

  if (msg.includes("csr") || msg.includes("ngo")) {
    return "MSTC's NGO & CSR division helps with:\n\n- Section 8 company registration\n- CSR fund management (2% net profit mandate)\n- Form CSR-1 filing\n- Social impact programs\n- Volunteer coordination\n- 80G tax exemption for donors\n- FCRA registration\n\n[LINKS: NGO & CSR|/services/ngo-csr, CSR Fund Management|/services/ngo-csr/csr-fund-management]\n\nWhat else can I help you with?";
  }

  if (
    msg.includes("music") ||
    msg.includes("artist") ||
    msg.includes("cultural")
  ) {
    return "MSTC Music & Cultural Services:\n\n- Artist management & booking\n- Music production studios\n- Concert & event coordination\n- Folk, classical & contemporary genres\n- Garba/Dandiya events\n- National music competitions\n\n[LINKS: Music & Cultural|/services/music-cultural, Artist Management|/services/music-cultural/artist-management]\n\nWhat else can I help you with?";
  }

  if (
    msg.includes("sports") ||
    msg.includes("tourism") ||
    msg.includes("travel")
  ) {
    return "MSTC Media, Sports & Tourism:\n\n- Sports event management (cricket, kabaddi, athletics)\n- Gujarat travel itineraries\n- Media production & broadcast coordination\n- Athlete management\n\n**Popular Gujarat Destinations:**\n- Rann of Kutch\n- Gir National Park\n- Somnath Temple\n- Dwarka\n- Statue of Unity\n- Ahmedabad Heritage\n\n[LINKS: Media/Sports/Tourism|/services/media-sports-tourism, Travel Itineraries|/services/media-sports-tourism/travel-itineraries]\n\nWhat else can I help you with?";
  }

  if (
    msg.includes("finance") ||
    msg.includes("investment") ||
    msg.includes("sip")
  ) {
    return "MSTC Finance & Investment Services:\n\n- Home loans (6.5-9% interest)\n- Business loans\n- Equity & VC funding\n- EMI calculation & planning\n- MSME loans\n- NRI investment guidance\n- SIP & mutual fund advisory\n- Property taxation guidance\n\n[LINKS: Finance & Investment|/services/finance, Home Loans|/services/finance/home-loans]\n\nWhat else can I help you with?";
  }

  if (
    msg.includes("infrastructure") ||
    msg.includes("construction") ||
    msg.includes("building")
  ) {
    return "MSTC Infrastructure & Property Division:\n\n- Residential, commercial & industrial construction\n- Project management services\n- Township development\n- Land acquisition guidance\n- Building approvals (AMC/AUDA)\n- Structural consulting\n\n[LINKS: Infrastructure & Property|/services/infrastructure]\n\nWhat else can I help you with?";
  }

  if (
    msg.includes("contact") ||
    msg.includes("phone") ||
    msg.includes("email") ||
    msg.includes("address")
  ) {
    return "**MSTC GLOBAL Contact Details:**\n\n📍 **Address:** 5, ShwetShikhar Society, Shantivan, Ahmedabad, Gujarat, India\n\n📱 **Mobile & WhatsApp:** +91 9512609016\n\n☎️ **Office:** +91 079-26638800\n\n📧 **Email:** mstc.gbl@gmail.com\n\n🌐 **Website:** https://mstcglobal-kh8.caffeine.xyz\n\n**MD:** Love Vijaybhai Parekh\n\n[SHOW_CONTACT: yes]\n\nWhat else can I help you with?";
  }

  // Generic helpful response
  return "Thank you for reaching out to MSTC GLOBAL! I'm here to help with any of our 8 service divisions:\n\n1. Infrastructure & Property\n2. RERA & PR Consulting\n3. Purchase / Rent / Redevelopment\n4. Finance & Investment\n5. Music & Cultural Services\n6. Hospitality & Events\n7. NGO & CSR Initiatives\n8. Media / Sports / Tourism\n\nPlease let me know which service you're interested in, or feel free to ask any question — I'm here to assist!\n\n[LINKS: Browse All Services|/#services, Property Portal|/properties]\n\nWhat else can I help you with?";
}

// ── Main exported function ───────────────────────────────────────────────────

export async function getAIResponse(
  message: string,
  history: OpenAIMessage[],
  language: string,
): Promise<string> {
  const settings = getAISettings();

  // Build full history with system prompt
  const systemPrompt = `${MSTC_KNOWLEDGE_BASE}\n\nCurrent language preference: ${language}. Respond in the same language the user writes in.`;

  const fullHistory: OpenAIMessage[] = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message },
  ];

  const providers: AIProvider[] = [
    settings.activeProvider,
    "openai",
    "gemini",
    "claude",
    "caffeine",
  ];

  // Deduplicate while preserving order
  const uniqueProviders = providers.filter((p, i, arr) => arr.indexOf(p) === i);

  let lastError = "";

  for (const provider of uniqueProviders) {
    try {
      let response = "";

      switch (provider) {
        case "openai": {
          const openaiKey = settings.openaiKey || "";
          if (!openaiKey) continue;
          response = await callOpenAI(fullHistory, openaiKey);
          break;
        }
        case "gemini": {
          const geminiKey = settings.geminiKey || "";
          if (!geminiKey) continue;
          response = await callGemini(fullHistory, geminiKey);
          break;
        }
        case "claude": {
          const claudeKey = settings.claudeKey || "";
          if (!claudeKey) continue;
          response = await callClaude(fullHistory, claudeKey);
          break;
        }
        case "caffeine": {
          response = await callCaffeineAI(fullHistory);
          break;
        }
      }

      if (response && response.trim().length > 0) {
        return response;
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      // Continue to next provider
    }
  }

  // All providers failed — return built-in response
  console.warn("All AI providers failed. Last error:", lastError);
  return generateKnowledgeResponse(message);
}

export { saveSettings };
