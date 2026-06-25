import {
  ChevronDown,
  Download,
  FileText,
  Printer,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

type Category =
  | "All"
  | "Rental"
  | "Sale"
  | "Property Docs"
  | "Legal Notices"
  | "Society"
  | "RERA"
  | "Finance"
  | "NGO"
  | "Events"
  | "NRI";

type FieldType = "text" | "date" | "number" | "textarea";

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  type: FieldType;
}

interface LegalForm {
  id: string;
  category: Exclude<Category, "All">;
  title: string;
  description: string;
  fields: FormField[];
}

const CATEGORY_COLORS: Record<Exclude<Category, "All">, string> = {
  Rental: "bg-green-900/50 text-green-300 border-green-700/50",
  Sale: "bg-blue-900/50 text-blue-300 border-blue-700/50",
  "Property Docs": "bg-purple-900/50 text-purple-300 border-purple-700/50",
  "Legal Notices": "bg-red-900/50 text-red-300 border-red-700/50",
  Society: "bg-orange-900/50 text-orange-300 border-orange-700/50",
  RERA: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50",
  Finance: "bg-cyan-900/50 text-cyan-300 border-cyan-700/50",
  NGO: "bg-teal-900/50 text-teal-300 border-teal-700/50",
  Events: "bg-pink-900/50 text-pink-300 border-pink-700/50",
  NRI: "bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30",
};

const FORMS_DATA: LegalForm[] = [
  // ── RENTAL ──────────────────────────────────────────────────────────────────
  {
    id: "rental-001",
    category: "Rental",
    title: "Rental Agreement (11-Month)",
    description:
      "Standard residential rental agreement valid for 11 months, legally compliant for Gujarat.",
    fields: [
      {
        key: "landlordName",
        label: "Landlord Full Name",
        placeholder: "e.g. Ramesh Kumar Patel",
        type: "text",
      },
      {
        key: "landlordAddress",
        label: "Landlord Address",
        placeholder: "Full address with PIN code",
        type: "textarea",
      },
      {
        key: "tenantName",
        label: "Tenant Full Name",
        placeholder: "e.g. Suresh Mehta",
        type: "text",
      },
      {
        key: "tenantAddress",
        label: "Tenant Permanent Address",
        placeholder: "Permanent address of tenant",
        type: "textarea",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Full property address with PIN code",
        type: "textarea",
      },
      {
        key: "monthlyRent",
        label: "Monthly Rent (₹)",
        placeholder: "e.g. 15000",
        type: "number",
      },
      {
        key: "depositAmount",
        label: "Security Deposit (₹)",
        placeholder: "Usually 2–3 months rent",
        type: "number",
      },
      {
        key: "startDate",
        label: "Agreement Start Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "endDate",
        label: "Agreement End Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "rental-002",
    category: "Rental",
    title: "Leave & License Agreement",
    description:
      "Maharashtra/Gujarat style leave & license for residential or commercial use.",
    fields: [
      {
        key: "licensorName",
        label: "Licensor (Owner) Name",
        placeholder: "e.g. Anil Shah",
        type: "text",
      },
      {
        key: "licenseeName",
        label: "Licensee (Occupant) Name",
        placeholder: "e.g. Priya Desai",
        type: "text",
      },
      {
        key: "propertyDesc",
        label: "Property Description",
        placeholder: "Flat no., Wing, Society, City, PIN",
        type: "textarea",
      },
      {
        key: "licenseFee",
        label: "Monthly License Fee (₹)",
        placeholder: "e.g. 20000",
        type: "number",
      },
      {
        key: "refundableDeposit",
        label: "Refundable Deposit (₹)",
        placeholder: "e.g. 60000",
        type: "number",
      },
      { key: "startDate", label: "Start Date", placeholder: "", type: "date" },
      { key: "endDate", label: "End Date", placeholder: "", type: "date" },
      {
        key: "purpose",
        label: "Purpose of Use",
        placeholder: "e.g. Residential / Office",
        type: "text",
      },
    ],
  },
  {
    id: "rental-003",
    category: "Rental",
    title: "Commercial Lease Agreement",
    description:
      "Formal commercial lease for office, warehouse, or retail space.",
    fields: [
      {
        key: "lessorName",
        label: "Lessor (Owner) Name",
        placeholder: "e.g. Mehta Realty Pvt Ltd",
        type: "text",
      },
      {
        key: "lesseeName",
        label: "Lessee (Tenant) Name",
        placeholder: "e.g. TechSolutions India",
        type: "text",
      },
      {
        key: "premisesAddress",
        label: "Premises Address",
        placeholder: "Complete commercial premises address",
        type: "textarea",
      },
      {
        key: "monthlyRent",
        label: "Monthly Rent (₹)",
        placeholder: "e.g. 75000",
        type: "number",
      },
      {
        key: "securityDeposit",
        label: "Security Deposit (₹)",
        placeholder: "e.g. 300000",
        type: "number",
      },
      {
        key: "leaseTerm",
        label: "Lease Term (months)",
        placeholder: "e.g. 36",
        type: "number",
      },
      {
        key: "startDate",
        label: "Lease Start Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "maintenanceCharge",
        label: "Monthly Maintenance (₹)",
        placeholder: "e.g. 5000",
        type: "number",
      },
    ],
  },
  {
    id: "rental-004",
    category: "Rental",
    title: "Shop Rental Agreement",
    description: "Rental agreement specifically for commercial shop premises.",
    fields: [
      {
        key: "ownerName",
        label: "Shop Owner Name",
        placeholder: "e.g. Girish Bhai Patel",
        type: "text",
      },
      {
        key: "tenantName",
        label: "Tenant / Shopkeeper Name",
        placeholder: "e.g. Kishore Traders",
        type: "text",
      },
      {
        key: "shopAddress",
        label: "Shop Address & Number",
        placeholder: "Shop no., Market, Road, City",
        type: "textarea",
      },
      {
        key: "shopArea",
        label: "Shop Area (sq ft)",
        placeholder: "e.g. 250",
        type: "number",
      },
      {
        key: "monthlyRent",
        label: "Monthly Rent (₹)",
        placeholder: "e.g. 12000",
        type: "number",
      },
      {
        key: "deposit",
        label: "Security Deposit (₹)",
        placeholder: "e.g. 50000",
        type: "number",
      },
      { key: "startDate", label: "Start Date", placeholder: "", type: "date" },
    ],
  },
  {
    id: "rental-005",
    category: "Rental",
    title: "PG / Hostel Agreement",
    description:
      "Paying guest accommodation agreement with house rules and facilities.",
    fields: [
      {
        key: "ownerName",
        label: "PG Owner Name",
        placeholder: "e.g. Savita Ben Shah",
        type: "text",
      },
      {
        key: "guestName",
        label: "PG Guest Name",
        placeholder: "e.g. Rahul Verma",
        type: "text",
      },
      {
        key: "pgAddress",
        label: "PG Address",
        placeholder: "Full PG address",
        type: "textarea",
      },
      {
        key: "roomNo",
        label: "Room Number",
        placeholder: "e.g. Room 204",
        type: "text",
      },
      {
        key: "monthlyCharge",
        label: "Monthly Charge (₹)",
        placeholder: "e.g. 8000",
        type: "number",
      },
      {
        key: "deposit",
        label: "Deposit (₹)",
        placeholder: "e.g. 16000",
        type: "number",
      },
      {
        key: "startDate",
        label: "Check-In Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "mealsIncluded",
        label: "Meals Included",
        placeholder: "e.g. Breakfast & Dinner",
        type: "text",
      },
    ],
  },
  {
    id: "rental-006",
    category: "Rental",
    title: "Rent Increase Notice",
    description: "Formal notice to tenant regarding increase in monthly rent.",
    fields: [
      {
        key: "landlordName",
        label: "Landlord Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "tenantName",
        label: "Tenant Name",
        placeholder: "Tenant's full name",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Address of rented property",
        type: "textarea",
      },
      {
        key: "currentRent",
        label: "Current Rent (₹)",
        placeholder: "e.g. 10000",
        type: "number",
      },
      {
        key: "newRent",
        label: "New Rent (₹)",
        placeholder: "e.g. 11500",
        type: "number",
      },
      {
        key: "effectiveDate",
        label: "Effective Date of Increase",
        placeholder: "",
        type: "date",
      },
      {
        key: "noticePeriod",
        label: "Notice Period (days)",
        placeholder: "e.g. 30",
        type: "number",
      },
    ],
  },
  {
    id: "rental-007",
    category: "Rental",
    title: "Rent Receipt",
    description:
      "Official rent receipt for monthly rent payment acknowledgment.",
    fields: [
      {
        key: "receiptNo",
        label: "Receipt Number",
        placeholder: "e.g. RR-2025-001",
        type: "text",
      },
      {
        key: "landlordName",
        label: "Landlord Name",
        placeholder: "Full name of landlord",
        type: "text",
      },
      {
        key: "tenantName",
        label: "Tenant Name",
        placeholder: "Full name of tenant",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Rented property address",
        type: "textarea",
      },
      {
        key: "amountPaid",
        label: "Amount Received (₹)",
        placeholder: "e.g. 15000",
        type: "number",
      },
      {
        key: "paymentMode",
        label: "Mode of Payment",
        placeholder: "e.g. Bank Transfer / Cash / UPI",
        type: "text",
      },
      {
        key: "periodFrom",
        label: "Rent Period From",
        placeholder: "",
        type: "date",
      },
      {
        key: "periodTo",
        label: "Rent Period To",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "rental-008",
    category: "Rental",
    title: "Notice to Vacate",
    description: "Formal notice issued to tenant to vacate the premises.",
    fields: [
      {
        key: "landlordName",
        label: "Landlord Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "tenantName",
        label: "Tenant Name",
        placeholder: "Tenant's full name",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Full address of property",
        type: "textarea",
      },
      {
        key: "vacateBy",
        label: "Vacate By Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "reason",
        label: "Reason for Vacating",
        placeholder: "e.g. Personal use / Non-payment of rent",
        type: "textarea",
      },
      {
        key: "noticeDate",
        label: "Date of Notice",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── SALE ────────────────────────────────────────────────────────────────────
  {
    id: "sale-001",
    category: "Sale",
    title: "Agreement to Sell",
    description:
      "Preliminary agreement between buyer and seller before final sale deed execution.",
    fields: [
      {
        key: "sellerName",
        label: "Seller Full Name",
        placeholder: "e.g. Bhavesh Kumar Joshi",
        type: "text",
      },
      {
        key: "buyerName",
        label: "Buyer Full Name",
        placeholder: "e.g. Nilesh Mehta",
        type: "text",
      },
      {
        key: "propertyDesc",
        label: "Property Description",
        placeholder: "Full address, survey no., area details",
        type: "textarea",
      },
      {
        key: "saleConsideration",
        label: "Total Sale Consideration (₹)",
        placeholder: "e.g. 4500000",
        type: "number",
      },
      {
        key: "tokenAmount",
        label: "Token/Advance Amount (₹)",
        placeholder: "e.g. 500000",
        type: "number",
      },
      {
        key: "balanceDate",
        label: "Balance Payment Due Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "registrationDate",
        label: "Target Registration Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "agreementDate",
        label: "Agreement Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "sale-002",
    category: "Sale",
    title: "Sale Deed Draft",
    description:
      "Full sale deed template for property transfer, compliant with Gujarat Registration Act.",
    fields: [
      {
        key: "vendorName",
        label: "Vendor (Seller) Name",
        placeholder: "Full legal name",
        type: "text",
      },
      {
        key: "vendorAddress",
        label: "Vendor Address",
        placeholder: "Permanent address with PIN",
        type: "textarea",
      },
      {
        key: "purchaserName",
        label: "Purchaser (Buyer) Name",
        placeholder: "Full legal name",
        type: "text",
      },
      {
        key: "purchaserAddress",
        label: "Purchaser Address",
        placeholder: "Permanent address with PIN",
        type: "textarea",
      },
      {
        key: "propertyDetails",
        label: "Property Details",
        placeholder: "Survey no., plot no., area, boundaries",
        type: "textarea",
      },
      {
        key: "saleAmount",
        label: "Sale Amount (₹)",
        placeholder: "e.g. 5500000",
        type: "number",
      },
      {
        key: "executionDate",
        label: "Deed Execution Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "sale-003",
    category: "Sale",
    title: "MOU – Property Transaction",
    description:
      "Memorandum of Understanding for property deal between parties before formal agreement.",
    fields: [
      {
        key: "party1Name",
        label: "Party 1 Name",
        placeholder: "Name of first party",
        type: "text",
      },
      {
        key: "party2Name",
        label: "Party 2 Name",
        placeholder: "Name of second party",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Property under discussion",
        type: "textarea",
      },
      {
        key: "tentativePrice",
        label: "Tentative Price (₹)",
        placeholder: "e.g. 6000000",
        type: "number",
      },
      { key: "mouDate", label: "MOU Date", placeholder: "", type: "date" },
      {
        key: "validity",
        label: "MOU Validity (days)",
        placeholder: "e.g. 30",
        type: "number",
      },
      {
        key: "terms",
        label: "Key Terms & Conditions",
        placeholder: "List key agreed points",
        type: "textarea",
      },
    ],
  },
  {
    id: "sale-004",
    category: "Sale",
    title: "Allotment Letter",
    description:
      "Developer allotment letter confirming flat/unit allotted to buyer.",
    fields: [
      {
        key: "developerName",
        label: "Developer / Builder Name",
        placeholder: "e.g. MSTC Infrastructure Pvt Ltd",
        type: "text",
      },
      {
        key: "buyerName",
        label: "Buyer Name",
        placeholder: "Full name of allottee",
        type: "text",
      },
      {
        key: "projectName",
        label: "Project Name",
        placeholder: "e.g. MSTC Heights, Bopal",
        type: "text",
      },
      {
        key: "unitNo",
        label: "Unit / Flat Number",
        placeholder: "e.g. B-403",
        type: "text",
      },
      {
        key: "unitArea",
        label: "Unit Area (sq ft)",
        placeholder: "e.g. 1250",
        type: "number",
      },
      {
        key: "totalCost",
        label: "Total Cost (₹)",
        placeholder: "e.g. 7500000",
        type: "number",
      },
      {
        key: "allotmentDate",
        label: "Allotment Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "sale-005",
    category: "Sale",
    title: "Possession Letter",
    description:
      "Builder's letter handing over physical possession of unit to buyer.",
    fields: [
      {
        key: "builderName",
        label: "Builder Name",
        placeholder: "Developer company name",
        type: "text",
      },
      {
        key: "buyerName",
        label: "Buyer Name",
        placeholder: "Full name",
        type: "text",
      },
      {
        key: "flatNo",
        label: "Flat / Unit Number",
        placeholder: "e.g. A-702",
        type: "text",
      },
      {
        key: "projectName",
        label: "Project Name & Address",
        placeholder: "Project name and location",
        type: "textarea",
      },
      {
        key: "possessionDate",
        label: "Possession Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "outstandingDues",
        label: "Outstanding Dues (₹)",
        placeholder: "e.g. 0 if fully paid",
        type: "number",
      },
    ],
  },
  {
    id: "sale-006",
    category: "Sale",
    title: "Cancellation of Agreement",
    description:
      "Formal cancellation of a previously executed agreement to sell or booking.",
    fields: [
      {
        key: "requesterName",
        label: "Requester Name",
        placeholder: "Name of party requesting cancellation",
        type: "text",
      },
      {
        key: "otherPartyName",
        label: "Other Party Name",
        placeholder: "Name of other party",
        type: "text",
      },
      {
        key: "originalAgreementDate",
        label: "Original Agreement Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "propertyDetails",
        label: "Property Details",
        placeholder: "Brief property description",
        type: "textarea",
      },
      {
        key: "reasonForCancellation",
        label: "Reason for Cancellation",
        placeholder: "Explain why cancellation is sought",
        type: "textarea",
      },
      {
        key: "refundAmount",
        label: "Refund Amount Sought (₹)",
        placeholder: "e.g. 500000",
        type: "number",
      },
      {
        key: "cancellationDate",
        label: "Cancellation Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "sale-007",
    category: "Sale",
    title: "Refund Request Letter",
    description:
      "Formal letter requesting refund of booking amount or advance payment.",
    fields: [
      {
        key: "applicantName",
        label: "Applicant Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "recipientName",
        label: "Developer / Seller Name",
        placeholder: "Entity to whom letter is addressed",
        type: "text",
      },
      {
        key: "bookingDate",
        label: "Original Booking Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "amountPaid",
        label: "Amount Paid (₹)",
        placeholder: "Total amount paid",
        type: "number",
      },
      {
        key: "refundRequested",
        label: "Refund Amount Requested (₹)",
        placeholder: "Amount you want back",
        type: "number",
      },
      {
        key: "reasonForRefund",
        label: "Reason for Refund",
        placeholder: "Explain reason clearly",
        type: "textarea",
      },
      {
        key: "bankDetails",
        label: "Bank Account Details",
        placeholder: "Account no., IFSC, Bank name",
        type: "textarea",
      },
    ],
  },

  // ── PROPERTY DOCS ───────────────────────────────────────────────────────────
  {
    id: "propdoc-001",
    category: "Property Docs",
    title: "General Power of Attorney",
    description:
      "Authorises another person to act on your behalf for all property matters.",
    fields: [
      {
        key: "principalName",
        label: "Principal (Grantor) Name",
        placeholder: "e.g. Vinod Kumar Shah",
        type: "text",
      },
      {
        key: "principalAddress",
        label: "Principal Address",
        placeholder: "Full residential address",
        type: "textarea",
      },
      {
        key: "agentName",
        label: "Agent (Attorney) Name",
        placeholder: "Full name of authorised person",
        type: "text",
      },
      {
        key: "agentAddress",
        label: "Agent Address",
        placeholder: "Agent's full address",
        type: "textarea",
      },
      {
        key: "powers",
        label: "Powers Granted",
        placeholder: "List all powers granted (buy, sell, lease, mortgage...)",
        type: "textarea",
      },
      {
        key: "propertyDesc",
        label: "Property Description",
        placeholder: "Specific property details if applicable",
        type: "textarea",
      },
      {
        key: "executionDate",
        label: "Execution Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "propdoc-002",
    category: "Property Docs",
    title: "Special Power of Attorney",
    description: "Limited POA for a specific transaction or purpose.",
    fields: [
      {
        key: "principalName",
        label: "Principal Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "agentName",
        label: "Authorised Agent Name",
        placeholder: "Agent's full name",
        type: "text",
      },
      {
        key: "specificPurpose",
        label: "Specific Purpose / Transaction",
        placeholder: "e.g. Sale of flat no. B-203, Navrang Society",
        type: "textarea",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Full property address",
        type: "textarea",
      },
      { key: "validFrom", label: "Valid From", placeholder: "", type: "date" },
      {
        key: "validUntil",
        label: "Valid Until",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "propdoc-003",
    category: "Property Docs",
    title: "NOC from Society",
    description:
      "No Objection Certificate from housing society for flat sale or transfer.",
    fields: [
      {
        key: "societyName",
        label: "Society Name",
        placeholder: "e.g. Navrang Co-Op Hsg Society",
        type: "text",
      },
      {
        key: "memberName",
        label: "Flat Owner / Member Name",
        placeholder: "e.g. Suresh Patel",
        type: "text",
      },
      {
        key: "flatNo",
        label: "Flat Number",
        placeholder: "e.g. B-204",
        type: "text",
      },
      {
        key: "buyerName",
        label: "Prospective Buyer Name",
        placeholder: "Name of new buyer",
        type: "text",
      },
      {
        key: "issueDate",
        label: "NOC Issue Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "secretaryName",
        label: "Secretary Name",
        placeholder: "Society Secretary's name",
        type: "text",
      },
    ],
  },
  {
    id: "propdoc-004",
    category: "Property Docs",
    title: "Property Mutation Application",
    description:
      "Application for mutation of property records in municipal/revenue records.",
    fields: [
      {
        key: "applicantName",
        label: "Applicant Name",
        placeholder: "New owner's name",
        type: "text",
      },
      {
        key: "applicantAddress",
        label: "Applicant Address",
        placeholder: "Current residential address",
        type: "textarea",
      },
      {
        key: "propertyDetails",
        label: "Property Survey/Plot Details",
        placeholder: "Survey no., plot no., village, taluka, district",
        type: "textarea",
      },
      {
        key: "previousOwner",
        label: "Previous Owner Name",
        placeholder: "Name of previous registered owner",
        type: "text",
      },
      {
        key: "purchaseDate",
        label: "Date of Purchase / Transfer",
        placeholder: "",
        type: "date",
      },
      {
        key: "registrationNo",
        label: "Registration Document Number",
        placeholder: "e.g. Doc no. 1234/2025",
        type: "text",
      },
      {
        key: "applicationDate",
        label: "Application Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "propdoc-005",
    category: "Property Docs",
    title: "Affidavit – Property Ownership",
    description:
      "Sworn affidavit declaring ownership of property for legal/banking purposes.",
    fields: [
      {
        key: "deponentName",
        label: "Deponent (Affiant) Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "deponentAddress",
        label: "Deponent Address",
        placeholder: "Full residential address",
        type: "textarea",
      },
      {
        key: "propertyDetails",
        label: "Property Details",
        placeholder: "Survey no., plot no., address of property owned",
        type: "textarea",
      },
      {
        key: "acquisitionMethod",
        label: "How Property was Acquired",
        placeholder: "e.g. Purchase / Inheritance / Gift",
        type: "text",
      },
      {
        key: "acquisitionDate",
        label: "Date of Acquisition",
        placeholder: "",
        type: "date",
      },
      {
        key: "affidavitDate",
        label: "Affidavit Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "propdoc-006",
    category: "Property Docs",
    title: "Affidavit – No Encumbrance",
    description:
      "Declaration that property has no mortgage, loan, or legal dispute pending.",
    fields: [
      {
        key: "ownerName",
        label: "Property Owner Name",
        placeholder: "Full legal name",
        type: "text",
      },
      {
        key: "propertyDetails",
        label: "Property Details",
        placeholder: "Full description with survey/plot no.",
        type: "textarea",
      },
      {
        key: "declarationDate",
        label: "Declaration Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "notaryName",
        label: "Notary / Witness Name",
        placeholder: "Name of attesting notary",
        type: "text",
      },
      {
        key: "encumbrancePeriod",
        label: "Clear Period Claimed (years)",
        placeholder: "e.g. 30 years",
        type: "text",
      },
    ],
  },
  {
    id: "propdoc-007",
    category: "Property Docs",
    title: "Property Transfer Form",
    description:
      "Internal society/municipality form for recording property transfer.",
    fields: [
      {
        key: "transferorName",
        label: "Transferor (Seller) Name",
        placeholder: "Full name of person transferring",
        type: "text",
      },
      {
        key: "transfereeName",
        label: "Transferee (Buyer) Name",
        placeholder: "Full name of new owner",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Full property address",
        type: "textarea",
      },
      {
        key: "transferDate",
        label: "Date of Transfer",
        placeholder: "",
        type: "date",
      },
      {
        key: "considerationPaid",
        label: "Consideration Amount (₹)",
        placeholder: "e.g. 4800000",
        type: "number",
      },
      {
        key: "stampDutyPaid",
        label: "Stamp Duty Paid (₹)",
        placeholder: "e.g. 144000",
        type: "number",
      },
    ],
  },
  {
    id: "propdoc-008",
    category: "Property Docs",
    title: "Undertaking – Buyer to Society",
    description:
      "Buyer's undertaking to comply with society rules after purchase.",
    fields: [
      {
        key: "buyerName",
        label: "Buyer Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "flatNo",
        label: "Flat / Unit Number",
        placeholder: "e.g. C-101",
        type: "text",
      },
      {
        key: "societyName",
        label: "Society Name",
        placeholder: "Full society name",
        type: "text",
      },
      {
        key: "purchaseDate",
        label: "Purchase Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "undertakingDate",
        label: "Undertaking Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "witnessName",
        label: "Witness Name",
        placeholder: "Name of witness",
        type: "text",
      },
    ],
  },

  // ── LEGAL NOTICES ───────────────────────────────────────────────────────────
  {
    id: "notice-001",
    category: "Legal Notices",
    title: "Legal Notice – Property Dispute",
    description:
      "Formal legal notice for property boundary, ownership, or possession disputes.",
    fields: [
      {
        key: "senderName",
        label: "Notice Sender Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "senderAddress",
        label: "Sender Address",
        placeholder: "Your full address",
        type: "textarea",
      },
      {
        key: "recipientName",
        label: "Notice Recipient Name",
        placeholder: "Opposite party's name",
        type: "text",
      },
      {
        key: "recipientAddress",
        label: "Recipient Address",
        placeholder: "Recipient's full address",
        type: "textarea",
      },
      {
        key: "disputeDetails",
        label: "Dispute Details",
        placeholder: "Describe the dispute clearly",
        type: "textarea",
      },
      {
        key: "reliefSought",
        label: "Relief / Action Sought",
        placeholder: "What action do you want the other party to take",
        type: "textarea",
      },
      {
        key: "compliancePeriod",
        label: "Compliance Period (days)",
        placeholder: "e.g. 15",
        type: "number",
      },
      {
        key: "noticeDate",
        label: "Notice Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "notice-002",
    category: "Legal Notices",
    title: "Legal Notice – Rent Default",
    description: "Notice to tenant for non-payment or default in monthly rent.",
    fields: [
      {
        key: "landlordName",
        label: "Landlord Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "tenantName",
        label: "Tenant Name",
        placeholder: "Tenant's full name",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Rented property address",
        type: "textarea",
      },
      {
        key: "defaultAmount",
        label: "Defaulted Amount (₹)",
        placeholder: "Total outstanding rent",
        type: "number",
      },
      {
        key: "defaultPeriod",
        label: "Default Period",
        placeholder: "e.g. April 2025 to June 2025",
        type: "text",
      },
      {
        key: "paymentDeadline",
        label: "Payment Deadline",
        placeholder: "",
        type: "date",
      },
      {
        key: "noticeDate",
        label: "Notice Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "notice-003",
    category: "Legal Notices",
    title: "Legal Notice – Builder Delay",
    description:
      "Notice to builder/developer for delay in project completion or possession.",
    fields: [
      {
        key: "buyerName",
        label: "Buyer Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "builderName",
        label: "Builder / Developer Name",
        placeholder: "Builder company name",
        type: "text",
      },
      {
        key: "projectName",
        label: "Project Name",
        placeholder: "Name of housing project",
        type: "text",
      },
      {
        key: "unitNo",
        label: "Unit / Flat Number",
        placeholder: "e.g. B-504",
        type: "text",
      },
      {
        key: "promisedDate",
        label: "Promised Possession Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "currentDelay",
        label: "Current Delay (months)",
        placeholder: "e.g. 18",
        type: "number",
      },
      {
        key: "reliefSought",
        label: "Relief Sought",
        placeholder: "Immediate possession / Compensation / Refund",
        type: "textarea",
      },
    ],
  },
  {
    id: "notice-004",
    category: "Legal Notices",
    title: "Cheque Bounce Notice (Section 138)",
    description:
      "Legal notice under NI Act Section 138 for dishonoured cheque.",
    fields: [
      {
        key: "complainantName",
        label: "Complainant Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "accusedName",
        label: "Accused (Cheque Issuer) Name",
        placeholder: "Name of person who issued cheque",
        type: "text",
      },
      {
        key: "chequeNo",
        label: "Cheque Number",
        placeholder: "e.g. 123456",
        type: "text",
      },
      {
        key: "chequeAmount",
        label: "Cheque Amount (₹)",
        placeholder: "e.g. 250000",
        type: "number",
      },
      {
        key: "bankName",
        label: "Drawee Bank",
        placeholder: "Bank on which cheque was drawn",
        type: "text",
      },
      {
        key: "dishonourDate",
        label: "Date of Dishonour",
        placeholder: "",
        type: "date",
      },
      {
        key: "noticeDate",
        label: "Notice Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "notice-005",
    category: "Legal Notices",
    title: "Consumer Forum Complaint",
    description:
      "Complaint to District Consumer Disputes Redressal Commission.",
    fields: [
      {
        key: "complainantName",
        label: "Complainant Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "complainantAddress",
        label: "Complainant Address",
        placeholder: "Your full address",
        type: "textarea",
      },
      {
        key: "opponentName",
        label: "Opposite Party Name",
        placeholder: "Builder / Company name",
        type: "text",
      },
      {
        key: "complaintDetails",
        label: "Nature of Complaint",
        placeholder: "Detailed description of the grievance",
        type: "textarea",
      },
      {
        key: "reliefSought",
        label: "Relief Sought",
        placeholder: "Compensation / Replacement / Repair",
        type: "textarea",
      },
      {
        key: "amountInvolved",
        label: "Amount Involved (₹)",
        placeholder: "e.g. 350000",
        type: "number",
      },
      {
        key: "complaintDate",
        label: "Complaint Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "notice-006",
    category: "Legal Notices",
    title: "Indemnity Bond",
    description:
      "Bond to indemnify a party against loss, damage, or liability.",
    fields: [
      {
        key: "indemnifierName",
        label: "Indemnifier Name",
        placeholder: "Name of person giving indemnity",
        type: "text",
      },
      {
        key: "indemniteeeName",
        label: "Indemnitee Name",
        placeholder: "Name of protected party",
        type: "text",
      },
      {
        key: "purposeDesc",
        label: "Purpose of Indemnity",
        placeholder: "Describe the purpose clearly",
        type: "textarea",
      },
      {
        key: "bondAmount",
        label: "Bond Amount (₹)",
        placeholder: "e.g. 100000",
        type: "number",
      },
      {
        key: "executionDate",
        label: "Execution Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "validityPeriod",
        label: "Validity (years)",
        placeholder: "e.g. 3",
        type: "number",
      },
    ],
  },

  // ── SOCIETY ─────────────────────────────────────────────────────────────────
  {
    id: "society-001",
    category: "Society",
    title: "Society Maintenance Agreement",
    description:
      "Agreement between society and member for monthly maintenance charges.",
    fields: [
      {
        key: "societyName",
        label: "Society Name",
        placeholder: "e.g. Shree Krishna Co-Op Hsg Society",
        type: "text",
      },
      {
        key: "memberName",
        label: "Member / Flat Owner Name",
        placeholder: "Flat owner's full name",
        type: "text",
      },
      {
        key: "flatNo",
        label: "Flat Number",
        placeholder: "e.g. A-301",
        type: "text",
      },
      {
        key: "monthlyMaintenance",
        label: "Monthly Maintenance (₹)",
        placeholder: "e.g. 3500",
        type: "number",
      },
      {
        key: "dueDate",
        label: "Monthly Due Date",
        placeholder: "e.g. 5th of every month",
        type: "text",
      },
      {
        key: "penaltyRate",
        label: "Late Payment Penalty (%)",
        placeholder: "e.g. 2",
        type: "number",
      },
      {
        key: "agreementDate",
        label: "Agreement Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "society-002",
    category: "Society",
    title: "Society NOC for Renovation",
    description:
      "No objection certificate from society for flat renovation/alteration works.",
    fields: [
      {
        key: "memberName",
        label: "Member Name",
        placeholder: "Flat owner's full name",
        type: "text",
      },
      {
        key: "flatNo",
        label: "Flat Number",
        placeholder: "e.g. D-102",
        type: "text",
      },
      {
        key: "societyName",
        label: "Society Name",
        placeholder: "Full society name",
        type: "text",
      },
      {
        key: "workDescription",
        label: "Renovation Work Description",
        placeholder: "Describe work: flooring, bathroom, kitchen...",
        type: "textarea",
      },
      {
        key: "workDuration",
        label: "Expected Work Duration",
        placeholder: "e.g. 15 days",
        type: "text",
      },
      {
        key: "startDate",
        label: "Work Start Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "issueDate",
        label: "NOC Issue Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "society-003",
    category: "Society",
    title: "Flat Transfer Letter",
    description:
      "Letter to society requesting flat transfer to new owner after sale.",
    fields: [
      {
        key: "currentMemberName",
        label: "Current Member (Seller) Name",
        placeholder: "Full name of current flat owner",
        type: "text",
      },
      {
        key: "newMemberName",
        label: "New Member (Buyer) Name",
        placeholder: "Full name of new flat owner",
        type: "text",
      },
      {
        key: "flatNo",
        label: "Flat Number",
        placeholder: "e.g. E-501",
        type: "text",
      },
      {
        key: "societyName",
        label: "Society Name",
        placeholder: "Full society name",
        type: "text",
      },
      { key: "saleDate", label: "Date of Sale", placeholder: "", type: "date" },
      {
        key: "requestDate",
        label: "Transfer Request Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "society-004",
    category: "Society",
    title: "Undertaking – Builder to Buyer",
    description:
      "Developer's undertaking to buyer guaranteeing construction quality and timelines.",
    fields: [
      {
        key: "builderName",
        label: "Builder / Developer Name",
        placeholder: "Full company name",
        type: "text",
      },
      {
        key: "buyerName",
        label: "Buyer Name",
        placeholder: "Full name",
        type: "text",
      },
      {
        key: "projectDetails",
        label: "Project Details",
        placeholder: "Project name, location, RERA no.",
        type: "textarea",
      },
      {
        key: "possessionDate",
        label: "Guaranteed Possession Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "warrantyPeriod",
        label: "Structural Warranty (years)",
        placeholder: "e.g. 5",
        type: "number",
      },
      {
        key: "undertakingDate",
        label: "Undertaking Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "society-005",
    category: "Society",
    title: "Builder-Buyer Agreement",
    description:
      "Comprehensive agreement between builder and buyer for under-construction property.",
    fields: [
      {
        key: "builderName",
        label: "Builder Name",
        placeholder: "Developer entity name",
        type: "text",
      },
      {
        key: "buyerName",
        label: "Buyer Name",
        placeholder: "Full name",
        type: "text",
      },
      {
        key: "unitDetails",
        label: "Unit Details",
        placeholder: "Flat no., floor, wing, area (sq ft)",
        type: "textarea",
      },
      {
        key: "totalPrice",
        label: "Total Agreement Price (₹)",
        placeholder: "e.g. 8500000",
        type: "number",
      },
      {
        key: "paymentSchedule",
        label: "Payment Schedule",
        placeholder: "Describe milestone-linked payment terms",
        type: "textarea",
      },
      {
        key: "possessionDate",
        label: "Expected Possession Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "reraNo",
        label: "RERA Registration Number",
        placeholder: "e.g. PR/GJ/AHMEDABAD/AUDA/...",
        type: "text",
      },
    ],
  },

  // ── RERA ────────────────────────────────────────────────────────────────────
  {
    id: "rera-001",
    category: "RERA",
    title: "RERA Project Registration Application",
    description:
      "Application form for registering a new real estate project under GujRERA.",
    fields: [
      {
        key: "developerName",
        label: "Developer / Promoter Name",
        placeholder: "Full legal entity name",
        type: "text",
      },
      {
        key: "projectName",
        label: "Project Name",
        placeholder: "Name of the project",
        type: "text",
      },
      {
        key: "projectAddress",
        label: "Project Location / Address",
        placeholder: "Survey no., village, taluka, district",
        type: "textarea",
      },
      {
        key: "totalUnits",
        label: "Total Number of Units",
        placeholder: "e.g. 120",
        type: "number",
      },
      {
        key: "totalArea",
        label: "Total Carpet Area (sq m)",
        placeholder: "e.g. 8500",
        type: "number",
      },
      {
        key: "startDate",
        label: "Project Start Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "completionDate",
        label: "Projected Completion Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "rera-002",
    category: "RERA",
    title: "RERA Complaint Form",
    description:
      "Complaint form for filing grievance against a builder/developer with GujRERA.",
    fields: [
      {
        key: "complainantName",
        label: "Complainant Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "reraProjectNo",
        label: "RERA Project Number",
        placeholder: "e.g. PR/GJ/AHMEDABAD/AUDA/12345",
        type: "text",
      },
      {
        key: "builderName",
        label: "Builder / Promoter Name",
        placeholder: "Developer name",
        type: "text",
      },
      {
        key: "unitNo",
        label: "Unit / Flat Number",
        placeholder: "Booked unit number",
        type: "text",
      },
      {
        key: "complaintDetails",
        label: "Complaint Details",
        placeholder: "Describe your grievance in detail",
        type: "textarea",
      },
      {
        key: "reliefSought",
        label: "Relief / Remedy Sought",
        placeholder: "Possession / Compensation / Refund",
        type: "textarea",
      },
      {
        key: "filingDate",
        label: "Filing Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "rera-003",
    category: "RERA",
    title: "RERA Refund Application",
    description: "Application for refund of amount paid under RERA Section 18.",
    fields: [
      {
        key: "applicantName",
        label: "Applicant Name",
        placeholder: "Your full name",
        type: "text",
      },
      {
        key: "projectName",
        label: "Project Name",
        placeholder: "Name of the project",
        type: "text",
      },
      {
        key: "reraNo",
        label: "RERA Registration Number",
        placeholder: "RERA project no.",
        type: "text",
      },
      {
        key: "totalPaid",
        label: "Total Amount Paid (₹)",
        placeholder: "e.g. 3500000",
        type: "number",
      },
      {
        key: "refundReason",
        label: "Reason for Refund",
        placeholder: "Delay / Non-compliance / Changed plans",
        type: "textarea",
      },
      {
        key: "applicationDate",
        label: "Application Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "rera-004",
    category: "RERA",
    title: "Shop & Establishment Registration",
    description:
      "Registration application for shops and commercial establishments in Gujarat.",
    fields: [
      {
        key: "ownerName",
        label: "Owner / Manager Name",
        placeholder: "Full name of proprietor",
        type: "text",
      },
      {
        key: "businessName",
        label: "Name of Establishment",
        placeholder: "e.g. MSTC Realty Services",
        type: "text",
      },
      {
        key: "businessAddress",
        label: "Business Address",
        placeholder: "Full address with PIN code",
        type: "textarea",
      },
      {
        key: "businessType",
        label: "Nature of Business",
        placeholder: "e.g. Real Estate Consultancy",
        type: "text",
      },
      {
        key: "employeeCount",
        label: "Number of Employees",
        placeholder: "e.g. 8",
        type: "number",
      },
      {
        key: "registrationDate",
        label: "Registration Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "rera-005",
    category: "RERA",
    title: "Trade License Application",
    description:
      "Application for trade license from local municipal authority (AMC/AUDA).",
    fields: [
      {
        key: "applicantName",
        label: "Applicant Name",
        placeholder: "Proprietor / Director name",
        type: "text",
      },
      {
        key: "businessName",
        label: "Business / Trade Name",
        placeholder: "Name of the business",
        type: "text",
      },
      {
        key: "businessAddress",
        label: "Business Premises Address",
        placeholder: "Full address of premises",
        type: "textarea",
      },
      {
        key: "tradeCategory",
        label: "Trade Category",
        placeholder: "e.g. Real Estate / Construction / Events",
        type: "text",
      },
      {
        key: "wardNo",
        label: "Ward Number",
        placeholder: "AMC Ward No.",
        type: "text",
      },
      {
        key: "applicationDate",
        label: "Application Date",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── FINANCE ─────────────────────────────────────────────────────────────────
  {
    id: "finance-001",
    category: "Finance",
    title: "Home Loan Application",
    description: "Standard home loan application form for bank submission.",
    fields: [
      {
        key: "applicantName",
        label: "Applicant Name",
        placeholder: "Full name as per PAN card",
        type: "text",
      },
      {
        key: "applicantDOB",
        label: "Date of Birth",
        placeholder: "",
        type: "date",
      },
      {
        key: "panNo",
        label: "PAN Number",
        placeholder: "e.g. ABCDE1234F",
        type: "text",
      },
      {
        key: "monthlyIncome",
        label: "Monthly Income (₹)",
        placeholder: "Net monthly income",
        type: "number",
      },
      {
        key: "loanAmountRequired",
        label: "Loan Amount Required (₹)",
        placeholder: "e.g. 3500000",
        type: "number",
      },
      {
        key: "propertyValue",
        label: "Property Value (₹)",
        placeholder: "e.g. 5000000",
        type: "number",
      },
      {
        key: "tenure",
        label: "Loan Tenure (years)",
        placeholder: "e.g. 20",
        type: "number",
      },
      {
        key: "employmentType",
        label: "Employment Type",
        placeholder: "Salaried / Self-Employed / Business",
        type: "text",
      },
    ],
  },
  {
    id: "finance-002",
    category: "Finance",
    title: "Loan Against Property Application",
    description:
      "Application for mortgage loan against existing property as collateral.",
    fields: [
      {
        key: "applicantName",
        label: "Applicant Name",
        placeholder: "Full name as per ID",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Mortgaged Property Address",
        placeholder: "Full address of property offered as collateral",
        type: "textarea",
      },
      {
        key: "propertyValue",
        label: "Property Market Value (₹)",
        placeholder: "e.g. 8000000",
        type: "number",
      },
      {
        key: "loanRequired",
        label: "Loan Amount Required (₹)",
        placeholder: "e.g. 5000000",
        type: "number",
      },
      {
        key: "purpose",
        label: "Purpose of Loan",
        placeholder: "Business expansion / Personal needs / Education",
        type: "text",
      },
      {
        key: "tenure",
        label: "Preferred Tenure (years)",
        placeholder: "e.g. 15",
        type: "number",
      },
      {
        key: "applicationDate",
        label: "Application Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "finance-003",
    category: "Finance",
    title: "Security Deposit Receipt",
    description: "Acknowledgment receipt for security deposit payment.",
    fields: [
      {
        key: "receiverName",
        label: "Deposit Receiver Name",
        placeholder: "Name of landlord/developer",
        type: "text",
      },
      {
        key: "payerName",
        label: "Deposit Payer Name",
        placeholder: "Name of tenant/buyer",
        type: "text",
      },
      {
        key: "depositAmount",
        label: "Deposit Amount (₹)",
        placeholder: "e.g. 100000",
        type: "number",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Address for which deposit is given",
        type: "textarea",
      },
      {
        key: "paymentMode",
        label: "Mode of Payment",
        placeholder: "e.g. NEFT / IMPS / Cheque",
        type: "text",
      },
      {
        key: "receiptDate",
        label: "Receipt Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "refundDate",
        label: "Expected Refund Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "finance-004",
    category: "Finance",
    title: "Tripartite Agreement",
    description:
      "Three-party agreement between builder, buyer, and bank for home loan disbursement.",
    fields: [
      {
        key: "builderName",
        label: "Builder / Developer Name",
        placeholder: "Full developer name",
        type: "text",
      },
      {
        key: "buyerName",
        label: "Buyer Name",
        placeholder: "Full name",
        type: "text",
      },
      {
        key: "bankName",
        label: "Lending Bank / NBFC",
        placeholder: "e.g. SBI / HDFC / ICICI Bank",
        type: "text",
      },
      {
        key: "loanAmount",
        label: "Sanctioned Loan Amount (₹)",
        placeholder: "e.g. 4200000",
        type: "number",
      },
      {
        key: "propertyDetails",
        label: "Property Details",
        placeholder: "Flat no., project, address",
        type: "textarea",
      },
      {
        key: "agreementDate",
        label: "Agreement Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "finance-005",
    category: "Finance",
    title: "Property Valuation Request",
    description:
      "Request letter to registered valuer for property valuation report.",
    fields: [
      {
        key: "applicantName",
        label: "Applicant Name",
        placeholder: "Name of property owner",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Full address requiring valuation",
        type: "textarea",
      },
      {
        key: "purposeOfValuation",
        label: "Purpose of Valuation",
        placeholder: "Loan / Sale / Legal / Insurance",
        type: "text",
      },
      {
        key: "propertyType",
        label: "Property Type",
        placeholder: "Residential Flat / Commercial / Plot / Industrial",
        type: "text",
      },
      {
        key: "propertyArea",
        label: "Built-Up Area (sq ft)",
        placeholder: "e.g. 1350",
        type: "number",
      },
      {
        key: "requestDate",
        label: "Request Date",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── NGO ─────────────────────────────────────────────────────────────────────
  {
    id: "ngo-001",
    category: "NGO",
    title: "NGO Trust Registration Form",
    description:
      "Application for registering a public charitable trust under the Bombay Public Trust Act.",
    fields: [
      {
        key: "trustName",
        label: "Name of Trust",
        placeholder: "e.g. MSTC Charitable Trust",
        type: "text",
      },
      {
        key: "trusteesNames",
        label: "Names of Trustees",
        placeholder: "List all trustees' full names",
        type: "textarea",
      },
      {
        key: "registeredAddress",
        label: "Registered Office Address",
        placeholder: "Full address with PIN code",
        type: "textarea",
      },
      {
        key: "objectsOfTrust",
        label: "Objects of the Trust",
        placeholder: "Educational / Medical / Social welfare...",
        type: "textarea",
      },
      {
        key: "initialCorpus",
        label: "Initial Corpus Fund (₹)",
        placeholder: "e.g. 100000",
        type: "number",
      },
      {
        key: "registrationDate",
        label: "Registration Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "ngo-002",
    category: "NGO",
    title: "CSR Agreement",
    description:
      "Agreement between corporate entity and NGO for CSR project implementation.",
    fields: [
      {
        key: "corporateName",
        label: "Corporate Name",
        placeholder: "Company giving CSR funds",
        type: "text",
      },
      {
        key: "ngoName",
        label: "NGO / Implementing Agency Name",
        placeholder: "NGO executing the project",
        type: "text",
      },
      {
        key: "projectTitle",
        label: "CSR Project Title",
        placeholder: "e.g. Skill Development Program, Bopal",
        type: "text",
      },
      {
        key: "csrAmount",
        label: "CSR Amount (₹)",
        placeholder: "Total CSR disbursement",
        type: "number",
      },
      {
        key: "projectDuration",
        label: "Project Duration (months)",
        placeholder: "e.g. 12",
        type: "number",
      },
      {
        key: "startDate",
        label: "Project Start Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "reportingSchedule",
        label: "Reporting Schedule",
        placeholder: "Monthly / Quarterly",
        type: "text",
      },
    ],
  },
  {
    id: "ngo-003",
    category: "NGO",
    title: "Volunteer Agreement",
    description: "Agreement defining terms of voluntary service with an NGO.",
    fields: [
      {
        key: "volunteerName",
        label: "Volunteer Name",
        placeholder: "Full name of volunteer",
        type: "text",
      },
      {
        key: "ngoName",
        label: "NGO Name",
        placeholder: "Organisation name",
        type: "text",
      },
      {
        key: "roleDescription",
        label: "Volunteer Role",
        placeholder: "e.g. Field Coordinator / Teacher / Medical Aid",
        type: "text",
      },
      {
        key: "commitment",
        label: "Time Commitment",
        placeholder: "e.g. 10 hours/week",
        type: "text",
      },
      { key: "startDate", label: "Start Date", placeholder: "", type: "date" },
      { key: "endDate", label: "End Date", placeholder: "", type: "date" },
      {
        key: "confidentialityClause",
        label: "Confidentiality Agreement",
        placeholder: "Yes / No",
        type: "text",
      },
    ],
  },
  {
    id: "ngo-004",
    category: "NGO",
    title: "Donation Receipt 80G",
    description:
      "Official donation receipt for 80G income tax deduction claim.",
    fields: [
      {
        key: "receiptNo",
        label: "Receipt Number",
        placeholder: "e.g. MSTC-80G-2025-001",
        type: "text",
      },
      {
        key: "donorName",
        label: "Donor Name",
        placeholder: "Full name of donor",
        type: "text",
      },
      {
        key: "donorPAN",
        label: "Donor PAN Number",
        placeholder: "e.g. ABCDE1234F",
        type: "text",
      },
      {
        key: "donationAmount",
        label: "Donation Amount (₹)",
        placeholder: "e.g. 50000",
        type: "number",
      },
      {
        key: "paymentMode",
        label: "Mode of Payment",
        placeholder: "Cheque / NEFT / UPI / DD",
        type: "text",
      },
      {
        key: "donationDate",
        label: "Donation Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "trustCertNo",
        label: "80G Certificate Number",
        placeholder: "NGO's 80G registration no.",
        type: "text",
      },
    ],
  },
  {
    id: "ngo-005",
    category: "NGO",
    title: "CSR Project Completion Report",
    description:
      "Completion report submitted by NGO to corporate after CSR project execution.",
    fields: [
      {
        key: "ngoName",
        label: "NGO Name",
        placeholder: "Implementing organization name",
        type: "text",
      },
      {
        key: "projectTitle",
        label: "Project Title",
        placeholder: "Name of completed CSR project",
        type: "text",
      },
      {
        key: "corporateName",
        label: "Corporate Funder",
        placeholder: "Company that funded the project",
        type: "text",
      },
      {
        key: "amountUtilized",
        label: "Amount Utilized (₹)",
        placeholder: "Total amount spent",
        type: "number",
      },
      {
        key: "beneficiaryCount",
        label: "Number of Beneficiaries",
        placeholder: "e.g. 350",
        type: "number",
      },
      {
        key: "completionDate",
        label: "Project Completion Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "outcomes",
        label: "Key Outcomes & Impact",
        placeholder: "Describe measurable outcomes achieved",
        type: "textarea",
      },
    ],
  },

  // ── EVENTS ──────────────────────────────────────────────────────────────────
  {
    id: "events-001",
    category: "Events",
    title: "Event Venue Agreement",
    description:
      "Agreement for booking a venue for events, weddings, or corporate functions.",
    fields: [
      {
        key: "venueName",
        label: "Venue Name",
        placeholder: "e.g. Royal Banquet, Ahmedabad",
        type: "text",
      },
      {
        key: "clientName",
        label: "Client Name",
        placeholder: "Full name of person booking venue",
        type: "text",
      },
      {
        key: "eventType",
        label: "Type of Event",
        placeholder: "Wedding / Corporate / Birthday / Conference",
        type: "text",
      },
      { key: "eventDate", label: "Event Date", placeholder: "", type: "date" },
      {
        key: "venueCost",
        label: "Venue Rental Cost (₹)",
        placeholder: "e.g. 250000",
        type: "number",
      },
      {
        key: "advanceDeposit",
        label: "Advance Deposit (₹)",
        placeholder: "e.g. 100000",
        type: "number",
      },
      {
        key: "guestCount",
        label: "Expected Guest Count",
        placeholder: "e.g. 500",
        type: "number",
      },
      {
        key: "agreementDate",
        label: "Agreement Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "events-002",
    category: "Events",
    title: "Artist Performance Agreement",
    description: "Agreement for hiring an artist/performer for an event.",
    fields: [
      {
        key: "artistName",
        label: "Artist / Performer Name",
        placeholder: "Name or stage name",
        type: "text",
      },
      {
        key: "organizerName",
        label: "Event Organizer Name",
        placeholder: "Organizer / Company name",
        type: "text",
      },
      {
        key: "eventName",
        label: "Event Name",
        placeholder: "Name of the event",
        type: "text",
      },
      {
        key: "eventDate",
        label: "Performance Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "venue",
        label: "Venue",
        placeholder: "Event venue address",
        type: "text",
      },
      {
        key: "performanceFee",
        label: "Performance Fee (₹)",
        placeholder: "e.g. 150000",
        type: "number",
      },
      {
        key: "performanceDuration",
        label: "Performance Duration (hours)",
        placeholder: "e.g. 2",
        type: "number",
      },
    ],
  },
  {
    id: "events-003",
    category: "Events",
    title: "Tour Package Agreement",
    description:
      "Agreement between travel agent and customer for a tour package.",
    fields: [
      {
        key: "agencyName",
        label: "Travel Agency Name",
        placeholder: "e.g. MSTC Holidays",
        type: "text",
      },
      {
        key: "clientName",
        label: "Client Name",
        placeholder: "Traveller's full name",
        type: "text",
      },
      {
        key: "destination",
        label: "Tour Destination",
        placeholder: "e.g. Kerala / Dubai / Ladakh",
        type: "text",
      },
      {
        key: "departureDate",
        label: "Departure Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "returnDate",
        label: "Return Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "packageCost",
        label: "Package Cost per Person (₹)",
        placeholder: "e.g. 35000",
        type: "number",
      },
      {
        key: "groupSize",
        label: "Group Size",
        placeholder: "Number of travellers",
        type: "number",
      },
      {
        key: "inclusionsList",
        label: "Inclusions",
        placeholder: "Hotel / Flights / Meals / Sightseeing",
        type: "textarea",
      },
    ],
  },
  {
    id: "events-004",
    category: "Events",
    title: "Media Collaboration Agreement",
    description:
      "Agreement for media coverage, PR, or collaboration for events.",
    fields: [
      {
        key: "mediaEntity",
        label: "Media Entity / Agency",
        placeholder: "News channel / Magazine / Digital Media name",
        type: "text",
      },
      {
        key: "clientName",
        label: "Client / Brand Name",
        placeholder: "Company requesting coverage",
        type: "text",
      },
      {
        key: "scopeOfWork",
        label: "Scope of Media Work",
        placeholder: "TV coverage / Social media / Print / Digital PR",
        type: "textarea",
      },
      {
        key: "fee",
        label: "Collaboration Fee (₹)",
        placeholder: "e.g. 75000",
        type: "number",
      },
      {
        key: "deliveryDate",
        label: "Delivery / Air Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "agreementDate",
        label: "Agreement Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "events-005",
    category: "Events",
    title: "Sports Management Agreement",
    description:
      "Agreement between sports management company and athlete or team.",
    fields: [
      {
        key: "managementCompany",
        label: "Sports Management Company",
        placeholder: "e.g. MSTC Sports Management",
        type: "text",
      },
      {
        key: "athleteName",
        label: "Athlete / Team Name",
        placeholder: "Full name or team name",
        type: "text",
      },
      {
        key: "sport",
        label: "Sport / Game",
        placeholder: "e.g. Cricket / Football / Athletics",
        type: "text",
      },
      {
        key: "contractDuration",
        label: "Contract Duration (years)",
        placeholder: "e.g. 2",
        type: "number",
      },
      {
        key: "managementFee",
        label: "Management Fee (%)",
        placeholder: "e.g. 15",
        type: "number",
      },
      {
        key: "startDate",
        label: "Contract Start Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "servicesOffered",
        label: "Services Offered",
        placeholder: "Endorsements / Contracts / Media / Training",
        type: "textarea",
      },
    ],
  },
  {
    id: "events-006",
    category: "Events",
    title: "Sponsorship Agreement",
    description:
      "Agreement between event organizer and sponsor for event sponsorship.",
    fields: [
      {
        key: "organizerName",
        label: "Event Organizer",
        placeholder: "Organization name",
        type: "text",
      },
      {
        key: "sponsorName",
        label: "Sponsor Name",
        placeholder: "Company / Individual sponsor",
        type: "text",
      },
      {
        key: "eventName",
        label: "Event Name",
        placeholder: "Name of the sponsored event",
        type: "text",
      },
      { key: "eventDate", label: "Event Date", placeholder: "", type: "date" },
      {
        key: "sponsorshipAmount",
        label: "Sponsorship Amount (₹)",
        placeholder: "e.g. 500000",
        type: "number",
      },
      {
        key: "sponsorBenefits",
        label: "Sponsor Benefits",
        placeholder: "Logo placement / Mentions / Booth / Exclusivity",
        type: "textarea",
      },
      {
        key: "agreementDate",
        label: "Agreement Date",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── NRI ─────────────────────────────────────────────────────────────────────
  {
    id: "nri-001",
    category: "NRI",
    title: "NRI Property Purchase – FEMA Declaration",
    description:
      "FEMA compliance declaration for NRI acquiring property in India.",
    fields: [
      {
        key: "nriName",
        label: "NRI Full Name",
        placeholder: "Name as per passport",
        type: "text",
      },
      {
        key: "passportNo",
        label: "Passport Number",
        placeholder: "e.g. P1234567",
        type: "text",
      },
      {
        key: "countryOfResidence",
        label: "Country of Residence",
        placeholder: "e.g. USA / UAE / UK / Canada",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Purchased in India",
        placeholder: "Full address of property",
        type: "textarea",
      },
      {
        key: "purchasePrice",
        label: "Purchase Price (₹)",
        placeholder: "e.g. 7500000",
        type: "number",
      },
      {
        key: "fundSource",
        label: "Source of Funds",
        placeholder: "NRE Account / NRO Account / Foreign remittance",
        type: "text",
      },
      {
        key: "declarationDate",
        label: "Declaration Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "nri-002",
    category: "NRI",
    title: "NRI Power of Attorney – India",
    description:
      "POA given by NRI to a resident Indian to act on their behalf for property matters.",
    fields: [
      {
        key: "nriName",
        label: "NRI (Principal) Name",
        placeholder: "NRI's full legal name",
        type: "text",
      },
      {
        key: "nriAddress",
        label: "NRI Address Abroad",
        placeholder: "Full overseas address",
        type: "textarea",
      },
      {
        key: "agentName",
        label: "Resident Agent Name",
        placeholder: "Name of person in India",
        type: "text",
      },
      {
        key: "agentAddress",
        label: "Agent Address in India",
        placeholder: "Agent's full Indian address",
        type: "textarea",
      },
      {
        key: "powersGranted",
        label: "Powers Granted",
        placeholder: "Sale / Purchase / Lease / Registration / Legal",
        type: "textarea",
      },
      {
        key: "apostilleDate",
        label: "Apostille / Notarization Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "nri-003",
    category: "NRI",
    title: "FCNR Account Declaration",
    description:
      "Declaration for opening/operating an FCNR (Foreign Currency Non-Repatriable) account.",
    fields: [
      {
        key: "accountHolderName",
        label: "Account Holder Name",
        placeholder: "Full name as per passport",
        type: "text",
      },
      {
        key: "bankName",
        label: "Bank Name",
        placeholder: "e.g. SBI / HDFC / ICICI",
        type: "text",
      },
      {
        key: "branchAddress",
        label: "Bank Branch Address",
        placeholder: "Full branch address",
        type: "textarea",
      },
      {
        key: "currency",
        label: "Currency of Account",
        placeholder: "e.g. USD / GBP / EUR / AED",
        type: "text",
      },
      {
        key: "depositAmount",
        label: "Deposit Amount (foreign currency)",
        placeholder: "e.g. 50000 USD",
        type: "text",
      },
      {
        key: "declarationDate",
        label: "Declaration Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "nri-004",
    category: "NRI",
    title: "Tax Residency Certificate Request",
    description:
      "Request letter to Indian tax authorities for Tax Residency Certificate (TRC).",
    fields: [
      {
        key: "nriName",
        label: "NRI Name",
        placeholder: "Full name",
        type: "text",
      },
      {
        key: "panNo",
        label: "Indian PAN Number",
        placeholder: "e.g. ABCDE1234F",
        type: "text",
      },
      {
        key: "countryOfResidence",
        label: "Country of Residence",
        placeholder: "Country where TRC is required",
        type: "text",
      },
      {
        key: "financialYear",
        label: "Financial Year",
        placeholder: "e.g. 2024–25",
        type: "text",
      },
      {
        key: "purposeOfTRC",
        label: "Purpose of TRC",
        placeholder: "DTAA benefit / Bank requirement / Visa",
        type: "textarea",
      },
      {
        key: "requestDate",
        label: "Request Date",
        placeholder: "",
        type: "date",
      },
    ],
  },
  {
    id: "nri-005",
    category: "NRI",
    title: "Repatriation of Sale Proceeds",
    description:
      "Application for repatriation of funds to NRI's overseas account after property sale.",
    fields: [
      {
        key: "nriName",
        label: "NRI Name",
        placeholder: "Full name as per bank records",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Sold",
        placeholder: "Full address of sold property in India",
        type: "textarea",
      },
      {
        key: "saleAmount",
        label: "Sale Amount (₹)",
        placeholder: "e.g. 9500000",
        type: "number",
      },
      {
        key: "capitalGainsTaxPaid",
        label: "Capital Gains Tax Paid (₹)",
        placeholder: "Amount of tax paid",
        type: "number",
      },
      {
        key: "nroAccountNo",
        label: "NRO Account Number",
        placeholder: "Account where sale proceeds received",
        type: "text",
      },
      {
        key: "overseasAccountNo",
        label: "Overseas Account Number",
        placeholder: "Account to which funds to be transferred",
        type: "text",
      },
      {
        key: "applicationDate",
        label: "Application Date",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── FLAT ALLOTMENT LETTER ────────────────────────────────────────────────────
  {
    id: "prop-doc-010",
    category: "Property Docs",
    title: "Flat Allotment Letter",
    description:
      "Standard flat allotment letter issued by builder to buyer confirming allotment of a specific unit in Gujarat.",
    fields: [
      {
        key: "builderName",
        label: "Builder / Developer Name",
        placeholder: "e.g. Shree Ram Developers Pvt. Ltd.",
        type: "text",
      },
      {
        key: "projectName",
        label: "Project / Scheme Name",
        placeholder: "e.g. Shree Ram Heights",
        type: "text",
      },
      {
        key: "reraNo",
        label: "RERA Registration Number",
        placeholder: "e.g. PR/GJ/AHMEDABAD/AUDA/...",
        type: "text",
      },
      {
        key: "flatNumber",
        label: "Flat / Unit Number",
        placeholder: "e.g. A-404",
        type: "text",
      },
      {
        key: "floor",
        label: "Floor Number",
        placeholder: "e.g. 4th Floor",
        type: "text",
      },
      {
        key: "areaSqft",
        label: "Carpet Area (sq. ft.)",
        placeholder: "e.g. 950",
        type: "number",
      },
      {
        key: "buyerName",
        label: "Buyer's Full Name",
        placeholder: "e.g. Rajesh Kumar Mehta",
        type: "text",
      },
      {
        key: "buyerAddress",
        label: "Buyer's Address",
        placeholder: "Full permanent address",
        type: "textarea",
      },
      {
        key: "allotmentDate",
        label: "Allotment Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "totalPrice",
        label: "Total Agreed Price (₹)",
        placeholder: "e.g. 4500000",
        type: "number",
      },
      {
        key: "bookingAmount",
        label: "Booking Amount Received (₹)",
        placeholder: "e.g. 200000",
        type: "number",
      },
      {
        key: "paymentSchedule",
        label: "Payment Schedule / Milestones",
        placeholder: "e.g. 10% on booking, 20% on foundation, 30% on slab...",
        type: "textarea",
      },
      {
        key: "possessionDate",
        label: "Tentative Possession Date",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── BUILDER-BUYER AGREEMENT ───────────────────────────────────────────────────
  {
    id: "sale-006",
    category: "Sale",
    title: "Builder-Buyer Agreement (RERA Compliant)",
    description:
      "Comprehensive RERA-compliant builder-buyer agreement for Gujarat under Real Estate (Regulation & Development) Act, 2016.",
    fields: [
      {
        key: "builderName",
        label: "Builder / Promoter Name",
        placeholder: "e.g. XYZ Realty Pvt. Ltd.",
        type: "text",
      },
      {
        key: "builderAddress",
        label: "Builder's Registered Address",
        placeholder: "Full registered office address",
        type: "textarea",
      },
      {
        key: "reraNumber",
        label: "Project RERA Registration Number",
        placeholder: "e.g. PR/GJ/AHMEDABAD/AUDA/...",
        type: "text",
      },
      {
        key: "projectName",
        label: "Project Name",
        placeholder: "e.g. Shree Ram Residency",
        type: "text",
      },
      {
        key: "projectAddress",
        label: "Project Location / Address",
        placeholder: "Survey No., Village, Taluka, District",
        type: "textarea",
      },
      {
        key: "buyerName",
        label: "Buyer's Full Name",
        placeholder: "e.g. Priya Jayesh Shah",
        type: "text",
      },
      {
        key: "buyerAddress",
        label: "Buyer's Permanent Address",
        placeholder: "Full permanent address with PIN code",
        type: "textarea",
      },
      {
        key: "flatDetails",
        label: "Unit / Flat Details",
        placeholder: "Unit No., Floor, Tower, Carpet Area, Type (2BHK/3BHK)",
        type: "textarea",
      },
      {
        key: "carpetArea",
        label: "Carpet Area (sq. ft.)",
        placeholder: "As per RERA definition",
        type: "number",
      },
      {
        key: "totalPrice",
        label: "Total Sale Price (₹)",
        placeholder: "e.g. 6500000",
        type: "number",
      },
      {
        key: "paymentPlan",
        label: "Payment Plan (10 Installments)",
        placeholder:
          "Installment 1: 10% on booking...\nInstallment 2: 15% on foundation...\n(list all 10)",
        type: "textarea",
      },
      {
        key: "possessionDate",
        label: "Agreed Possession Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "penaltyClause",
        label: "Penalty for Delay (per month, ₹)",
        placeholder: "As per RERA: interest at SBI PLR + 2%",
        type: "text",
      },
      {
        key: "forceMajeure",
        label: "Force Majeure Conditions",
        placeholder:
          "Flood, earthquake, war, government restriction — specify exclusions",
        type: "textarea",
      },
      {
        key: "agreementDate",
        label: "Agreement Execution Date",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── POSSESSION LETTER ────────────────────────────────────────────────────────
  {
    id: "prop-doc-011",
    category: "Property Docs",
    title: "Possession Letter",
    description:
      "Official letter from builder to buyer handing over possession of the property unit after completion.",
    fields: [
      {
        key: "builderName",
        label: "Builder / Developer Name",
        placeholder: "e.g. Shree Ram Developers Pvt. Ltd.",
        type: "text",
      },
      {
        key: "buyerName",
        label: "Buyer's Full Name",
        placeholder: "e.g. Amit Patel",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address (Complete)",
        placeholder: "Flat No., Floor, Tower, Project, Society, City, PIN",
        type: "textarea",
      },
      {
        key: "reraNo",
        label: "RERA Registration Number",
        placeholder: "e.g. PR/GJ/...",
        type: "text",
      },
      {
        key: "possessionDate",
        label: "Date of Possession Handover",
        placeholder: "",
        type: "date",
      },
      {
        key: "handoverCondition",
        label: "Condition of Handover",
        placeholder:
          "e.g. As per agreed specifications, all fixtures installed, CC obtained",
        type: "textarea",
      },
      {
        key: "pendingDues",
        label: "Pending Dues (if any)",
        placeholder:
          "e.g. ₹25,000 pending towards stamp duty / maintenance deposit",
        type: "textarea",
      },
      {
        key: "defectLiabilityPeriod",
        label: "Defect Liability Period (years)",
        placeholder: "As per RERA: minimum 5 years",
        type: "text",
      },
      {
        key: "metersHandedOver",
        label: "Meters / Keys Handed Over",
        placeholder: "e.g. 2 keys, electricity meter no., water meter no.",
        type: "textarea",
      },
      {
        key: "witnessName",
        label: "Witness Name",
        placeholder: "Name of witness present at handover",
        type: "text",
      },
    ],
  },

  // ── SOCIETY FORMATION CHECKLIST (GUJARAT) ────────────────────────────────────
  {
    id: "society-004",
    category: "Society",
    title: "Society Formation Checklist (Gujarat Co-op)",
    description:
      "Step-by-step checklist for forming a Cooperative Housing Society in Gujarat under the Gujarat Co-operative Societies Act, 1961.",
    fields: [
      {
        key: "societyName",
        label: "Proposed Society Name",
        placeholder: "e.g. Shanti Nagar Co-operative Housing Society Ltd.",
        type: "text",
      },
      {
        key: "registeredAddress",
        label: "Proposed Registered Address",
        placeholder: "Full address of the society premises",
        type: "textarea",
      },
      {
        key: "membersCount",
        label: "Number of Founding Members",
        placeholder: "Minimum 10 members required under Gujarat law",
        type: "number",
      },
      {
        key: "district",
        label: "District / Taluka",
        placeholder: "e.g. Ahmedabad, Gandhinagar",
        type: "text",
      },
      {
        key: "registrarOffice",
        label: "Concerned Registrar Office",
        placeholder: "e.g. Deputy Registrar, Co-operative Societies, Ahmedabad",
        type: "text",
      },
      {
        key: "applicationDate",
        label: "Proposed Application Date",
        placeholder: "",
        type: "date",
      },
      {
        key: "additionalNotes",
        label: "Additional Notes / Special Conditions",
        placeholder: "Any special conditions, builder pending handover, etc.",
        type: "textarea",
      },
    ],
  },

  // ── TENANT EVICTION PROCEDURE (GUJARAT) ──────────────────────────────────────
  {
    id: "legal-notice-006",
    category: "Legal Notices",
    title: "Tenant Eviction Procedure Guide + Notice (Gujarat)",
    description:
      "Step-by-step guide for tenant eviction under Gujarat Rent Control Act, 1947, with a ready-to-use legal notice template.",
    fields: [
      {
        key: "landlordName",
        label: "Landlord Full Name",
        placeholder: "e.g. Harish Kumar Patel",
        type: "text",
      },
      {
        key: "landlordAddress",
        label: "Landlord's Address",
        placeholder: "Full address for correspondence",
        type: "textarea",
      },
      {
        key: "tenantName",
        label: "Tenant Full Name",
        placeholder: "e.g. Suresh Ramji Shah",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Tenanted Property Address",
        placeholder: "Full address of the rented premises",
        type: "textarea",
      },
      {
        key: "noticePeriod",
        label: "Notice Period (days)",
        placeholder: "e.g. 15 / 30 / 60",
        type: "text",
      },
      {
        key: "groundsForEviction",
        label: "Grounds for Eviction",
        placeholder:
          "e.g. Non-payment of rent / Expiry of agreement / Personal use / Subletting without permission",
        type: "textarea",
      },
      {
        key: "amountDue",
        label: "Rent / Dues Outstanding (₹)",
        placeholder: "Total amount outstanding if non-payment is a ground",
        type: "number",
      },
      {
        key: "noticeDate",
        label: "Date of Notice",
        placeholder: "",
        type: "date",
      },
      {
        key: "vacateByDate",
        label: "Vacate By Date",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── NOTICE TO VACATE — 15 DAYS ───────────────────────────────────────────────
  {
    id: "legal-notice-007",
    category: "Legal Notices",
    title: "Notice to Vacate — 15 Days",
    description:
      "15-day notice to vacate addressed to the tenant, legally enforceable under Gujarat Rent Control Act.",
    fields: [
      {
        key: "landlordName",
        label: "Landlord Full Name",
        placeholder: "e.g. Dharmesh Patel",
        type: "text",
      },
      {
        key: "tenantName",
        label: "Tenant Full Name",
        placeholder: "e.g. Rakesh Verma",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Full address of rented premises",
        type: "textarea",
      },
      {
        key: "issueDate",
        label: "Date of Notice",
        placeholder: "",
        type: "date",
      },
      {
        key: "reason",
        label: "Reason for Vacation",
        placeholder: "e.g. Expiry of license period / Non-payment of rent",
        type: "textarea",
      },
    ],
  },

  // ── NOTICE TO VACATE — 30 DAYS ───────────────────────────────────────────────
  {
    id: "legal-notice-008",
    category: "Legal Notices",
    title: "Notice to Vacate — 30 Days",
    description:
      "30-day notice to vacate addressed to the tenant, legally enforceable under Gujarat Rent Control Act.",
    fields: [
      {
        key: "landlordName",
        label: "Landlord Full Name",
        placeholder: "e.g. Dharmesh Patel",
        type: "text",
      },
      {
        key: "tenantName",
        label: "Tenant Full Name",
        placeholder: "e.g. Rakesh Verma",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Full address of rented premises",
        type: "textarea",
      },
      {
        key: "issueDate",
        label: "Date of Notice",
        placeholder: "",
        type: "date",
      },
      {
        key: "reason",
        label: "Reason for Vacation",
        placeholder:
          "e.g. Personal use / Sale of property / Unauthorized subletting",
        type: "textarea",
      },
    ],
  },

  // ── NOTICE TO VACATE — 60 DAYS ───────────────────────────────────────────────
  {
    id: "legal-notice-009",
    category: "Legal Notices",
    title: "Notice to Vacate — 60 Days",
    description:
      "60-day notice to vacate addressed to the tenant, for properties requiring longer notice periods under Gujarat tenancy law.",
    fields: [
      {
        key: "landlordName",
        label: "Landlord Full Name",
        placeholder: "e.g. Dharmesh Patel",
        type: "text",
      },
      {
        key: "tenantName",
        label: "Tenant Full Name",
        placeholder: "e.g. Rakesh Verma",
        type: "text",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Full address of rented premises",
        type: "textarea",
      },
      {
        key: "issueDate",
        label: "Date of Notice",
        placeholder: "",
        type: "date",
      },
      {
        key: "reason",
        label: "Reason for Vacation",
        placeholder: "e.g. Redevelopment / Personal use / Extended non-payment",
        type: "textarea",
      },
    ],
  },

  // ── CO-OWNERSHIP AGREEMENT ────────────────────────────────────────────────────
  {
    id: "prop-doc-012",
    category: "Property Docs",
    title: "Co-Ownership Agreement",
    description:
      "Agreement between two or more co-owners of a property defining shares, rights, responsibilities, and exit terms.",
    fields: [
      {
        key: "owner1Name",
        label: "Owner 1 — Full Name",
        placeholder: "e.g. Vijay Ramesh Shah",
        type: "text",
      },
      {
        key: "owner1Share",
        label: "Owner 1 — Ownership Share (%)",
        placeholder: "e.g. 60",
        type: "number",
      },
      {
        key: "owner2Name",
        label: "Owner 2 — Full Name",
        placeholder: "e.g. Priya Suresh Mehta",
        type: "text",
      },
      {
        key: "owner2Share",
        label: "Owner 2 — Ownership Share (%)",
        placeholder: "e.g. 40 (total must equal 100)",
        type: "number",
      },
      {
        key: "propertyAddress",
        label: "Property Address",
        placeholder: "Full address of co-owned property",
        type: "textarea",
      },
      {
        key: "purchasePrice",
        label: "Total Purchase Price (₹)",
        placeholder: "e.g. 8500000",
        type: "number",
      },
      {
        key: "usageRights",
        label: "Usage Rights",
        placeholder:
          "e.g. Owner 1 uses floors 1–2, Owner 2 uses floor 3 / Joint use with mutual consent",
        type: "textarea",
      },
      {
        key: "costSharing",
        label: "Cost Sharing (maintenance, taxes)",
        placeholder: "e.g. Proportional to ownership share / Equal split",
        type: "textarea",
      },
      {
        key: "rentalIncome",
        label: "Rental Income Distribution",
        placeholder: "How rental income (if any) is divided",
        type: "textarea",
      },
      {
        key: "disputeResolution",
        label: "Dispute Resolution Mechanism",
        placeholder: "e.g. Arbitration in Ahmedabad / Mediation / Civil Court",
        type: "textarea",
      },
      {
        key: "exitClause",
        label: "Exit / Buyout Clause",
        placeholder:
          "e.g. Right of first refusal to other co-owner at fair market value",
        type: "textarea",
      },
      {
        key: "agreementDate",
        label: "Agreement Date",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── JOINT DEVELOPMENT AGREEMENT ───────────────────────────────────────────────
  {
    id: "sale-007",
    category: "Sale",
    title: "Joint Development Agreement (JDA) — Landowner & Builder",
    description:
      "Standard JDA format for Gujarat — landowner contributes land, builder contributes construction, both share completed units or revenue.",
    fields: [
      {
        key: "landownerName",
        label: "Landowner's Full Name",
        placeholder: "e.g. Mansukhbhai Ranchhodbhai Patel",
        type: "text",
      },
      {
        key: "landownerAddress",
        label: "Landowner's Address",
        placeholder: "Full address with PIN code",
        type: "textarea",
      },
      {
        key: "builderName",
        label: "Builder / Developer Name",
        placeholder: "e.g. Sai Construction Co. Pvt. Ltd.",
        type: "text",
      },
      {
        key: "builderAddress",
        label: "Builder's Registered Address",
        placeholder: "Registered office address",
        type: "textarea",
      },
      {
        key: "landDetails",
        label: "Land Details (Survey / Plot)",
        placeholder:
          "Survey No., Plot No., Village, Taluka, District, Area in sq. yards",
        type: "textarea",
      },
      {
        key: "landArea",
        label: "Total Land Area (sq. yards)",
        placeholder: "e.g. 1200",
        type: "number",
      },
      {
        key: "landownerShare",
        label: "Landowner's Share of Completed Units (%)",
        placeholder: "e.g. 40%",
        type: "text",
      },
      {
        key: "builderShare",
        label: "Builder's Share of Completed Units (%)",
        placeholder: "e.g. 60%",
        type: "text",
      },
      {
        key: "landownerUnits",
        label: "Units Allocated to Landowner",
        placeholder:
          "e.g. Ground Floor — 2BHK (Unit A), First Floor — 2BHK (Unit B)",
        type: "textarea",
      },
      {
        key: "constructionTimeline",
        label: "Construction Completion Timeline",
        placeholder: "e.g. 24 months from commencement date",
        type: "text",
      },
      {
        key: "reraCompliance",
        label: "RERA Compliance Details",
        placeholder: "RERA registration responsibility, authority, timeline",
        type: "textarea",
      },
      {
        key: "jdaDate",
        label: "JDA Execution Date",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── RERA COMPLAINT FORM (GUJRERA) ────────────────────────────────────────────
  {
    id: "rera-004",
    category: "RERA",
    title: "RERA Complaint Form (GujRERA)",
    description:
      "Draft complaint form to file before the Gujarat Real Estate Regulatory Authority (GujRERA) against builders for non-compliance, delay, or deficiency.",
    fields: [
      {
        key: "complainantName",
        label: "Complainant's Full Name",
        placeholder: "e.g. Suresh Harilal Mehta",
        type: "text",
      },
      {
        key: "complainantAddress",
        label: "Complainant's Address",
        placeholder: "Full residential address with PIN code",
        type: "textarea",
      },
      {
        key: "complainantEmail",
        label: "Complainant's Email Address",
        placeholder: "e.g. suresh.mehta@gmail.com",
        type: "text",
      },
      {
        key: "complainantPhone",
        label: "Complainant's Mobile Number",
        placeholder: "+91 XXXXXXXXXX",
        type: "text",
      },
      {
        key: "respondentName",
        label: "Respondent (Builder / Promoter) Name",
        placeholder: "Full name of builder / promoter",
        type: "text",
      },
      {
        key: "respondentAddress",
        label: "Respondent's Address",
        placeholder: "Registered office address of builder",
        type: "textarea",
      },
      {
        key: "projectName",
        label: "Project Name",
        placeholder: "Name of the residential / commercial project",
        type: "text",
      },
      {
        key: "reraRegNo",
        label: "Project RERA Registration Number",
        placeholder: "e.g. PR/GJ/AHMEDABAD/AUDA/...",
        type: "text",
      },
      {
        key: "unitDetails",
        label: "Unit / Flat Details",
        placeholder: "Unit No., Floor, Tower, Carpet Area",
        type: "text",
      },
      {
        key: "complaintDetails",
        label: "Complaint Details (Narration)",
        placeholder:
          "Detailed description of the issue — delay, non-delivery, defects, misrepresentation, etc.",
        type: "textarea",
      },
      {
        key: "amountPaid",
        label: "Total Amount Paid to Builder (₹)",
        placeholder: "Total consideration paid till date",
        type: "number",
      },
      {
        key: "reliefSought",
        label: "Relief Sought",
        placeholder:
          "e.g. Possession of unit / Refund with interest / Penalty / Compensation",
        type: "textarea",
      },
      {
        key: "complaintDate",
        label: "Date of Filing Complaint",
        placeholder: "",
        type: "date",
      },
    ],
  },

  // ── CONSUMER COURT GUIDE + APPLICATION (PROPERTY DISPUTE) ────────────────────
  {
    id: "legal-notice-010",
    category: "Legal Notices",
    title: "Consumer Court Application — Property Dispute",
    description:
      "Complete guide and application template to file a consumer complaint for property disputes before the District Consumer Disputes Redressal Commission under Consumer Protection Act, 2019.",
    fields: [
      {
        key: "complainantName",
        label: "Complainant's Full Name",
        placeholder: "e.g. Priya Jayesh Desai",
        type: "text",
      },
      {
        key: "complainantAddress",
        label: "Complainant's Complete Address",
        placeholder: "Full address with PIN code",
        type: "textarea",
      },
      {
        key: "complainantPhone",
        label: "Complainant's Contact Number",
        placeholder: "+91 XXXXXXXXXX",
        type: "text",
      },
      {
        key: "respondentName",
        label: "Respondent (Builder / Seller) Name",
        placeholder: "Full name / company name",
        type: "text",
      },
      {
        key: "respondentAddress",
        label: "Respondent's Address",
        placeholder: "Registered address of the respondent",
        type: "textarea",
      },
      {
        key: "districtForum",
        label: "District Consumer Forum",
        placeholder:
          "e.g. District Consumer Disputes Redressal Commission, Ahmedabad",
        type: "text",
      },
      {
        key: "deficiencyOfService",
        label: "Deficiency of Service / Unfair Trade Practice",
        placeholder:
          "Describe in detail: delayed possession, false promises, non-refund, construction defects, title issues, etc.",
        type: "textarea",
      },
      {
        key: "amountInvolved",
        label: "Amount Involved (₹)",
        placeholder: "Total financial loss / consideration amount",
        type: "number",
      },
      {
        key: "complaintNarration",
        label: "Full Complaint Narration",
        placeholder:
          "Chronological facts of the case — dates, amounts paid, promises made, defaults committed",
        type: "textarea",
      },
      {
        key: "documentsAttached",
        label: "Documents to be Attached",
        placeholder:
          "e.g. Agreement copy, payment receipts, builder correspondence, possession demand letters",
        type: "textarea",
      },
      {
        key: "reliefSought",
        label: "Relief Sought",
        placeholder:
          "e.g. Refund of ₹X with 12% p.a. interest + ₹50,000 compensation + ₹25,000 litigation cost",
        type: "textarea",
      },
      {
        key: "filingDate",
        label: "Date of Filing",
        placeholder: "",
        type: "date",
      },
    ],
  },
];

const ALL_CATEGORIES: Category[] = [
  "All",
  "Rental",
  "Sale",
  "Property Docs",
  "Legal Notices",
  "Society",
  "RERA",
  "Finance",
  "NGO",
  "Events",
  "NRI",
];

function generateTextTemplate(
  form: LegalForm,
  values: Record<string, string>,
): string {
  const lines: string[] = [
    "===================================",
    "MSTC GLOBAL \u2013 LEGAL DOCUMENT",
    "===================================",
    `Form: ${form.title}`,
    `Category: ${form.category}`,
    `Generated: ${new Date().toLocaleDateString("en-IN")}`,
    "===================================",
    "",
  ];
  for (const field of form.fields) {
    const val = values[field.key] || "___________________";
    lines.push(`${field.label}:`);
    lines.push(`  ${val}`);
    lines.push("");
  }
  lines.push("===================================");
  lines.push("Prepared by MSTC GLOBAL \u2013 +91 9512609016");
  lines.push("www.mstcglobal.in | mstc.gbl@gmail.com");
  lines.push("===================================");
  return lines.join("\n");
}

export default function AdminLegalFormsTab() {
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<LegalForm | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const filteredForms = FORMS_DATA.filter((f) => {
    const matchCat =
      activeCategoryFilter === "All" || f.category === activeCategoryFilter;
    const matchSearch = f.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  function openForm(form: LegalForm) {
    setSelectedForm(form);
    setFormValues({});
    setPreviewMode(false);
  }

  function closeForm() {
    setSelectedForm(null);
    setFormValues({});
    setPreviewMode(false);
  }

  function handleFieldChange(key: string, value: string) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleDownload() {
    if (!selectedForm) return;
    const text = generateTextTemplate(selectedForm, formValues);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedForm.title.replace(/\s+/g, "_")}_MSTC.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    window.print();
  }

  const categoryCount = (cat: Category) =>
    cat === "All"
      ? FORMS_DATA.length
      : FORMS_DATA.filter((f) => f.category === cat).length;

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "#06090f" }}
      data-ocid="legalforms.section"
    >
      {/* Print CSS */}
      <style>{`
        @media print {
          body > *:not(#legal-print-area) { display: none !important; }
          #legal-print-area { display: block !important; }
        }
      `}</style>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "#c9a84c" }}>
          Legal Forms Library
        </h2>
        <p className="text-sm mt-1" style={{ color: "#888" }}>
          {FORMS_DATA.length} professionally formatted forms — fillable,
          printable, downloadable
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "#c9a84c" }}
        />
        <input
          type="text"
          placeholder="Search forms by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
          style={{
            background: "#0a0e17",
            border: "1px solid rgba(201,168,76,0.3)",
            color: "#e8e8e8",
          }}
          data-ocid="legalforms.search_input"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategoryFilter(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: activeCategoryFilter === cat ? "#c9a84c" : "#0f1319",
              color: activeCategoryFilter === cat ? "#000" : "#c9a84c",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
            data-ocid={`legalforms.${cat.toLowerCase().replace(/\s+/g, "_")}.tab`}
          >
            {cat} <span className="opacity-70">({categoryCount(cat)})</span>
          </button>
        ))}
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{
            background: "#0f1319",
            border: "1px solid rgba(201,168,76,0.15)",
          }}
          data-ocid="legalforms.empty_state"
        >
          <FileText
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: "#c9a84c", opacity: 0.4 }}
          />
          <p style={{ color: "#888" }}>No forms found for this search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredForms.map((form, idx) => (
            <div
              key={form.id}
              className="rounded-xl p-5 flex flex-col gap-3 cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: "#0f1319",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
              onClick={() => openForm(form)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openForm(form);
              }}
              data-ocid={`legalforms.item.${idx + 1}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3
                  className="text-sm font-semibold leading-snug"
                  style={{ color: "#c9a84c" }}
                >
                  {form.title}
                </h3>
                <span
                  className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                    CATEGORY_COLORS[form.category]
                  }`}
                >
                  {form.category}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>
                {form.description}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs" style={{ color: "#666" }}>
                  {form.fields.length} fields
                </span>
                <button
                  type="button"
                  className="text-xs px-3 py-1 rounded-md font-semibold"
                  style={{ background: "#c9a84c", color: "#000" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openForm(form);
                  }}
                  data-ocid={`legalforms.fill_button.${idx + 1}`}
                >
                  Fill Form
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeForm();
          }}
          role="dialog"
          aria-modal="true"
          data-ocid="legalforms.dialog"
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{
              background: "#0f1319",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            {/* Modal Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between p-5"
              style={{
                background: "#0f1319",
                borderBottom: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              <div>
                <h3
                  className="font-bold text-base"
                  style={{ color: "#c9a84c" }}
                >
                  {selectedForm.title}
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium border mt-1 inline-block ${
                    CATEGORY_COLORS[selectedForm.category]
                  }`}
                >
                  {selectedForm.category}
                </span>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 rounded-full transition-colors"
                style={{ background: "rgba(201,168,76,0.1)" }}
                aria-label="Close form"
                data-ocid="legalforms.close_button"
              >
                <X className="w-4 h-4" style={{ color: "#c9a84c" }} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-4">
              {!previewMode ? (
                <>
                  {selectedForm.fields.map((field) => (
                    <div key={field.key} className="flex flex-col gap-1">
                      <label
                        className="text-xs font-medium"
                        style={{ color: "#c9a84c" }}
                      >
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          rows={3}
                          placeholder={field.placeholder}
                          value={formValues[field.key] || ""}
                          onChange={(e) =>
                            handleFieldChange(field.key, e.target.value)
                          }
                          className="rounded-lg px-3 py-2 text-sm outline-none resize-none"
                          style={{
                            background: "#0a0e17",
                            border: "1px solid rgba(201,168,76,0.3)",
                            color: "#e8e8e8",
                          }}
                          data-ocid={`legalforms.${field.key}.textarea`}
                        />
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formValues[field.key] || ""}
                          onChange={(e) =>
                            handleFieldChange(field.key, e.target.value)
                          }
                          className="rounded-lg px-3 py-2 text-sm outline-none"
                          style={{
                            background: "#0a0e17",
                            border: "1px solid rgba(201,168,76,0.3)",
                            color: "#e8e8e8",
                          }}
                          data-ocid={`legalforms.${field.key}.input`}
                        />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                // Preview area (also the print area)
                <div
                  id="legal-print-area"
                  className="rounded-lg p-4 font-mono text-xs whitespace-pre-wrap"
                  style={{
                    background: "#06090f",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "#e8e8e8",
                    lineHeight: 1.8,
                  }}
                >
                  {generateTextTemplate(selectedForm, formValues)}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="sticky bottom-0 flex flex-wrap items-center gap-3 p-5"
              style={{
                background: "#0f1319",
                borderTop: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              <button
                type="button"
                onClick={() => setPreviewMode((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: previewMode ? "rgba(201,168,76,0.15)" : "#c9a84c",
                  color: previewMode ? "#c9a84c" : "#000",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
                data-ocid="legalforms.preview_button"
              >
                <ChevronDown className="w-4 h-4" />
                {previewMode ? "Edit Form" : "Preview"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  color: "#c9a84c",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
                data-ocid="legalforms.download_button"
              >
                <Download className="w-4 h-4" />
                Download .txt
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  color: "#c9a84c",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
                data-ocid="legalforms.print_button"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="ml-auto px-4 py-2 rounded-lg text-sm"
                style={{ color: "#666" }}
                data-ocid="legalforms.cancel_button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
