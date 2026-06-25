export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: number;
  links?: Array<{ label: string; path: string }>;
  propertyCards?: PropertyCard[];
  showContact?: boolean;
  isEscalated?: boolean;
  leadFormStep?: LeadFormStep;
  isApiKeyMissing?: boolean;
}

export type Language = "en" | "gu" | "hi";

export interface PropertyCard {
  id: string;
  title: string;
  price: string;
  location: string;
  bhk: string;
  image: string;
  action: string;
  propertyType: string;
  sqft?: string;
  furnishing?: string;
  possession?: string;
}

export interface LeadQualificationState {
  active: boolean;
  step: 0 | 1 | 2 | 3;
  budget: string;
  area: string;
  intent: string;
  done: boolean;
}
export type LeadFormStep = "budget" | "location" | "intent" | "contact";

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatInteraction {
  id: bigint;
  sessionId: string;
  userMessage: string;
  botResponse: string;
  sentimentTag: string;
  timestamp: bigint;
}

export interface InteractionStats {
  total: bigint;
  todayCount: bigint;
  needsAttentionCount: bigint;
  avgMessageLength: bigint;
}
