import {
  Building2,
  Calendar,
  Globe,
  Heart,
  Music,
  Scale,
  TrendingUp,
} from "lucide-react";
import type { ElementType } from "react";

interface ServiceLink {
  title: string;
  desc: string;
  href: string;
  icon: ElementType;
}

const SERVICE_MAP: Record<string, ServiceLink[]> = {
  property: [
    {
      title: "Finance & Loans",
      desc: "Home loans, EMI planning, tax benefits",
      href: "/services/finance",
      icon: TrendingUp,
    },
    {
      title: "RERA Consulting",
      desc: "Legal compliance and project verification",
      href: "/services/rera-consulting",
      icon: Scale,
    },
  ],
  finance: [
    {
      title: "Property Search",
      desc: "Find your perfect home in Ahmedabad",
      href: "/property-portal",
      icon: Building2,
    },
    {
      title: "RERA Consulting",
      desc: "Protect your investment with legal guidance",
      href: "/services/rera-consulting",
      icon: Scale,
    },
  ],
  events: [
    {
      title: "Music & Cultural",
      desc: "Live performances and cultural events",
      href: "/services/music-cultural",
      icon: Music,
    },
    {
      title: "NGO & CSR",
      desc: "Community initiatives and social impact",
      href: "/services/ngo-csr",
      icon: Heart,
    },
  ],
  csr: [
    {
      title: "Events & Hospitality",
      desc: "Corporate events and venue management",
      href: "/services/hospitality-events",
      icon: Calendar,
    },
    {
      title: "Media & Tourism",
      desc: "Sports, media and travel services",
      href: "/services/media-sports-tourism",
      icon: Globe,
    },
  ],
};

const DEFAULT_SERVICES: ServiceLink[] = [
  {
    title: "Property Search",
    desc: "Find your perfect home in Ahmedabad",
    href: "/property-portal",
    icon: Building2,
  },
  {
    title: "Finance Tools",
    desc: "EMI calculator, loan eligibility and more",
    href: "/services/finance",
    icon: TrendingUp,
  },
  {
    title: "Events & Hospitality",
    desc: "Corporate events and venue booking",
    href: "/services/hospitality-events",
    icon: Calendar,
  },
];

interface Props {
  currentService?: string;
}

export default function RelatedServices({ currentService = "" }: Props) {
  const services =
    SERVICE_MAP[currentService.toLowerCase()] ?? DEFAULT_SERVICES;

  return (
    <div className="mt-8" data-ocid="related_services.section">
      <p className="text-gray-400 text-sm mb-3">People also enquired about</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <a
              key={s.href}
              href={s.href}
              data-ocid={`related_services.item.${i + 1}`}
              className="flex-shrink-0 w-48 bg-black/40 border border-yellow-600/20 rounded-xl p-4 hover:border-yellow-600/50 transition-all group"
            >
              <Icon className="w-6 h-6 text-yellow-400 mb-2" />
              <p className="text-white text-sm font-semibold group-hover:text-yellow-400 transition-colors">
                {s.title}
              </p>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                {s.desc}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
