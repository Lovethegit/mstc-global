import TutorialFloatingButton from "@/components/TutorialFloatingButton";
import SecureAppGate from "@/components/shared/SecureAppGate";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Archive,
  Building2,
  CheckCircle,
  Edit3,
  Home,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Property = {
  id: number;
  title: string;
  type: string;
  location: string;
  price: number;
  area: number;
  status: string;
  action: string;
  addedDate: string;
  description: string;
};

const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Prahlad Nagar 3BHK Luxury Flat",
    type: "Flat",
    location: "Prahladnagar",
    price: 8500000,
    area: 1850,
    status: "Active",
    action: "Buy",
    addedDate: "2025-01-10",
    description:
      "Premium 3BHK with modular kitchen, 3 bathrooms, 2 parking, gated society",
  },
  {
    id: 2,
    title: "SG Highway Commercial Office",
    type: "Office",
    location: "SG Highway",
    price: 12000000,
    area: 2200,
    status: "Active",
    action: "Buy",
    addedDate: "2025-01-15",
    description:
      "Ground floor commercial office in prime SG Highway plaza, full fit-out",
  },
  {
    id: 3,
    title: "Bodakdev Independent Villa",
    type: "Villa",
    location: "Bodakdev",
    price: 22000000,
    area: 3800,
    status: "Active",
    action: "Buy",
    addedDate: "2025-01-22",
    description:
      "5BHK independent villa with terrace garden, home theatre, 4-car parking",
  },
  {
    id: 4,
    title: "Navrangpura Residential Plot",
    type: "Plot",
    location: "Navrangpura",
    price: 6500000,
    area: 3200,
    status: "Active",
    action: "Buy",
    addedDate: "2025-02-01",
    description: "Residential AUDA-approved plot, 200 sqyd, near CG Road",
  },
  {
    id: 5,
    title: "Satellite 2BHK Apartment",
    type: "Flat",
    location: "Satellite",
    price: 22000,
    area: 1100,
    status: "Active",
    action: "Rent",
    addedDate: "2025-02-05",
    description: "Semi-furnished 2BHK, 2nd floor, society with pool and gym",
  },
  {
    id: 6,
    title: "Vastrapur Lake View Flat",
    type: "Flat",
    location: "Vastrapur",
    price: 7200000,
    area: 1600,
    status: "Under Review",
    action: "Buy",
    addedDate: "2025-02-10",
    description: "3BHK lake facing flat, premium finishes, covered parking",
  },
  {
    id: 7,
    title: "Maninagar Industrial Shed",
    type: "Commercial",
    location: "Maninagar",
    price: 45000,
    area: 5000,
    status: "Active",
    action: "Rent",
    addedDate: "2025-02-14",
    description:
      "5,000 sqft industrial shed with 3-phase power, loading bay, office space",
  },
  {
    id: 8,
    title: "Prahladnagar Garden Row House",
    type: "Villa",
    location: "Prahladnagar",
    price: 14500000,
    area: 3600,
    status: "Sold",
    action: "Buy",
    addedDate: "2025-01-05",
    description:
      "4BHK row house with private garden, modular kitchen, 2 parking",
  },
  {
    id: 9,
    title: "Thaltej Commercial Shop",
    type: "Shop",
    location: "Thaltej",
    price: 4800000,
    area: 450,
    status: "Active",
    action: "Buy",
    addedDate: "2025-02-20",
    description:
      "Ground floor retail shop on main road, high footfall location",
  },
  {
    id: 10,
    title: "Bopal 2BHK Affordable Flat",
    type: "Flat",
    location: "Bopal",
    price: 3800000,
    area: 980,
    status: "Active",
    action: "Buy",
    addedDate: "2025-02-25",
    description:
      "Budget 2BHK in gated complex, ready-to-move, near school & market",
  },
  {
    id: 11,
    title: "Chandkheda 3BHK New Launch",
    type: "Flat",
    location: "Chandkheda",
    price: 5200000,
    area: 1450,
    status: "Active",
    action: "Buy",
    addedDate: "2025-03-01",
    description:
      "RERA-registered 3BHK, under construction, possession Dec 2026",
  },
  {
    id: 12,
    title: "Gota Residential Land",
    type: "Plot",
    location: "Gota",
    price: 2800000,
    area: 2400,
    status: "Active",
    action: "Buy",
    addedDate: "2025-03-05",
    description:
      "150 sqyd corner plot on 40ft road, NA-approved, immediate sale",
  },
  {
    id: 13,
    title: "Motera 2BHK Flat",
    type: "Flat",
    location: "Motera",
    price: 28000,
    area: 1050,
    status: "Active",
    action: "Rent",
    addedDate: "2025-03-10",
    description:
      "Fully furnished 2BHK near Narendra Modi Stadium, excellent connectivity",
  },
  {
    id: 14,
    title: "Navrangpura Commercial Office",
    type: "Office",
    location: "Navrangpura",
    price: 95000,
    area: 1200,
    status: "Active",
    action: "Rent",
    addedDate: "2025-03-12",
    description:
      "Prime CG Road office, 1,200 sqft, 6th floor, city view, ready to occupy",
  },
  {
    id: 15,
    title: "Satellite Premium Villa",
    type: "Villa",
    location: "Satellite",
    price: 18500000,
    area: 4200,
    status: "Under Review",
    action: "Buy",
    addedDate: "2025-03-15",
    description:
      "Ultra-luxury 5BHK duplex villa, Italian marble, smart home automation",
  },
  {
    id: 16,
    title: "Prahladnagar Studio Apartment",
    type: "Flat",
    location: "Prahladnagar",
    price: 14000,
    area: 550,
    status: "Active",
    action: "Rent",
    addedDate: "2025-03-18",
    description:
      "Compact studio for working professionals, Wi-Fi included, near metro",
  },
  {
    id: 17,
    title: "Thaltej IT Park Office",
    type: "Office",
    location: "Thaltej",
    price: 30000000,
    area: 8500,
    status: "Active",
    action: "Buy",
    addedDate: "2025-03-20",
    description:
      "Full floor IT park office, LEED certified, 100+ workstations capacity",
  },
  {
    id: 18,
    title: "Bopal Duplex Villa",
    type: "Villa",
    location: "Bopal",
    price: 12800000,
    area: 2800,
    status: "Active",
    action: "Buy",
    addedDate: "2025-03-22",
    description:
      "Modern duplex villa, 4BHK, private terrace, 3-car garage, smart locks",
  },
  {
    id: 19,
    title: "Gota Industrial Plot",
    type: "Plot",
    location: "Gota",
    price: 8500000,
    area: 6000,
    status: "Active",
    action: "Buy",
    addedDate: "2025-03-25",
    description:
      "Industrial zone plot 375 sqyd, GIDC-adjacent, road-facing, clear title",
  },
  {
    id: 20,
    title: "Chandkheda 1BHK Starter Flat",
    type: "Flat",
    location: "Chandkheda",
    price: 1800000,
    area: 620,
    status: "Sold",
    action: "Buy",
    addedDate: "2025-01-20",
    description: "Affordable 1BHK, ready possession, first-home buyer deal",
  },
  {
    id: 21,
    title: "Maninagar 3BHK Resale",
    type: "Flat",
    location: "Maninagar",
    price: 3500000,
    area: 1300,
    status: "Active",
    action: "Buy",
    addedDate: "2025-04-01",
    description: "Well-maintained resale 3BHK, original owner, no broker",
  },
  {
    id: 22,
    title: "Vastrapur Commercial Strip",
    type: "Shop",
    location: "Vastrapur",
    price: 180000,
    area: 800,
    status: "Active",
    action: "Rent",
    addedDate: "2025-04-03",
    description:
      "Three connecting shops on busy road, ideal for showroom or food outlet",
  },
  {
    id: 23,
    title: "SG Highway Penthouse",
    type: "Flat",
    location: "SG Highway",
    price: 32000000,
    area: 4800,
    status: "Under Review",
    action: "Buy",
    addedDate: "2025-04-05",
    description:
      "Sky penthouse, 4,800 sqft, 360° city views, private pool, elevator",
  },
  {
    id: 24,
    title: "Bodakdev Commercial Showroom",
    type: "Shop",
    location: "Bodakdev",
    price: 9200000,
    area: 1200,
    status: "Active",
    action: "Buy",
    addedDate: "2025-04-08",
    description:
      "Double height showroom, corner position, main road frontage, ample parking",
  },
  {
    id: 25,
    title: "Navrangpura 4BHK Flat",
    type: "Flat",
    location: "Navrangpura",
    price: 11500000,
    area: 2400,
    status: "Active",
    action: "Buy",
    addedDate: "2025-04-10",
    description:
      "Spacious 4BHK with servant quarters, 2 balconies, 3-car parking",
  },
  {
    id: 26,
    title: "Satellite IT Office Lease",
    type: "Office",
    location: "Satellite",
    price: 55000,
    area: 800,
    status: "Active",
    action: "Rent",
    addedDate: "2025-04-12",
    description:
      "800 sqft plug-and-play office, 24/7 AC, backup power, security",
  },
  {
    id: 27,
    title: "Thaltej Residential Plot",
    type: "Plot",
    location: "Thaltej",
    price: 5800000,
    area: 4000,
    status: "Active",
    action: "Buy",
    addedDate: "2025-04-15",
    description:
      "250 sqyd AUDA-approved plot, 60ft road frontage, premium location",
  },
  {
    id: 28,
    title: "Motera Commercial Warehouse",
    type: "Commercial",
    location: "Motera",
    price: 75000,
    area: 8000,
    status: "Active",
    action: "Rent",
    addedDate: "2025-04-18",
    description:
      "8,000 sqft warehouse, fire NOC, CCTV, truck docking bay, 5km from NH48",
  },
  {
    id: 29,
    title: "Prahladnagar 2BHK Compact",
    type: "Flat",
    location: "Prahladnagar",
    price: 5800000,
    area: 1150,
    status: "Sold",
    action: "Buy",
    addedDate: "2025-02-28",
    description: "Sold in 3 weeks — premium location, quick possession",
  },
  {
    id: 30,
    title: "Bopal Agricultural Land",
    type: "Plot",
    location: "Bopal",
    price: 3200000,
    area: 12000,
    status: "Active",
    action: "Buy",
    addedDate: "2025-04-20",
    description:
      "750 sqyd agricultural land convertible to NA, near upcoming metro",
  },
  {
    id: 31,
    title: "Chandkheda Rental Shop",
    type: "Shop",
    location: "Chandkheda",
    price: 22000,
    area: 350,
    status: "Active",
    action: "Rent",
    addedDate: "2025-04-22",
    description:
      "Ground floor shop on highway, bank ATM nearby, strong footfall",
  },
  {
    id: 32,
    title: "Gota 2BHK New Build",
    type: "Flat",
    location: "Gota",
    price: 4100000,
    area: 1020,
    status: "Active",
    action: "Buy",
    addedDate: "2025-04-25",
    description:
      "New construction 2BHK, RERA approved, semi-furnished, solar panels",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-green-900/20 text-green-300 border-green-800/30",
  "Under Review": "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
  Sold: "bg-blue-900/20 text-blue-300 border-blue-800/30",
};

const ALL_TYPES = [
  "All",
  "Flat",
  "Villa",
  "Plot",
  "Office",
  "Shop",
  "Commercial",
];
const ALL_LOCATIONS = [
  "All",
  "Prahladnagar",
  "SG Highway",
  "Bodakdev",
  "Navrangpura",
  "Satellite",
  "Vastrapur",
  "Maninagar",
  "Thaltej",
  "Bopal",
  "Chandkheda",
  "Gota",
  "Motera",
];
const ALL_STATUSES = ["All", "Active", "Under Review", "Sold"];

export default function PropertiesAdminPage() {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [showImport, setShowImport] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState<Partial<Property>>({});
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAction, setFilterAction] = useState("All");
  const [addForm, setAddForm] = useState({
    title: "",
    type: "Flat",
    location: "Prahladnagar",
    price: "",
    area: "",
    description: "",
    status: "Active",
    action: "Buy",
  });

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      const matchType = filterType === "All" || p.type === filterType;
      const matchLocation =
        filterLocation === "All" || p.location === filterLocation;
      const matchStatus = filterStatus === "All" || p.status === filterStatus;
      const matchAction = filterAction === "All" || p.action === filterAction;
      return (
        matchSearch && matchType && matchLocation && matchStatus && matchAction
      );
    });
  }, [
    properties,
    search,
    filterType,
    filterLocation,
    filterStatus,
    filterAction,
  ]);

  const totalCount = properties.length;
  const activeCount = properties.filter((p) => p.status === "Active").length;
  const reviewCount = properties.filter(
    (p) => p.status === "Under Review",
  ).length;
  const soldCount = properties.filter((p) => p.status === "Sold").length;

  function openEdit(p: Property) {
    setEditProperty(p);
    setEditForm({
      title: p.title,
      type: p.type,
      location: p.location,
      price: p.price,
      area: p.area,
      status: p.status,
      action: p.action,
      description: p.description,
    });
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editProperty) return;
    setProperties((prev) =>
      prev.map((p) =>
        p.id === editProperty.id
          ? {
              ...p,
              ...editForm,
              price: Number(editForm.price ?? p.price),
              area: Number(editForm.area ?? p.area),
            }
          : p,
      ),
    );
    setEditProperty(null);
    toast.success("Property updated");
  }

  function handleDelete(p: Property) {
    setProperties((prev) => prev.filter((x) => x.id !== p.id));
    setDeleteConfirm(null);
    toast.success("Property deleted");
  }

  const formatPrice = (p: Property) =>
    p.action === "Rent"
      ? `₹${p.price.toLocaleString()}/mo`
      : p.price >= 10000000
        ? `₹${(p.price / 10000000).toFixed(2)} Cr`
        : `₹${(p.price / 100000).toFixed(0)}L`;

  return (
    <SecureAppGate appName="Property Manager">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="properties_admin.page"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <a
                href="/master"
                className="text-gold-600 hover:text-gold-400 transition-colors text-xs"
                data-ocid="properties_admin.back_link"
              >
                ← Master
              </a>
              <span className="text-gold-700/40">/</span>
              <Home className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Property Manager
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowImport(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-800/40 text-gold-500 text-xs hover:border-gold-600/50 transition-colors"
                data-ocid="properties_admin.import_button"
              >
                <Upload className="w-3.5 h-3.5" /> Import Excel
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
                data-ocid="properties_admin.add_button"
              >
                <Plus className="w-3.5 h-3.5" /> Add Property
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              {
                label: "Total Properties",
                value: totalCount,
                color: "text-gold-400",
                icon: Building2,
              },
              {
                label: "Active Listings",
                value: activeCount,
                color: "text-green-400",
                icon: CheckCircle,
              },
              {
                label: "Under Review",
                value: reviewCount,
                color: "text-yellow-400",
                icon: Edit3,
              },
              {
                label: "Sold",
                value: soldCount,
                color: "text-blue-400",
                icon: Archive,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className={`font-serif text-xl font-bold ${s.color}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties..."
                className="pl-8 bg-card border-gold-800/30 text-foreground text-sm"
                data-ocid="properties_admin.search_input"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger
                className="w-28 bg-card border-gold-800/30 text-xs"
                data-ocid="properties_admin.type_filter"
              >
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-gold-800/40">
                {ALL_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger
                className="w-36 bg-card border-gold-800/30 text-xs"
                data-ocid="properties_admin.location_filter"
              >
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-card border-gold-800/40">
                {ALL_LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger
                className="w-32 bg-card border-gold-800/30 text-xs"
                data-ocid="properties_admin.status_filter"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-gold-800/40">
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger
                className="w-24 bg-card border-gold-800/30 text-xs"
                data-ocid="properties_admin.action_filter"
              >
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent className="bg-card border-gold-800/40">
                {["All", "Buy", "Rent"].map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gold-800/30">
            <table className="w-full text-sm">
              <thead className="bg-card border-b border-gold-800/30">
                <tr>
                  {[
                    "ID",
                    "Title",
                    "Type",
                    "Location",
                    "Price",
                    "Area (sqft)",
                    "Status",
                    "Added",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-medium text-gold-600 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-gold-800/20 hover:bg-card/60 transition-colors"
                    data-ocid={`properties_admin.item.${i + 1}`}
                  >
                    <td className="px-3 py-2.5 text-xs text-muted-foreground font-mono">
                      #{p.id.toString().padStart(3, "0")}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground max-w-[180px] truncate">
                      <button
                        type="button"
                        onClick={() => setSelectedProperty(p)}
                        className="text-left hover:text-gold-400 transition-colors"
                        data-ocid={`properties_admin.title.${i + 1}`}
                      >
                        {p.title}
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {p.type}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {p.location}
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold text-gold-400 whitespace-nowrap">
                      {formatPrice(p)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">
                      {p.area.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge
                        variant="outline"
                        className={`text-xs border whitespace-nowrap ${STATUS_COLORS[p.status] ?? ""}`}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {p.addedDate}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="px-2 py-1 rounded text-xs border border-gold-800/40 text-gold-600 hover:text-gold-400 transition-colors"
                          data-ocid={`properties_admin.edit_button.${i + 1}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(p)}
                          className="px-2 py-1 rounded text-xs border border-red-900/30 text-red-400 hover:border-red-700/50 transition-colors"
                          data-ocid={`properties_admin.delete_button.${i + 1}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div
                className="text-center py-10 text-muted-foreground text-sm"
                data-ocid="properties_admin.empty_state"
              >
                No properties match your filters
              </div>
            )}
          </div>
        </div>

        {/* Edit Property Modal */}
        {editProperty && (
          <Dialog open onOpenChange={() => setEditProperty(null)}>
            <DialogContent
              className="bg-card border-gold-700/40 text-foreground max-w-lg"
              data-ocid="properties_admin.edit_dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-serif text-gold-400">
                  Edit Property
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleEditSubmit}
                className="space-y-3 max-h-[65vh] overflow-y-auto pr-1"
              >
                <div>
                  <Label className="text-xs text-gold-600">Title</Label>
                  <Input
                    value={editForm.title ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold-800/40"
                    data-ocid="properties_admin.edit.title_input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gold-600">Price (₹)</Label>
                    <Input
                      type="number"
                      value={editForm.price ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          price: Number(e.target.value),
                        }))
                      }
                      className="mt-1 bg-background border-gold-800/40"
                      data-ocid="properties_admin.edit.price_input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gold-600">Area (sqft)</Label>
                    <Input
                      type="number"
                      value={editForm.area ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          area: Number(e.target.value),
                        }))
                      }
                      className="mt-1 bg-background border-gold-800/40"
                      data-ocid="properties_admin.edit.area_input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gold-600">Status</Label>
                    <Select
                      value={editForm.status ?? "Active"}
                      onValueChange={(v) =>
                        setEditForm((f) => ({ ...f, status: v }))
                      }
                    >
                      <SelectTrigger
                        className="mt-1 bg-background border-gold-800/40"
                        data-ocid="properties_admin.edit.status_select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-gold-800/40">
                        {ALL_STATUSES.slice(1).map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gold-600">Transaction</Label>
                    <Select
                      value={editForm.action ?? "Buy"}
                      onValueChange={(v) =>
                        setEditForm((f) => ({ ...f, action: v }))
                      }
                    >
                      <SelectTrigger
                        className="mt-1 bg-background border-gold-800/40"
                        data-ocid="properties_admin.edit.action_select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-gold-800/40">
                        <SelectItem value="Buy">For Sale</SelectItem>
                        <SelectItem value="Rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gold-600">Description</Label>
                  <textarea
                    value={editForm.description ?? ""}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-1 w-full rounded-md border border-gold-800/40 bg-background text-foreground text-sm px-3 py-2 resize-none focus:outline-none"
                    data-ocid="properties_admin.edit.description_textarea"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditProperty(null)}
                    className="flex-1 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm"
                    data-ocid="properties_admin.edit.cancel_button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gold-700/30 hover:bg-gold-700/40 text-gold-300 text-sm font-medium"
                    data-ocid="properties_admin.edit.submit_button"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirm Dialog */}
        {deleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setDeleteConfirm(null)}
              onKeyDown={() => {}}
            />
            <div
              className="relative bg-card border border-red-700/40 rounded-2xl p-5 w-full max-w-sm"
              data-ocid="properties_admin.delete_dialog"
            >
              <h2 className="font-serif font-bold text-foreground mb-2">
                Delete Property?
              </h2>
              <p className="text-sm text-muted-foreground mb-1">
                {deleteConfirm.title}
              </p>
              <p className="text-xs text-red-400 mb-4">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm"
                  data-ocid="properties_admin.delete.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2 rounded-lg bg-red-700/30 hover:bg-red-700/40 text-red-300 text-sm font-medium"
                  data-ocid="properties_admin.delete.confirm_button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Property Detail Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setSelectedProperty(null)}
              onKeyDown={() => {}}
              role="button"
              tabIndex={-1}
            />
            <div
              className="relative bg-card border border-gold-700/40 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
              data-ocid="properties_admin.detail_dialog"
            >
              <div className="sticky top-0 bg-card border-b border-gold-800/30 px-5 py-4 flex items-center justify-between">
                <h2 className="font-serif text-base font-bold text-gold-400 pr-4 line-clamp-1">
                  {selectedProperty.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedProperty(null)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-gold-800/40 text-muted-foreground hover:text-foreground hover:border-gold-600/50 transition-colors"
                  data-ocid="properties_admin.detail.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Type", value: selectedProperty.type },
                    { label: "Location", value: selectedProperty.location },
                    { label: "Price", value: formatPrice(selectedProperty) },
                    {
                      label: "Area",
                      value: `${selectedProperty.area.toLocaleString()} sqft`,
                    },
                    { label: "Status", value: selectedProperty.status },
                    {
                      label: "Transaction",
                      value:
                        selectedProperty.action === "Buy"
                          ? "For Sale"
                          : "For Rent",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-background/50 border border-gold-800/20 p-3"
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-background/50 border border-gold-800/20 p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedProperty.description}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-900/10 border border-amber-800/30 p-3">
                  <p className="text-xs text-amber-400 font-medium mb-1">
                    🔒 Photo Policy
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Public photographs are not displayed per MSTC GLOBAL policy.
                    Property details and site visits arranged privately by
                    appointment.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-700/20 hover:bg-gold-700/30 text-gold-400 text-sm font-medium transition-colors"
                    data-ocid="properties_admin.detail.edit_button"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Details
                  </button>
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700/20 hover:bg-blue-700/30 text-blue-400 text-sm font-medium transition-colors"
                    data-ocid="properties_admin.detail.mark_sold_button"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark Sold
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground text-sm font-medium transition-colors"
                    data-ocid="properties_admin.detail.archive_button"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Property Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent
            className="bg-card border-gold-700/40 text-foreground max-w-lg"
            data-ocid="properties_admin.add_dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-serif text-gold-400">
                Add New Property
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <Label className="text-xs text-gold-600">Title</Label>
                <Input
                  value={addForm.title}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. Prahlad Nagar 3BHK Luxury Flat"
                  className="mt-1 bg-background border-gold-800/40"
                  data-ocid="properties_admin.add.title_input"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gold-600">Type</Label>
                  <Select
                    value={addForm.type}
                    onValueChange={(v) =>
                      setAddForm((p) => ({ ...p, type: v }))
                    }
                  >
                    <SelectTrigger
                      className="mt-1 bg-background border-gold-800/40"
                      data-ocid="properties_admin.add.type_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-gold-800/40">
                      {[
                        "Flat",
                        "Villa",
                        "Plot",
                        "Office",
                        "Shop",
                        "Commercial",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gold-600">Location</Label>
                  <Select
                    value={addForm.location}
                    onValueChange={(v) =>
                      setAddForm((p) => ({ ...p, location: v }))
                    }
                  >
                    <SelectTrigger
                      className="mt-1 bg-background border-gold-800/40"
                      data-ocid="properties_admin.add.location_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-gold-800/40">
                      {ALL_LOCATIONS.slice(1).map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gold-600">Price (₹)</Label>
                  <Input
                    value={addForm.price}
                    onChange={(e) =>
                      setAddForm((p) => ({ ...p, price: e.target.value }))
                    }
                    placeholder="e.g. 8500000"
                    className="mt-1 bg-background border-gold-800/40"
                    data-ocid="properties_admin.add.price_input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gold-600">Area (sq ft)</Label>
                  <Input
                    value={addForm.area}
                    onChange={(e) =>
                      setAddForm((p) => ({ ...p, area: e.target.value }))
                    }
                    placeholder="e.g. 1850"
                    className="mt-1 bg-background border-gold-800/40"
                    data-ocid="properties_admin.add.area_input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gold-600">Transaction</Label>
                  <Select
                    value={addForm.action}
                    onValueChange={(v) =>
                      setAddForm((p) => ({ ...p, action: v }))
                    }
                  >
                    <SelectTrigger
                      className="mt-1 bg-background border-gold-800/40"
                      data-ocid="properties_admin.add.action_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-gold-800/40">
                      <SelectItem value="Buy">For Sale</SelectItem>
                      <SelectItem value="Rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gold-600">Status</Label>
                  <Select
                    value={addForm.status}
                    onValueChange={(v) =>
                      setAddForm((p) => ({ ...p, status: v }))
                    }
                  >
                    <SelectTrigger
                      className="mt-1 bg-background border-gold-800/40"
                      data-ocid="properties_admin.add.status_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-gold-800/40">
                      {ALL_STATUSES.slice(1).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs text-gold-600">Description</Label>
                <textarea
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Key features, specifications, USPs..."
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gold-800/40 bg-background text-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-gold-700/50"
                  data-ocid="properties_admin.add.description_textarea"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gold-800/40 text-muted-foreground text-sm hover:border-gold-600/50 transition-colors"
                  data-ocid="properties_admin.add.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gold-700/30 hover:bg-gold-700/40 text-gold-300 text-sm font-medium transition-colors"
                  data-ocid="properties_admin.add.submit_button"
                >
                  Add Property
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Import Modal */}
        {showImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowImport(false)}
              onKeyDown={() => {}}
              role="button"
              tabIndex={-1}
            />
            <div
              className="relative bg-card border border-gold-700/40 rounded-2xl p-6 w-full max-w-md"
              data-ocid="properties_admin.import_dialog"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-bold text-gold-400">
                  Import from Excel
                </h2>
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gold-800/40 text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="properties_admin.import.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div
                className="border-2 border-dashed border-gold-700/40 rounded-xl p-8 text-center mb-4"
                data-ocid="properties_admin.dropzone"
              >
                <Upload className="w-10 h-10 text-gold-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop CSV or Excel file here
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Supports XLS, XLSX, CSV — auto column mapping
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer px-4 py-2 rounded-lg bg-gold-700/20 text-gold-400 text-sm hover:bg-gold-700/30 transition-colors"
                  data-ocid="properties_admin.upload_button"
                >
                  Choose File
                </label>
              </div>
              <div className="rounded-xl bg-background/50 border border-gold-800/20 p-3 mb-4">
                <p className="text-xs font-medium text-gold-600 mb-1">
                  Required columns:
                </p>
                <p className="text-xs text-muted-foreground">
                  Title, Type, Location, Price, Area (sqft), Status,
                  Description. Fuzzy matching handles column name variations
                  automatically.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <TutorialFloatingButton />
    </SecureAppGate>
  );
}
