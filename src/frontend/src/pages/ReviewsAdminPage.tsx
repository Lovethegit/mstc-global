import SecureAppGate from "@/components/shared/SecureAppGate";
import { useReviews } from "@/hooks/useCrmQueries";
import type { ReviewRecord } from "@/types/crm";
import { Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MOCK_REVIEWS: ReviewRecord[] = [
  {
    id: 1n,
    platform: "Google",
    reviewerName: "Rajesh Mehta",
    rating: 5n,
    reviewText:
      "Exceptional service! MSTC GLOBAL helped me find my dream home. Love Parekh sir personally guided me.",
    reviewDate: 0n,
    responded: true,
    responseText: ["Thank you for your kind words!"],
    sentiment: "Positive",
  },
  {
    id: 2n,
    platform: "JustDial",
    reviewerName: "Priya Shah",
    rating: 5n,
    reviewText:
      "Very professional team. RERA consultation was spot on. Highly recommend.",
    reviewDate: 0n,
    responded: false,
    responseText: [],
    sentiment: "Positive",
  },
  {
    id: 3n,
    platform: "Google",
    reviewerName: "Vikram Patel",
    rating: 4n,
    reviewText:
      "Good service overall. Quick response time and knowledgeable staff.",
    reviewDate: 0n,
    responded: true,
    responseText: ["Thank you!"],
    sentiment: "Positive",
  },
  {
    id: 4n,
    platform: "Google",
    reviewerName: "Suresh Kumar",
    rating: 3n,
    reviewText: "Decent service but follow-up could be faster.",
    reviewDate: 0n,
    responded: false,
    responseText: [],
    sentiment: "Neutral",
  },
  {
    id: 5n,
    platform: "JustDial",
    reviewerName: "Kavita Desai",
    rating: 5n,
    reviewText:
      "Best real estate consultants in Ahmedabad. Trusted by our family for 3 transactions.",
    reviewDate: 0n,
    responded: true,
    responseText: ["Thank you!"],
    sentiment: "Positive",
  },
];

const SENTIMENT_COLORS: Record<string, string> = {
  Positive: "bg-green-900/20 text-green-300 border-green-800/30",
  Neutral: "bg-yellow-900/20 text-yellow-300 border-yellow-800/30",
  Negative: "bg-red-900/20 text-red-300 border-red-800/30",
};

function Stars({ count }: { count: bigint }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3 h-3 ${n <= Number(count) ? "text-gold-400 fill-gold-400" : "text-gold-800/40"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsAdminPage() {
  const { data: fetchedReviews = [] } = useReviews();
  const reviews: ReviewRecord[] =
    fetchedReviews.length > 0
      ? (fetchedReviews as unknown as ReviewRecord[])
      : MOCK_REVIEWS;
  const [platformFilter, setPlatformFilter] = useState("All");
  const [respondingId, setRespondingId] = useState<bigint | null>(null);
  const [responseText, setResponseText] = useState("");
  const [reviewList, setReviewList] = useState(reviews);
  const [publishedIds, setPublishedIds] = useState<Set<string>>(
    new Set(["1", "3", "5"]),
  );

  const filtered =
    platformFilter === "All"
      ? reviewList
      : reviewList.filter((r) => r.platform === platformFilter);
  const avgRating =
    reviewList.reduce((s, r) => s + Number(r.rating), 0) /
    (reviewList.length || 1);

  function submitResponse(id: bigint) {
    if (!responseText.trim()) return;
    setReviewList((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, responded: true, responseText: [responseText] }
          : r,
      ),
    );
    toast.success("Response published");
    setRespondingId(null);
    setResponseText("");
  }

  function generateAiResponse(review: ReviewRecord) {
    const responses: Record<string, string> = {
      Positive: `Thank you so much for your kind words, ${review.reviewerName}! It was a pleasure working with you. We look forward to serving you again. — MSTC GLOBAL Team`,
      Neutral: `Thank you for your feedback, ${review.reviewerName}. We take all suggestions seriously and are working to improve our service. Please feel free to contact us at mstc.gbl@gmail.com. — MSTC GLOBAL`,
      Negative: `Dear ${review.reviewerName}, we sincerely apologize for your experience. This is not the standard we hold ourselves to. Please contact us directly at +91 9512609016 and we will make it right. — MSTC GLOBAL`,
    };
    setResponseText(responses[review.sentiment] ?? responses.Positive);
    setRespondingId(review.id);
  }

  function togglePublish(id: bigint) {
    const key = String(id);
    setPublishedIds((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
    toast.success(
      publishedIds.has(String(id)) ? "Review unpublished" : "Review published",
    );
  }

  return (
    <SecureAppGate appName="Review Manager">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="reviews_admin.page"
      >
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gold-400" />
            <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
              Review Manager
            </h1>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Average Rating",
                value: `${avgRating.toFixed(1)}/5`,
                color: "text-gold-400",
              },
              {
                label: "Total Reviews",
                value: reviews.length,
                color: "text-blue-400",
              },
              {
                label: "Positive",
                value: reviews.filter((r) => r.sentiment === "Positive").length,
                color: "text-green-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold-800/30 bg-card p-3 text-center"
              >
                <p className={`font-serif text-xl font-bold ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            {["All", "Google", "JustDial"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${platformFilter === p ? "bg-gold-700/30 text-gold-300 border-gold-600/50" : "border-gold-800/30 text-gold-600"}`}
                data-ocid={`reviews_admin.filter.${p.toLowerCase()}`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((rev, i) => (
              <div
                key={String(rev.id)}
                className="rounded-xl border border-gold-800/30 bg-card p-4"
                data-ocid={`reviews_admin.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {rev.reviewerName}
                      </span>
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] border ${rev.platform === "Google" ? "bg-blue-900/20 text-blue-300 border-blue-800/30" : "bg-orange-900/20 text-orange-300 border-orange-800/30"}`}
                      >
                        {rev.platform}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Stars count={rev.rating} />
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] border ${SENTIMENT_COLORS[rev.sentiment] ?? ""}`}
                      >
                        {rev.sentiment}
                      </span>
                    </div>
                  </div>
                  {!rev.responded && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => generateAiResponse(rev)}
                        className="text-xs px-2 py-1 rounded-lg border border-purple-800/40 text-purple-400 hover:text-purple-300 whitespace-nowrap shrink-0"
                        data-ocid={`reviews_admin.ai_respond_button.${i + 1}`}
                      >
                        ✨ AI Respond
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRespondingId(rev.id);
                          setResponseText("");
                        }}
                        className="text-xs px-2 py-1 rounded-lg border border-gold-800/40 text-gold-500 hover:text-gold-400 whitespace-nowrap shrink-0"
                        data-ocid={`reviews_admin.respond_button.${i + 1}`}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => togglePublish(rev.id)}
                    className={`text-xs px-2 py-0.5 rounded border transition-colors ${publishedIds.has(String(rev.id)) ? "bg-green-900/20 text-green-300 border-green-800/30" : "border-gold-800/30 text-gold-600"}`}
                    data-ocid={`reviews_admin.publish_button.${i + 1}`}
                  >
                    {publishedIds.has(String(rev.id)) ? "Published" : "Publish"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {rev.reviewText}
                </p>
                {rev.responded && rev.responseText[0] && (
                  <div className="mt-2 pl-3 border-l-2 border-gold-700/40">
                    <p className="text-xs text-gold-600">
                      Response: {rev.responseText[0]}
                    </p>
                  </div>
                )}
                {respondingId === rev.id && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gold-800/40 bg-background text-foreground text-xs resize-none"
                      placeholder="Write your response..."
                      data-ocid={`reviews_admin.response_input.${i + 1}`}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRespondingId(null)}
                        className="flex-1 py-1.5 rounded-lg border border-gold-800/30 text-muted-foreground text-xs"
                        data-ocid={`reviews_admin.cancel_response.${i + 1}`}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => submitResponse(rev.id)}
                        className="flex-1 py-1.5 rounded-lg bg-gold-700/30 hover:bg-gold-700/40 text-gold-300 text-xs"
                        data-ocid={`reviews_admin.submit_response.${i + 1}`}
                      >
                        Post Response
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SecureAppGate>
  );
}
