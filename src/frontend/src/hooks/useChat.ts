import { getAIResponse } from "@/utils/aiProviders";
import { useCallback, useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type {
  ChatMessage,
  Language,
  LeadQualificationState,
  OpenAIMessage,
  PropertyCard,
} from "../types/chat";
import { useActor } from "./useActor";

// ── MSTC System Prompt ────────────────────────────────────────────────────────
// ── Session memory helpers ───────────────────────────────────────────────────
function getSessionContext(): string {
  const topic = localStorage.getItem("mstc_last_topic");
  const name = localStorage.getItem("mstc_user_name");
  if (!topic && !name) return "";
  const parts: string[] = [];
  if (name) parts.push(`The user's name is ${name}. Address them by name.`);
  if (topic)
    parts.push(
      `This user was previously browsing the topic: "${topic}". Greet them with "Welcome back!" and ask if they want to continue from where they left off.`,
    );
  return parts.join(" ");
}

function saveTopicToSession(text: string): void {
  const topicMap: Record<string, string> = {
    rera: "RERA & PR Consulting",
    registration: "RERA Registration",
    "home loan": "Home Loans",
    loan: "Finance & Investment",
    emi: "EMI Calculation",
    wedding: "Hospitality & Events",
    event: "Hospitality & Events",
    ngo: "NGO & CSR Initiatives",
    csr: "CSR Services",
    music: "Music & Cultural Services",
    artist: "Artist Management",
    tourism: "Travel & Tourism",
    kutch: "Travel & Tourism",
    property: "Property Search",
    flat: "Property Search",
    apartment: "Property Search",
    redevelopment: "Society Redevelopment",
    invest: "Investment & Finance",
    roi: "Investment Analysis",
  };
  const lower = text.toLowerCase();
  for (const [kw, topic] of Object.entries(topicMap)) {
    if (lower.includes(kw)) {
      localStorage.setItem("mstc_last_topic", topic);
      return;
    }
  }
}

function extractNameFromMessage(text: string): void {
  const patterns = [
    /my name is ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    /i am ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    /i'm ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    /call me ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i,
    /mara naam ([A-Za-z]+(?: [A-Za-z]+)?)/i,
    /mera naam ([A-Za-z]+(?: [A-Za-z]+)?)/i,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match?.[1]) {
      localStorage.setItem("mstc_user_name", match[1].trim());
      return;
    }
  }
}

const MSTC_SYSTEM_PROMPT = `You are MSTC VIRTUAL ASSISTANT — the complete virtual staff of MSTC GLOBAL, a premier diversified conglomerate headquartered in Ahmedabad, Gujarat, India. You act as receptionist, sales agent, property consultant, finance advisor, legal guide, event coordinator, CSR advisor, media & tourism guide, and customer support — all in one. You are highly intelligent, warm, and knowledgeable — you answer every question thoroughly, from the most basic to the most complex.

COMPANY INFO:
- Name: MSTC GLOBAL
- MD: Love Vijaybhai Parekh
- Address: Ahmedabad, Gujarat, India
- Mobile & WhatsApp: +91 9512609016
- Office: +91 079-26638800
- Email: mstc.gbl@gmail.com
- Website: https://mstcglobal-kh8.caffeine.xyz

8 SERVICE DIVISIONS:
1. INFRASTRUCTURE & PROPERTY — Residential/commercial/industrial construction; MSTC as project manager; township development; land acquisition guidance; building approvals; AMC/AUDA regulations.
2. RERA & PR CONSULTING — RERA registration for promoters (Form REP-1, 30-60 days, requires architect certificate + land title + project details) and agents (Form REA-1, within 90 days of first transaction); GujRERA compliance; quarterly progress reports; RERA number tracking.
3. PURCHASE / RENT / REDEVELOPMENT — Property search assistance; residential & commercial rentals; rental agreement drafting; society redevelopment (requires 70% society consent, architect NOC, RERA approval); FSI guidance; stamp duty registration.
4. FINANCE & INVESTMENT — Home loans 6.5-9% interest (documents: salary slips 3 months, Form 16, bank statements 6 months, property papers, ID + address proof); business loans; equity/VC funding; EMI calculation; MSME loans; NRI investment guidance; SIP/mutual funds; taxation on property.
5. MUSIC & CULTURAL SERVICES — Artist management; music production studios; concert/event coordination; folk, classical & contemporary genres; heritage cultural events; Gujarati Garba/Dandiya events; national music competitions.
6. HOSPITALITY & EVENTS — Venue booking; wedding management; corporate events; conference planning; product launches; catering coordination; team outings; annual dinners; MICE (Meetings, Incentives, Conferences, Exhibitions).
7. NGO & CSR INITIATIVES — Section 8 company registration; CSR fund management (Companies Act 2013, 2% net profit mandate); Form CSR-1 filing; social impact programs; volunteer coordination; 80G tax exemption for donors; FCRA registration.
8. MEDIA / SPORTS / TOURISM — Sports event management (cricket tournaments, kabaddi, athletics, Pro Kabaddi connections); Gujarat travel itineraries (Rann of Kutch, Gir, Somnath, Dwarka, Ahmedabad heritage, Statue of Unity); media production; athlete management; broadcast coordination.

KEY FACTS (answer with full detail):
- RERA registration: 30-60 days, Form REP-1, architect certificate, land title, project layout plan, balance sheet, auditor certificate. GujRERA portal: rera.gujarat.gov.in
- Home loan typical processing: 7-15 working days after complete documents. LTV ratio up to 75-90% depending on loan amount.
- Redevelopment process: society resolution (70%+ consent) → architect NOC → municipal approval → RERA registration → individual consent letters → TDR/FSI calculation
- CSR compliance: Companies with turnover ≥ Rs.1000 Cr OR net profit ≥ Rs.5 Cr OR net worth ≥ Rs.500 Cr must spend 2% net profit on CSR.
- Section 8 company (NGO): minimum 2 directors, MOA/AOA filing, Form INC-12 to MCA, 80G + 12A registrations for tax exemption.
- Rental agreement Gujarat stamp duty: 0.25% of (total rent + deposit). Registration mandatory for leases >11 months.
- EMI formula: P × r × (1+r)^n / ((1+r)^n - 1) where P=principal, r=monthly rate, n=tenure months.
- Gujarat property stamp duty: 4.9% of property value; registration: 1% (max Rs.30,000).
- PMAY (Pradhan Mantri Awas Yojana): EWS category income ≤ Rs.3L, LIG ≤ Rs.6L, MIG-I ≤ Rs.12L, MIG-II ≤ Rs.18L.

NAVIGATION PAGES:
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
- /nri-corner (NRI Investment Corner)

BEHAVIOR RULES:
1. Be warm, professional, and genuinely helpful — like the most knowledgeable human staff member MSTC could have.
2. Give COMPLETE, SPECIFIC answers. Never say "please contact us" as your only answer — always answer the question first, then offer contact if needed.
3. Respond in the SAME LANGUAGE the user writes in: English, Gujarati, or Hindi.
4. After answering, include 1-3 relevant page links in this exact format: [LINKS: label1|/path1, label2|/path2]
5. When recommending properties, include: [PROPERTY_SEARCH: yes]
6. Every 3rd message or when user seems stuck: [SHOW_CONTACT: yes]
7. If you cannot resolve after 3 exchanges on the same topic: [ESCALATE: yes]
8. Use bullet points for lists. Use Rs. or ₹ for Indian Rupees.
9. End answers with an engaging follow-up like "What else can I help you with?"
10. You can answer ANY question — general knowledge, calculations, explanations — not just MSTC topics.

INVESTMENT ANALYSIS CAPABILITY:
When a user asks "Is this a good investment?", asks about ROI, pastes property details, or asks about returns/yield/appreciation:
- Automatically compute: EMI at current home loan rates (8.5–9% for 20 years using formula P×r×(1+r)^n/((1+r)^n-1))
- Rental yield estimate: 2.5–4% annually in Ahmedabad depending on area (IT/commercial zones higher)
- 10-year price appreciation: 5–8% CAGR in Ahmedabad (premium areas 8–10%)
- Tax benefits: Section 80C deduction up to Rs.1.5L on principal; Section 24 deduction up to Rs.2L on interest
- Present the analysis in a clear table or bullet format with actual numbers
- Conclude with a clear recommendation (good/moderate/caution) with reasons
- Always show the formula/working so the user trusts the numbers

RETURNING USER PROTOCOL:
If the system context contains a previous topic or user name, immediately use it in your very first reply — greet them warmly by name if known, and ask if they want to continue from their previous topic.`;

// ── Parse OpenAI response ─────────────────────────────────────────────────────
interface ParsedResponse {
  text: string;
  links: Array<{ label: string; path: string }>;
  showContact: boolean;
  escalate: boolean;
  propertySearch: boolean;
}

function parseAIResponse(raw: string): ParsedResponse {
  let text = raw;
  const links: Array<{ label: string; path: string }> = [];
  let showContact = false;
  let escalate = false;
  let propertySearch = false;

  const linksRegex = /\[LINKS:\s*([^\]]+)\]/g;
  let found: RegExpExecArray | null = linksRegex.exec(raw);
  while (found !== null) {
    const parts = found[1].split(",");
    for (const part of parts) {
      const [label, path] = part.split("|").map((s) => s.trim());
      if (label && path) links.push({ label, path });
    }
    found = linksRegex.exec(raw);
  }
  text = text.replace(/\[LINKS:[^\]]+\]/g, "").trim();
  if (/\[SHOW_CONTACT:\s*yes\]/i.test(text)) {
    showContact = true;
    text = text.replace(/\[SHOW_CONTACT:\s*yes\]/gi, "").trim();
  }
  if (/\[ESCALATE:\s*yes\]/i.test(text)) {
    escalate = true;
    showContact = true;
    text = text.replace(/\[ESCALATE:\s*yes\]/gi, "").trim();
  }
  if (/\[PROPERTY_SEARCH:\s*yes\]/i.test(text)) {
    propertySearch = true;
    text = text.replace(/\[PROPERTY_SEARCH:\s*yes\]/gi, "").trim();
  }

  return { text, links, showContact, escalate, propertySearch };
}

// ── Smart keyword-based fallback responses ────────────────────────────────────
const KEYWORD_RESPONSES: Array<{
  keywords: string[];
  answer: (lang: Language) => string;
  links: Array<{ label: string; path: string }>;
}> = [
  {
    keywords: ["rera", "registration", "gujrera", "promoter", "agent reg"],
    answer: (lang) =>
      lang === "hi"
        ? "RERA registration ke liye MSTC poori madad karta hai. Promoter registration mein Form REP-1, architect certificate, land title aur project details chahiye — 30-60 din mein complete hoti hai. Agent registration ke liye Form REA-1 — pehle transaction ke 90 din ke andar. Aaj appointment book karein!"
        : lang === "gu"
          ? "RERA registration mate MSTC poori madad kare che. Promoter mate Form REP-1, architect certificate, land title — 30-60 din ma complete. Agent mate Form REA-1, pehla transaction na 90 din ma. Appointment booking mate contact karo!"
          : "MSTC provides complete RERA registration support. For promoters: Form REP-1, architect certificate, land title + project documents — completed in 30-60 days. For agents: Form REA-1 within 90 days of your first transaction. Our team handles all GujRERA compliance and quarterly progress reports. Ready to get started?",
    links: [
      { label: "RERA & PR Consulting", path: "/services/rera-consulting" },
      {
        label: "Promoter Registration",
        path: "/services/rera-consulting/promoter-registration",
      },
    ],
  },
  {
    keywords: [
      "home loan",
      "loan",
      "emi",
      "finance",
      "interest rate",
      "mortgage",
    ],
    answer: (lang) =>
      lang === "hi"
        ? "Home loan interest rates abhi 6.5% se 9% per annum hain. Documents chahiye: 3 mahine ki salary slips, Form 16, 6 mahine ke bank statements, property papers, ID aur address proof. Processing 7-15 working days mein hoti hai. MSTC aapko best bank deals dilata hai!"
        : lang === "gu"
          ? "Home loan interest 6.5% thi 9% per annum che. Documents: 3 mahina salary slips, Form 16, 6 mahina bank statements, property papers, ID + address proof. 7-15 working days ma process thashe. MSTC best bank deal apavse!"
          : "Current home loan interest rates range from 6.5% to 9% p.a. Required documents: 3 months salary slips, Form 16, 6 months bank statements, property documents, ID & address proof. Typically processed in 7–15 working days. MSTC helps you compare and get the best deal across multiple banks and NBFCs.",
    links: [
      { label: "Finance & Investment", path: "/services/finance" },
      { label: "Home Loans", path: "/services/finance/home-loans" },
    ],
  },
  {
    keywords: ["wedding", "event", "venue", "corporate", "conference", "party"],
    answer: (lang) =>
      lang === "hi"
        ? "MSTC GLOBAL Ahmedabad mein premium events manage karta hai — shaadi, corporate events, conferences, product launches, team outings, annual dinners. Venue shortlisting, catering coordination, AV setup — sab kuch! Apna event date batao."
        : lang === "gu"
          ? "MSTC GLOBAL premium events manage kare che — lagna, corporate events, conferences, product launches. Venue selection thi catering coordination sudhi sab kuch. Tamara event date janavao!"
          : "MSTC GLOBAL manages premium events across Ahmedabad — weddings, corporate gatherings, conferences, product launches, team outings & annual dinners. We handle venue shortlisting, catering coordination, AV setup, décor, and guest management end-to-end. Share your event date and we'll plan it perfectly!",
    links: [
      {
        label: "Hospitality & Events",
        path: "/services/hospitality-events",
      },
      {
        label: "Venue Booking",
        path: "/services/hospitality-events/venue-booking",
      },
    ],
  },
  {
    keywords: [
      "ngo",
      "csr",
      "section 8",
      "nonprofit",
      "charity",
      "social",
      "volunteer",
    ],
    answer: (lang) =>
      lang === "hi"
        ? "MSTC NGO & CSR division Section 8 company registration, 80G + 12A certificates, CSR fund management aur social impact programs handle karta hai. Companies Act 2013 ke anusaar companies jinka net profit ≥ Rs.5 Cr, unhe 2% CSR spend karna mandatory hai. Madad chahiye?"
        : lang === "gu"
          ? "MSTC NGO & CSR division Section 8 registration, 80G + 12A, CSR fund management handle kare che. Net profit ≥ Rs.5 Cr hoy tevi companies ne 2% CSR spend mandatory che. Madad joie?"
          : "MSTC's NGO & CSR division assists with Section 8 company registration, 80G + 12A tax exemption certificates, and CSR fund management. Companies with net profit ≥ Rs.5 Cr must spend 2% on CSR (Companies Act 2013). We also handle FCRA registration for foreign funds and design complete social impact programs.",
    links: [
      { label: "NGO & CSR Services", path: "/services/ngo-csr" },
      {
        label: "CSR Fund Management",
        path: "/services/ngo-csr/csr-fund-management",
      },
    ],
  },
  {
    keywords: ["music", "artist", "concert", "cultural", "folk", "classical"],
    answer: (lang) =>
      lang === "hi"
        ? "MSTC Music & Cultural division artist management, music production studios, concerts, Gujarati Garba/Dandiya events aur national competitions coordinate karta hai. Apna artist profile share karein!"
        : lang === "gu"
          ? "MSTC Music & Cultural division artist management, music production, concerts, Garba/Dandiya events coordinate kare che. Tamaro artist profile share karo!"
          : "MSTC's Music & Cultural Services division handles artist management, music production studios, concerts, Gujarati Garba & Dandiya events, classical performances, and national cultural competitions. We represent artists across folk, classical, and contemporary genres.",
    links: [
      {
        label: "Music & Cultural Services",
        path: "/services/music-cultural",
      },
      {
        label: "Artist Management",
        path: "/services/music-cultural/artist-management",
      },
    ],
  },
  {
    keywords: ["tourism", "travel", "kutch", "gir", "somnath", "itinerary"],
    answer: (lang) =>
      lang === "hi"
        ? "MSTC Gujarat ke liye customized travel itineraries banata hai — Rann of Kutch, Gir National Park, Somnath, Dwarka, Ahmedabad Heritage Walk, Statue of Unity. Sports events coordination aur media production bhi. Apna preferred destination batao!"
        : lang === "gu"
          ? "MSTC Gujarat mate customized itineraries banave che — Rann of Kutch, Gir, Somnath, Dwarka, Ahmedabad Heritage, Statue of Unity. Sports events aur media production pan. Destination batavo!"
          : "MSTC crafts customized Gujarat travel itineraries — Rann of Kutch festival packages, Gir National Park wildlife tours, Somnath/Dwarka pilgrimage circuits, Ahmedabad Heritage Walk, and Statue of Unity trips. We also manage sports events (cricket, kabaddi) and media productions.",
    links: [
      {
        label: "Media, Sports & Tourism",
        path: "/services/media-sports-tourism",
      },
      {
        label: "Travel Itineraries",
        path: "/services/media-sports-tourism/travel-itineraries",
      },
    ],
  },
  {
    keywords: ["redevelopment", "society", "fsi", "tdr", "demolish"],
    answer: (lang) =>
      lang === "hi"
        ? "Society redevelopment process: society resolution (70%+ members ka consent) → architect NOC → municipal approval → RERA registration → individual consent letters → TDR/FSI calculation. MSTC poori process manage karta hai. Kya aapki society redevelopment ke liye ready hai?"
        : lang === "gu"
          ? "Society redevelopment: society resolution (70%+ members consent) → architect NOC → municipal approval → RERA registration → individual consent letters → TDR/FSI. MSTC poori process manage kare che."
          : "Society redevelopment follows this process: society resolution (70%+ member consent) → architect NOC → AMC/municipal approval → RERA registration → individual consent letters → TDR/FSI calculation → new construction. MSTC manages the entire process — from society meetings to possession handover.",
    links: [
      { label: "Redevelopment Services", path: "/services/purchase-rent" },
      {
        label: "Redevelopment Details",
        path: "/services/purchase-rent/redevelopment",
      },
    ],
  },
  {
    keywords: ["nri", "overseas", "foreign", "abroad", "dollar", "uae", "usa"],
    answer: (lang) =>
      lang === "hi"
        ? "NRIs FEMA regulations ke under India mein residential aur commercial property khareed sakte hain (agricultural land, plantation, farmhouse ko chhod ke). Home loan bhi mil sakta hai. NRI Corner mein sabhi details dekhein!"
        : lang === "gu"
          ? "NRIs FEMA under India ma residential aur commercial property kharidi shake che. Home loan pan mali shake. NRI Corner ma badhi details juo!"
          : "NRIs can invest in Indian residential and commercial properties under FEMA regulations (excluding agricultural land, plantation properties, and farmhouses). Home loans are available to NRIs from Indian banks. MSTC specializes in NRI investment guidance — currency conversion, repatriation rules, TDS on property, and complete end-to-end facilitation.",
    links: [
      { label: "NRI Investment Corner", path: "/nri-corner" },
      { label: "Finance & Investment", path: "/services/finance" },
    ],
  },
];

function getKeywordResponse(
  text: string,
  lang: Language,
): { answer: string; links: Array<{ label: string; path: string }> } | null {
  const lower = text.toLowerCase();
  for (const entry of KEYWORD_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { answer: entry.answer(lang), links: entry.links };
    }
  }
  return null;
}

// ── Browser Speech API types ──────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

const SESSION_ID = Math.random().toString(36).substring(2, 18);

// ── UI translations ──────────────────────────────────────────────────────────
const T: Record<Language, Record<string, string>> = {
  en: {
    welcome:
      "Namaste! 🙏 Welcome to MSTC GLOBAL. I'm your AI assistant — trained across all 8 of our service divisions. I can help with real estate, finance, RERA, events, NGO setup, travel itineraries, and much more. Ask me anything — from the simplest to the most complex question! What can I help you with today?",
    fallback:
      "Thank you for your question! Our AI assistant requires an API key to provide intelligent responses. For immediate assistance, please call or WhatsApp us at +91 9512609016. Our team is available Mon–Sat, 9 AM–7 PM IST.",
    noKeyMsg:
      "To enable full AI intelligence, please configure your OpenAI API key in the chat settings. In the meantime, I can still help with common MSTC questions! Try asking about RERA, home loans, events, or properties.",
    propertySearch:
      "Here are some properties matching your search. Tap Enquire on any listing to get in touch:",
    noPropertiesFound:
      "Let me show you our full property portal where you can filter by all your preferences:",
    qualifyBudget:
      "I'd love to help you find the perfect property! 🏠 What is your approximate budget? (e.g. Rs.30 lakhs, Rs.1 crore, or monthly rent Rs.15,000)",
    qualifyLocation:
      "Great choice! Which area or locality in Ahmedabad are you looking at? (e.g. Satellite, Bopal, SG Highway, Navrangpura, Thaltej)",
    qualifyIntent:
      "Perfect! Are you looking to Buy, Rent, Lease, or Invest in a property?",
    qualifyDone:
      "Excellent! Your requirements have been noted. 🌟 Our property expert will reach out to you shortly on WhatsApp. You can also browse our full portal right now:",
  },
  gu: {
    welcome:
      "Namaste! 🙏 MSTC GLOBAL ma swagat che. Hu tamaro AI Assistant chu — real estate, finance, RERA, events, NGO ane tamam 8 services ma madad kari shaku. Koi pan prashna pucho! Aaje shu help kari shaku?",
    fallback:
      "Tamaro prashna mate aabhar! Turant madad mate +91 9512609016 par call/WhatsApp karo. Team Mon–Sat, 9 AM–7 PM available che.",
    noKeyMsg:
      "Full AI intelligence mate API key configure karo. Tyare sudhi RERA, home loan, events, properties — common prashno nu jawab aapi shaku!",
    propertySearch: "Tamari search mujab properties:",
    noPropertiesFound: "Amara property portal ma juo:",
    qualifyBudget:
      "Property ma madad karish! 🏠 Budget approx. ketlo che? (e.g. Rs.30 lakh, Rs.1 crore, month Rs.15,000)",
    qualifyLocation:
      "Ahmedabad ma kai locality? (e.g. Satellite, Bopal, Navrangpura, SG Highway)",
    qualifyIntent: "Buy, Rent, Lease, ke Invest — shu icho?",
    qualifyDone: "Note karyu! 🌟 Expert jald WhatsApp par contact karshe.",
  },
  hi: {
    welcome:
      "Namaste! 🙏 MSTC GLOBAL mein aapka swagat hai. Main AI Assistant hun — real estate, finance, RERA, events aur NGO sahit sabhi 8 services mein madad karta hun. Kuch bhi puchein! Aaj kaise sahayata karun?",
    fallback:
      "Aapke sawaal ke liye shukriya! Turant sahayata ke liye +91 9512609016 par call/WhatsApp karen.",
    noKeyMsg:
      "Full AI ke liye API key configure karein. Tab tak RERA, home loan, events, properties ke bare mein pooch sakte hain!",
    propertySearch: "Aapki search ke anusar properties:",
    noPropertiesFound: "Hamare property portal mein dekhen:",
    qualifyBudget:
      "Sahi property dhundhne mein madad karunga! 🏠 Budget kitna hai? (jaise Rs.30 lakh, Rs.1 crore, kiraya Rs.15,000/mah)",
    qualifyLocation:
      "Ahmedabad mein kaun si locality? (jaise Satellite, Bopal, Navrangpura)",
    qualifyIntent: "Buy, Rent, Lease, ya Invest — kya chahiye?",
    qualifyDone: "Note kar liya! 🌟 Expert jald WhatsApp karenge.",
  },
};

// ── Property samples ──────────────────────────────────────────────────────────
const PROPERTY_SAMPLES: PropertyCard[] = [
  {
    id: "p1",
    title: "2 BHK Flat in Satellite",
    price: "Rs.62 Lakhs",
    location: "Satellite, Ahmedabad",
    bhk: "2 BHK",
    image: "",
    action: "/properties",
    propertyType: "Apartment",
    sqft: "985 sq ft",
    furnishing: "Semi-Furnished",
  },
  {
    id: "p2",
    title: "3 BHK Apartment — Bopal",
    price: "Rs.88 Lakhs",
    location: "Bopal, Ahmedabad",
    bhk: "3 BHK",
    image: "",
    action: "/properties",
    propertyType: "Apartment",
    sqft: "1,420 sq ft",
    furnishing: "Unfurnished",
  },
  {
    id: "p3",
    title: "1 BHK Rental — Navrangpura",
    price: "Rs.14,000/mo",
    location: "Navrangpura, Ahmedabad",
    bhk: "1 BHK",
    image: "",
    action: "/properties",
    propertyType: "Apartment",
    sqft: "560 sq ft",
    furnishing: "Furnished",
  },
  {
    id: "p4",
    title: "4 BHK Villa — Thaltej",
    price: "Rs.2.1 Crores",
    location: "Thaltej, Ahmedabad",
    bhk: "4 BHK",
    image: "",
    action: "/properties",
    propertyType: "Villa",
    sqft: "3,200 sq ft",
    furnishing: "Semi-Furnished",
  },
  {
    id: "p5",
    title: "Commercial Office — SG Highway",
    price: "Rs.55,000/mo",
    location: "SG Highway, Ahmedabad",
    bhk: "Office",
    image: "",
    action: "/properties",
    propertyType: "Commercial",
    sqft: "1,800 sq ft",
    furnishing: "Bare Shell",
  },
  {
    id: "p6",
    title: "2 BHK Budget Flat — Gota",
    price: "Rs.38 Lakhs",
    location: "Gota, Ahmedabad",
    bhk: "2 BHK",
    image: "",
    action: "/properties",
    propertyType: "Apartment",
    sqft: "880 sq ft",
    furnishing: "Unfurnished",
  },
  {
    id: "p7",
    title: "1 BHK Flat — Chandkheda",
    price: "Rs.22 Lakhs",
    location: "Chandkheda, Ahmedabad",
    bhk: "1 BHK",
    image: "",
    action: "/properties",
    propertyType: "Apartment",
    sqft: "480 sq ft",
    furnishing: "Unfurnished",
  },
  {
    id: "p8",
    title: "2 BHK Premium — Prahlad Nagar",
    price: "Rs.95 Lakhs",
    location: "Prahlad Nagar, Ahmedabad",
    bhk: "2 BHK",
    image: "",
    action: "/properties",
    propertyType: "Apartment",
    sqft: "1,150 sq ft",
    furnishing: "Fully Furnished",
  },
  {
    id: "p9",
    title: "Residential Plot — Shela",
    price: "Rs.45 Lakhs",
    location: "Shela, Ahmedabad",
    bhk: "Plot",
    image: "",
    action: "/properties",
    propertyType: "Plot",
    sqft: "1,200 sq ft",
  },
  {
    id: "p10",
    title: "2 BHK Rent — Maninagar",
    price: "Rs.10,500/mo",
    location: "Maninagar, Ahmedabad",
    bhk: "2 BHK",
    image: "",
    action: "/properties",
    propertyType: "Apartment",
    sqft: "780 sq ft",
    furnishing: "Semi-Furnished",
  },
];

const PROPERTY_KEYWORDS = [
  "buy",
  "rent",
  "flat",
  "apartment",
  "house",
  "property",
  "bhk",
  "commercial",
  "invest",
  "plot",
  "villa",
  "office",
  "2bhk",
  "3bhk",
  "1bhk",
  "4bhk",
  "show me",
  "find",
  "search property",
  "properties",
  "listing",
];

const SERVICE_PAGES_NAV = [
  {
    keywords: ["infrastructure", "construction", "building", "township"],
    path: "/services/infrastructure",
    label: "Infrastructure & Property",
  },
  {
    keywords: [
      "rera",
      "compliance",
      "promoter",
      "agent registration",
      "gujrera",
    ],
    path: "/services/rera-consulting",
    label: "RERA & PR Consulting",
  },
  {
    keywords: [
      "purchase",
      "buy",
      "rent",
      "rental",
      "redevelopment",
      "flat",
      "apartment",
    ],
    path: "/services/purchase-rent",
    label: "Purchase, Rent & Redevelopment",
  },
  {
    keywords: [
      "finance",
      "loan",
      "home loan",
      "investment",
      "business loan",
      "emi",
      "equity",
    ],
    path: "/services/finance",
    label: "Finance & Investment",
  },
  {
    keywords: [
      "music",
      "artist",
      "cultural",
      "folk",
      "classical",
      "singer",
      "concert",
    ],
    path: "/services/music-cultural",
    label: "Music & Cultural Services",
  },
  {
    keywords: [
      "hospitality",
      "event",
      "wedding",
      "venue",
      "conference",
      "catering",
    ],
    path: "/services/hospitality-events",
    label: "Hospitality & Events",
  },
  {
    keywords: [
      "ngo",
      "csr",
      "social",
      "volunteer",
      "community",
      "charity",
      "nonprofit",
    ],
    path: "/services/ngo-csr",
    label: "NGO & CSR Initiatives",
  },
  {
    keywords: [
      "media",
      "sports",
      "tourism",
      "travel",
      "cricket",
      "itinerary",
      "film",
      "athlete",
    ],
    path: "/services/media-sports-tourism",
    label: "Media, Sports & Tourism",
  },
];

function isPropertyQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return PROPERTY_KEYWORDS.some((kw) => lower.includes(kw));
}

function detectLanguage(text: string): Language {
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  return "en";
}

function parsePropertySearch(text: string): PropertyCard[] {
  const lower = text.toLowerCase();
  return PROPERTY_SAMPLES.filter((p) => {
    const loc = p.location.toLowerCase();
    const title = p.title.toLowerCase();
    const bhkMatch = /([1-4])\s*bhk/.exec(lower);
    if (bhkMatch && !title.includes(`${bhkMatch[1]} bhk`)) return false;
    if (lower.includes("commercial") && p.propertyType !== "Commercial")
      return false;
    if (lower.includes("plot") && p.propertyType !== "Plot") return false;
    if (lower.includes("villa") && p.propertyType !== "Villa") return false;
    const areas = [
      "satellite",
      "bopal",
      "navrangpura",
      "thaltej",
      "gota",
      "sg highway",
      "maninagar",
      "paldi",
      "chandkheda",
      "vastral",
      "prahlad nagar",
      "shela",
    ];
    const mentionedArea = areas.find((a) => lower.includes(a));
    if (mentionedArea && !loc.includes(mentionedArea)) return false;
    return true;
  }).slice(0, 3);
}

// ── Welcome message ───────────────────────────────────────────────────────────
const WELCOME = (): ChatMessage => ({
  id: "welcome",
  role: "bot",
  text: T.en.welcome,
  timestamp: Date.now(),
  links: [
    { label: "Our Services", path: "/#services" },
    { label: "Properties Portal", path: "/properties" },
    { label: "Contact Us", path: "/#contact" },
  ],
});

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useChat() {
  const { actor, isFetching } = useActor(createActor);
  const [language, setLanguage] = useState<Language>("en");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [WELCOME()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Full OpenAI conversation history (multi-turn) — inject session context
  const sessionCtx = getSessionContext();
  const systemPrompt = sessionCtx
    ? `${MSTC_SYSTEM_PROMPT}\n\nSESSION CONTEXT: ${sessionCtx}`
    : MSTC_SYSTEM_PROMPT;
  const aiHistory = useRef<OpenAIMessage[]>([
    { role: "system", content: systemPrompt },
  ]);

  // Lead qualification state
  const leadState = useRef<LeadQualificationState>({
    active: false,
    step: 0,
    budget: "",
    area: "",
    intent: "",
    done: false,
  });

  // Periodic contact nudge counter
  const msgCount = useRef(0);

  // Escalation tracker (same topic)
  const topicTracker = useRef<{ topic: string; count: number }>({
    topic: "",
    count: 0,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }, []);

  const addBotMessage = useCallback(
    (
      text: string,
      links: Array<{ label: string; path: string }> = [],
      opts?: {
        propertyCards?: PropertyCard[];
        showContact?: boolean;
        isEscalated?: boolean;
        isApiKeyMissing?: boolean;
      },
    ) => {
      const msg: ChatMessage = {
        id: `b-${Date.now()}-${Math.random()}`,
        role: "bot",
        text,
        timestamp: Date.now(),
        links,
        propertyCards: opts?.propertyCards,
        showContact: opts?.showContact,
        isEscalated: opts?.isEscalated,
        isApiKeyMissing: opts?.isApiKeyMissing,
      };
      setMessages((prev) => [...prev, msg]);
      return msg;
    },
    [],
  );

  const logInteraction = useCallback(
    (userMsg: string, botMsg: string) => {
      if (!actor || isFetching) return;
      (
        actor as unknown as {
          logChatInteraction: (
            sid: string,
            uMsg: string,
            bMsg: string,
          ) => Promise<bigint>;
        }
      )
        .logChatInteraction(SESSION_ID, userMsg, botMsg)
        .catch(() => {});
    },
    [actor, isFetching],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Language detection
      const detectedLang = detectLanguage(trimmed);
      const activeLang = detectedLang !== "en" ? detectedLang : language;
      if (detectedLang !== "en") setLanguage(detectedLang);
      const t = T[activeLang];

      // Save topic & name to session memory
      saveTopicToSession(trimmed);
      extractNameFromMessage(trimmed);

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);
      msgCount.current += 1;

      const ls = leadState.current;

      // ── Lead qualification (local flow) ─────────────────────────────────
      if (ls.active) {
        setIsTyping(false);
        if (ls.step === 1) {
          leadState.current = { ...ls, budget: trimmed, step: 2 };
          addBotMessage(t.qualifyLocation);
          scrollToBottom();
          logInteraction(trimmed, t.qualifyLocation);
          return;
        }
        if (ls.step === 2) {
          leadState.current = { ...ls, area: trimmed, step: 3 };
          addBotMessage(t.qualifyIntent);
          scrollToBottom();
          return;
        }
        if (ls.step === 3) {
          const score = /buy|purchase|invest/i.test(trimmed)
            ? "Hot"
            : /rent/i.test(trimmed)
              ? "Warm"
              : "Cold";
          leadState.current = {
            ...ls,
            intent: trimmed,
            active: false,
            done: true,
          };
          addBotMessage(t.qualifyDone, [
            { label: "Browse Properties", path: "/properties" },
          ]);
          scrollToBottom();
          logInteraction(
            `[LEAD][${score}] Budget:${ls.budget} | Area:${ls.area} | Intent:${trimmed}`,
            t.qualifyDone,
          );
          if (actor && !isFetching) {
            (
              actor as unknown as {
                submitLeadQualification: (
                  sid: string,
                  answers: string,
                ) => Promise<string>;
              }
            )
              .submitLeadQualification(
                SESSION_ID,
                JSON.stringify({
                  budget: ls.budget,
                  area: ls.area,
                  intent: trimmed,
                  score,
                }),
              )
              .catch(() => {});
          }
          return;
        }
      }

      // ── Property search detection ────────────────────────────────────────
      const isPropSearch = isPropertyQuery(trimmed);

      // ── OpenAI history ───────────────────────────────────────────────────
      const langHint =
        activeLang === "gu"
          ? " Please respond in Gujarati."
          : activeLang === "hi"
            ? " Please respond in Hindi."
            : "";

      aiHistory.current.push({ role: "user", content: trimmed + langHint });

      // Trim to 23 entries (system + 22 turns)
      if (aiHistory.current.length > 23) {
        aiHistory.current = [
          aiHistory.current[0],
          ...aiHistory.current.slice(-22),
        ];
      }

      // Topic escalation
      const topicMatch = SERVICE_PAGES_NAV.find((s) =>
        s.keywords.some((kw) => trimmed.toLowerCase().includes(kw)),
      );
      if (topicMatch) {
        if (topicTracker.current.topic === topicMatch.path) {
          topicTracker.current.count += 1;
        } else {
          topicTracker.current = { topic: topicMatch.path, count: 1 };
        }
      }
      const shouldEscalate = topicTracker.current.count >= 3;
      const shouldShowContact = msgCount.current % 3 === 0;

      let botText = "";
      let links: Array<{ label: string; path: string }> = [];
      let showContact = shouldShowContact || shouldEscalate;
      let isEscalated = false;

      // ── Try AI providers ─────────────────────────────────────────────────
      try {
        const aiRaw = await getAIResponse(
          trimmed,
          aiHistory.current.slice(1).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          activeLang,
        );
        const parsed = parseAIResponse(aiRaw);
        botText = parsed.text;
        if (parsed.links.length > 0) links = parsed.links;
        showContact = showContact || parsed.showContact || parsed.escalate;
        isEscalated = parsed.escalate || shouldEscalate;
        aiHistory.current.push({ role: "assistant", content: aiRaw });

        if ((parsed.propertySearch || isPropSearch) && !ls.done) {
          const cards = parsePropertySearch(trimmed);
          addBotMessage(
            botText,
            cards.length > 0
              ? links
              : [
                  ...links,
                  { label: "Browse Property Portal", path: "/properties" },
                ],
            {
              propertyCards: cards.length > 0 ? cards : undefined,
              showContact,
              isEscalated,
            },
          );
          if (!ls.done && !ls.active) {
            setTimeout(() => {
              leadState.current = {
                ...leadState.current,
                active: true,
                step: 1,
              };
              setMessages((prev) => [
                ...prev,
                {
                  id: `b-qualify-${Date.now()}`,
                  role: "bot" as const,
                  text: T[activeLang].qualifyBudget,
                  timestamp: Date.now(),
                  links: [],
                },
              ]);
              scrollToBottom();
            }, 1000);
          }
          setIsTyping(false);
          scrollToBottom();
          logInteraction(trimmed, botText);
          return;
        }
      } catch (e) {
        console.warn("AI provider error, falling back:", e);
      }

      // ── No API key or OpenAI failed — try backend then keyword fallback ──
      if (!botText) {
        // Try backend getBotResponse
        if (actor && !isFetching) {
          try {
            botText = await (
              actor as unknown as {
                getBotResponse: (msg: string) => Promise<string>;
              }
            ).getBotResponse(trimmed);
          } catch {
            /* ignore */
          }
        }
      }

      // ── Keyword matching fallback ────────────────────────────────────────
      if (!botText) {
        const kwResult = getKeywordResponse(trimmed, activeLang);
        if (kwResult) {
          botText = kwResult.answer;
          links = kwResult.links;
        } else if (isPropSearch) {
          const cards = parsePropertySearch(trimmed);
          const propText =
            cards.length > 0 ? t.propertySearch : t.noPropertiesFound;
          addBotMessage(
            propText,
            cards.length > 0
              ? []
              : [{ label: "Property Portal", path: "/properties" }],
            {
              propertyCards: cards.length > 0 ? cards : undefined,
              showContact: true,
            },
          );
          setIsTyping(false);
          scrollToBottom();
          logInteraction(trimmed, propText);
          return;
        } else {
          // Generic helpful fallback
          botText = t.fallback;
          links = [
            { label: "Browse All Services", path: "/#services" },
            { label: "Contact Us", path: "/#contact" },
          ];
          showContact = true;
        }
      }

      if (!botText) botText = t.fallback;

      setIsTyping(false);
      addBotMessage(botText, links, {
        showContact,
        isEscalated,
      });

      if (isEscalated) {
        logInteraction(
          `[ESCALATION] Session:${SESSION_ID} Turns:${topicTracker.current.count}`,
          botText,
        );
      } else {
        logInteraction(trimmed, botText);
      }

      scrollToBottom();
    },
    [
      actor,
      isFetching,
      language,
      addBotMessage,
      scrollToBottom,
      logInteraction,
    ],
  );

  return {
    messages,
    input,
    setInput,
    isTyping,
    sendMessage,
    bottomRef,
    language,
    setLanguage,
  };
}
