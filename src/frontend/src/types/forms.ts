// Re-export backend types so UI can import from a single forms types module.
// These interfaces exactly mirror the Motoko/Candid generated types in backend.ts.
export type {
  Feedback,
  CallbackRequest,
  QuoteRequest,
  MoreInfoRequest,
  SupportForm,
  FormStats,
} from "../backend";
