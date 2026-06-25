import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useState } from "react";

export default function PartnerNetworkPage() {
  const { actor } = useActor(createActor);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    experience: "",
    areas: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (actor) {
        await actor.addPartnerApplication(
          form.name,
          form.phone,
          form.email,
          form.company,
          form.experience,
          form.areas,
        );
      }
      const msg = `Hi, I'm interested in joining the MSTC GLOBAL Partner Network. Name: ${form.name}, Company: ${form.company}, Experience: ${form.experience} years, Areas: ${form.areas}`;
      window.open(
        `https://wa.me/919512609016?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-white">
      {/* Hero */}
      <div className="py-20 px-6 text-center bg-gradient-to-b from-amber-950/30 to-[#06090f]">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-amber-400 mb-4">
          Join the MSTC GLOBAL Partner Network
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Are you a real estate agent, broker, or consultant in Ahmedabad?
          Partner with MSTC GLOBAL to expand your business, access premium
          listings, and grow your client base.
        </p>
      </div>

      {/* Benefits */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: "🏆",
              title: "Premium Listings Access",
              desc: "Get access to exclusive high-value properties before they hit the open market.",
            },
            {
              icon: "💰",
              title: "Higher Commissions",
              desc: "Earn competitive commissions on every referral and closed deal.",
            },
            {
              icon: "🤝",
              title: "MSTC Brand Support",
              desc: "Leverage the MSTC GLOBAL brand, marketing materials, and expert team support.",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="p-6 rounded-xl border border-amber-500/20 bg-amber-950/10"
            >
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="text-amber-400 font-semibold text-lg mb-2">
                {b.title}
              </h3>
              <p className="text-gray-400 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Application Form */}
        {submitted ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-amber-400 mb-2">
              Application Submitted!
            </h2>
            <p className="text-gray-400">
              We'll review your application and reach out within 2 business
              days.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
              Apply to Become a Partner
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-amber-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none"
                    data-ocid="partners.input.name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-amber-400 mb-1">
                    Phone *
                  </label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none"
                    data-ocid="partners.input.phone"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-amber-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none"
                  data-ocid="partners.input.email"
                />
              </div>
              <div>
                <label className="block text-sm text-amber-400 mb-1">
                  Company / Agency Name
                </label>
                <input
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none"
                  data-ocid="partners.input.company"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-amber-400 mb-1">
                    Years of Experience *
                  </label>
                  <select
                    required
                    value={form.experience}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, experience: e.target.value }))
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none"
                    data-ocid="partners.input.experience"
                  >
                    <option value="">Select</option>
                    <option>Less than 1 year</option>
                    <option>1-3 years</option>
                    <option>3-5 years</option>
                    <option>5-10 years</option>
                    <option>10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-amber-400 mb-1">
                    Primary Work Areas *
                  </label>
                  <input
                    required
                    value={form.areas}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, areas: e.target.value }))
                    }
                    placeholder="e.g. Bopal, SG Highway, Satellite"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 outline-none"
                    data-ocid="partners.input.areas"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                data-ocid="partners.submit_button"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
