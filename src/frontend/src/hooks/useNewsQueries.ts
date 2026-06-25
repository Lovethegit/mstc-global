import { createActor } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  category: string;
  imageUrl?: string;
}

export const PLACEHOLDER_ARTICLES: NewsArticle[] = [
  {
    id: "1",
    title:
      "GujRERA Mandates Quarterly Progress Reports for All New Residential Projects",
    summary:
      "Gujarat Real Estate Regulatory Authority has issued fresh directives requiring developers to submit quarterly progress updates, enhancing transparency for homebuyers across Ahmedabad, Surat, and Vadodara.",
    source: "Gujarat Real Estate News",
    date: "May 8, 2026",
    url: "https://rera.gujarat.gov.in",
    category: "RERA",
    imageUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
  },
  {
    id: "2",
    title:
      "Ahmedabad Property Prices Rise 12% in Q1 2026 — Satellite and Bopal Lead Growth",
    summary:
      "According to PropTiger's quarterly index, Ahmedabad recorded a 12% YoY increase in residential property values. Satellite, Bopal, and SG Highway remain the most sought-after corridors for mid-to-premium segment buyers.",
    source: "PropTiger Research",
    date: "April 29, 2026",
    url: "https://www.proptiger.com",
    category: "Real Estate",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  },
  {
    id: "3",
    title:
      "SBI Cuts Home Loan Rates to 8.35% — Best Time for First-Time Buyers in Gujarat",
    summary:
      "State Bank of India has reduced home loan interest rates for loans up to ₹30 lakh, making homeownership more accessible. Financial advisors recommend 2026 as an opportune year for first-time buyers in tier-2 cities.",
    source: "Economic Times",
    date: "April 22, 2026",
    url: "https://economictimes.indiatimes.com",
    category: "Home Loans",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80",
  },
  {
    id: "4",
    title:
      "GIFT City Sees Record Investment Inflows; NRI Property Demand Surges by 35%",
    summary:
      "GIFT City in Gandhinagar continues to attract international capital, with NRI property registrations in the Ahmedabad metropolitan area surging 35% compared to the same period last year, driven by favorable exchange rates.",
    source: "Mint",
    date: "April 17, 2026",
    url: "https://www.livemint.com",
    category: "Investment",
    imageUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
  },
  {
    id: "5",
    title:
      "Ahmedabad Metro Phase-2 Expansion Boosts Property Values Along New Corridors",
    summary:
      "Properties within a 2-km radius of upcoming Ahmedabad Metro Phase-2 stations have seen a 15-20% appreciation in enquiries. Analysts predict sustained demand in Motera, Ranip, and Chandkheda over the next 18 months.",
    source: "Times of India",
    date: "April 10, 2026",
    url: "https://timesofindia.indiatimes.com",
    category: "Gujarat",
    imageUrl:
      "https://images.unsplash.com/photo-1565791380713-1756b9a05343?w=600&q=80",
  },
  {
    id: "6",
    title:
      "Budget 2026: Infrastructure Outlay for Gujarat Increases by ₹8,200 Crore",
    summary:
      "The Union Budget allocated a significant boost to Gujarat's infrastructure development, including expressway expansions, BRTS upgrades, and smart city projects in Ahmedabad—expected to unlock new real estate investment hotspots.",
    source: "Business Standard",
    date: "March 30, 2026",
    url: "https://www.business-standard.com",
    category: "Investment",
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
  },
  {
    id: "7",
    title:
      "Redevelopment Boom: Old Ahmedabad Societies Eye RERA-Compliant Rebuild Projects",
    summary:
      "Over 140 older residential societies in Ahmedabad have initiated redevelopment discussions in 2026, driven by improved FSI norms and RERA compliance requirements. Experts note growing demand for pre-launch redevelopment advisory services.",
    source: "Gujarat Samachar Business",
    date: "March 22, 2026",
    url: "https://www.gujaratsamachar.com",
    category: "Real Estate",
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
  },
  {
    id: "8",
    title:
      "Commercial Real Estate in Ahmedabad: Office Spaces Near SG Highway Record Full Occupancy",
    summary:
      "Grade-A office spaces along SG Highway in Ahmedabad achieved 97% occupancy in Q4 2025, with rents up 9% YoY. IT companies and startups are the primary drivers of demand in this premium commercial corridor.",
    source: "Knight Frank India",
    date: "March 15, 2026",
    url: "https://www.knightfrank.co.in",
    category: "Real Estate",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  },
];

export function useGetLatestNews() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NewsArticle[]>({
    queryKey: ["latest-news"],
    queryFn: async () => {
      if (!actor) return PLACEHOLDER_ARTICLES;
      try {
        // Backend may or may not have fetchLatestNews — graceful fallback
        const res = await (
          actor as unknown as { fetchLatestNews?: () => Promise<NewsArticle[]> }
        ).fetchLatestNews?.();
        if (res && Array.isArray(res) && res.length > 0) return res;
        return PLACEHOLDER_ARTICLES;
      } catch {
        return PLACEHOLDER_ARTICLES;
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
