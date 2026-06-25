import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, TrendingUp, Users } from "lucide-react";

const PACKAGES = [
  {
    id: 1,
    name: "Gujarat Heritage Circuit",
    days: 7,
    rate: 18500,
    includes: [
      "Ahmedabad old city",
      "Modhera Sun Temple",
      "Patan Patola",
      "Rani ki Vav",
      "Champaner-Pavagadh",
    ],
    minGroup: 2,
    maxGroup: 30,
    category: "Heritage",
  },
  {
    id: 2,
    name: "Rann of Kutch White Desert Safari",
    days: 4,
    rate: 14000,
    includes: [
      "Great Rann sunrise camp",
      "Kalo Dungar",
      "Bhuj old city",
      "Kutchi artisans",
      "Tent stay",
    ],
    minGroup: 2,
    maxGroup: 20,
    category: "Adventure",
  },
  {
    id: 3,
    name: "Gir Lion Safari & Somnath",
    days: 3,
    rate: 9500,
    includes: [
      "Gir Forest 2 safaris",
      "Somnath temple",
      "Diu beach",
      "Heritage hotel stay",
    ],
    minGroup: 2,
    maxGroup: 15,
    category: "Wildlife",
  },
  {
    id: 4,
    name: "Ahmedabad City Heritage Walk",
    days: 1,
    rate: 2500,
    includes: [
      "Manek Chowk",
      "Swaminarayan Mandir",
      "Calico Textile Museum",
      "Ellis Bridge",
      "Heritage meals",
    ],
    minGroup: 1,
    maxGroup: 25,
    category: "City Tour",
  },
  {
    id: 5,
    name: "Saurashtra Pilgrimage Tour",
    days: 5,
    rate: 12000,
    includes: [
      "Dwarka Dwarkadhish",
      "Nageshwar Jyotirlinga",
      "Bet Dwarka",
      "Porbandar Gandhi birthplace",
      "Upleta",
    ],
    minGroup: 4,
    maxGroup: 40,
    category: "Pilgrimage",
  },
];

const BOOKINGS = [
  {
    id: 1,
    client: "Mehta Family Group",
    package: "Gujarat Heritage Circuit",
    dates: "2026-11-15 to 2026-11-21",
    size: 6,
    status: "Confirmed",
    paid: 111000,
  },
  {
    id: 2,
    client: "TCS Team Outing",
    package: "Rann of Kutch White Desert Safari",
    dates: "2026-12-01 to 2026-12-04",
    size: 18,
    status: "Deposit Paid",
    paid: 126000,
  },
  {
    id: 3,
    client: "Patel NRI Family",
    package: "Gir Lion Safari & Somnath",
    dates: "2026-10-20 to 2026-10-22",
    size: 4,
    status: "Confirmed",
    paid: 38000,
  },
  {
    id: 4,
    client: "Joshi Corporate",
    package: "Ahmedabad City Heritage Walk",
    dates: "2026-09-14",
    size: 22,
    status: "Paid",
    paid: 55000,
  },
  {
    id: 5,
    client: "ISRO Retirees Club",
    package: "Saurashtra Pilgrimage Tour",
    dates: "2026-11-05 to 2026-11-09",
    size: 14,
    status: "Enquiry",
    paid: 0,
  },
];

const DESTINATIONS = [
  {
    id: 1,
    name: "Rann of Kutch",
    peak: "Nov–Feb",
    avgSpend: 14000,
    attractions: "White salt desert, folk art, camping",
    demand: 95,
  },
  {
    id: 2,
    name: "Gir National Park",
    peak: "Dec–Apr",
    avgSpend: 9800,
    attractions: "Asiatic lions, wildlife safaris",
    demand: 88,
  },
  {
    id: 3,
    name: "Ahmedabad Old City",
    peak: "Oct–Mar",
    avgSpend: 3500,
    attractions: "Heritage havelis, UNESCO city walk",
    demand: 92,
  },
  {
    id: 4,
    name: "Somnath & Dwarka",
    peak: "Oct–Feb",
    avgSpend: 7500,
    attractions: "Sacred temples, pilgrimage sites",
    demand: 80,
  },
  {
    id: 5,
    name: "Saputara Hill Station",
    peak: "Jun–Sep",
    avgSpend: 5000,
    attractions: "Tribal culture, eco-trekking",
    demand: 70,
  },
  {
    id: 6,
    name: "Patan & Modhera",
    peak: "Oct–Mar",
    avgSpend: 4500,
    attractions: "Sun Temple, Patan UNESCO stepwell",
    demand: 76,
  },
];

const CAT_COLORS: Record<string, string> = {
  Heritage: "bg-gold-800/30 text-gold-300 border-gold-700/40",
  Adventure: "bg-blue-900/30 text-blue-300 border-blue-700/40",
  Wildlife: "bg-green-900/30 text-green-300 border-green-700/40",
  "City Tour": "bg-purple-900/30 text-purple-300 border-purple-700/40",
  Pilgrimage: "bg-orange-900/30 text-orange-300 border-orange-700/40",
};

const STATUS_STYLE: Record<string, string> = {
  Confirmed: "bg-green-900/30 text-green-300 border-green-700/40",
  "Deposit Paid": "bg-blue-900/30 text-blue-300 border-blue-700/40",
  Paid: "bg-gold-800/30 text-gold-300 border-gold-700/40",
  Enquiry: "bg-amber-900/30 text-amber-300 border-amber-700/40",
};

export default function TourismAdminPage() {
  return (
    <SecureAppGate>
      <div className="min-h-screen bg-[#06090f] text-gold-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1
              className="text-2xl font-bold text-gold-400"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Tourism Planner
            </h1>
            <p className="text-sm text-muted-foreground">
              Gujarat tour packages, group bookings & destination intelligence
            </p>
          </div>

          {/* Packages */}
          <div>
            <h2 className="font-bold text-gold-300 mb-3">Package Templates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PACKAGES.map((p, i) => (
                <div
                  key={p.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 space-y-3"
                  data-ocid={`tourism.package.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      {p.name}
                    </h3>
                    <Badge
                      className={`${CAT_COLORS[p.category]} text-[10px] flex-shrink-0`}
                    >
                      {p.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gold-400 font-bold">
                      ₹{p.rate.toLocaleString("en-IN")}/person
                    </span>
                    <span className="text-muted-foreground">{p.days} days</span>
                  </div>
                  <ul className="space-y-0.5">
                    {p.includes.slice(0, 3).map((item) => (
                      <li
                        key={item}
                        className="text-[10px] text-muted-foreground flex items-start gap-1"
                      >
                        <span className="text-gold-600 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                    {p.includes.length > 3 && (
                      <li className="text-[10px] text-gold-600">
                        +{p.includes.length - 3} more inclusions
                      </li>
                    )}
                  </ul>
                  <p className="text-[10px] text-muted-foreground">
                    Group: {p.minGroup}–{p.maxGroup} pax
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings */}
          <div className="bg-card/80 border border-gold-800/30 rounded-xl p-4">
            <h2 className="font-bold text-gold-300 mb-3">
              Group Booking Manager
            </h2>
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                data-ocid="tourism.bookings.table"
              >
                <thead>
                  <tr className="border-b border-gold-800/30">
                    {[
                      "Client",
                      "Package",
                      "Dates",
                      "Size",
                      "Status",
                      "Amount Paid",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 text-xs text-muted-foreground font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BOOKINGS.map((b, i) => (
                    <tr
                      key={b.id}
                      className="border-b border-gold-800/10 hover:bg-gold-900/10"
                      data-ocid={`tourism.booking.item.${i + 1}`}
                    >
                      <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                        {b.client}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">
                        {b.package}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground text-xs whitespace-nowrap">
                        {b.dates}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gold-400" />
                          <span>{b.size}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          className={`${STATUS_STYLE[b.status]} text-[10px]`}
                        >
                          {b.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-green-400 font-semibold">
                        ₹{b.paid.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h2 className="font-bold text-gold-300 mb-3">
              Destination Intelligence
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DESTINATIONS.map((d, i) => (
                <div
                  key={d.id}
                  className="bg-card/80 border border-gold-800/30 rounded-xl p-4 space-y-2"
                  data-ocid={`tourism.destination.item.${i + 1}`}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                    <h3 className="text-sm font-bold text-foreground">
                      {d.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {d.attractions}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gold-400 font-semibold">
                        {d.peak}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Peak Season
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-400 font-semibold">
                        ₹{d.avgSpend.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Avg/Person
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-400 font-semibold">
                        {d.demand}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Demand
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-500/60 rounded-full"
                      style={{ width: `${d.demand}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
