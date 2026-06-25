import {
  AlertCircle,
  CheckCircle,
  Clock,
  MessageCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

interface TrackResult {
  status: string;
  service: string;
  createdAt: number;
  notes: string;
}

function StatusIcon({ s }: { s: string }) {
  if (s === "Resolved")
    return <CheckCircle className="w-5 h-5 text-green-400" />;
  if (s === "In Progress") return <Clock className="w-5 h-5 text-blue-400" />;
  return <AlertCircle className="w-5 h-5 text-yellow-400" />;
}

function statusColor(s: string) {
  if (s === "Resolved") return "text-green-400";
  if (s === "In Progress") return "text-blue-400";
  return "text-yellow-400";
}

export default function TrackEnquiryPage() {
  const [refNumber, setRefNumber] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!refNumber.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      if (refNumber.startsWith("TKT-")) {
        setResult({
          status: "In Progress",
          service: "Property Enquiry",
          createdAt: Date.now(),
          notes: "Our team is reviewing your enquiry.",
        });
      } else {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06090f]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-16">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Search className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h1 className="text-3xl font-serif font-bold text-yellow-400">
              Track Your Enquiry
            </h1>
            <p className="text-gray-400 mt-2">
              Enter your reference number to check the status
            </p>
          </div>
          <div className="bg-black/40 border border-yellow-600/20 rounded-2xl p-6">
            <div className="flex gap-3 mb-4">
              <input
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="e.g. TKT-12345"
                data-ocid="track_enquiry.input"
                className="flex-1 bg-black/60 border border-yellow-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
              <button
                type="button"
                onClick={handleTrack}
                disabled={loading}
                data-ocid="track_enquiry.submit_button"
                className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Track"}
              </button>
            </div>
            {result && (
              <div
                className="p-4 bg-black/50 border border-yellow-600/20 rounded-xl"
                data-ocid="track_enquiry.result"
              >
                <div className="flex items-center gap-2 mb-3">
                  <StatusIcon s={result.status} />
                  <span
                    className={`font-bold text-lg ${statusColor(result.status)}`}
                  >
                    {result.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Service: <span className="text-white">{result.service}</span>
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Submitted:{" "}
                  <span className="text-white">
                    {new Date(result.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </p>
                {result.notes && (
                  <p className="text-gray-400 text-sm mt-2 italic">
                    &ldquo;{result.notes}&rdquo;
                  </p>
                )}
              </div>
            )}
            {notFound && (
              <div
                className="p-4 bg-black/50 border border-red-500/20 rounded-xl"
                data-ocid="track_enquiry.error_state"
              >
                <p className="text-gray-300 text-sm">
                  Reference not found. Please check the number or contact us.
                </p>
                <a
                  href="https://wa.me/919512609016?text=Hi, I need help tracking my enquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 mt-3 text-green-400 hover:text-green-300 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact us on WhatsApp
                </a>
              </div>
            )}
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            Need help?{" "}
            <a
              href="tel:+919512609016"
              className="text-yellow-400 hover:underline"
            >
              Call +91 9512609016
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
