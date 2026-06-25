import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type MarketTrend = "Rising" | "Stable" | "Cooling";
type MarketType = "Seller's Market" | "Buyer's Market" | "Balanced";

interface LocalityData {
  slug: string;
  name: string;
  zone: string;
  type: string;
  tagline: string;
  overview: string[];
  stats: {
    avgPrice: string;
    pricePerSqft: string;
    metro: string;
    topSchools: string;
    hospitals: string;
    nearestMall: string;
    itHub: string;
  };
  infrastructure: string[];
  propertyTypes: string[];
  pros: string[];
  cons: string[];
  market: {
    type: MarketType;
    trend: MarketTrend;
    note: string;
  };
  relatedAreas: string[];
}

const LOCALITY_DATA: Record<string, LocalityData> = {
  bopal: {
    slug: "bopal",
    name: "Bopal",
    zone: "West Ahmedabad",
    type: "Premium Residential",
    tagline: "The family-first premium suburb of West Ahmedabad",
    overview: [
      "Bopal has transformed from a peripheral township to one of Ahmedabad's most sought-after family residential zones over the last decade. Its wide, tree-lined roads, well-planned residential societies, and strong school catchment make it ideal for families with children.",
      "The locality sits off the Bopal-Ambli Road and is well connected to SG Highway, enabling easy commutes to the city's major commercial centres. Infrastructure includes international schools, multi-specialty hospitals, and retail hubs within a 5-km radius.",
      "Real estate in Bopal primarily consists of mid-to-large format apartments ranging from 2BHK to 4BHK. With multiple under-construction and ready-to-move projects from reputed developers, it offers good options across different budgets within the premium category.",
    ],
    stats: {
      avgPrice: "₹60–90 Lakhs",
      pricePerSqft: "₹4,200–5,800",
      metro: "Within 3 km (Thaltej-Shilaj)",
      topSchools: "Zydus School, Anand Niketan, DPS Bopal",
      hospitals: "HCG, SAL, Apollo Spectra (all within 6 km)",
      nearestMall: "Elements Mall – 4 km",
      itHub: "GIFT City – 18 km | SG Highway IT – 5 km",
    },
    infrastructure: [
      "4-lane roads with pedestrian footpaths across major stretches",
      "BRTS (Bus Rapid Transit System) connecting to central Ahmedabad",
      "Reliable AMTS city bus routes",
      "24x7 water supply via AMC piped network",
      "Underground electricity cabling in newer sectors",
      "Multiple petrol pumps, banks, and ATMs in the locality",
    ],
    propertyTypes: [
      "2BHK (800–1,100 sq ft)",
      "3BHK (1,200–1,700 sq ft)",
      "4BHK (1,800–2,400 sq ft)",
      "Plotted Development",
      "Row Houses",
    ],
    pros: [
      "Excellent school ecosystem — multiple CBSE and ICSE schools within the locality",
      "Peaceful, low-traffic residential environment despite urban proximity",
      "Strong community of families and professionals, safe neighbourhood",
      "Consistent property appreciation of 8–12% annually over the last 5 years",
    ],
    cons: [
      "Slightly farther from central Ahmedabad (15–20 km from city centre)",
      "Traffic congestion on Bopal-Ambli Road during peak hours",
      "Limited public transport options compared to central localities",
    ],
    market: {
      type: "Seller's Market",
      trend: "Rising",
      note: "Demand outpaces new supply. Ready-to-move inventory sells within 30–45 days. Prices have risen 10% in 2024.",
    },
    relatedAreas: ["ambli", "thaltej", "sg-highway"],
  },
  "sg-highway": {
    slug: "sg-highway",
    name: "SG Highway",
    zone: "West Ahmedabad",
    type: "Premium Corridor",
    tagline: "Ahmedabad's most prestigious commercial and residential spine",
    overview: [
      "SG Highway (Sarkhej-Gandhinagar Highway or SH 71) is the defining axis of modern Ahmedabad. Stretching from Sarkhej to the Gandhinagar border, it passes through Makarba, Satellite, Bodakdev, Thaltej, and Sola, housing the city's finest residential towers, premium malls, and corporate campuses.",
      "The corridor attracts Ahmedabad's top-tier buyers including C-suite professionals, NRIs, and entrepreneurs. Properties along SG Highway command a premium due to their connectivity to the airport, railway station, and both the old city and new Gandhinagar capital.",
      "Development along the highway is stratified — the stretch near Bodakdev and Satellite commands the highest prices, while Thaltej and Sola offer better value with similar amenities. Under-construction luxury projects from major national developers are actively launching here.",
    ],
    stats: {
      avgPrice: "₹80 Lakhs–1.5 Crore",
      pricePerSqft: "₹5,500–8,000",
      metro: "Yes — Multiple stations (Thaltej, Sola, Vadaj)",
      topSchools: "VIBGYOR, Udgam, Silver Bells",
      hospitals: "Sterling, HCG, CIMS, Shalby (all on SG Highway)",
      nearestMall: "Ahmedabad One Mall, Seawoods Grand Central, Iscon",
      itHub: "TCS, Wipro, Zydus HQ, GIFT City – all on this corridor",
    },
    infrastructure: [
      "8-lane divided highway with service roads",
      "Metro rail with 4 stations directly on the corridor",
      "BRTS express connecting Sarkhej to Sector 28 Gandhinagar",
      "All major banks, ATMs, fuel stations available every 500m",
      "Flyovers at all major intersections reducing signal stops",
      "Airport connectivity within 15–25 minutes depending on stretch",
    ],
    propertyTypes: [
      "2BHK Apartments (900–1,200 sq ft)",
      "3BHK Apartments (1,400–2,000 sq ft)",
      "4BHK Luxury Flats (2,200–3,200 sq ft)",
      "Penthouses",
      "Commercial Office Spaces",
    ],
    pros: [
      "Best infrastructure and connectivity in Ahmedabad — metro + highway + airport access",
      "All top hospitals, schools, malls and corporate offices are along or near this corridor",
      "Highest NRI investment zone — robust rental demand from corporate executives",
      "Consistent capital appreciation — one of India's best-performing real estate corridors",
    ],
    cons: [
      "Premium pricing — entry point starts at ₹80L, limiting first-time buyers",
      "Highway-facing units can have noise issues without proper double-glazed windows",
      "High traffic congestion during office hours on the main corridor",
    ],
    market: {
      type: "Seller's Market",
      trend: "Rising",
      note: "Strong investor and end-user demand. NRI buying is at a 5-year high. Luxury project launches oversubscribed.",
    },
    relatedAreas: ["prahlad-nagar", "satellite", "thaltej"],
  },
  navrangpura: {
    slug: "navrangpura",
    name: "Navrangpura",
    zone: "Central Ahmedabad",
    type: "Central Premium",
    tagline: "Ahmedabad's intellectual and commercial nerve centre",
    overview: [
      "Navrangpura is central Ahmedabad's most premium locality. It is home to Gujarat University, top coaching institutes, reputed hospitals, and the city's most walkable commercial streets. Its central location means virtually everything in Ahmedabad is equidistant.",
      "The real estate landscape features a mix of older bungalow conversions, mid-rise societies, and newer premium apartments. Due to limited land availability, prices have remained consistently high and new inventory is scarce, making existing properties particularly valuable.",
      "Navrangpura is preferred by doctors, lawyers, professors, and business families who want to be in the heart of the city. The area has excellent social infrastructure and is one of the few central localities with both legacy charm and modern amenities.",
    ],
    stats: {
      avgPrice: "₹90 Lakhs–2 Crore",
      pricePerSqft: "₹6,000–9,500",
      metro: "Yes — CG Road and Navrangpura stations",
      topSchools: "St. Xavier's, Rosary High, Gujarat University Campus",
      hospitals: "Civil Hospital, HCG, Shalby, VS Hospital (all under 3 km)",
      nearestMall: "Mithakali Six Roads / CG Road Retail Strip",
      itHub: "Prahladnagar IT – 5 km | Sola – 8 km",
    },
    infrastructure: [
      "Dense road network with city bus and auto-rickshaw coverage",
      "Metro station on CG Road connecting to west and east Ahmedabad",
      "Walking-distance access to courts, government offices, and civic services",
      "Most utility services (AUDA, AMC) accessible within 2 km",
      "Dense telecom and broadband infrastructure",
    ],
    propertyTypes: [
      "1BHK (500–700 sq ft)",
      "2BHK (800–1,200 sq ft)",
      "3BHK Luxury (1,600–2,200 sq ft)",
      "Penthouse & Duplex",
      "Commercial Ground Floor",
    ],
    pros: [
      "Zero-compromise central location — fastest access to any part of Ahmedabad",
      "Scarcity of new land drives consistent long-term appreciation",
      "Premium rental market — doctors, lawyers, and corporate tenants willing to pay top rents",
      "Best hospitals and educational institutes are within walking distance",
    ],
    cons: [
      "Very limited new inventory — buyers must compete for available properties",
      "Older buildings may need significant renovation or have fewer modern amenities",
      "Parking is a persistent challenge given the density",
    ],
    market: {
      type: "Seller's Market",
      trend: "Stable",
      note: "Limited new supply keeps prices firm. Premium properties hold value. Ideal for long-term wealth preservation.",
    },
    relatedAreas: ["vastrapur", "satellite", "prahlad-nagar"],
  },
  "prahlad-nagar": {
    slug: "prahlad-nagar",
    name: "Prahlad Nagar",
    zone: "West Ahmedabad",
    type: "Luxury Zone",
    tagline: "Ahmedabad's ultimate luxury address",
    overview: [
      "Prahlad Nagar is unequivocally Ahmedabad's most prestigious residential address. Flanked by Iscon Mega Mall and the 100 Feet Road, this locality is synonymous with luxury living — penthouse apartments, sprawling duplexes, gated communities with full amenities, and the city's finest dining and entertainment.",
      "The area attracts Ahmedabad's wealthiest families, NRI investors, and senior corporate professionals. Properties here routinely cross ₹2–3 Cr for 4BHK apartments, with select penthouses trading at ₹5–8 Cr. Despite premium pricing, demand remains strong due to limited supply and the area's irreplaceable status.",
      "Prahlad Nagar has matured into a fully developed luxury zone with no large vacant parcels remaining. Future appreciation will be driven by quality upgrades and replacement of older buildings with new premium projects.",
    ],
    stats: {
      avgPrice: "₹1 Crore–3 Crore",
      pricePerSqft: "₹7,000–12,000",
      metro: "Within 2 km (Iscon Cross Road station)",
      topSchools: "Zebar School, Xavier's, DPS (all within 5 km)",
      hospitals: "CIMS, Shalby, SAL (5–7 km via SG Highway)",
      nearestMall: "Iscon Mega Mall — adjacent",
      itHub: "Sola IT Park – 4 km | Infocity – 6 km",
    },
    infrastructure: [
      "Wide 100 Feet Road with dividers and full amenities",
      "Proximity to SG Highway providing airport and highway access",
      "24x7 power backup in all new premium societies",
      "Piped gas (PNG) available across the locality",
      "High-speed fibre broadband from Jio, Airtel, BSNL available",
    ],
    propertyTypes: [
      "3BHK Luxury Apartments (1,800–2,400 sq ft)",
      "4BHK (2,500–3,500 sq ft)",
      "Penthouse (3,500–6,000 sq ft)",
      "Row Houses & Bungalows",
      "Premium Commercial Spaces",
    ],
    pros: [
      "Ahmedabad's most prestigious address — best for social capital and NRI investment",
      "Iscon Mall, premium restaurants, and entertainment within walking distance",
      "High rental yield — corporate expats and NRIs prefer this locality above all others",
      "Best resale value in the city — properties retain premium even in downturns",
    ],
    cons: [
      "Highest entry cost in Ahmedabad — not accessible to most buyers",
      "Fully built-up area with limited new supply — finding the right property takes time",
      "Traffic congestion near Iscon crossing can be severe during weekends",
    ],
    market: {
      type: "Seller's Market",
      trend: "Rising",
      note: "Luxury segment outperforming all other zones in 2024. NRI and HNI buyers driving prices higher. Sub-₹2Cr inventory nearly sold out.",
    },
    relatedAreas: ["satellite", "sg-highway", "vastrapur"],
  },
  thaltej: {
    slug: "thaltej",
    name: "Thaltej",
    zone: "West Ahmedabad",
    type: "Emerging Premium",
    tagline: "Premium living at competitive prices on the SG Highway belt",
    overview: [
      "Thaltej has emerged as one of Ahmedabad's most attractive investment destinations. Located on SG Highway with its own metro station, it offers the infrastructure and lifestyle of established premium zones like Satellite and Bodakdev but at prices that still offer room for appreciation.",
      "The locality has seen significant residential development in the last 5 years, with top builders launching projects that combine modern amenities with relatively competitive pricing. The presence of Thaltej-Shilaj metro station makes it extremely accessible.",
      "Thaltej is also close to multiple IT parks and the upcoming GIFT City corridor, making it a preferred choice for IT professionals and young families looking for premium housing without crossing the ₹1 Cr threshold.",
    ],
    stats: {
      avgPrice: "₹65 Lakhs–1.2 Crore",
      pricePerSqft: "₹4,800–7,200",
      metro: "Yes — Thaltej-Shilaj Metro Station",
      topSchools: "Anand Niketan (Satellite), DPS Bopal – 3 km",
      hospitals: "HCG, Apollo – within 6 km",
      nearestMall: "Elements Mall – 3 km | Ahmedabad One – 5 km",
      itHub: "SG Highway IT Corridor – 2 km | GIFT City – 15 km",
    },
    infrastructure: [
      "Direct metro connectivity to Motera and Apparel Park",
      "SP Ring Road access for connecting to North and South Ahmedabad",
      "SG Highway express access to airport within 25 minutes",
      "New residential townships with clubhouses, pools, and sports courts",
      "Multiple petrol pumps, supermarkets, and daily utility shops",
    ],
    propertyTypes: [
      "2BHK (900–1,200 sq ft)",
      "3BHK (1,400–1,900 sq ft)",
      "4BHK Premium (2,000–2,800 sq ft)",
      "Luxury Apartments",
    ],
    pros: [
      "Metro station in the locality — excellent connectivity without car dependency",
      "Better value vs Satellite and Prahlad Nagar with same SG Highway lifestyle",
      "New developments offer modern amenities: gym, pool, EV charging",
      "Strong appreciation potential as the area continues to develop",
    ],
    cons: [
      "Some stretches still under infrastructure development",
      "Fewer established commercial areas compared to Satellite",
      "Construction activity can cause temporary inconvenience",
    ],
    market: {
      type: "Balanced",
      trend: "Rising",
      note: "Strong launch momentum from top builders. Appreciation expected to accelerate as infrastructure matures. Good entry point before prices align with Satellite.",
    },
    relatedAreas: ["bopal", "sg-highway", "satellite"],
  },
  gota: {
    slug: "gota",
    name: "Gota",
    zone: "North-West Ahmedabad",
    type: "Affordable Quality",
    tagline: "Value-for-money family living with full amenities",
    overview: [
      "Gota has established itself as Ahmedabad's top choice for first-time buyers and middle-class families. Its strong social infrastructure — with government schools, private hospitals, and well-connected roads — provides quality living at genuinely affordable price points.",
      "The locality stretches from Chandlodia to the SP Ring Road junction and is well-served by BRTS, making daily commutes manageable. Multiple housing societies with basic amenities at ₹30–50L have made Gota popular with salaried employees and small business owners.",
      "Recent infrastructure upgrades including road widening and the extended metro line to Motera have improved Gota's connectivity significantly, and this has begun to translate into steady price appreciation of 6–9% annually.",
    ],
    stats: {
      avgPrice: "₹30–60 Lakhs",
      pricePerSqft: "₹2,800–4,200",
      metro: "Within 4 km (Chandlodia station)",
      topSchools: "Kendriya Vidyalaya, Gujarat Secondary Board schools",
      hospitals: "Zydus Hospitals, Nidhi Hospital, Krishna Hospital",
      nearestMall: "Nexus Ahmedabad One – 10 km",
      itHub: "SG Highway – 12 km | Science City – 8 km",
    },
    infrastructure: [
      "BRTS corridor with regular services to central Ahmedabad",
      "State highway access connecting to Gandhinagar and North Gujarat",
      "AMC piped water supply and drainage network",
      "Multiple government schools, colleges, and vocational institutes",
      "Vegetable markets, APMC zone nearby for fresh produce",
    ],
    propertyTypes: [
      "1BHK (450–650 sq ft)",
      "2BHK (700–1,050 sq ft)",
      "3BHK (1,100–1,500 sq ft)",
      "Plotted Development (150–200 sq yd)",
    ],
    pros: [
      "Most affordable price points for quality housing in Ahmedabad",
      "Full social infrastructure — schools, hospitals, markets all accessible",
      "Good BRTS connectivity makes car-free living viable",
      "Ideal for first-time buyers and investors seeking rental yield (5–6%)",
    ],
    cons: [
      "Distance from premium lifestyle zones like SG Highway and Prahlad Nagar",
      "Traffic congestion near the Gota Circle during peak hours",
      "Road infrastructure in some interior lanes needs improvement",
    ],
    market: {
      type: "Balanced",
      trend: "Stable",
      note: "Steady demand from first-time buyers. Affordable segment remains the most active in Ahmedabad. Good rental yields for investors.",
    },
    relatedAreas: ["chandkheda", "bopal", "thaltej"],
  },
  chandkheda: {
    slug: "chandkheda",
    name: "Chandkheda",
    zone: "North Ahmedabad",
    type: "North Growing",
    tagline: "Affordable and growing — Gateway to Gandhinagar",
    overview: [
      "Chandkheda is North Ahmedabad's emerging residential zone, strategically located between Ahmedabad and Gandhinagar. Its proximity to PDPU (Pandit Deendayal Petroleum University), government offices, and the upcoming metro line extension has created consistent housing demand.",
      "The locality primarily caters to government employees, students, and lower-middle-income families. Properties here offer the lowest entry points in the city while still providing access to civic amenities, and recent developments include several affordable housing projects under PMAY.",
      "As Gandhinagar continues to develop as a tech and government hub, Chandkheda's location between the two cities is increasingly valuable. Infrastructure investments in the area are visible with road widening and utility upgrades.",
    ],
    stats: {
      avgPrice: "₹25–50 Lakhs",
      pricePerSqft: "₹2,200–3,800",
      metro: "Yes — Chandkheda Metro Station",
      topSchools: "PDPU, Kendriya Vidyalaya No. 2, Government schools",
      hospitals: "Civil Hospital Sector 21, Kiran Hospital",
      nearestMall: "Mahadev Puram Mall – 2 km",
      itHub: "Infocity Gandhinagar – 8 km | GIFT City – 22 km",
    },
    infrastructure: [
      "Metro station providing direct connectivity to Ahmedabad city centre",
      "GSRTC and AMTS buses to Gandhinagar Secretariat and Ahmedabad",
      "National Highway 48 access for outstation travel",
      "Post office, banks, and government service centres",
      "PMAY affordable housing projects with government subsidies",
    ],
    propertyTypes: [
      "1BHK (350–550 sq ft)",
      "2BHK (600–900 sq ft)",
      "3BHK (900–1,200 sq ft)",
      "Plotted Development",
      "PMAY Housing",
    ],
    pros: [
      "Lowest property prices in Ahmedabad — ideal entry for budget-constrained buyers",
      "Metro connectivity to Ahmedabad reduces commute time significantly",
      "PMAY subsidy benefits applicable for eligible buyers",
      "Gateway location between two major cities offers future upside",
    ],
    cons: [
      "Limited premium lifestyle amenities compared to West Ahmedabad",
      "Some areas still lack piped gas and quality road surfaces",
      "Lower rental yields due to lower-income tenant profile",
    ],
    market: {
      type: "Buyer's Market",
      trend: "Stable",
      note: "Steady but measured appreciation. Preferred by end-users over investors. PMAY demand supports baseline prices.",
    },
    relatedAreas: ["gota", "bopal", "thaltej"],
  },
  ambli: {
    slug: "ambli",
    name: "Ambli",
    zone: "West Ahmedabad",
    type: "Peaceful Suburban",
    tagline: "Quiet luxury in Ahmedabad's most serene western suburb",
    overview: [
      "Ambli is one of Ahmedabad's best-kept residential secrets. Unlike the high-rise density of Satellite or the commercial bustle of SG Highway, Ambli offers a quieter, lower-density environment with larger plot sizes, bungalow developments, and breathing room that is increasingly rare in the city.",
      "Located on the Ambli-Bopal Road, the locality benefits from excellent proximity to Bopal's school ecosystem and SG Highway's commercial infrastructure while maintaining its peaceful character. Senior citizens and families with young children particularly prefer Ambli for its green surroundings.",
      "Property offerings here tend towards larger formats — 3BHK and 4BHK in low-rise or row-house developments, and plotted land for self-construction. This makes Ambli a premium suburban alternative for buyers who find Bopal too congested.",
    ],
    stats: {
      avgPrice: "₹55–90 Lakhs",
      pricePerSqft: "₹4,000–5,800",
      metro: "Within 5 km (Bopal or Thaltej)",
      topSchools: "Zydus School, Anand Niketan (Bopal) – 2 km",
      hospitals: "SAL, Apollo Spectra – within 7 km via SH 17",
      nearestMall: "Elements Mall – 5 km",
      itHub: "SG Highway IT Corridor – 6 km",
    },
    infrastructure: [
      "Ambli-Bopal Road — fully developed 4-lane road",
      "Regular auto-rickshaw services to SG Highway and Bopal",
      "AMC water supply and DGVCL electricity",
      "Low-rise development regulations preserving green character",
      "New society developments with clubhouse and gated security",
    ],
    propertyTypes: [
      "2BHK (900–1,100 sq ft)",
      "3BHK (1,300–1,800 sq ft)",
      "Row Houses & Villas",
      "Plotted Development (200–400 sq yd)",
      "Bungalows",
    ],
    pros: [
      "Most peaceful and green environment in West Ahmedabad",
      "Lower density than Bopal and Satellite — more open space and privacy",
      "Access to Bopal's school ecosystem without Bopal's congestion",
      "Good long-term appreciation as West Ahmedabad continues to develop",
    ],
    cons: [
      "Limited commercial activity within Ambli — residents travel to Bopal for most needs",
      "No metro station within walking distance",
      "Auto-rickshaw availability can be limited during off-peak hours",
    ],
    market: {
      type: "Balanced",
      trend: "Stable",
      note: "Niche appeal to specific buyer profile. Steady demand from senior buyers and families who prioritise quiet living. Limited supply supports prices.",
    },
    relatedAreas: ["bopal", "thaltej", "sg-highway"],
  },
  satellite: {
    slug: "satellite",
    name: "Satellite",
    zone: "West Ahmedabad",
    type: "Premium West",
    tagline: "Ahmedabad's established premium address with unmatched amenities",
    overview: [
      "Satellite is among Ahmedabad's most mature and complete premium localities. Bounded by Shivranjani to the east and Bodakdev to the west, and flanked by SG Highway to the north, it represents the gold standard of established West Ahmedabad living.",
      "The area has virtually every urban amenity within a 2 km radius — top-tier hospitals, schools, shopping complexes, restaurants, banks, and entertainment venues. Its proximity to Ahmedabad's best hospitals makes it a preferred area for medical professionals and their families.",
      "Satellite offers a mix of established housing societies, some built in the 1990s and 2000s, and newer premium towers. Redevelopment of older buildings is actively occurring, bringing modern amenities to legacy locations.",
    ],
    stats: {
      avgPrice: "₹70 Lakhs–1.5 Crore",
      pricePerSqft: "₹5,200–8,500",
      metro: "Yes — Shivranjani and Satellite Road stations",
      topSchools: "DPS Satellite, Shishuvan, Adani Vidya Mandir",
      hospitals: "Shalby, SAL, Apollo – all within 2 km",
      nearestMall: "Jodhpur Cross Road Market, Reliance Mall",
      itHub: "SG Highway Corridor – adjacent",
    },
    infrastructure: [
      "Metro connectivity at Shivranjani and Jodhpur Cross Road",
      "100 Feet Road connecting to Prahlad Nagar and Iskcon",
      "Dense auto-rickshaw and city bus network",
      "All major banks and their branch offices in the locality",
      "Piped gas (PNG) available across the entire locality",
      "Underground electric lines in newer development zones",
    ],
    propertyTypes: [
      "2BHK (900–1,250 sq ft)",
      "3BHK (1,400–2,000 sq ft)",
      "4BHK Luxury (2,000–3,000 sq ft)",
      "Penthouse",
      "Commercial Offices",
    ],
    pros: [
      "Most complete premium locality in Ahmedabad — all facilities within 2 km",
      "Premium hospitals within walking distance — valued by medical professionals",
      "Strong metro connectivity across two stations",
      "Premium established area — lower risk profile than emerging zones",
    ],
    cons: [
      "Among the most expensive localities — ₹5,000+ per sq ft in established zones",
      "Older buildings may lack modern amenities and have parking limitations",
      "Higher maintenance costs in premium societies",
    ],
    market: {
      type: "Seller's Market",
      trend: "Rising",
      note: "Consistent high demand. Quality properties sell fast. Redevelopment projects driving premium pricing in older sectors.",
    },
    relatedAreas: ["prahlad-nagar", "vastrapur", "sg-highway"],
  },
  vastrapur: {
    slug: "vastrapur",
    name: "Vastrapur",
    zone: "West Ahmedabad",
    type: "Lakeside Luxury",
    tagline:
      "Luxury living by the lake — Ahmedabad's most scenic premium address",
    overview: [
      "Vastrapur is Ahmedabad's crown jewel for discerning buyers who want luxury with natural beauty. Adjacent to the serene Vastrapur Lake and its beautifully developed lake garden, the locality offers a rare combination of green open spaces, premium housing, and institutional prestige — IIM Ahmedabad is located here.",
      "The area attracts IIM alumni, senior executives, and families who want premium living without the commercial noise of SG Highway. Properties facing the lake command significant premiums and rarely come to market, making Vastrapur one of the most competitive property markets in Ahmedabad.",
      "Commercial development is deliberately limited, preserving the residential character. The locality has excellent metro connectivity and proximity to major hospitals, making it practical as well as desirable.",
    ],
    stats: {
      avgPrice: "₹80 Lakhs–2 Crore",
      pricePerSqft: "₹6,000–10,000",
      metro: "Yes — Vastrapur and Gujarat University stations",
      topSchools: "Anand Niketan, DPS Satellite – within 4 km",
      hospitals: "HCG, CIMS, Shalby – all within 4 km",
      nearestMall: "SG Highway Malls – 4 km",
      itHub: "IIMA Campus adjacent | SG Highway IT – 5 km",
    },
    infrastructure: [
      "Lake garden promenade — one of Ahmedabad's finest public spaces",
      "Metro stations at Vastrapur and Gujarat University",
      "Good auto-rickshaw availability connecting to all city zones",
      "AUDA-maintained roads with regular upkeep",
      "IIM Ahmedabad campus creates a premium institutional character",
    ],
    propertyTypes: [
      "2BHK (850–1,200 sq ft)",
      "3BHK Premium (1,500–2,200 sq ft)",
      "4BHK Luxury (2,200–3,500 sq ft)",
      "Penthouse (lake-facing)",
      "Commercial (limited)",
    ],
    pros: [
      "Lake-facing properties are among Ahmedabad's most coveted — perpetual scarcity",
      "IIM Ahmedabad adjacency provides institutional prestige and strong rental demand",
      "Combination of natural beauty, luxury housing, and metro connectivity is unmatched",
      "Highest long-term capital appreciation in Ahmedabad — lake-facing units up 40% in 5 years",
    ],
    cons: [
      "Very limited available inventory — buyers must be patient",
      "Premium pricing with ₹6,000+ per sq ft even for non-lake-facing units",
      "Limited commercial options within Vastrapur itself",
    ],
    market: {
      type: "Seller's Market",
      trend: "Rising",
      note: "Extremely tight inventory. Lake-facing properties sell within days. One of Ahmedabad's safest real estate investments.",
    },
    relatedAreas: ["navrangpura", "satellite", "prahlad-nagar"],
  },
};

const LOCALITY_SLUGS: Record<string, string> = {
  bopal: "Bopal",
  "sg-highway": "SG Highway",
  navrangpura: "Navrangpura",
  "prahlad-nagar": "Prahlad Nagar",
  thaltej: "Thaltej",
  gota: "Gota",
  chandkheda: "Chandkheda",
  ambli: "Ambli",
  satellite: "Satellite",
  vastrapur: "Vastrapur",
};

const TREND_ICON = {
  Rising: <TrendingUp size={16} className="text-emerald-400" />,
  Stable: <TrendingUp size={16} className="text-gold-400" />,
  Cooling: <TrendingDown size={16} className="text-amber-400" />,
};

const TREND_COLOR = {
  Rising: "text-emerald-400",
  Stable: "text-gold-400",
  Cooling: "text-amber-400",
};

export default function AreaGuidePage() {
  const { locality } = useParams({ strict: false }) as { locality?: string };
  const slug = locality || "";
  const data = LOCALITY_DATA[slug];

  if (!data) {
    return (
      <div className="min-h-screen bg-obsidian-900 text-gold-100">
        <Header />
        <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <AlertCircle size={48} className="text-gold-600/50 mb-4" />
          <h1 className="font-serif text-2xl text-gold-300 mb-2">
            Area Guide Not Found
          </h1>
          <p className="font-sans text-muted-foreground mb-6">
            We don't have a guide for "{slug}" yet.
          </p>
          <Link
            to="/area-guides"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gold-600/40 text-gold-400 hover:bg-gold-600/10 font-sans text-sm transition-all"
          >
            <ArrowLeft size={14} /> View All Area Guides
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-900 text-gold-100">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-14 px-4 bg-gradient-to-b from-obsidian-800 to-obsidian-900 border-b border-gold-800/30">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/area-guides"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-sans mb-8 transition-colors"
              data-ocid="area-guide.back_link"
            >
              <ArrowLeft size={16} /> All Area Guides
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={16} className="text-gold-500" />
              <span className="text-gold-500 font-sans text-xs uppercase tracking-widest">
                {data.zone}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium font-sans bg-gold-600/20 text-gold-400 border border-gold-600/30">
                {data.type}
              </span>
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-6xl gold-text mb-3">
              {data.name}
            </h1>
            <p className="font-sans text-base text-obsidian-100 max-w-2xl">
              {data.tagline}
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
          {/* Overview */}
          <section>
            <h2 className="font-serif font-bold text-2xl gold-text mb-5">
              Overview
            </h2>
            <div className="space-y-4">
              {data.overview.map((para) => (
                <p
                  key={para}
                  className="font-sans text-base text-obsidian-100 leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* Key Stats */}
          <section>
            <h2 className="font-serif font-bold text-2xl gold-text mb-5">
              Key Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(
                [
                  ["Avg Price", data.stats.avgPrice],
                  ["Price / Sq Ft", data.stats.pricePerSqft],
                  ["Metro", data.stats.metro],
                  ["Top Schools", data.stats.topSchools],
                  ["Hospitals", data.stats.hospitals],
                  ["Nearest Mall", data.stats.nearestMall],
                  ["IT Hub", data.stats.itHub],
                ] as [string, string][]
              ).map(([label, val]) => (
                <div
                  key={label}
                  className="rounded-xl bg-card border border-gold-800/30 p-4"
                >
                  <p className="text-[10px] text-gold-600 font-sans uppercase tracking-wide mb-1">
                    {label}
                  </p>
                  <p className="font-sans text-sm text-gold-200 leading-snug">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Infrastructure */}
          <section>
            <h2 className="font-serif font-bold text-2xl gold-text mb-5">
              Infrastructure &amp; Connectivity
            </h2>
            <ul className="space-y-2">
              {data.infrastructure.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-sans text-sm text-obsidian-100"
                >
                  <CheckCircle2
                    size={16}
                    className="text-gold-500 mt-0.5 shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Property Types */}
          <section>
            <h2 className="font-serif font-bold text-2xl gold-text mb-5">
              Available Property Types
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.propertyTypes.map((pt) => (
                <span
                  key={pt}
                  className="px-3 py-1.5 rounded-lg font-sans text-sm bg-obsidian-800 border border-gold-800/30 text-gold-300 flex items-center gap-2"
                >
                  <Building2 size={13} className="text-gold-600" />
                  {pt}
                </span>
              ))}
            </div>
          </section>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="rounded-2xl border border-emerald-700/30 bg-emerald-900/10 p-6">
              <h2 className="font-serif font-bold text-xl text-emerald-400 mb-4">
                Why Buy Here
              </h2>
              <ul className="space-y-3">
                {data.pros.map((pro) => (
                  <li
                    key={pro}
                    className="flex items-start gap-3 font-sans text-sm text-obsidian-100"
                  >
                    <CheckCircle2
                      size={15}
                      className="text-emerald-400 mt-0.5 shrink-0"
                    />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-amber-700/30 bg-amber-900/10 p-6">
              <h2 className="font-serif font-bold text-xl text-amber-400 mb-4">
                Considerations
              </h2>
              <ul className="space-y-3">
                {data.cons.map((con) => (
                  <li
                    key={con}
                    className="flex items-start gap-3 font-sans text-sm text-obsidian-100"
                  >
                    <AlertCircle
                      size={15}
                      className="text-amber-400 mt-0.5 shrink-0"
                    />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Current Market */}
          <section className="rounded-2xl border border-gold-800/30 bg-card p-6">
            <h2 className="font-serif font-bold text-2xl gold-text mb-4">
              Current Market
            </h2>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {TREND_ICON[data.market.trend]}
                <span
                  className={`font-serif font-semibold text-lg ${TREND_COLOR[data.market.trend]}`}
                >
                  {data.market.trend}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium font-sans bg-gold-600/10 text-gold-400 border border-gold-700/30">
                {data.market.type}
              </span>
            </div>
            <p className="font-sans text-sm text-obsidian-100 leading-relaxed">
              {data.market.note}
            </p>
          </section>

          {/* CTA Button */}
          <section className="text-center">
            <a
              href={`/property-portal?locality=${encodeURIComponent(data.name)}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-600 text-obsidian-950 font-semibold font-sans text-base hover:bg-gold-500 transition-all duration-200 shadow-lg"
              data-ocid="area-guide.search_properties_button"
            >
              Search Properties in {data.name}
            </a>
          </section>

          {/* Related Areas */}
          <section>
            <h2 className="font-serif font-bold text-2xl gold-text mb-5">
              Related Areas
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.relatedAreas.map((slug) => (
                <a
                  key={slug}
                  href={`/area-guides/${slug}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gold-800/30 bg-card hover:border-gold-500/50 hover:bg-gold-600/5 transition-all duration-200 font-sans text-sm text-gold-300"
                  data-ocid={`area-guide.related_area_link.${slug}`}
                >
                  <MapPin size={13} className="text-gold-500" />
                  {LOCALITY_SLUGS[slug] || slug}
                </a>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="rounded-2xl border border-gold-700/30 bg-gradient-to-r from-obsidian-800 to-obsidian-700 p-8 text-center">
            <h2 className="font-serif font-bold text-2xl text-gold-200 mb-2">
              Talk to an Expert About {data.name}
            </h2>
            <p className="font-sans text-sm text-obsidian-100 mb-6 max-w-md mx-auto">
              Our team has in-depth knowledge of {data.name} properties. Get
              personalised advice, shortlisted options, and on-ground insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/919512609016"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold font-sans text-sm hover:bg-emerald-500 transition-all duration-200"
                data-ocid="area-guide.whatsapp_button"
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
              <a
                href="tel:+919512609016"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gold-600/40 text-gold-400 font-semibold font-sans text-sm hover:bg-gold-600/10 transition-all duration-200"
                data-ocid="area-guide.call_button"
              >
                <Phone size={16} /> +91 95126 09016
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
