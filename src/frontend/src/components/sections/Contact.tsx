import { CustomerSupportForm } from "@/components/forms/CustomerSupportForm";
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";

const contactItems = [
  {
    icon: Phone,
    label: "Mobile / WhatsApp",
    value: "+91 9512609016",
    href: "tel:+919512609016",
    sub: "Mobile & WhatsApp",
  },
  {
    icon: Phone,
    label: "Office Landline",
    value: "+91 079-2663 8800",
    href: "tel:+917926638800",
    sub: "Office Line",
  },
  {
    icon: Mail,
    label: "Email",
    value: "mstc.gbl@gmail.com",
    href: "mailto:mstc.gbl@gmail.com",
    sub: "Official Email",
  },
  {
    icon: Globe,
    label: "Website",
    value: "mstcglobal-kh8.caffeine.xyz",
    href: "https://mstcglobal-kh8.caffeine.xyz",
    sub: "Official Website",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Ahmedabad, Gujarat, India",
    href: "https://maps.app.goo.gl/P6Wov2DvcsU87joDA",
    sub: "Head Office",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-obsidian-800 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="font-sans text-xs tracking-[0.4em] text-gold-400 uppercase">
            Get In Touch
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gold-300 mt-2 mb-4">
            Contact Us
          </h2>
          <div className="section-divider w-32 mx-auto mb-6" />
          <p className="font-sans text-obsidian-100 max-w-xl mx-auto text-sm md:text-base">
            Reach out to{" "}
            <span className="text-gold-400 font-medium">
              Love Vijaybhai Parekh (MD)
            </span>{" "}
            and the MSTC GLOBAL team for partnerships, inquiries, and
            opportunities.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {contactItems.map(({ icon: Icon, label, value, href, sub }) => (
            <a
              key={label}
              href={href}
              className="group flex items-start gap-4 p-5 border border-gold-700/40 rounded-sm bg-obsidian-700/50 hover:border-gold-500/60 hover:bg-obsidian-700/70 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-sm bg-gold-600/20 border border-gold-600/40 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-600/30 transition-all duration-300 mt-0.5">
                <Icon
                  size={18}
                  className="text-gold-400 group-hover:text-gold-300 transition-colors"
                />
              </div>
              <div>
                <div className="font-sans text-xs text-gold-500 tracking-widest uppercase mb-0.5">
                  {label}
                </div>
                <div className="font-sans text-sm text-gold-100 font-medium group-hover:text-white transition-colors">
                  {value}
                </div>
                <div className="font-sans text-xs text-obsidian-200 mt-0.5">
                  {sub}
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 p-5 border border-gold-700/30 rounded-sm bg-obsidian-700/40">
            <Clock size={20} className="text-gold-400 flex-shrink-0" />
            <div>
              <div className="font-sans text-xs text-gold-500 tracking-widest uppercase mb-1">
                Business Hours
              </div>
              <div className="font-sans text-sm text-obsidian-100">
                Monday – Saturday:{" "}
                <span className="text-gold-400 font-medium">
                  9:00 AM – 7:00 PM IST
                </span>
                <span className="mx-3 text-gold-700">|</span>
                Sunday:{" "}
                <span className="text-gold-400 font-medium">
                  By Appointment
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Office Location Map */}
        <div className="mt-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-gold-400" />
            <h3 className="font-serif text-xl text-gold-300">
              Our Office Location
            </h3>
          </div>
          <div
            className="rounded-xl border overflow-hidden h-64 md:h-80"
            style={{ borderColor: "rgba(201,168,76,0.30)" }}
          >
            <iframe
              src="https://maps.google.com/maps?q=23.0013511,72.5630849&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MSTC GLOBAL — 5, ShwetShikhar Society, Shantivan, Ahmedabad"
            />
          </div>
          {/* Address label + Get Directions */}
          <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-sans text-xs text-gold-400 flex items-center gap-1.5">
              <MapPin size={12} className="shrink-0" />
              MSTC GLOBAL — 5, ShwetShikhar Society, Shantivan, Ahmedabad,
              Gujarat
            </p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=23.0013511,72.5630849"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border font-sans text-xs font-semibold tracking-wide uppercase transition-all duration-200 hover:brightness-110"
              style={{
                borderColor: "rgba(201,168,76,0.6)",
                color: "#c9a84c",
                background: "rgba(201,168,76,0.08)",
              }}
              data-ocid="contact.get_directions_button"
            >
              <MapPin size={12} />
              Get Directions
            </a>
          </div>
          {/* Contact details below map */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="tel:+919512609016"
              className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:brightness-110"
              style={{
                borderColor: "rgba(201,168,76,0.25)",
                background: "rgba(201,168,76,0.05)",
              }}
              data-ocid="contact.phone1_link"
            >
              <Phone size={14} className="text-gold-400 shrink-0" />
              <div>
                <div className="font-sans text-xs text-gold-500 tracking-widest uppercase">
                  Mobile
                </div>
                <div className="font-sans text-sm text-gold-100 font-medium">
                  +91 9512609016
                </div>
              </div>
            </a>
            <a
              href="tel:+917926638800"
              className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:brightness-110"
              style={{
                borderColor: "rgba(201,168,76,0.25)",
                background: "rgba(201,168,76,0.05)",
              }}
              data-ocid="contact.phone2_link"
            >
              <Phone size={14} className="text-gold-400 shrink-0" />
              <div>
                <div className="font-sans text-xs text-gold-500 tracking-widest uppercase">
                  Office
                </div>
                <div className="font-sans text-sm text-gold-100 font-medium">
                  +91 079-26638800
                </div>
              </div>
            </a>
            <a
              href="mailto:mstc.gbl@gmail.com"
              className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:brightness-110"
              style={{
                borderColor: "rgba(201,168,76,0.25)",
                background: "rgba(201,168,76,0.05)",
              }}
              data-ocid="contact.email_link"
            >
              <Mail size={14} className="text-gold-400 shrink-0" />
              <div>
                <div className="font-sans text-xs text-gold-500 tracking-widest uppercase">
                  Email
                </div>
                <div className="font-sans text-sm text-gold-100 font-medium">
                  mstc.gbl@gmail.com
                </div>
              </div>
            </a>
          </div>
        </div>
        <div
          className="mt-14 max-w-5xl mx-auto"
          data-ocid="contact.support_form"
        >
          <CustomerSupportForm />
        </div>
      </div>
    </section>
  );
}
