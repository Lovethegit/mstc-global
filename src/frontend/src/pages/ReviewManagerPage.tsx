import BackButton from "@/components/ui/BackButton";
import CloseButton from "@/components/ui/CloseButton";
import Modal from "@/components/ui/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Plus,
  Reply,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const REVIEWS = [
  {
    id: 1,
    reviewer: "Ramesh Patel",
    rating: 5,
    date: "2026-05-20",
    service: "Property Purchase",
    comment:
      "Excellent service! Team was very professional and helped us find our dream home in Bopal.",
    status: "Published",
    replied: true,
  },
  {
    id: 2,
    reviewer: "Priya Mehta",
    rating: 5,
    date: "2026-05-18",
    service: "Finance Consulting",
    comment:
      "Got home loan at lowest rate. Very efficient process, completed in 12 days.",
    status: "Published",
    replied: true,
  },
  {
    id: 3,
    reviewer: "Suresh Shah",
    rating: 4,
    date: "2026-05-17",
    service: "RERA Consulting",
    comment:
      "Good knowledge of RERA regulations. Helped resolve builder dispute quickly.",
    status: "Published",
    replied: false,
  },
  {
    id: 4,
    reviewer: "Anjali Desai",
    rating: 5,
    date: "2026-05-15",
    service: "Commercial Rental",
    comment:
      "Found the perfect office space in SG Highway within our budget. Highly recommended!",
    status: "Published",
    replied: true,
  },
  {
    id: 5,
    reviewer: "Vikram Joshi",
    rating: 4,
    date: "2026-05-14",
    service: "Property Purchase",
    comment:
      "Smooth transaction for 3BHK in Prahlad Nagar. All paperwork handled perfectly.",
    status: "Published",
    replied: true,
  },
  {
    id: 6,
    reviewer: "Meena Trivedi",
    rating: 5,
    date: "2026-05-12",
    service: "Investment Advisory",
    comment:
      "Outstanding ROI on commercial property investment. Will invest again with MSTC.",
    status: "Published",
    replied: false,
  },
  {
    id: 7,
    reviewer: "Kiran Agarwal",
    rating: 3,
    date: "2026-05-10",
    service: "Rental Management",
    comment:
      "Service was okay, some delays in tenant verification but resolved eventually.",
    status: "Pending",
    replied: false,
  },
  {
    id: 8,
    reviewer: "Deepak Rana",
    rating: 5,
    date: "2026-05-08",
    service: "Property Sale",
    comment:
      "Sold my Satellite property 15% above market rate. Brilliant negotiation by the team.",
    status: "Published",
    replied: true,
  },
  {
    id: 9,
    reviewer: "Nisha Kapoor",
    rating: 4,
    date: "2026-05-07",
    service: "Event Hospitality",
    comment:
      "Corporate event at The Grand Bhagwati was flawless. Great coordination from MSTC.",
    status: "Published",
    replied: true,
  },
  {
    id: 10,
    reviewer: "Ajay Sharma",
    rating: 5,
    date: "2026-05-05",
    service: "Property Purchase",
    comment:
      "Excellent guidance on under-construction project in Science City area.",
    status: "Published",
    replied: true,
  },
  {
    id: 11,
    reviewer: "Sunita Pillai",
    rating: 4,
    date: "2026-05-03",
    service: "NRI Services",
    comment:
      "Very helpful for NRI property purchase. Power of attorney process was smooth.",
    status: "Published",
    replied: false,
  },
  {
    id: 12,
    reviewer: "Ravi Gupta",
    rating: 5,
    date: "2026-05-01",
    service: "Finance Consulting",
    comment:
      "Best interest rate on business loan. Entire team is knowledgeable and responsive.",
    status: "Published",
    replied: true,
  },
  {
    id: 13,
    reviewer: "Pooja Nair",
    rating: 5,
    date: "2026-04-29",
    service: "Property Purchase",
    comment:
      "Purchased premium villa in Shilaj. Team handled everything from search to registry.",
    status: "Published",
    replied: true,
  },
  {
    id: 14,
    reviewer: "Harish Chandra",
    rating: 4,
    date: "2026-04-27",
    service: "RERA Consulting",
    comment:
      "Helped register under RERA within 8 days. Very professional service.",
    status: "Published",
    replied: false,
  },
  {
    id: 15,
    reviewer: "Kavita Bhat",
    rating: 5,
    date: "2026-04-25",
    service: "Music Events",
    comment:
      "Organized our corporate cultural program beautifully. Artists were top-notch.",
    status: "Published",
    replied: true,
  },
  {
    id: 16,
    reviewer: "Manish Verma",
    rating: 3,
    date: "2026-04-23",
    service: "Rental Management",
    comment:
      "Response time could be better during lease renewal but overall satisfied.",
    status: "Pending",
    replied: false,
  },
  {
    id: 17,
    reviewer: "Lalita Rao",
    rating: 5,
    date: "2026-04-20",
    service: "Property Purchase",
    comment:
      "Exceptional experience buying commercial shop. Every detail was handled perfectly.",
    status: "Published",
    replied: true,
  },
  {
    id: 18,
    reviewer: "Dilip Soni",
    rating: 4,
    date: "2026-04-18",
    service: "Investment Advisory",
    comment:
      "Portfolio diversification advice helped me earn 18% returns in 14 months.",
    status: "Published",
    replied: true,
  },
  {
    id: 19,
    reviewer: "Rekha Pandey",
    rating: 5,
    date: "2026-04-15",
    service: "CSR Services",
    comment:
      "MSTC helped us set up our CSR program for rural education. Amazing initiative.",
    status: "Published",
    replied: false,
  },
  {
    id: 20,
    reviewer: "Mohan Das",
    rating: 4,
    date: "2026-04-12",
    service: "Property Sale",
    comment:
      "Sold ancestral property in Maninagar with zero hassle. Clean documentation.",
    status: "Published",
    replied: true,
  },
  {
    id: 21,
    reviewer: "Seema Tiwari",
    rating: 5,
    date: "2026-04-10",
    service: "Commercial Rental",
    comment:
      "Found ideal retail space in Ashram Road within 48 hours. Incredible speed.",
    status: "Published",
    replied: true,
  },
  {
    id: 22,
    reviewer: "Naresh Modi",
    rating: 4,
    date: "2026-04-08",
    service: "Finance Consulting",
    comment:
      "Business loan of ₹2.5Cr processed in 18 days. Smooth experience overall.",
    status: "Published",
    replied: false,
  },
  {
    id: 23,
    reviewer: "Preeti Jain",
    rating: 5,
    date: "2026-04-05",
    service: "Property Purchase",
    comment:
      "Dream home in Ambawadi at great price. MSTC negotiated brilliantly for us.",
    status: "Published",
    replied: true,
  },
  {
    id: 24,
    reviewer: "Sunil Bhatt",
    rating: 4,
    date: "2026-04-03",
    service: "Sports Events",
    comment:
      "MSTC organized our cricket tournament professionally. Will book again.",
    status: "Published",
    replied: true,
  },
  {
    id: 25,
    reviewer: "Usha Menon",
    rating: 5,
    date: "2026-04-01",
    service: "Property Purchase",
    comment:
      "Seamless purchase of 4BHK in Bodakdev. Best real estate partner in Ahmedabad.",
    status: "Published",
    replied: true,
  },
];

const SERVICES = [
  "All Services",
  "Property Purchase",
  "Property Sale",
  "Finance Consulting",
  "RERA Consulting",
  "Commercial Rental",
  "Rental Management",
  "Investment Advisory",
  "NRI Services",
  "Event Hospitality",
  "Music Events",
  "CSR Services",
  "Sports Events",
];
const RATINGS = [
  "All Ratings",
  "5 Stars",
  "4 Stars",
  "3 Stars",
  "2 Stars",
  "1 Star",
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= rating ? "text-gold-400 fill-gold-400" : "text-obsidian-600"
          }
        />
      ))}
    </span>
  );
}

export default function ReviewManagerPage() {
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("All Services");
  const [filterRating, setFilterRating] = useState("All Ratings");
  const [showAddModal, setShowAddModal] = useState(false);
  const [replyReview, setReplyReview] = useState<(typeof REVIEWS)[0] | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = REVIEWS.filter((r) => {
    const matchSearch =
      r.reviewer.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    const matchService =
      filterService === "All Services" || r.service === filterService;
    const matchRating =
      filterRating === "All Ratings" || r.rating === Number(filterRating[0]);
    return matchSearch && matchService && matchRating;
  });

  const totalReviews = REVIEWS.length;
  const avgRating = (
    REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
  ).toFixed(1);
  const positive = Math.round(
    (REVIEWS.filter((r) => r.rating >= 4).length / REVIEWS.length) * 100,
  );
  const replied = Math.round(
    (REVIEWS.filter((r) => r.replied).length / REVIEWS.length) * 100,
  );

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="reviews.page"
    >
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            role="button"
            tabIndex={-1}
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Enter" && setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-64 bg-card border-r border-gold-700/30 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gold-700/20">
              <span className="font-serif text-gold-300 font-semibold text-sm">
                Navigation
              </span>
              <CloseButton onClick={() => setSidebarOpen(false)} size="sm" />
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {["Dashboard", "Reviews", "Analytics", "Settings"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gold-300 hover:bg-gold-700/10 transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="font-serif text-2xl font-bold gold-text">
                Review Manager
              </h1>
              <p className="text-muted-foreground text-sm font-sans">
                Monitor and respond to customer reviews
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="gold-button gap-2"
            data-ocid="reviews.add_button"
          >
            <Plus size={16} /> Add Review
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Reviews",
              value: totalReviews,
              icon: MessageCircle,
              color: "text-blue-400",
            },
            {
              label: "Avg Rating",
              value: `${avgRating}/5`,
              icon: Star,
              color: "text-gold-400",
            },
            {
              label: "Positive Reviews",
              value: `${positive}%`,
              icon: TrendingUp,
              color: "text-green-400",
            },
            {
              label: "Response Rate",
              value: `${replied}%`,
              icon: Reply,
              color: "text-purple-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-gold-700/20 rounded-xl p-4"
              data-ocid={`reviews.stat.${stat.label.toLowerCase().replace(/ /g, "_")}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-muted-foreground font-sans">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold font-serif text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Rating Breakdown */}
        <div className="bg-card border border-gold-700/20 rounded-xl p-4 mb-6">
          <h2 className="font-serif text-sm font-semibold text-gold-300 mb-3">
            Rating Breakdown
          </h2>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = REVIEWS.filter((r) => r.rating === star).length;
              const pct = Math.round((count / REVIEWS.length) * 100);
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8 font-sans">
                    {star}★
                  </span>
                  <div className="flex-1 bg-obsidian-700/40 rounded-full h-2">
                    <div
                      className="bg-gold-500 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right font-sans">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-card border-gold-700/30 h-9 text-sm"
              data-ocid="reviews.search_input"
            />
          </div>
          <Select value={filterService} onValueChange={setFilterService}>
            <SelectTrigger
              className="w-44 h-9 bg-card border-gold-700/30 text-sm"
              data-ocid="reviews.service_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-gold-700/30">
              {SERVICES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger
              className="w-36 h-9 bg-card border-gold-700/30 text-sm"
              data-ocid="reviews.rating_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-gold-700/30">
              {RATINGS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reviews Table */}
        <div className="bg-card border border-gold-700/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="reviews.table">
              <thead>
                <tr className="border-b border-gold-700/20 bg-obsidian-800/40">
                  {[
                    "Reviewer",
                    "Rating",
                    "Date",
                    "Service",
                    "Comment",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gold-400 font-sans whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-b border-gold-700/10 hover:bg-gold-700/5 transition-colors"
                    data-ocid={`reviews.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                      {r.reviewer}
                    </td>
                    <td className="px-4 py-3">
                      <StarDisplay rating={r.rating} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="border-gold-700/30 text-gold-400 text-xs whitespace-nowrap"
                      >
                        {r.service}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                      {r.comment}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          r.status === "Published"
                            ? "bg-green-900/30 text-green-400 border-green-700/30"
                            : "bg-yellow-900/30 text-yellow-400 border-yellow-700/30"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold-700/30 text-gold-400 h-7 text-xs"
                        onClick={() => setReplyReview(r)}
                        data-ocid={`reviews.reply_button.${i + 1}`}
                      >
                        <Reply size={12} className="mr-1" />
                        {r.replied ? "Edit Reply" : "Reply"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Review Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Manual Review"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">
                Reviewer Name
              </Label>
              <Input
                placeholder="Full name"
                className="bg-obsidian-800/60 border-gold-700/30"
              />
            </div>
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">
                Service
              </Label>
              <Select>
                <SelectTrigger className="bg-obsidian-800/60 border-gold-700/30">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-700/30">
                  {SERVICES.slice(1).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  className="w-9 h-9 rounded-lg border border-gold-700/30 text-gold-400 hover:bg-gold-700/20 text-sm font-bold"
                >
                  {s}★
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-gold-300 text-xs mb-1 block">
              Review Comment
            </Label>
            <Textarea
              placeholder="Write review..."
              className="bg-obsidian-800/60 border-gold-700/30 min-h-[100px]"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              className="border-gold-700/30"
              onClick={() => setShowAddModal(false)}
              data-ocid="reviews.add_modal.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="gold-button"
              data-ocid="reviews.add_modal.submit_button"
            >
              Add Review
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={!!replyReview}
        onClose={() => setReplyReview(null)}
        title="Reply to Review"
        size="md"
      >
        {replyReview && (
          <div className="space-y-4">
            <div className="bg-obsidian-800/40 rounded-lg p-3 border border-gold-700/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-foreground">
                  {replyReview.reviewer}
                </span>
                <StarDisplay rating={replyReview.rating} />
              </div>
              <p className="text-sm text-muted-foreground">
                {replyReview.comment}
              </p>
            </div>
            <div>
              <Label className="text-gold-300 text-xs mb-1 block">
                Your Response
              </Label>
              <Textarea
                placeholder="Write your response..."
                className="bg-obsidian-800/60 border-gold-700/30 min-h-[100px]"
                defaultValue={
                  replyReview.replied
                    ? "Thank you for your kind words! We're delighted to have served you. Looking forward to assisting you again."
                    : ""
                }
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                className="border-gold-700/30"
                onClick={() => setReplyReview(null)}
                data-ocid="reviews.reply_modal.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="gold-button"
                data-ocid="reviews.reply_modal.submit_button"
              >
                Send Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
