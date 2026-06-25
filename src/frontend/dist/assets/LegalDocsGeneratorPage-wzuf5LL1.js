import{r as p,j as e,aY as E,aT as C,aU as R,aV as S,ae as v,aW as D}from"./index-B_qAaeh5.js";import{B as $}from"./BackToTop-BxU1H5w2.js";import{S as P}from"./scale-Cc8SXeVE.js";import{P as L}from"./printer-DQ2R6606.js";const I={landlordName:"",tenantName:"",landlordAddress:"",tenantAddress:"",address:"",rent:"",deposit:"",startDate:"",duration:"11",maintenanceClause:"Tenant shall maintain the property in good condition. Minor repairs up to ₹500 per incident shall be borne by tenant.",witnesses:""},w={sellerName:"",sellerPan:"",buyerName:"",buyerPan:"",address:"",price:"",advancePaid:"",saleDate:"",registrar:"",surveyNo:""},F={complainantName:"",complainantPhone:"",complainantEmail:"",developerName:"",projectName:"",reraNumber:"",bookingDate:"",issueType:"",issueDescription:"",reliefSought:"",date:""},O={issuerName:"",issuerAddress:"",recipientName:"",purpose:"",propertyAddress:"",date:"",conditions:""},k={deponentName:"",deponentAddress:"",aadhaar:"",subject:"",statement:"",date:"",place:""};function q(r){return`                    RENTAL AGREEMENT
                  (DRAFT TEMPLATE — FOR REFERENCE ONLY)

This Rental Agreement ("Agreement") is made and entered into on ${r.startDate} at Ahmedabad, Gujarat, India between:

LANDLORD:
Name : ${r.landlordName}
Address : ${r.landlordAddress}
(hereinafter referred to as the “Landlord”)

AND

TENANT:
Name : ${r.tenantName}
Address : ${r.tenantAddress}
(hereinafter referred to as the “Tenant”)

1. PROPERTY
The Landlord agrees to let and the Tenant agrees to take on rent the following premises:
${r.address}
(hereinafter referred to as the “Premises”)

2. TERM
This Agreement shall be effective for a period of ${r.duration} months commencing from ${r.startDate}. It shall stand automatically terminated at the end of the said period unless renewed in writing by mutual consent.

3. RENT
The Tenant shall pay a monthly rent of ₹${r.rent}/- (Rupees ${r.rent} only) payable on or before the 5th of every English calendar month.

4. SECURITY DEPOSIT
The Tenant has paid a refundable security deposit of ₹${r.deposit}/- which shall be refunded within 30 days of vacating the premises after deducting any outstanding dues or damage charges.

5. MAINTENANCE
${r.maintenanceClause}

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

Witnesses: ${r.witnesses}

___________________________          ___________________________
Landlord’s Signature                  Tenant’s Signature
${r.landlordName}                     ${r.tenantName}`}function G(r){return`                    AGREEMENT FOR SALE
                  (DRAFT TEMPLATE — FOR REFERENCE ONLY)

This Agreement for Sale is made at Ahmedabad, Gujarat on ${r.saleDate} between:

SELLER:
Name : ${r.sellerName}
PAN  : ${r.sellerPan}
(hereinafter referred to as the “Seller”)

AND

BUYER:
Name : ${r.buyerName}
PAN  : ${r.buyerPan}
(hereinafter referred to as the “Buyer”)

1. PROPERTY DETAILS
The Seller agrees to sell and the Buyer agrees to purchase the following property:
${r.address}
Survey / Revenue No.: ${r.surveyNo}

2. SALE CONSIDERATION
The total agreed sale consideration is ₹${r.price}/- (Rupees ${r.price} only).
The Buyer has paid an advance of ₹${r.advancePaid}/- as earnest money. The balance shall be paid at the time of registration.

3. TERMS AND CONDITIONS
   a. The Seller confirms the property is free from all encumbrances, liens, mortgages, or pending litigation.
   b. Time for completion: Sale deed shall be executed within 60 days of this Agreement unless extended by mutual written consent.
   c. Stamp duty and registration charges shall be borne by the Buyer as per the Gujarat Stamp Act.
   d. The Seller shall hand over possession of the property upon receipt of full sale consideration.
   e. 1% TDS shall be deducted by the Buyer if sale consideration exceeds ₹50 Lakhs (as per Income Tax Act Section 194IA).

4. DEFAULT
If the Buyer defaults, the Seller may forfeit the earnest money. If the Seller defaults, the Buyer is entitled to a refund of double the earnest money.

5. SUB-REGISTRAR
Sale deed to be executed before the Sub-Registrar, ${r.registrar}.

6. GOVERNING LAW
The Transfer of Property Act, 1882 and the Registration Act, 1908 shall apply.

FACILITATOR CLAUSE: MSTC GLOBAL has prepared this draft as a facilitator only. Independent legal advice is strongly recommended.

___________________________          ___________________________
Seller’s Signature                    Buyer’s Signature
${r.sellerName}                       ${r.buyerName}`}function M(r){return`                  RERA COMPLAINT LETTER
                  (DRAFT TEMPLATE — FOR REFERENCE ONLY)

To,
The Hon’ble Adjudicating Officer / Regulatory Authority
Gujarat Real Estate Regulatory Authority (GujRERA)
Ahmedabad, Gujarat

Date: ${r.date||new Date().toLocaleDateString("en-IN")}

Sub: Complaint under Section 31 / Section 71 of the Real Estate (Regulation and Development) Act, 2016

Respected Sir/Madam,

I, ${r.complainantName}, residing at _____________________, Phone: ${r.complainantPhone}, Email: ${r.complainantEmail}, do hereby file this complaint against:

Respondent (Developer / Promoter):
Name    : ${r.developerName}
Project : ${r.projectName}
GujRERA Registration No.: ${r.reraNumber}

Facts of the Case:
- Booking Date : ${r.bookingDate}
- Nature of Grievance : ${r.issueType}

Details of Grievance:
${r.issueDescription}

Relief Sought:
${r.reliefSought}

Declaration:
I hereby declare that the information provided above is true and correct to the best of my knowledge and belief. No other complaint on this subject is pending before any court or authority.

Yours faithfully,
${r.complainantName}
Phone: ${r.complainantPhone}
Email: ${r.complainantEmail}

Note: Attach copies of booking agreement, payment receipts, and all correspondence with the developer.`}function B(r){return`                       NO OBJECTION CERTIFICATE
                  (DRAFT TEMPLATE — FOR REFERENCE ONLY)

Date: ${r.date}

To Whom It May Concern,

I / We, ${r.issuerName}
Address: ${r.issuerAddress}

Hereby issue this No Objection Certificate (NOC) in favour of:
${r.recipientName}

For the purpose of: ${r.purpose}

Property Details: ${r.propertyAddress}

This NOC is issued with the following conditions:
${r.conditions||"No specific conditions. This NOC is issued unconditionally."}

This certificate is valid for a period of 6 months from the date of issue unless revoked earlier by the undersigned.

Signature: _________________________
Name     : ${r.issuerName}
Date     : ${r.date}

Note: This is a draft template. Get this document attested/notarized as required by the receiving authority.`}function Y(r){return`                         AFFIDAVIT
                  (DRAFT TEMPLATE — FOR REFERENCE ONLY)

                    AFFIDAVIT

I, ${r.deponentName}, son/daughter of ___________________, aged ______ years, residing at ${r.deponentAddress}, Aadhaar No.: ${r.aadhaar}, do hereby solemnly affirm and state as follows:

SUBJECT: ${r.subject}

1. ${r.statement}

2. I am making this affidavit in support of the above-mentioned purpose and for submission to the concerned authority.

3. I solemnly declare that the contents of this affidavit are true and correct to the best of my knowledge and belief. Nothing has been concealed therefrom.

SOLEMNLY AFFIRMED AND SIGNED
on this ${r.date} at ${r.place}


Deponent’s Signature: _____________________
Name: ${r.deponentName}


BEFORE ME:

Notary Public / Executive Magistrate
Date: ${r.date}
Place: ${r.place}

Note: This is a draft for reference only. Execute the final affidavit on non-judicial stamp paper of required value and get it notarized.`}function s({label:r,children:N}){return e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs text-muted-foreground mb-1",children:r}),N]})}const n="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary",z=[{id:"rental",label:"Rental Agreement",desc:"Landlord-tenant lease"},{id:"sale",label:"Sale Agreement",desc:"Property purchase/sale"},{id:"rera-complaint",label:"RERA Complaint",desc:"GujRERA grievance letter"},{id:"noc",label:"NOC Letter",desc:"No objection certificate"},{id:"affidavit",label:"Affidavit",desc:"Sworn statement"}];function J(){const[r,N]=p.useState(""),[l,o]=p.useState(I),[i,c]=p.useState(w),[d,u]=p.useState(F),[m,g]=p.useState(O),[h,x]=p.useState(k),[f,b]=p.useState(""),[_,j]=p.useState(!1),y=()=>{_&&(r==="rental"?b(q(l)):r==="sale"?b(G(i)):r==="rera-complaint"?b(M(d)):r==="noc"?b(B(m)):r==="affidavit"&&b(Y(h)))},A=a=>{N(a),b(""),j(!1)};return e.jsx(E,{children:e.jsxs("div",{className:"min-h-screen bg-background text-foreground",children:[e.jsx(C,{}),e.jsx("section",{className:"pt-24 pb-8 px-4 bg-card/50 border-b border-border",children:e.jsxs("div",{className:"max-w-5xl mx-auto",children:[e.jsxs(R,{to:"/",className:"inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4","data-ocid":"legaldocs.back_button",children:[e.jsx(S,{size:14})," Back to Home"]}),e.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[e.jsx(P,{size:24,className:"text-primary"}),e.jsx("h1",{className:"font-serif font-bold text-3xl gold-text",children:"Legal Document Generator"})]}),e.jsx("p",{className:"font-sans text-sm text-muted-foreground",children:"Generate printable draft agreements and legal documents. These are templates only — always consult a lawyer before using."})]})}),e.jsxs("main",{className:"max-w-5xl mx-auto px-4 py-10",children:[e.jsx("div",{className:"grid gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-8",children:z.map(({id:a,label:t,desc:T})=>e.jsxs("button",{type:"button",onClick:()=>A(a),className:`p-4 rounded-xl border text-left transition-all ${r===a?"border-primary bg-primary/10":"border-border bg-card hover:border-primary/50"}`,"data-ocid":`legaldocs.type_${a}`,children:[e.jsx(v,{size:20,className:r===a?"text-primary mb-2":"text-muted-foreground mb-2"}),e.jsx("div",{className:"font-semibold text-xs text-foreground",children:t}),e.jsx("div",{className:"text-xs text-muted-foreground mt-0.5",children:T})]},a))}),r==="rental"&&e.jsxs("div",{className:"bg-card border border-border rounded-xl p-6 mb-6",children:[e.jsx("h3",{className:"font-serif font-semibold text-lg mb-5 text-foreground",children:"Rental Agreement Details"}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(s,{label:"Landlord Full Name *",children:e.jsx("input",{required:!0,value:l.landlordName,onChange:a=>o(t=>({...t,landlordName:a.target.value})),className:n,"data-ocid":"legaldocs.rental.landlordName"})}),e.jsx(s,{label:"Tenant Full Name *",children:e.jsx("input",{required:!0,value:l.tenantName,onChange:a=>o(t=>({...t,tenantName:a.target.value})),className:n,"data-ocid":"legaldocs.rental.tenantName"})}),e.jsx(s,{label:"Landlord Address",children:e.jsx("input",{value:l.landlordAddress,onChange:a=>o(t=>({...t,landlordAddress:a.target.value})),className:n})}),e.jsx(s,{label:"Tenant Address",children:e.jsx("input",{value:l.tenantAddress,onChange:a=>o(t=>({...t,tenantAddress:a.target.value})),className:n})}),e.jsx(s,{label:"Property Address *",children:e.jsx("input",{required:!0,value:l.address,onChange:a=>o(t=>({...t,address:a.target.value})),className:n,"data-ocid":"legaldocs.rental.address"})}),e.jsx(s,{label:"Monthly Rent (₹) *",children:e.jsx("input",{required:!0,value:l.rent,onChange:a=>o(t=>({...t,rent:a.target.value})),className:n,"data-ocid":"legaldocs.rental.rent"})}),e.jsx(s,{label:"Security Deposit (₹) *",children:e.jsx("input",{required:!0,value:l.deposit,onChange:a=>o(t=>({...t,deposit:a.target.value})),className:n,"data-ocid":"legaldocs.rental.deposit"})}),e.jsx(s,{label:"Start Date *",children:e.jsx("input",{required:!0,type:"date",value:l.startDate,onChange:a=>o(t=>({...t,startDate:a.target.value})),className:n,"data-ocid":"legaldocs.rental.startDate"})}),e.jsx(s,{label:"Duration (months)",children:e.jsx("input",{value:l.duration,onChange:a=>o(t=>({...t,duration:a.target.value})),className:n})}),e.jsx(s,{label:"Witness Names",children:e.jsx("input",{value:l.witnesses,onChange:a=>o(t=>({...t,witnesses:a.target.value})),placeholder:"Full names of 2 witnesses",className:n})}),e.jsx("div",{className:"sm:col-span-2",children:e.jsx(s,{label:"Maintenance Clause",children:e.jsx("textarea",{value:l.maintenanceClause,onChange:a=>o(t=>({...t,maintenanceClause:a.target.value})),rows:2,className:`${n} resize-none`})})})]})]}),r==="sale"&&e.jsxs("div",{className:"bg-card border border-border rounded-xl p-6 mb-6",children:[e.jsx("h3",{className:"font-serif font-semibold text-lg mb-5 text-foreground",children:"Sale Agreement Details"}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(s,{label:"Seller Full Name *",children:e.jsx("input",{required:!0,value:i.sellerName,onChange:a=>c(t=>({...t,sellerName:a.target.value})),className:n,"data-ocid":"legaldocs.sale.sellerName"})}),e.jsx(s,{label:"Seller PAN",children:e.jsx("input",{value:i.sellerPan,onChange:a=>c(t=>({...t,sellerPan:a.target.value})),className:n})}),e.jsx(s,{label:"Buyer Full Name *",children:e.jsx("input",{required:!0,value:i.buyerName,onChange:a=>c(t=>({...t,buyerName:a.target.value})),className:n,"data-ocid":"legaldocs.sale.buyerName"})}),e.jsx(s,{label:"Buyer PAN",children:e.jsx("input",{value:i.buyerPan,onChange:a=>c(t=>({...t,buyerPan:a.target.value})),className:n})}),e.jsx("div",{className:"sm:col-span-2",children:e.jsx(s,{label:"Property Address *",children:e.jsx("input",{required:!0,value:i.address,onChange:a=>c(t=>({...t,address:a.target.value})),className:n,"data-ocid":"legaldocs.sale.address"})})}),e.jsx(s,{label:"Survey / Plot No.",children:e.jsx("input",{value:i.surveyNo,onChange:a=>c(t=>({...t,surveyNo:a.target.value})),className:n})}),e.jsx(s,{label:"Sale Price (₹) *",children:e.jsx("input",{required:!0,value:i.price,onChange:a=>c(t=>({...t,price:a.target.value})),className:n,"data-ocid":"legaldocs.sale.price"})}),e.jsx(s,{label:"Advance / Earnest Money (₹)",children:e.jsx("input",{value:i.advancePaid,onChange:a=>c(t=>({...t,advancePaid:a.target.value})),className:n})}),e.jsx(s,{label:"Agreement Date *",children:e.jsx("input",{required:!0,type:"date",value:i.saleDate,onChange:a=>c(t=>({...t,saleDate:a.target.value})),className:n,"data-ocid":"legaldocs.sale.saleDate"})}),e.jsx(s,{label:"Sub-Registrar Office",children:e.jsx("input",{value:i.registrar,onChange:a=>c(t=>({...t,registrar:a.target.value})),className:n})})]})]}),r==="rera-complaint"&&e.jsxs("div",{className:"bg-card border border-border rounded-xl p-6 mb-6",children:[e.jsx("h3",{className:"font-serif font-semibold text-lg mb-5 text-foreground",children:"RERA Complaint Details"}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(s,{label:"Your Full Name *",children:e.jsx("input",{required:!0,value:d.complainantName,onChange:a=>u(t=>({...t,complainantName:a.target.value})),className:n,"data-ocid":"legaldocs.rera.complainantName"})}),e.jsx(s,{label:"Your Phone *",children:e.jsx("input",{required:!0,value:d.complainantPhone,onChange:a=>u(t=>({...t,complainantPhone:a.target.value})),className:n})}),e.jsx(s,{label:"Your Email",children:e.jsx("input",{type:"email",value:d.complainantEmail,onChange:a=>u(t=>({...t,complainantEmail:a.target.value})),className:n})}),e.jsx(s,{label:"Developer / Promoter Name *",children:e.jsx("input",{required:!0,value:d.developerName,onChange:a=>u(t=>({...t,developerName:a.target.value})),className:n,"data-ocid":"legaldocs.rera.developerName"})}),e.jsx(s,{label:"Project Name *",children:e.jsx("input",{required:!0,value:d.projectName,onChange:a=>u(t=>({...t,projectName:a.target.value})),className:n})}),e.jsx(s,{label:"GujRERA Registration No.",children:e.jsx("input",{value:d.reraNumber,onChange:a=>u(t=>({...t,reraNumber:a.target.value})),className:n})}),e.jsx(s,{label:"Booking Date",children:e.jsx("input",{type:"date",value:d.bookingDate,onChange:a=>u(t=>({...t,bookingDate:a.target.value})),className:n})}),e.jsx(s,{label:"Type of Issue *",children:e.jsxs("select",{required:!0,value:d.issueType,onChange:a=>u(t=>({...t,issueType:a.target.value})),className:n,"data-ocid":"legaldocs.rera.issueType",children:[e.jsx("option",{value:"",children:"Select issue type"}),e.jsx("option",{children:"Delayed possession"}),e.jsx("option",{children:"Structural defects"}),e.jsx("option",{children:"Misrepresentation of project"}),e.jsx("option",{children:"Refund not given"}),e.jsx("option",{children:"Change in project without consent"}),e.jsx("option",{children:"Other"})]})}),e.jsx("div",{className:"sm:col-span-2",children:e.jsx(s,{label:"Description of Grievance *",children:e.jsx("textarea",{required:!0,value:d.issueDescription,onChange:a=>u(t=>({...t,issueDescription:a.target.value})),rows:3,className:`${n} resize-none`,"data-ocid":"legaldocs.rera.issueDescription"})})}),e.jsx("div",{className:"sm:col-span-2",children:e.jsx(s,{label:"Relief Sought *",children:e.jsx("textarea",{required:!0,value:d.reliefSought,onChange:a=>u(t=>({...t,reliefSought:a.target.value})),rows:2,className:`${n} resize-none`})})})]})]}),r==="noc"&&e.jsxs("div",{className:"bg-card border border-border rounded-xl p-6 mb-6",children:[e.jsx("h3",{className:"font-serif font-semibold text-lg mb-5 text-foreground",children:"NOC Letter Details"}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(s,{label:"Issuer Name *",children:e.jsx("input",{required:!0,value:m.issuerName,onChange:a=>g(t=>({...t,issuerName:a.target.value})),className:n,"data-ocid":"legaldocs.noc.issuerName"})}),e.jsx(s,{label:"Issuer Address *",children:e.jsx("input",{required:!0,value:m.issuerAddress,onChange:a=>g(t=>({...t,issuerAddress:a.target.value})),className:n})}),e.jsx(s,{label:"Recipient Name *",children:e.jsx("input",{required:!0,value:m.recipientName,onChange:a=>g(t=>({...t,recipientName:a.target.value})),className:n})}),e.jsx(s,{label:"Purpose *",children:e.jsx("input",{required:!0,value:m.purpose,onChange:a=>g(t=>({...t,purpose:a.target.value})),placeholder:"e.g. Sale / Loan / Construction",className:n,"data-ocid":"legaldocs.noc.purpose"})}),e.jsx(s,{label:"Property Address",children:e.jsx("input",{value:m.propertyAddress,onChange:a=>g(t=>({...t,propertyAddress:a.target.value})),className:n})}),e.jsx(s,{label:"Date *",children:e.jsx("input",{required:!0,type:"date",value:m.date,onChange:a=>g(t=>({...t,date:a.target.value})),className:n})}),e.jsx("div",{className:"sm:col-span-2",children:e.jsx(s,{label:"Conditions (if any)",children:e.jsx("textarea",{value:m.conditions,onChange:a=>g(t=>({...t,conditions:a.target.value})),rows:2,className:`${n} resize-none`})})})]})]}),r==="affidavit"&&e.jsxs("div",{className:"bg-card border border-border rounded-xl p-6 mb-6",children:[e.jsx("h3",{className:"font-serif font-semibold text-lg mb-5 text-foreground",children:"Affidavit Details"}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-2",children:[e.jsx(s,{label:"Deponent Full Name *",children:e.jsx("input",{required:!0,value:h.deponentName,onChange:a=>x(t=>({...t,deponentName:a.target.value})),className:n,"data-ocid":"legaldocs.affidavit.deponentName"})}),e.jsx(s,{label:"Aadhaar / ID Number",children:e.jsx("input",{value:h.aadhaar,onChange:a=>x(t=>({...t,aadhaar:a.target.value})),className:n})}),e.jsx("div",{className:"sm:col-span-2",children:e.jsx(s,{label:"Deponent Address *",children:e.jsx("input",{required:!0,value:h.deponentAddress,onChange:a=>x(t=>({...t,deponentAddress:a.target.value})),className:n})})}),e.jsx(s,{label:"Subject of Affidavit *",children:e.jsx("input",{required:!0,value:h.subject,onChange:a=>x(t=>({...t,subject:a.target.value})),className:n,"data-ocid":"legaldocs.affidavit.subject"})}),e.jsx(s,{label:"Date *",children:e.jsx("input",{required:!0,type:"date",value:h.date,onChange:a=>x(t=>({...t,date:a.target.value})),className:n})}),e.jsx(s,{label:"Place",children:e.jsx("input",{value:h.place,onChange:a=>x(t=>({...t,place:a.target.value})),placeholder:"Ahmedabad",className:n})}),e.jsx("div",{className:"sm:col-span-2",children:e.jsx(s,{label:"Statement / Declaration *",children:e.jsx("textarea",{required:!0,value:h.statement,onChange:a=>x(t=>({...t,statement:a.target.value})),rows:4,className:`${n} resize-none`,placeholder:"I solemnly declare that...","data-ocid":"legaldocs.affidavit.statement"})})})]})]}),r&&e.jsxs(e.Fragment,{children:[e.jsxs("label",{className:"flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-muted/20 border border-border mb-5",children:[e.jsx("input",{type:"checkbox",checked:_,onChange:a=>j(a.target.checked),className:"mt-0.5 accent-primary","data-ocid":"legaldocs.indemnity_checkbox"}),e.jsxs("span",{className:"text-sm text-muted-foreground leading-relaxed",children:["I understand that this is a"," ",e.jsx("strong",{children:"draft template for reference only"}),". I will consult a qualified lawyer before signing or using this document for any legal purpose. MSTC GLOBAL shall not be held liable for any legal or financial consequences arising from the use of this template.",e.jsx("span",{className:"text-red-400 ml-1",children:"*Required"})]})]}),e.jsx("button",{type:"button",disabled:!_,onClick:y,className:"px-6 py-3 rounded-lg font-semibold text-sm mb-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5",style:{background:"oklch(0.72 0.18 76)",color:"oklch(0.1 0.01 60)"},"data-ocid":"legaldocs.generate_button",children:"Generate Document"})]}),f&&e.jsxs("div",{className:"bg-card border border-border rounded-xl p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(v,{size:16,className:"text-primary"}),e.jsx("h3",{className:"font-semibold text-foreground",children:"Generated Draft Document"})]}),e.jsxs("button",{type:"button",onClick:()=>window.print(),className:"flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:border-primary/60",style:{borderColor:"oklch(0.72 0.18 76 / 0.4)",color:"oklch(0.72 0.18 76)"},"data-ocid":"legaldocs.print_button",children:[e.jsx(L,{size:13})," Print / Save PDF"]})]}),e.jsx("pre",{className:"font-mono text-xs text-foreground bg-muted/20 rounded-lg p-5 whitespace-pre-wrap leading-relaxed overflow-x-auto",style:{maxHeight:500},children:f}),e.jsxs("div",{className:"mt-4 p-3 rounded-lg text-xs text-muted-foreground",style:{background:"oklch(0.72 0.18 76 / 0.06)",border:"1px solid oklch(0.72 0.18 76 / 0.2)"},children:["⚠️ ",e.jsx("strong",{children:"Important:"})," This is a draft template for reference only. Please consult a qualified advocate or legal advisor before executing any legal document. MSTC GLOBAL is not responsible for any legal outcomes arising from the use of this template."]})]})]}),e.jsx(D,{}),e.jsx($,{})]})})}export{J as default};
