import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, Printer, Scale } from "lucide-react";
import { useState } from "react";

type DocType = "rental" | "sale" | "rera-complaint" | "noc" | "affidavit" | "";

// ── Field definitions ────────────────────────────────────────────────────────

interface RentalFields {
  landlordName: string;
  tenantName: string;
  landlordAddress: string;
  tenantAddress: string;
  address: string;
  rent: string;
  deposit: string;
  startDate: string;
  duration: string;
  maintenanceClause: string;
  witnesses: string;
}

interface SaleFields {
  sellerName: string;
  sellerPan: string;
  buyerName: string;
  buyerPan: string;
  address: string;
  price: string;
  advancePaid: string;
  saleDate: string;
  registrar: string;
  surveyNo: string;
}

interface ReraFields {
  complainantName: string;
  complainantPhone: string;
  complainantEmail: string;
  developerName: string;
  projectName: string;
  reraNumber: string;
  bookingDate: string;
  issueType: string;
  issueDescription: string;
  reliefSought: string;
  date: string;
}

interface NocFields {
  issuerName: string;
  issuerAddress: string;
  recipientName: string;
  purpose: string;
  propertyAddress: string;
  date: string;
  conditions: string;
}

interface AffidavitFields {
  deponentName: string;
  deponentAddress: string;
  aadhaar: string;
  subject: string;
  statement: string;
  date: string;
  place: string;
}

const defaultRental: RentalFields = {
  landlordName: "",
  tenantName: "",
  landlordAddress: "",
  tenantAddress: "",
  address: "",
  rent: "",
  deposit: "",
  startDate: "",
  duration: "11",
  maintenanceClause:
    "Tenant shall maintain the property in good condition. Minor repairs up to ₹500 per incident shall be borne by tenant.",
  witnesses: "",
};

const defaultSale: SaleFields = {
  sellerName: "",
  sellerPan: "",
  buyerName: "",
  buyerPan: "",
  address: "",
  price: "",
  advancePaid: "",
  saleDate: "",
  registrar: "",
  surveyNo: "",
};

const defaultRera: ReraFields = {
  complainantName: "",
  complainantPhone: "",
  complainantEmail: "",
  developerName: "",
  projectName: "",
  reraNumber: "",
  bookingDate: "",
  issueType: "",
  issueDescription: "",
  reliefSought: "",
  date: "",
};

const defaultNoc: NocFields = {
  issuerName: "",
  issuerAddress: "",
  recipientName: "",
  purpose: "",
  propertyAddress: "",
  date: "",
  conditions: "",
};

const defaultAffidavit: AffidavitFields = {
  deponentName: "",
  deponentAddress: "",
  aadhaar: "",
  subject: "",
  statement: "",
  date: "",
  place: "",
};

// ── Generators ───────────────────────────────────────────────────────────────

function genRental(f: RentalFields) {
  return `                    RENTAL AGREEMENT
                  (DRAFT TEMPLATE — FOR REFERENCE ONLY)

This Rental Agreement ("Agreement") is made and entered into on ${f.startDate} at Ahmedabad, Gujarat, India between:

LANDLORD:
Name : ${f.landlordName}
Address : ${f.landlordAddress}
(hereinafter referred to as the “Landlord”)

AND

TENANT:
Name : ${f.tenantName}
Address : ${f.tenantAddress}
(hereinafter referred to as the “Tenant”)

1. PROPERTY
The Landlord agrees to let and the Tenant agrees to take on rent the following premises:
${f.address}
(hereinafter referred to as the “Premises”)

2. TERM
This Agreement shall be effective for a period of ${f.duration} months commencing from ${f.startDate}. It shall stand automatically terminated at the end of the said period unless renewed in writing by mutual consent.

3. RENT
The Tenant shall pay a monthly rent of ₹${f.rent}/- (Rupees ${f.rent} only) payable on or before the 5th of every English calendar month.

4. SECURITY DEPOSIT
The Tenant has paid a refundable security deposit of ₹${f.deposit}/- which shall be refunded within 30 days of vacating the premises after deducting any outstanding dues or damage charges.

5. MAINTENANCE
${f.maintenanceClause}

6. GENERAL CONDITIONS
   a. The Tenant shall not sub-let, assign or transfer the Premises or any part thereof without prior written consent of the Landlord.
   b. The Tenant shall not make any structural alteration, addition or improvement to the Premises.
   c. The Tenant shall allow the Landlord or the Landlord’s authorized agent to inspect the Premises at reasonable times with prior notice.
   d. Either party may terminate this Agreement by giving 30 days’ prior written notice.
   e. Stamp duty and registration charges shall be borne as per applicable law.

7. JURISDICTION
This Agreement shall be governed by the laws of Gujarat, India. Disputes shall be subject to the jurisdiction of courts in Ahmedabad.

8. FACILITATOR CLAUSE
This agreement has been drafted by MSTC GLOBAL as a facilitator. MSTC GLOBAL is not a party to this agreement and shall bear no liability for the terms herein. Parties are advised to seek independent legal advice.

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first written above.

Witnesses: ${f.witnesses}

___________________________          ___________________________
Landlord’s Signature                  Tenant’s Signature
${f.landlordName}                     ${f.tenantName}`;
}

function genSale(f: SaleFields) {
  return `                    AGREEMENT FOR SALE
                  (DRAFT TEMPLATE — FOR REFERENCE ONLY)

This Agreement for Sale is made at Ahmedabad, Gujarat on ${f.saleDate} between:

SELLER:
Name : ${f.sellerName}
PAN  : ${f.sellerPan}
(hereinafter referred to as the “Seller”)

AND

BUYER:
Name : ${f.buyerName}
PAN  : ${f.buyerPan}
(hereinafter referred to as the “Buyer”)

1. PROPERTY DETAILS
The Seller agrees to sell and the Buyer agrees to purchase the following property:
${f.address}
Survey / Revenue No.: ${f.surveyNo}

2. SALE CONSIDERATION
The total agreed sale consideration is ₹${f.price}/- (Rupees ${f.price} only).
The Buyer has paid an advance of ₹${f.advancePaid}/- as earnest money. The balance shall be paid at the time of registration.

3. TERMS AND CONDITIONS
   a. The Seller confirms the property is free from all encumbrances, liens, mortgages, or pending litigation.
   b. Time for completion: Sale deed shall be executed within 60 days of this Agreement unless extended by mutual written consent.
   c. Stamp duty and registration charges shall be borne by the Buyer as per the Gujarat Stamp Act.
   d. The Seller shall hand over possession of the property upon receipt of full sale consideration.
   e. 1% TDS shall be deducted by the Buyer if sale consideration exceeds ₹50 Lakhs (as per Income Tax Act Section 194IA).

4. DEFAULT
If the Buyer defaults, the Seller may forfeit the earnest money. If the Seller defaults, the Buyer is entitled to a refund of double the earnest money.

5. SUB-REGISTRAR
Sale deed to be executed before the Sub-Registrar, ${f.registrar}.

6. GOVERNING LAW
The Transfer of Property Act, 1882 and the Registration Act, 1908 shall apply.

FACILITATOR CLAUSE: MSTC GLOBAL has prepared this draft as a facilitator only. Independent legal advice is strongly recommended.

___________________________          ___________________________
Seller’s Signature                    Buyer’s Signature
${f.sellerName}                       ${f.buyerName}`;
}

function genRera(f: ReraFields) {
  return `                  RERA COMPLAINT LETTER
                  (DRAFT TEMPLATE — FOR REFERENCE ONLY)

To,
The Hon’ble Adjudicating Officer / Regulatory Authority
Gujarat Real Estate Regulatory Authority (GujRERA)
Ahmedabad, Gujarat

Date: ${f.date || new Date().toLocaleDateString("en-IN")}

Sub: Complaint under Section 31 / Section 71 of the Real Estate (Regulation and Development) Act, 2016

Respected Sir/Madam,

I, ${f.complainantName}, residing at _____________________, Phone: ${f.complainantPhone}, Email: ${f.complainantEmail}, do hereby file this complaint against:

Respondent (Developer / Promoter):
Name    : ${f.developerName}
Project : ${f.projectName}
GujRERA Registration No.: ${f.reraNumber}

Facts of the Case:
- Booking Date : ${f.bookingDate}
- Nature of Grievance : ${f.issueType}

Details of Grievance:
${f.issueDescription}

Relief Sought:
${f.reliefSought}

Declaration:
I hereby declare that the information provided above is true and correct to the best of my knowledge and belief. No other complaint on this subject is pending before any court or authority.

Yours faithfully,
${f.complainantName}
Phone: ${f.complainantPhone}
Email: ${f.complainantEmail}

Note: Attach copies of booking agreement, payment receipts, and all correspondence with the developer.`;
}

function genNoc(f: NocFields) {
  return `                       NO OBJECTION CERTIFICATE
                  (DRAFT TEMPLATE — FOR REFERENCE ONLY)

Date: ${f.date}

To Whom It May Concern,

I / We, ${f.issuerName}
Address: ${f.issuerAddress}

Hereby issue this No Objection Certificate (NOC) in favour of:
${f.recipientName}

For the purpose of: ${f.purpose}

Property Details: ${f.propertyAddress}

This NOC is issued with the following conditions:
${f.conditions || "No specific conditions. This NOC is issued unconditionally."}

This certificate is valid for a period of 6 months from the date of issue unless revoked earlier by the undersigned.

Signature: _________________________
Name     : ${f.issuerName}
Date     : ${f.date}

Note: This is a draft template. Get this document attested/notarized as required by the receiving authority.`;
}

function genAffidavit(f: AffidavitFields) {
  return `                         AFFIDAVIT
                  (DRAFT TEMPLATE — FOR REFERENCE ONLY)

                    AFFIDAVIT

I, ${f.deponentName}, son/daughter of ___________________, aged ______ years, residing at ${f.deponentAddress}, Aadhaar No.: ${f.aadhaar}, do hereby solemnly affirm and state as follows:

SUBJECT: ${f.subject}

1. ${f.statement}

2. I am making this affidavit in support of the above-mentioned purpose and for submission to the concerned authority.

3. I solemnly declare that the contents of this affidavit are true and correct to the best of my knowledge and belief. Nothing has been concealed therefrom.

SOLEMNLY AFFIRMED AND SIGNED
on this ${f.date} at ${f.place}


Deponent’s Signature: _____________________
Name: ${f.deponentName}


BEFORE ME:

Notary Public / Executive Magistrate
Date: ${f.date}
Place: ${f.place}

Note: This is a draft for reference only. Execute the final affidavit on non-judicial stamp paper of required value and get it notarized.`;
}

// ── Reusable field component ─────────────────────────────────────────────────

function Field({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary";

// ── Document type selector ────────────────────────────────────────────────────

const DOC_TYPES: { id: DocType; label: string; desc: string }[] = [
  { id: "rental", label: "Rental Agreement", desc: "Landlord-tenant lease" },
  { id: "sale", label: "Sale Agreement", desc: "Property purchase/sale" },
  {
    id: "rera-complaint",
    label: "RERA Complaint",
    desc: "GujRERA grievance letter",
  },
  { id: "noc", label: "NOC Letter", desc: "No objection certificate" },
  { id: "affidavit", label: "Affidavit", desc: "Sworn statement" },
];

export default function LegalDocsGeneratorPage() {
  const [docType, setDocType] = useState<DocType>("");
  const [rentalF, setRentalF] = useState<RentalFields>(defaultRental);
  const [saleF, setSaleF] = useState<SaleFields>(defaultSale);
  const [reraF, setReraF] = useState<ReraFields>(defaultRera);
  const [nocF, setNocF] = useState<NocFields>(defaultNoc);
  const [affF, setAffF] = useState<AffidavitFields>(defaultAffidavit);
  const [generated, setGenerated] = useState("");
  const [indemnity, setIndemnity] = useState(false);

  const handleGenerate = () => {
    if (!indemnity) return;
    if (docType === "rental") setGenerated(genRental(rentalF));
    else if (docType === "sale") setGenerated(genSale(saleF));
    else if (docType === "rera-complaint") setGenerated(genRera(reraF));
    else if (docType === "noc") setGenerated(genNoc(nocF));
    else if (docType === "affidavit") setGenerated(genAffidavit(affF));
  };

  const selectDoc = (id: DocType) => {
    setDocType(id);
    setGenerated("");
    setIndemnity(false);
  };

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        {/* Page Header */}
        <section className="pt-24 pb-8 px-4 bg-card/50 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
              data-ocid="legaldocs.back_button"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Scale size={24} className="text-primary" />
              <h1 className="font-serif font-bold text-3xl gold-text">
                Legal Document Generator
              </h1>
            </div>
            <p className="font-sans text-sm text-muted-foreground">
              Generate printable draft agreements and legal documents. These are
              templates only — always consult a lawyer before using.
            </p>
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-4 py-10">
          {/* Document Type Selector */}
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-8">
            {DOC_TYPES.map(({ id, label, desc }) => (
              <button
                key={id}
                type="button"
                onClick={() => selectDoc(id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  docType === id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
                data-ocid={`legaldocs.type_${id}`}
              >
                <FileText
                  size={20}
                  className={
                    docType === id
                      ? "text-primary mb-2"
                      : "text-muted-foreground mb-2"
                  }
                />
                <div className="font-semibold text-xs text-foreground">
                  {label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {desc}
                </div>
              </button>
            ))}
          </div>

          {/* ── Rental Agreement ── */}
          {docType === "rental" && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="font-serif font-semibold text-lg mb-5 text-foreground">
                Rental Agreement Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Landlord Full Name *">
                  <input
                    required
                    value={rentalF.landlordName}
                    onChange={(e) =>
                      setRentalF((f) => ({
                        ...f,
                        landlordName: e.target.value,
                      }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.rental.landlordName"
                  />
                </Field>
                <Field label="Tenant Full Name *">
                  <input
                    required
                    value={rentalF.tenantName}
                    onChange={(e) =>
                      setRentalF((f) => ({ ...f, tenantName: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.rental.tenantName"
                  />
                </Field>
                <Field label="Landlord Address">
                  <input
                    value={rentalF.landlordAddress}
                    onChange={(e) =>
                      setRentalF((f) => ({
                        ...f,
                        landlordAddress: e.target.value,
                      }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Tenant Address">
                  <input
                    value={rentalF.tenantAddress}
                    onChange={(e) =>
                      setRentalF((f) => ({
                        ...f,
                        tenantAddress: e.target.value,
                      }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Property Address *">
                  <input
                    required
                    value={rentalF.address}
                    onChange={(e) =>
                      setRentalF((f) => ({ ...f, address: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.rental.address"
                  />
                </Field>
                <Field label="Monthly Rent (₹) *">
                  <input
                    required
                    value={rentalF.rent}
                    onChange={(e) =>
                      setRentalF((f) => ({ ...f, rent: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.rental.rent"
                  />
                </Field>
                <Field label="Security Deposit (₹) *">
                  <input
                    required
                    value={rentalF.deposit}
                    onChange={(e) =>
                      setRentalF((f) => ({ ...f, deposit: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.rental.deposit"
                  />
                </Field>
                <Field label="Start Date *">
                  <input
                    required
                    type="date"
                    value={rentalF.startDate}
                    onChange={(e) =>
                      setRentalF((f) => ({ ...f, startDate: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.rental.startDate"
                  />
                </Field>
                <Field label="Duration (months)">
                  <input
                    value={rentalF.duration}
                    onChange={(e) =>
                      setRentalF((f) => ({ ...f, duration: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Witness Names">
                  <input
                    value={rentalF.witnesses}
                    onChange={(e) =>
                      setRentalF((f) => ({ ...f, witnesses: e.target.value }))
                    }
                    placeholder="Full names of 2 witnesses"
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Maintenance Clause">
                    <textarea
                      value={rentalF.maintenanceClause}
                      onChange={(e) =>
                        setRentalF((f) => ({
                          ...f,
                          maintenanceClause: e.target.value,
                        }))
                      }
                      rows={2}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Sale Agreement ── */}
          {docType === "sale" && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="font-serif font-semibold text-lg mb-5 text-foreground">
                Sale Agreement Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Seller Full Name *">
                  <input
                    required
                    value={saleF.sellerName}
                    onChange={(e) =>
                      setSaleF((f) => ({ ...f, sellerName: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.sale.sellerName"
                  />
                </Field>
                <Field label="Seller PAN">
                  <input
                    value={saleF.sellerPan}
                    onChange={(e) =>
                      setSaleF((f) => ({ ...f, sellerPan: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Buyer Full Name *">
                  <input
                    required
                    value={saleF.buyerName}
                    onChange={(e) =>
                      setSaleF((f) => ({ ...f, buyerName: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.sale.buyerName"
                  />
                </Field>
                <Field label="Buyer PAN">
                  <input
                    value={saleF.buyerPan}
                    onChange={(e) =>
                      setSaleF((f) => ({ ...f, buyerPan: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Property Address *">
                    <input
                      required
                      value={saleF.address}
                      onChange={(e) =>
                        setSaleF((f) => ({ ...f, address: e.target.value }))
                      }
                      className={inputCls}
                      data-ocid="legaldocs.sale.address"
                    />
                  </Field>
                </div>
                <Field label="Survey / Plot No.">
                  <input
                    value={saleF.surveyNo}
                    onChange={(e) =>
                      setSaleF((f) => ({ ...f, surveyNo: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Sale Price (₹) *">
                  <input
                    required
                    value={saleF.price}
                    onChange={(e) =>
                      setSaleF((f) => ({ ...f, price: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.sale.price"
                  />
                </Field>
                <Field label="Advance / Earnest Money (₹)">
                  <input
                    value={saleF.advancePaid}
                    onChange={(e) =>
                      setSaleF((f) => ({ ...f, advancePaid: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Agreement Date *">
                  <input
                    required
                    type="date"
                    value={saleF.saleDate}
                    onChange={(e) =>
                      setSaleF((f) => ({ ...f, saleDate: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.sale.saleDate"
                  />
                </Field>
                <Field label="Sub-Registrar Office">
                  <input
                    value={saleF.registrar}
                    onChange={(e) =>
                      setSaleF((f) => ({ ...f, registrar: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* ── RERA Complaint ── */}
          {docType === "rera-complaint" && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="font-serif font-semibold text-lg mb-5 text-foreground">
                RERA Complaint Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Your Full Name *">
                  <input
                    required
                    value={reraF.complainantName}
                    onChange={(e) =>
                      setReraF((f) => ({
                        ...f,
                        complainantName: e.target.value,
                      }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.rera.complainantName"
                  />
                </Field>
                <Field label="Your Phone *">
                  <input
                    required
                    value={reraF.complainantPhone}
                    onChange={(e) =>
                      setReraF((f) => ({
                        ...f,
                        complainantPhone: e.target.value,
                      }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Your Email">
                  <input
                    type="email"
                    value={reraF.complainantEmail}
                    onChange={(e) =>
                      setReraF((f) => ({
                        ...f,
                        complainantEmail: e.target.value,
                      }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Developer / Promoter Name *">
                  <input
                    required
                    value={reraF.developerName}
                    onChange={(e) =>
                      setReraF((f) => ({ ...f, developerName: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.rera.developerName"
                  />
                </Field>
                <Field label="Project Name *">
                  <input
                    required
                    value={reraF.projectName}
                    onChange={(e) =>
                      setReraF((f) => ({ ...f, projectName: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="GujRERA Registration No.">
                  <input
                    value={reraF.reraNumber}
                    onChange={(e) =>
                      setReraF((f) => ({ ...f, reraNumber: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Booking Date">
                  <input
                    type="date"
                    value={reraF.bookingDate}
                    onChange={(e) =>
                      setReraF((f) => ({ ...f, bookingDate: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Type of Issue *">
                  <select
                    required
                    value={reraF.issueType}
                    onChange={(e) =>
                      setReraF((f) => ({ ...f, issueType: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.rera.issueType"
                  >
                    <option value="">Select issue type</option>
                    <option>Delayed possession</option>
                    <option>Structural defects</option>
                    <option>Misrepresentation of project</option>
                    <option>Refund not given</option>
                    <option>Change in project without consent</option>
                    <option>Other</option>
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Description of Grievance *">
                    <textarea
                      required
                      value={reraF.issueDescription}
                      onChange={(e) =>
                        setReraF((f) => ({
                          ...f,
                          issueDescription: e.target.value,
                        }))
                      }
                      rows={3}
                      className={`${inputCls} resize-none`}
                      data-ocid="legaldocs.rera.issueDescription"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Relief Sought *">
                    <textarea
                      required
                      value={reraF.reliefSought}
                      onChange={(e) =>
                        setReraF((f) => ({
                          ...f,
                          reliefSought: e.target.value,
                        }))
                      }
                      rows={2}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── NOC ── */}
          {docType === "noc" && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="font-serif font-semibold text-lg mb-5 text-foreground">
                NOC Letter Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Issuer Name *">
                  <input
                    required
                    value={nocF.issuerName}
                    onChange={(e) =>
                      setNocF((f) => ({ ...f, issuerName: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.noc.issuerName"
                  />
                </Field>
                <Field label="Issuer Address *">
                  <input
                    required
                    value={nocF.issuerAddress}
                    onChange={(e) =>
                      setNocF((f) => ({ ...f, issuerAddress: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Recipient Name *">
                  <input
                    required
                    value={nocF.recipientName}
                    onChange={(e) =>
                      setNocF((f) => ({ ...f, recipientName: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Purpose *">
                  <input
                    required
                    value={nocF.purpose}
                    onChange={(e) =>
                      setNocF((f) => ({ ...f, purpose: e.target.value }))
                    }
                    placeholder="e.g. Sale / Loan / Construction"
                    className={inputCls}
                    data-ocid="legaldocs.noc.purpose"
                  />
                </Field>
                <Field label="Property Address">
                  <input
                    value={nocF.propertyAddress}
                    onChange={(e) =>
                      setNocF((f) => ({
                        ...f,
                        propertyAddress: e.target.value,
                      }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Date *">
                  <input
                    required
                    type="date"
                    value={nocF.date}
                    onChange={(e) =>
                      setNocF((f) => ({ ...f, date: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Conditions (if any)">
                    <textarea
                      value={nocF.conditions}
                      onChange={(e) =>
                        setNocF((f) => ({ ...f, conditions: e.target.value }))
                      }
                      rows={2}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Affidavit ── */}
          {docType === "affidavit" && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="font-serif font-semibold text-lg mb-5 text-foreground">
                Affidavit Details
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Deponent Full Name *">
                  <input
                    required
                    value={affF.deponentName}
                    onChange={(e) =>
                      setAffF((f) => ({ ...f, deponentName: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.affidavit.deponentName"
                  />
                </Field>
                <Field label="Aadhaar / ID Number">
                  <input
                    value={affF.aadhaar}
                    onChange={(e) =>
                      setAffF((f) => ({ ...f, aadhaar: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Deponent Address *">
                    <input
                      required
                      value={affF.deponentAddress}
                      onChange={(e) =>
                        setAffF((f) => ({
                          ...f,
                          deponentAddress: e.target.value,
                        }))
                      }
                      className={inputCls}
                    />
                  </Field>
                </div>
                <Field label="Subject of Affidavit *">
                  <input
                    required
                    value={affF.subject}
                    onChange={(e) =>
                      setAffF((f) => ({ ...f, subject: e.target.value }))
                    }
                    className={inputCls}
                    data-ocid="legaldocs.affidavit.subject"
                  />
                </Field>
                <Field label="Date *">
                  <input
                    required
                    type="date"
                    value={affF.date}
                    onChange={(e) =>
                      setAffF((f) => ({ ...f, date: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Place">
                  <input
                    value={affF.place}
                    onChange={(e) =>
                      setAffF((f) => ({ ...f, place: e.target.value }))
                    }
                    placeholder="Ahmedabad"
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Statement / Declaration *">
                    <textarea
                      required
                      value={affF.statement}
                      onChange={(e) =>
                        setAffF((f) => ({ ...f, statement: e.target.value }))
                      }
                      rows={4}
                      className={`${inputCls} resize-none`}
                      placeholder="I solemnly declare that..."
                      data-ocid="legaldocs.affidavit.statement"
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* Indemnity + Generate */}
          {docType && (
            <>
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-muted/20 border border-border mb-5">
                <input
                  type="checkbox"
                  checked={indemnity}
                  onChange={(e) => setIndemnity(e.target.checked)}
                  className="mt-0.5 accent-primary"
                  data-ocid="legaldocs.indemnity_checkbox"
                />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I understand that this is a{" "}
                  <strong>draft template for reference only</strong>. I will
                  consult a qualified lawyer before signing or using this
                  document for any legal purpose. MSTC GLOBAL shall not be held
                  liable for any legal or financial consequences arising from
                  the use of this template.
                  <span className="text-red-400 ml-1">*Required</span>
                </span>
              </label>
              <button
                type="button"
                disabled={!indemnity}
                onClick={handleGenerate}
                className="px-6 py-3 rounded-lg font-semibold text-sm mb-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                style={{
                  background: "oklch(0.72 0.18 76)",
                  color: "oklch(0.1 0.01 60)",
                }}
                data-ocid="legaldocs.generate_button"
              >
                Generate Document
              </button>
            </>
          )}

          {/* Generated Document */}
          {generated && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Generated Draft Document
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:border-primary/60"
                  style={{
                    borderColor: "oklch(0.72 0.18 76 / 0.4)",
                    color: "oklch(0.72 0.18 76)",
                  }}
                  data-ocid="legaldocs.print_button"
                >
                  <Printer size={13} /> Print / Save PDF
                </button>
              </div>
              <pre
                className="font-mono text-xs text-foreground bg-muted/20 rounded-lg p-5 whitespace-pre-wrap leading-relaxed overflow-x-auto"
                style={{ maxHeight: 500 }}
              >
                {generated}
              </pre>
              <div
                className="mt-4 p-3 rounded-lg text-xs text-muted-foreground"
                style={{
                  background: "oklch(0.72 0.18 76 / 0.06)",
                  border: "1px solid oklch(0.72 0.18 76 / 0.2)",
                }}
              >
                ⚠️ <strong>Important:</strong> This is a draft template for
                reference only. Please consult a qualified advocate or legal
                advisor before executing any legal document. MSTC GLOBAL is not
                responsible for any legal outcomes arising from the use of this
                template.
              </div>
            </div>
          )}
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PrivacyGate>
  );
}
