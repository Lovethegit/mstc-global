// TypeScript types matching backend PropertyListing and PropertyEnquiry

export interface PropertyListing {
  id: string;
  title: string;
  propertyType: string;
  action: string;
  bhk: string;
  sqft: bigint;
  price: bigint;
  priceDisplay: string;
  address: string;
  location: string;
  city: string;
  furnishing: string;
  possession: string;
  facing: string;
  floorNo: bigint;
  description: string;
  amenities: string[];
  images: string[];
  mapLink: string;
  sourceTag: string;
  listedDate: string;
  agencyName: string;
  agencyPhone: string;
  isPreLaunch?: boolean;
  constructionStage?: string;
  possessionDate?: string;
  builderName?: string;
  societyName?: string;
  // owner fields omitted — only visible on admin dashboard
}

export interface PropertyEnquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyType: string;
  propertyBhk: string;
  propertySqft: bigint;
  propertyPrice: string;
  propertyAddress: string;
  sourceTag: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerMessage: string;
  preferredTime: string;
  visitDate: string;
  status: string;
  submittedAt: bigint;
  contactedAt?: bigint;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  agencyName: string;
  agencyPhone: string;
  notes: string;
}

export type PortalState = "selection" | "portal";

export type SourceTab = "99acres" | "MagicBricks" | "Housing.com";

export type SortOption = "newest" | "price-asc" | "price-desc" | "area-asc";

export interface PropertyFilters {
  propertyType: string;
  action: string;
  location: string;
  budgetRange: string;
  bhk: string;
  furnishing: string;
  possession: string;
}

export const DEFAULT_FILTERS: PropertyFilters = {
  propertyType: "",
  action: "",
  location: "",
  budgetRange: "",
  bhk: "",
  furnishing: "",
  possession: "",
};

export interface BudgetRange {
  label: string;
  min: number;
  max: number;
}

export const BUY_BUDGET_RANGES: BudgetRange[] = [
  { label: "Any", min: 0, max: 999999999999 },
  { label: "Under \u20b910L", min: 0, max: 1000000 },
  { label: "\u20b910\u201320L", min: 1000000, max: 2000000 },
  { label: "\u20b920\u201330L", min: 2000000, max: 3000000 },
  { label: "\u20b930\u201350L", min: 3000000, max: 5000000 },
  { label: "\u20b950\u201375L", min: 5000000, max: 7500000 },
  { label: "\u20b975L\u20131Cr", min: 7500000, max: 10000000 },
  { label: "\u20b91\u20132Cr", min: 10000000, max: 20000000 },
  { label: "\u20b92\u20135Cr", min: 20000000, max: 50000000 },
  { label: "Above \u20b95Cr", min: 50000000, max: 999999999999 },
];

export const RENT_BUDGET_RANGES: BudgetRange[] = [
  { label: "Any", min: 0, max: 999999999999 },
  { label: "Under \u20b95K/mo", min: 0, max: 5000 },
  { label: "\u20b95\u20138K/mo", min: 5000, max: 8000 },
  { label: "\u20b98\u201312K/mo", min: 8000, max: 12000 },
  { label: "\u20b912\u201318K/mo", min: 12000, max: 18000 },
  { label: "\u20b918\u201325K/mo", min: 18000, max: 25000 },
  { label: "\u20b925\u201340K/mo", min: 25000, max: 40000 },
  { label: "\u20b940\u201375K/mo", min: 40000, max: 75000 },
  { label: "\u20b975K\u20131.5L/mo", min: 75000, max: 150000 },
  { label: "Above \u20b91.5L/mo", min: 150000, max: 999999999999 },
];

export const LEASE_BUDGET_RANGES: BudgetRange[] = [
  { label: "Any", min: 0, max: 999999999999 },
  { label: "Under \u20b920K/mo", min: 0, max: 20000 },
  { label: "\u20b920\u201350K/mo", min: 20000, max: 50000 },
  { label: "\u20b950K\u20131L/mo", min: 50000, max: 100000 },
  { label: "\u20b91\u20133L/mo", min: 100000, max: 300000 },
  { label: "Above \u20b93L/mo", min: 300000, max: 999999999999 },
];

export const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Plot",
  "Industrial",
  "Redevelopment",
];

export const ACTIONS = ["Buy", "Rent", "Lease", "PG"];

export const AHMEDABAD_LOCATIONS = [
  "All Ahmedabad",
  "Satellite",
  "Navrangpura",
  "Bopal",
  "SG Highway",
  "Thaltej",
  "Prahlad Nagar",
  "Vastrapur",
  "Maninagar",
  "Gota",
  "New Ranip",
  "Chandkheda",
  "Vastral",
  "Nikol",
  "Naranpura",
  "Paldi",
  "Vejalpur",
  "Ambawadi",
  "Bodakdev",
  "Motera",
  "Shela",
  "South Bopal",
  "Sarkhej",
  "Nehru Nagar",
  "Anand Nagar",
];

export const GUJARAT_CITIES = [
  "Surat",
  "Vadodara",
  "Rajkot",
  "Gandhinagar",
  "Anand",
  "Mehsana",
];

export const BHK_OPTIONS = [
  "Any",
  "1 RK",
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK+",
  "Studio",
  "Villa",
  "Plot",
];

export const FURNISHING_OPTIONS = [
  "Any",
  "Furnished",
  "Semi-Furnished",
  "Unfurnished",
];

export const AMENITY_OPTIONS = [
  "Parking",
  "Garden",
  "Gym",
  "Swimming Pool",
  "Lift",
  "Security",
  "Power Backup",
  "Club House",
];

export const POSSESSION_OPTIONS = [
  "Any",
  "Ready to Move",
  "Under Construction",
  "Ready Soon",
];

export const SOURCE_TABS: SourceTab[] = [
  "99acres",
  "MagicBricks",
  "Housing.com",
];

export const SOURCE_COLORS: Record<SourceTab, string> = {
  "99acres": "bg-emerald-700 text-emerald-100",
  MagicBricks: "bg-orange-700 text-orange-100",
  "Housing.com": "bg-rose-700 text-rose-100",
};

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}
