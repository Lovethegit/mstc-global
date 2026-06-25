import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, HelpCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  label: string;
  icon: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqCategory[] = [
  {
    id: "property",
    label: "Property Buying",
    icon: "🏠",
    items: [
      {
        q: "What documents do I need to buy a property in Ahmedabad?",
        a: "To purchase a property in Ahmedabad, you will need identity proof (Aadhaar Card, PAN Card, Passport), address proof, recent passport-size photographs, bank statements for the last 6 months, income tax returns for the last 2–3 years, and a salary slip or business income proof. Additionally, for the property itself, you will need the title deed, encumbrance certificate, approved building plan, RERA registration number (for new projects), property tax receipts, and a NOC from the society or builder. Ensure all documents are verified by a qualified property lawyer before executing the sale agreement.",
      },
      {
        q: "How does RERA protect buyers in Gujarat?",
        a: "The Real Estate (Regulation and Development) Act 2016, administered in Gujarat through GujRERA, mandates that all real estate projects above 500 sq mt or 8 units must be registered before sale. RERA requires developers to deposit 70% of collected funds in a dedicated account for project construction, preventing fund diversion. Buyers are entitled to compensation for any delay in possession at the SBI MCLR rate plus 2%. If a builder defaults or the project is stalled, buyers can approach the GujRERA authority for relief, refund, or compensation.",
      },
      {
        q: "What is the stamp duty rate in Gujarat for property purchase?",
        a: "In Gujarat, stamp duty is 4.9% for properties in municipal corporation areas and 4.9% for properties in panchayat areas. An additional 1% registration fee is payable on the property value. For women buyers purchasing in their own name, some state concessions may apply — check with the Sub-Registrar's office for current rates. Stamp duty is calculated on the agreement value or the circle rate (jantri rate), whichever is higher, as notified by the Gujarat government.",
      },
      {
        q: "How do I verify a property's legal status?",
        a: "Verify a property's legal status through four key checks: (1) Title search — obtain a certified copy of the title deed from the Sub-Registrar's office and trace ownership for the last 30 years; (2) Encumbrance check — obtain an encumbrance certificate (EC) confirming no mortgage or lien exists; (3) RERA registration — verify the project on the GujRERA portal (rera.gujarat.gov.in) for registered status, approved plans, and project progress; (4) Municipal approvals — confirm building plan approval from AMC, AUDA, or the relevant municipal authority. MSTC GLOBAL offers a complete property due diligence service for all these checks.",
      },
      {
        q: "What is a ready-to-move vs under-construction property?",
        a: "A ready-to-move (RTM) property has received its completion certificate (CC) and occupation certificate (OC) from the municipal authority — you can take possession immediately. Under-construction (UC) properties are still being built and offer a lower initial price but carry builder delivery risk. RTM properties attract full GST exemption (as opposed to 5% GST on UC properties), but typically cost 10–15% more than UC properties in the same building. For investment, UC properties in RERA-registered projects from reputed builders historically deliver better appreciation from the launch price.",
      },
    ],
  },
  {
    id: "finance",
    label: "Home Finance",
    icon: "💰",
    items: [
      {
        q: "How much home loan can I get on my salary?",
        a: "Banks and HFCs in India typically allow a home loan EMI of up to 40–50% of your gross monthly income (the FOIR — Fixed Obligation to Income Ratio). As a general rule, you can get approximately ₹60–65 lakhs for every ₹1 lakh in monthly net income. For example, a monthly net salary of ₹60,000 typically qualifies for a loan of ₹35–40 lakhs. This depends on your credit score (750+ is ideal), existing EMIs, employment stability, age, and the lender's internal policies. A co-applicant's income can be added to enhance eligibility.",
      },
      {
        q: "What is the current interest rate for home loans in India?",
        a: "As of 2024–25, home loan interest rates in India range from 8.40% to 9.50% per annum for salaried borrowers with good credit scores (750+). Public sector banks like SBI, Bank of Baroda, and Canara Bank typically offer the lowest rates. Private banks (HDFC, ICICI, Axis) and HFCs (LIC HFL, PNB Housing) are slightly higher. Rates are linked to the RBI repo rate — any repo rate cut will reduce floating rate home loans accordingly. MSTC GLOBAL can help you compare rates across 15+ lenders and get the best deal.",
      },
      {
        q: "Can NRIs buy property in India?",
        a: "Yes, Non-Resident Indians (NRIs) and Persons of Indian Origin (PIOs) can freely purchase residential and commercial property in India under the Foreign Exchange Management Act (FEMA). NRIs do not require RBI approval for property purchases. They can fund the purchase through NRE/NRO accounts or foreign inward remittances. Agricultural land, farmhouses, and plantation properties are not permitted. The property can be repatriated subject to FEMA guidelines after selling. MSTC GLOBAL has a dedicated NRI advisory service covering property search, legal due diligence, and home loan facilitation.",
      },
      {
        q: "What deductions are available for home loan under income tax?",
        a: "Home loan borrowers can claim two key deductions under the Income Tax Act: (1) Section 24(b) — deduction up to ₹2 lakhs per year on home loan interest for a self-occupied property; (2) Section 80C — deduction up to ₹1.5 lakhs per year on principal repayment (combined limit with other 80C investments). First-time buyers may additionally claim ₹50,000 under Section 80EEA if the property value is below ₹45 lakhs and the loan was sanctioned between April 2019 and March 2022. These deductions are available under the Old Tax Regime — not the New Tax Regime.",
      },
      {
        q: "What is the process for getting a home loan in Ahmedabad?",
        a: "The home loan process in Ahmedabad typically takes 7–15 working days from application to disbursement. Step 1: Choose the property and get a confirmed sale agreement. Step 2: Submit application with income documents, KYC, and property documents to the lender. Step 3: Bank conducts technical appraisal and valuation of the property. Step 4: Legal team verifies property title and approvals. Step 5: Loan sanction letter issued with terms. Step 6: Submit original property documents for mortgage creation. Step 7: Disbursement — either in tranches (for UC properties) or full amount (for RTM). MSTC GLOBAL assists with lender selection, document preparation, and follow-up at no extra cost.",
      },
    ],
  },
  {
    id: "rera",
    label: "RERA & Legal",
    icon: "⚖️",
    items: [
      {
        q: "What is RERA and why is it important?",
        a: "RERA (Real Estate Regulation and Development Act, 2016) is India's landmark real estate consumer protection law. In Gujarat, it is implemented through GujRERA. RERA is important because it mandates transparency — developers must disclose project details, timelines, and approved plans. It protects buyers from project delays (with mandatory compensation), fund diversion (70% of collections must stay in a dedicated account), and misleading advertising. All new projects above the threshold must be registered before sale, giving buyers confidence in their investment.",
      },
      {
        q: "How do I file a complaint with GujRERA?",
        a: "To file a RERA complaint in Gujarat: (1) Visit rera.gujarat.gov.in and register as a complainant; (2) File a complaint online under the 'Complaint' section — select the project and nature of grievance; (3) Pay the requisite fee (currently ₹1,000 for a formal complaint); (4) The authority issues notice to the developer and schedules a hearing; (5) GujRERA adjudicates and can order compensation, refund, or possession. Alternatively, complaints can be filed offline at the GujRERA office in Gandhinagar. For complex cases, MSTC GLOBAL's RERA consulting team can guide you through the entire process.",
      },
      {
        q: "How do I check if a project is RERA registered?",
        a: "To verify RERA registration in Gujarat: Visit rera.gujarat.gov.in → Click on 'Projects' → Search by project name, promoter name, or RERA registration number. A registered project will display its approval date, expiry date, approved plans, quarterly progress updates, and promoter details. Always verify RERA status before booking any new property in Gujarat. If a project is not on the GujRERA portal, it is either exempt (small projects below 500 sq mt or 8 units) or non-compliant, which is a serious red flag.",
      },
      {
        q: "What is the timeline for RERA registration?",
        a: "Under RERA, developers must apply for registration before launching any project. GujRERA must grant or reject the registration application within 30 days. Once registered, a project typically receives a registration valid for the period stated in the application — usually matching the project completion timeline. If a project is not completed on time, the developer must apply for an extension. MSTC GLOBAL's RERA consulting service assists promoters with the complete registration process, including document preparation, application filing, and follow-up with GujRERA.",
      },
      {
        q: "What protection does RERA offer if the builder delays possession?",
        a: "If a RERA-registered builder delays possession beyond the agreed date, buyers are entitled to: (1) Monthly interest at SBI MCLR + 2% on the amount paid for every month of delay — this is currently approximately 11% per annum; (2) Option to withdraw from the project and get a full refund with interest if the delay is significant; (3) File a complaint with GujRERA for a binding order against the developer. RERA also allows class action complaints where multiple buyers of the same project file together. The builder's response timeline and compliance are monitored by the authority.",
      },
    ],
  },
  {
    id: "events",
    label: "Events & Hospitality",
    icon: "🎉",
    items: [
      {
        q: "What types of events does MSTC GLOBAL manage?",
        a: "MSTC GLOBAL manages a comprehensive range of events including corporate conferences and team events, luxury weddings and receptions, cultural and musical programmes, sports tournaments, government and social welfare events, music concerts and artist performances, and large-scale public events. We handle end-to-end management including venue selection, catering, entertainment, décor, technical production, and guest management. Our team has experience with events ranging from 50 to 5,000+ attendees.",
      },
      {
        q: "How far in advance should I book for a wedding event?",
        a: "For weddings in Ahmedabad, we recommend booking MSTC GLOBAL at least 3–6 months in advance for standard celebrations, and 8–12 months ahead for premium or destination-style weddings in Gujarat. Peak wedding season (October–February and April–May) gets fully booked quickly. Early booking ensures venue availability, preferred vendor tie-ins, and adequate planning time for customisation. A preliminary meeting and token booking can be done as early as you like — there is no downside to early confirmation.",
      },
      {
        q: "What is included in a corporate event package?",
        a: "MSTC GLOBAL's corporate event packages include venue sourcing and booking, audio-visual setup (screens, projectors, PA system), décor aligned with your brand identity, catering (welcome drinks, lunch/dinner, tea/coffee service), logistics coordination, event staff and floor management, photography and videography (on request), and post-event reporting. Customised packages are available for team outings, product launches, annual dinners, training events, and conferences. Contact us at +91 9512609016 or mstc.gbl@gmail.com for a tailored quote.",
      },
    ],
  },
  {
    id: "general",
    label: "About MSTC GLOBAL",
    icon: "ℹ️",
    items: [
      {
        q: "What services does MSTC GLOBAL offer?",
        a: "MSTC GLOBAL is a diversified professional services company operating across 8 divisions: Infrastructure & Property Development, RERA & PR Consulting, Purchase/Rent/Redevelopment facilitation, Finance & Investment advisory, Music & Cultural Services, Hospitality & Event Management, NGO & CSR Initiatives, and Media/Sports/Tourism. Led by MD Love Vijaybhai Parekh, MSTC GLOBAL serves individuals, families, businesses, NRIs, and organisations across Ahmedabad and Gujarat with a single point of contact for multiple service needs.",
      },
      {
        q: "How do I contact MSTC GLOBAL?",
        a: "You can reach MSTC GLOBAL through multiple channels: Phone/WhatsApp: +91 9512609016 (primary, available for all enquiries), Office landline: +91 079-26638800, Email: mstc.gbl@gmail.com. Our office is located at 5, ShwetShikhar Society, Shantivan, Ahmedabad, Gujarat. You can also use the contact form on this website or reach us through the AI assistant (available 24x7) for immediate responses. We typically respond to all enquiries within 2 hours during business hours.",
      },
      {
        q: "Where is MSTC GLOBAL located?",
        a: "MSTC GLOBAL's registered office is at 5, ShwetShikhar Society, Shantivan, Ahmedabad — 380013, Gujarat, India. GPS coordinates: 23.0013511, 72.5630849. The office is easily accessible from SG Highway via the Shantivan junction, and from the central city via the Sarkhej-Gandhinagar Highway. On-street parking is available. For directions, search 'mstcglobal' on Google Maps or use the embedded map on our Contact section.",
      },
    ],
  },
];

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gold-800/30 rounded-xl overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left flex items-start justify-between gap-4 p-5 bg-card hover:bg-obsidian-700/40 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-serif font-semibold text-sm md:text-base text-gold-200 leading-snug">
          {item.q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gold-500 transition-transform duration-300 mt-0.5 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-1 bg-obsidian-800/40">
          <p className="font-sans text-sm text-obsidian-100 leading-relaxed">
            {item.a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredData = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FAQ_DATA.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          (activeCategory === "all" || cat.id === activeCategory) &&
          (!q ||
            item.q.toLowerCase().includes(q) ||
            item.a.toLowerCase().includes(q)),
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [search, activeCategory]);

  const totalResults = filteredData.reduce(
    (acc, cat) => acc + cat.items.length,
    0,
  );

  return (
    <div className="min-h-screen bg-obsidian-900 text-gold-100">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-12 px-4 text-center bg-gradient-to-b from-obsidian-800 to-obsidian-900 border-b border-gold-800/30">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-sans mb-8 transition-colors"
              data-ocid="faq.back_link"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="flex items-center justify-center gap-2 mb-3">
              <HelpCircle size={20} className="text-gold-500" />
              <span className="text-gold-500 font-sans text-xs uppercase tracking-widest">
                Knowledge Base
              </span>
            </div>
            <h1 className="font-serif font-bold text-3xl md:text-5xl gold-text mb-4">
              Frequently Asked Questions
            </h1>
            <p className="font-sans text-base text-obsidian-100 max-w-xl mx-auto">
              Answers to the most common questions about property buying, home
              loans, RERA, events, and MSTC GLOBAL's services in Ahmedabad and
              Gujarat.
            </p>
          </div>
        </section>

        {/* Sticky Filters */}
        <section className="sticky top-16 z-20 bg-obsidian-800/95 backdrop-blur-md border-b border-gold-800/20 py-3 px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-600"
              />
              <input
                type="text"
                placeholder="Search questions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-obsidian-800 border border-gold-800/40 rounded-xl text-sm text-gold-100 placeholder-gold-700 font-sans focus:outline-none focus:border-gold-500/60 transition-colors"
                data-ocid="faq.search_input"
              />
            </div>
            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "all", label: "All" },
                ...FAQ_DATA.map((c) => ({
                  id: c.id,
                  label: `${c.icon} ${c.label}`,
                })),
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium font-sans transition-all duration-200 border whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "bg-gold-600/20 border-gold-500/50 text-gold-300"
                      : "bg-transparent border-gold-800/30 text-gold-600 hover:border-gold-700/50 hover:text-gold-400"
                  }`}
                  data-ocid={`faq.category_tab.${cat.id}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {totalResults === 0 ? (
              <div className="text-center py-20" data-ocid="faq.empty_state">
                <HelpCircle
                  size={40}
                  className="mx-auto text-gold-700/40 mb-4"
                />
                <p className="font-serif text-xl text-gold-400 mb-2">
                  No questions found
                </p>
                <p className="font-sans text-sm text-muted-foreground">
                  Try a different search term or category
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {filteredData.map((cat) => (
                  <div key={cat.id}>
                    <h2 className="font-serif font-bold text-xl gold-text flex items-center gap-2 mb-5">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </h2>
                    <div className="space-y-3">
                      {cat.items.map((item, idx) => {
                        const key = `${cat.id}-${idx}`;
                        return (
                          <FaqAccordionItem
                            key={key}
                            item={item}
                            isOpen={!!openItems[key]}
                            onToggle={() => toggleItem(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact CTA */}
            <div className="mt-16 rounded-2xl border border-gold-700/30 bg-gradient-to-r from-obsidian-800 to-obsidian-700 p-8 text-center">
              <HelpCircle size={32} className="mx-auto text-gold-500 mb-3" />
              <h3 className="font-serif font-bold text-xl text-gold-200 mb-2">
                Still have a question?
              </h3>
              <p className="font-sans text-sm text-obsidian-100 mb-5 max-w-md mx-auto">
                Our team is available to answer any question about property,
                finance, RERA, or any of our services. Reach out directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/919512609016"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold font-sans text-sm hover:bg-emerald-500 transition-all duration-200"
                  data-ocid="faq.whatsapp_button"
                >
                  WhatsApp +91 9512609016
                </a>
                <a
                  href="mailto:mstc.gbl@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gold-600/40 text-gold-400 font-semibold font-sans text-sm hover:bg-gold-600/10 transition-all duration-200"
                  data-ocid="faq.email_button"
                >
                  mstc.gbl@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
