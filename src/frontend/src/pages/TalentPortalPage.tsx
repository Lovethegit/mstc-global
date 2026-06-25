import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Filter,
  MapPin,
  Mic,
  Music,
  Search,
  Star,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type TalentCategory = "Music" | "Sports" | "Cultural" | "Media";
type Availability = "Available" | "Booked";

interface TalentProfile {
  id: string;
  name: string;
  category: TalentCategory;
  subType: string;
  genre?: string;
  location: string;
  bio: string;
  specialities: string[];
  availability: Availability;
  experience: string;
  eventTypes: string[];
}

const TALENT_PROFILES: TalentProfile[] = [
  // --- MUSIC ARTISTS ---
  {
    id: "m1",
    name: "Maestro Rajan Shah",
    category: "Music",
    subType: "Classical Vocalist",
    genre: "Hindustani Classical",
    location: "Ahmedabad",
    bio: "A revered Hindustani classical vocalist with over 20 years of stage experience, performing at prestigious sabhas, cultural centres, and heritage events across India.",
    specialities: ["Raag Bhairav", "Thumri", "Bhajan", "Khayal"],
    availability: "Available",
    experience: "20+ years",
    eventTypes: [
      "Cultural Events",
      "Sabhas",
      "Heritage Festivals",
      "Corporate Galas",
    ],
  },
  {
    id: "m2",
    name: "DJ Nirav Patel",
    category: "Music",
    subType: "DJ / Electronic",
    genre: "EDM & Bollywood Remixes",
    location: "Ahmedabad",
    bio: "Ahmedabad's premier DJ specialising in high-energy EDM, commercial Bollywood, and seamless curated sets for corporate events, weddings, and premium clubs.",
    specialities: ["EDM", "Bollywood Remixes", "Deep House", "Commercial Sets"],
    availability: "Available",
    experience: "8+ years",
    eventTypes: ["Corporate Events", "Weddings", "Clubs", "Private Parties"],
  },
  {
    id: "m3",
    name: "Kaavya Joshi",
    category: "Music",
    subType: "Vocalist",
    genre: "Ghazal & Thumri",
    location: "Vadodara / Gujarat",
    bio: "Trained under leading Ghazal maestros, Kaavya brings depth, emotion, and finesse to intimate concerts, sabhas, and cultural evenings. Her Thumri performances are sought-after across Gujarat.",
    specialities: ["Ghazal", "Thumri", "Dadra", "Semi-classical"],
    availability: "Available",
    experience: "12+ years",
    eventTypes: [
      "Sabha Performances",
      "Intimate Concerts",
      "Cultural Evenings",
    ],
  },
  {
    id: "m4",
    name: "The Garba Squad",
    category: "Music",
    subType: "Folk & Garba Band",
    genre: "Traditional Gujarati Folk",
    location: "Ahmedabad",
    bio: "A vibrant 8-member folk ensemble renowned for authentic Gujarati Garba, Dandiya, and folk music. The heartbeat of Navratri celebrations and regional cultural festivals.",
    specialities: ["Garba", "Dandiya Raas", "Lok Geet", "Navratri Specials"],
    availability: "Available",
    experience: "10+ years",
    eventTypes: [
      "Navratri Events",
      "Cultural Festivals",
      "Weddings",
      "Community Gatherings",
    ],
  },
  {
    id: "m5",
    name: "Rahul Strings",
    category: "Music",
    subType: "Instrumental (Guitar)",
    genre: "Jazz & Bollywood Instrumental",
    location: "Ahmedabad",
    bio: "Classically trained guitarist weaving jazz sensibilities with Bollywood melodies. Creates elegant ambient atmospheres for restaurants, corporate dinners, and private events.",
    specialities: [
      "Jazz Guitar",
      "Bollywood Instrumental",
      "Lounge Music",
      "Classical Guitar",
    ],
    availability: "Available",
    experience: "7+ years",
    eventTypes: [
      "Restaurants",
      "Corporate Dinners",
      "Private Events",
      "Product Launches",
    ],
  },
  {
    id: "m6",
    name: "Aarohi Classical Dance",
    category: "Music",
    subType: "Classical Dance",
    genre: "Bharatanatyam & Kathak",
    location: "Ahmedabad",
    bio: "An acclaimed classical dance academy presenting Bharatanatyam and Kathak performances of the highest artistic calibre. Perfect for cultural programs, competitions, and prestigious galas.",
    specialities: ["Bharatanatyam", "Kathak", "Odissi", "Fusion Classical"],
    availability: "Available",
    experience: "15+ years",
    eventTypes: ["Cultural Programs", "Competitions", "Galas", "School Events"],
  },
  {
    id: "m7",
    name: "Fusion Beats",
    category: "Music",
    subType: "Fusion Band",
    genre: "World Music Fusion",
    location: "Mumbai / Gujarat Touring",
    bio: "A 5-member world music fusion band blending Indian classical ragas with contemporary jazz, electronic, and folk elements. Touring performers with corporate and cultural show experience.",
    specialities: [
      "World Fusion",
      "Indo-Jazz",
      "Electronic Fusion",
      "Live Looping",
    ],
    availability: "Available",
    experience: "9+ years",
    eventTypes: [
      "Corporate Events",
      "Cultural Shows",
      "Music Festivals",
      "International Events",
    ],
  },
  {
    id: "m8",
    name: "Meera Folk Ensemble",
    category: "Music",
    subType: "Folk Music Group",
    genre: "Rajasthani & Gujarati Folk",
    location: "Gujarat",
    bio: "Authentic folk musicians presenting the rich cultural tapestry of Rajasthani and Gujarati folk traditions. Ideal for cultural festivals, rural events, and heritage tourism experiences.",
    specialities: ["Rajasthani Folk", "Lok Geet", "Morchang", "Khartal"],
    availability: "Available",
    experience: "18+ years",
    eventTypes: [
      "Cultural Festivals",
      "Heritage Events",
      "Rural Programs",
      "Tourism Events",
    ],
  },
  {
    id: "m9",
    name: "Swar Samrat Orchestra",
    category: "Music",
    subType: "Orchestra",
    genre: "Bollywood & Classical Orchestral",
    location: "Ahmedabad",
    bio: "A 15-member full orchestra delivering grand Bollywood and classical orchestral experiences for film events, award ceremonies, and prestigious gala dinners across India.",
    specialities: [
      "Bollywood Orchestral",
      "Film Music",
      "Classical Symphony",
      "Live Concert",
    ],
    availability: "Available",
    experience: "12+ years",
    eventTypes: [
      "Film Events",
      "Gala Dinners",
      "Award Ceremonies",
      "Cultural Galas",
    ],
  },
  {
    id: "m10",
    name: "Yuvaan Pop Band",
    category: "Music",
    subType: "Pop / Indie Band",
    genre: "Original Compositions & Covers",
    location: "Ahmedabad",
    bio: "A fresh indie-pop outfit crafting original Gujarati and Hindi compositions alongside curated covers. High-energy performers popular at college fests, youth events, and music competitions.",
    specialities: [
      "Original Songs",
      "Indie Pop",
      "Gujarati Pop",
      "Rock Covers",
    ],
    availability: "Available",
    experience: "5+ years",
    eventTypes: [
      "Youth Events",
      "College Fests",
      "Music Competitions",
      "Brand Launches",
    ],
  },
  // --- ATHLETES / SPORTS ---
  {
    id: "s1",
    name: "Arjun Mehta",
    category: "Sports",
    subType: "Cricketer",
    genre: undefined,
    location: "Ahmedabad",
    bio: "State-level cricketer and qualified cricket coach offering personalised coaching sessions, brand endorsements, and appearances at corporate and community sports events.",
    specialities: [
      "Cricket Coaching",
      "Brand Endorsement",
      "Youth Camps",
      "Corporate Cricket",
    ],
    availability: "Available",
    experience: "State-level, 10+ years",
    eventTypes: [
      "Coaching",
      "Brand Ambassadorship",
      "Corporate Events",
      "Sports Camps",
    ],
  },
  {
    id: "s2",
    name: "Priya Desai",
    category: "Sports",
    subType: "Badminton Player",
    location: "Ahmedabad",
    bio: "National Junior Badminton Champion with a proven coaching track record. Available for coaching academies, brand ambassador roles, and school/corporate sports events.",
    specialities: [
      "Badminton Coaching",
      "Youth Training",
      "Brand Ambassadorship",
    ],
    availability: "Available",
    experience: "National Junior Champion",
    eventTypes: [
      "Coaching",
      "Brand Ambassador",
      "Sports Events",
      "School Programs",
    ],
  },
  {
    id: "s3",
    name: "Karan Shah",
    category: "Sports",
    subType: "Marathon Runner",
    location: "Ahmedabad",
    bio: "Elite sub-3hr marathoner and motivational speaker empowering corporate teams through wellness runs, fitness programs, and inspiring talks on resilience and peak performance.",
    specialities: [
      "Marathon Running",
      "Corporate Wellness",
      "Motivational Speaking",
      "Fitness Training",
    ],
    availability: "Available",
    experience: "Sub-3hr marathoner",
    eventTypes: [
      "Corporate Wellness Runs",
      "Motivational Talks",
      "Fitness Events",
      "Charity Runs",
    ],
  },
  {
    id: "s4",
    name: "Rishi Patel",
    category: "Sports",
    subType: "Boxer",
    location: "Ahmedabad",
    bio: "State Boxing Champion offering professional coaching, sports camps, and motivational appearances. A compelling speaker on discipline, focus, and competitive mindset.",
    specialities: ["Boxing Coaching", "Sports Camps", "Motivational Talks"],
    availability: "Available",
    experience: "State Champion",
    eventTypes: [
      "Coaching",
      "Sports Camps",
      "Corporate Events",
      "School Programs",
    ],
  },
  {
    id: "s5",
    name: "Nisha Jain",
    category: "Sports",
    subType: "Yoga & Wellness Trainer",
    location: "Ahmedabad",
    bio: "Internationally certified Yoga trainer delivering transformative sessions for corporate wellness programmes, luxury retreats, and large-scale wellness events across India.",
    specialities: [
      "Hatha Yoga",
      "Corporate Wellness",
      "Meditation",
      "Pranayama",
    ],
    availability: "Available",
    experience: "International Certification",
    eventTypes: [
      "Corporate Wellness",
      "Retreats",
      "Wellness Events",
      "Conferences",
    ],
  },
  {
    id: "s6",
    name: "Dhruv Verma",
    category: "Sports",
    subType: "Chess Player",
    location: "Ahmedabad",
    bio: "FIDE-rated chess player and educator conducting workshops for schools, corporates, and chess clubs. Brings analytical rigour and strategic thinking to every engagement.",
    specialities: [
      "Chess Workshops",
      "School Programs",
      "Tournament Organisation",
      "Chess Coaching",
    ],
    availability: "Available",
    experience: "FIDE Rated",
    eventTypes: [
      "Chess Workshops",
      "School Programs",
      "Tournaments",
      "Corporate Teambuilding",
    ],
  },
  {
    id: "s7",
    name: "Team Falcons FC",
    category: "Sports",
    subType: "Football Team",
    location: "Ahmedabad",
    bio: "Ahmedabad's competitive city football club available for friendly matches, corporate sports days, and community football tournaments. Full squad of 20 players.",
    specialities: [
      "Football",
      "Friendly Matches",
      "Corporate Sports",
      "Youth Training",
    ],
    availability: "Available",
    experience: "City Football Club",
    eventTypes: [
      "Corporate Sports Days",
      "Friendly Matches",
      "Tournaments",
      "Community Events",
    ],
  },
  {
    id: "s8",
    name: "Ahmedabad Runners Club",
    category: "Sports",
    subType: "Running Community",
    location: "Ahmedabad",
    bio: "A thriving 500+ member running community organising corporate wellness runs, charity marathons, and city-wide running events to promote fitness culture across Ahmedabad.",
    specialities: [
      "Corporate Wellness",
      "Charity Runs",
      "Marathon Events",
      "Community Building",
    ],
    availability: "Available",
    experience: "500+ Members",
    eventTypes: [
      "Corporate Wellness Runs",
      "Charity Marathons",
      "City Events",
      "Running Workshops",
    ],
  },
  // --- CULTURAL ACTS ---
  {
    id: "c1",
    name: "Bharati Puppet Theatre",
    category: "Cultural",
    subType: "Puppet Show",
    location: "Ahmedabad",
    bio: "Masters of traditional Rajasthani Kathputli puppetry presenting vivid storytelling performances for children's events, cultural festivals, and heritage exhibitions across Gujarat.",
    specialities: [
      "Kathputli Puppetry",
      "Shadow Puppets",
      "Interactive Shows",
      "Heritage Storytelling",
    ],
    availability: "Available",
    experience: "20+ years",
    eventTypes: [
      "Children Events",
      "Cultural Festivals",
      "Heritage Exhibitions",
      "School Programs",
    ],
  },
  {
    id: "c2",
    name: "Rangmanch Drama Group",
    category: "Cultural",
    subType: "Theatre / Drama",
    location: "Ahmedabad",
    bio: "An established theatre collective performing original plays in Gujarati and Hindi. Known for thought-provoking narratives, strong stage design, and outstanding ensemble performances.",
    specialities: [
      "Gujarati Drama",
      "Hindi Theatre",
      "Street Plays",
      "Original Scripts",
    ],
    availability: "Available",
    experience: "15+ years",
    eventTypes: [
      "Cultural Events",
      "Schools",
      "Community Programs",
      "Theatre Festivals",
    ],
  },
  {
    id: "c3",
    name: "Natraj Dance Academy",
    category: "Cultural",
    subType: "Dance Group",
    location: "Ahmedabad",
    bio: "A troupe of 20 trained performers presenting breathtaking classical and folk fusion dance spectacles. Ideal for cultural galas, corporate events, and prestigious award ceremonies.",
    specialities: [
      "Classical Fusion",
      "Folk Dance",
      "Contemporary",
      "Garba Fusion",
    ],
    availability: "Available",
    experience: "12+ years",
    eventTypes: [
      "Cultural Galas",
      "Corporate Events",
      "Award Ceremonies",
      "Festivals",
    ],
  },
  {
    id: "c4",
    name: "Kalakriti Art Live",
    category: "Cultural",
    subType: "Live Art Performance",
    location: "Ahmedabad",
    bio: "A unique live painting performance artist creating large-scale works in real time during events. Transforms corporate launches, exhibitions, and cultural evenings into unforgettable visual experiences.",
    specialities: [
      "Live Painting",
      "Portrait Art",
      "Abstract Art",
      "Brand Art Installations",
    ],
    availability: "Available",
    experience: "8+ years",
    eventTypes: [
      "Corporate Events",
      "Exhibitions",
      "Product Launches",
      "Art Festivals",
    ],
  },
  {
    id: "c5",
    name: "Sarvesh Comedy",
    category: "Cultural",
    subType: "Stand-up Comedy",
    location: "Ahmedabad & Gujarat",
    bio: "A highly rated corporate stand-up comedian performing in Hindi and Gujarati. Brings intelligent, inclusive humour to corporate events, team offsites, and private gatherings.",
    specialities: [
      "Corporate Comedy",
      "Hindi Stand-up",
      "Gujarati Comedy",
      "Emcee",
    ],
    availability: "Available",
    experience: "6+ years",
    eventTypes: [
      "Corporate Events",
      "Team Offsites",
      "Award Nights",
      "Private Parties",
    ],
  },
  {
    id: "c6",
    name: "Gujarat Heritage Dancers",
    category: "Cultural",
    subType: "Folk Dance Troupe",
    location: "Ahmedabad",
    bio: "A celebrated folk dance troupe specialising in authentic Garba, Dandiya Raas, and Ghoomar performances. A favourite at cultural festivals, tourism events, and national showcases.",
    specialities: ["Garba", "Dandiya Raas", "Ghoomar", "Tribal Folk Dance"],
    availability: "Available",
    experience: "14+ years",
    eventTypes: [
      "Cultural Festivals",
      "Tourism Events",
      "National Shows",
      "Navratri Celebrations",
    ],
  },
  {
    id: "c7",
    name: "Akash Magic Show",
    category: "Cultural",
    subType: "Magic & Illusion",
    location: "Ahmedabad",
    bio: "A professional magician and illusionist delivering captivating family-friendly and corporate magic shows. Stage illusions, mentalism, and close-up magic tailored to every audience.",
    specialities: [
      "Stage Illusion",
      "Mentalism",
      "Close-up Magic",
      "Family Shows",
    ],
    availability: "Available",
    experience: "10+ years",
    eventTypes: [
      "Family Events",
      "Corporate Events",
      "Birthday Shows",
      "Cultural Programs",
    ],
  },
  // --- MEDIA / CELEBRITY ---
  {
    id: "md1",
    name: "Mohit Trivedi",
    category: "Media",
    subType: "Anchor / Emcee",
    location: "Ahmedabad",
    bio: "A polished bilingual anchor and emcee with extensive TV and live event experience in Hindi and Gujarati. Adds professionalism and energy to corporate events, weddings, and television productions.",
    specialities: [
      "Corporate Anchoring",
      "Wedding Emcee",
      "TV Hosting",
      "Bilingual",
    ],
    availability: "Available",
    experience: "10+ years",
    eventTypes: [
      "Corporate Events",
      "Weddings",
      "TV Shows",
      "Award Ceremonies",
    ],
  },
  {
    id: "md2",
    name: "Divya Kapoor",
    category: "Media",
    subType: "Actor / Model",
    location: "Mumbai / Ahmedabad",
    bio: "A versatile film and commercial actor based between Mumbai and Ahmedabad. Available for brand campaigns, event appearances, print campaigns, and film productions.",
    specialities: [
      "Brand Campaigns",
      "Film Roles",
      "Print Modelling",
      "Event Appearances",
    ],
    availability: "Available",
    experience: "7+ years",
    eventTypes: [
      "Brand Campaigns",
      "Film Productions",
      "Events",
      "Commercial Shoots",
    ],
  },
  {
    id: "md3",
    name: "Vrajesh Photography",
    category: "Media",
    subType: "Event Photographer",
    location: "Ahmedabad",
    bio: "A highly sought-after professional photographer specialising in event, wedding, and corporate photography. Deliverables include premium edited galleries and print-ready files.",
    specialities: [
      "Event Photography",
      "Wedding Photography",
      "Corporate Photography",
      "Product Shoots",
    ],
    availability: "Available",
    experience: "12+ years",
    eventTypes: ["Events", "Weddings", "Corporate", "Commercial Shoots"],
  },
  {
    id: "md4",
    name: "ScreenCraft Films",
    category: "Media",
    subType: "Videography / Production",
    location: "Ahmedabad",
    bio: "A full-service corporate video production house delivering brand films, documentary shorts, and event coverage. State-of-the-art equipment and experienced crew for every project.",
    specialities: [
      "Corporate Films",
      "Brand Videos",
      "Documentaries",
      "Event Coverage",
    ],
    availability: "Available",
    experience: "10+ years",
    eventTypes: [
      "Corporate Shoots",
      "Brand Films",
      "Documentaries",
      "Event Coverage",
    ],
  },
  {
    id: "md5",
    name: "Priya Voice",
    category: "Media",
    subType: "Voice Artist",
    location: "Ahmedabad",
    bio: "A versatile professional voice artist with a warm, authoritative vocal range in Hindi and Gujarati. Experienced in commercial advertisements, documentary narration, and e-learning productions.",
    specialities: [
      "Hindi Voice-over",
      "Gujarati Voice-over",
      "Advertisement Narration",
      "Documentary Narration",
    ],
    availability: "Available",
    experience: "8+ years",
    eventTypes: ["Ads", "Documentaries", "E-learning", "Corporate AV"],
  },
];

const CATEGORIES: TalentCategory[] = ["Music", "Sports", "Cultural", "Media"];
const LOCATIONS = ["All Locations", "Ahmedabad", "Gujarat", "Pan India"];
const AVAILABILITIES: Availability[] = ["Available", "Booked"];

const CATEGORY_ICONS: Record<TalentCategory, React.ReactNode> = {
  Music: <Music size={14} />,
  Sports: <Trophy size={14} />,
  Cultural: <Star size={14} />,
  Media: <Mic size={14} />,
};

const CATEGORY_COLORS: Record<TalentCategory, string> = {
  Music: "bg-gold-700/25 text-gold-300 border-gold-700/40",
  Sports: "bg-blue-900/30 text-blue-300 border-blue-700/40",
  Cultural: "bg-purple-900/30 text-purple-300 border-purple-700/40",
  Media: "bg-emerald-900/30 text-emerald-300 border-emerald-700/40",
};

interface BookingForm {
  eventType: string;
  date: string;
  location: string;
  budget: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  agreed: boolean;
}

interface TalentCardProps {
  talent: TalentProfile;
  onBook: (talent: TalentProfile) => void;
}

function TalentCard({ talent, onBook }: TalentCardProps) {
  return (
    <div
      className="group relative flex flex-col bg-obsidian-800/60 border border-gold-800/30 rounded-xl overflow-hidden hover:border-gold-500/50 hover:shadow-gold transition-all duration-300"
      data-ocid={`talent.card.${talent.id}`}
    >
      {/* Header strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Name + availability */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif font-semibold text-base text-gold-100 leading-snug">
              {talent.name}
            </h3>
            <p className="font-sans text-xs text-gold-400 mt-0.5">
              {talent.subType}
            </p>
          </div>
          <span
            className={`shrink-0 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border ${
              talent.availability === "Available"
                ? "bg-emerald-900/30 text-emerald-400 border-emerald-700/40"
                : "bg-red-900/30 text-red-400 border-red-700/40"
            }`}
          >
            {talent.availability}
          </span>
        </div>

        {/* Category + Location */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border ${
              CATEGORY_COLORS[talent.category]
            }`}
          >
            {CATEGORY_ICONS[talent.category]}
            {talent.category}
          </span>
          {talent.genre && (
            <span className="text-[10px] font-sans text-obsidian-100 bg-obsidian-700/40 px-2 py-0.5 rounded-full">
              {talent.genre}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[10px] font-sans text-obsidian-100">
            <MapPin size={10} className="text-gold-500" />
            {talent.location}
          </span>
        </div>

        {/* Bio */}
        <p className="font-sans text-xs text-obsidian-100 leading-relaxed line-clamp-3 flex-1">
          {talent.bio}
        </p>

        {/* Specialities */}
        <div className="flex flex-wrap gap-1.5">
          {talent.specialities.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[10px] font-sans text-gold-400 bg-gold-900/20 border border-gold-800/30 px-2 py-0.5 rounded"
            >
              {s}
            </span>
          ))}
          {talent.specialities.length > 3 && (
            <span className="text-[10px] font-sans text-obsidian-200">
              +{talent.specialities.length - 3} more
            </span>
          )}
        </div>

        {/* Experience */}
        <p className="font-sans text-[11px] text-gold-500/80">
          Experience: <span className="text-gold-300">{talent.experience}</span>
        </p>

        {/* Book button */}
        <button
          type="button"
          onClick={() => onBook(talent)}
          className="mt-auto w-full py-2.5 px-4 rounded-lg bg-gold-600/20 border border-gold-600/40 text-gold-300 text-sm font-sans font-medium hover:bg-gold-600/30 hover:border-gold-400/60 transition-all duration-200 flex items-center justify-center gap-2"
          data-ocid={`talent.book_button.${talent.id}`}
        >
          <Calendar size={14} />
          Book Inquiry
        </button>
      </div>
    </div>
  );
}

const EMPTY_FORM: BookingForm = {
  eventType: "",
  date: "",
  location: "",
  budget: "",
  name: "",
  phone: "",
  email: "",
  message: "",
  agreed: false,
};

export default function TalentPortalPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<TalentCategory | "All">(
    "All",
  );
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    Availability | "All"
  >("All");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(
    null,
  );
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [applyForm, setApplyForm] = useState({
    name: "",
    type: "",
    location: "",
    phone: "",
    email: "",
    bio: "",
    agreed: false,
  });
  const [applySubmitted, setApplySubmitted] = useState(false);

  const filtered = useMemo(() => {
    return TALENT_PROFILES.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.subType.toLowerCase().includes(q) ||
        (t.genre?.toLowerCase().includes(q) ?? false) ||
        t.location.toLowerCase().includes(q) ||
        t.specialities.some((s) => s.toLowerCase().includes(q));
      const matchCat =
        categoryFilter === "All" || t.category === categoryFilter;
      const matchLoc =
        locationFilter === "All Locations" ||
        t.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchAvail =
        availabilityFilter === "All" || t.availability === availabilityFilter;
      return matchSearch && matchCat && matchLoc && matchAvail;
    });
  }, [search, categoryFilter, locationFilter, availabilityFilter]);

  const handleBook = (talent: TalentProfile) => {
    setSelectedTalent(talent);
    setForm(EMPTY_FORM);
    setSubmitted(false);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedTalent(null);
    document.body.style.overflow = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.agreed) return;
    setApplySubmitted(true);
  };

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-obsidian-900 text-gold-100">
        <Header />
        <main className="pt-20 md:pt-24">
          {/* Hero Banner */}
          <section className="relative px-4 py-12 md:py-16 bg-gradient-to-b from-obsidian-800/80 to-obsidian-900 border-b border-gold-800/30 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-gold-600/5 blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-gold-500/5 blur-3xl" />
            </div>
            <div className="relative max-w-7xl mx-auto">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-sans text-gold-400 hover:text-gold-300 transition-colors mb-6"
                data-ocid="talent.back_link"
              >
                <ArrowLeft size={14} /> Back to Home
              </Link>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-700/20 border border-gold-700/30 text-gold-400 text-xs font-sans mb-3">
                    <Users size={12} /> MSTC GLOBAL Talent Roster
                  </div>
                  <h1 className="font-serif font-bold text-3xl md:text-4xl gold-text leading-tight">
                    Talent Portal
                  </h1>
                  <p className="font-sans text-sm text-obsidian-100 mt-2 max-w-xl">
                    Discover and book world-class artists, athletes, cultural
                    performers, and media professionals — curated exclusively by
                    MSTC GLOBAL.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  {(
                    [
                      ["30+", "Talent Profiles"],
                      ["4", "Categories"],
                      ["100%", "Verified"],
                    ] as const
                  ).map(([val, label]) => (
                    <div key={label} className="text-center">
                      <div className="font-serif font-bold text-xl gold-text">
                        {val}
                      </div>
                      <div className="font-sans text-[10px] text-obsidian-200 uppercase tracking-widest">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Search + Filters */}
          <section className="px-4 py-6 bg-obsidian-800/40 border-b border-gold-800/20 sticky top-16 md:top-20 z-30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500"
                />
                <input
                  type="text"
                  placeholder="Search by name, category, speciality..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60 transition-colors"
                  data-ocid="talent.search_input"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-300 font-sans text-sm hover:border-gold-500/60 transition-colors"
                data-ocid="talent.filter_toggle"
              >
                <Filter size={14} />
                Filters
                {(categoryFilter !== "All" ||
                  locationFilter !== "All Locations" ||
                  availabilityFilter !== "All") && (
                  <span className="w-2 h-2 rounded-full bg-gold-400" />
                )}
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="max-w-7xl mx-auto mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-[10px] font-sans font-medium text-gold-500 uppercase tracking-widest mb-1.5">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(["All", ...CATEGORIES] as const).map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setCategoryFilter(c)}
                        className={`px-3 py-1 rounded-full text-xs font-sans border transition-all ${
                          categoryFilter === c
                            ? "bg-gold-600/30 border-gold-500/60 text-gold-200"
                            : "bg-transparent border-gold-800/40 text-obsidian-100 hover:border-gold-600/40"
                        }`}
                        data-ocid={`talent.filter_category.${c.toLowerCase()}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[10px] font-sans font-medium text-gold-500 uppercase tracking-widest mb-1.5">
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                    data-ocid="talent.filter_location"
                  >
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-[10px] font-sans font-medium text-gold-500 uppercase tracking-widest mb-1.5">
                    Availability
                  </label>
                  <div className="flex gap-2">
                    {(["All", ...AVAILABILITIES] as const).map((a) => (
                      <button
                        type="button"
                        key={a}
                        onClick={() => setAvailabilityFilter(a)}
                        className={`px-3 py-1 rounded-full text-xs font-sans border transition-all ${
                          availabilityFilter === a
                            ? "bg-gold-600/30 border-gold-500/60 text-gold-200"
                            : "bg-transparent border-gold-800/40 text-obsidian-100 hover:border-gold-600/40"
                        }`}
                        data-ocid={`talent.filter_availability.${a.toLowerCase()}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Results count + Category tabs */}
          <section className="px-4 pt-6 pb-2 max-w-7xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4">
                {(["All", ...CATEGORIES] as const).map((c) => {
                  const count =
                    c === "All"
                      ? TALENT_PROFILES.length
                      : TALENT_PROFILES.filter((t) => t.category === c).length;
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCategoryFilter(c)}
                      className={`text-xs font-sans pb-1 border-b-2 transition-all ${
                        categoryFilter === c
                          ? "border-gold-500 text-gold-300 font-semibold"
                          : "border-transparent text-obsidian-200 hover:text-gold-400"
                      }`}
                      data-ocid={`talent.tab.${c.toLowerCase()}`}
                    >
                      {c} ({count})
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-sans text-obsidian-300">
                Showing{" "}
                <span className="text-gold-300 font-medium">
                  {filtered.length}
                </span>{" "}
                of {TALENT_PROFILES.length} talents
              </span>
            </div>
          </section>

          {/* Talent Grid */}
          <section className="px-4 py-6 max-w-7xl mx-auto">
            {filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 text-center"
                data-ocid="talent.empty_state"
              >
                <Users size={40} className="text-gold-700/40 mb-4" />
                <h3 className="font-serif text-lg text-gold-300 mb-2">
                  No talent found
                </h3>
                <p className="font-sans text-sm text-obsidian-200">
                  Try adjusting your search or filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setLocationFilter("All Locations");
                    setAvailabilityFilter("All");
                  }}
                  className="mt-4 px-4 py-2 rounded-lg border border-gold-700/40 text-gold-400 text-sm font-sans hover:border-gold-500/60 transition-colors"
                  data-ocid="talent.reset_filters_button"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((t) => (
                  <TalentCard key={t.id} talent={t} onBook={handleBook} />
                ))}
              </div>
            )}
          </section>

          {/* Talent Application Section */}
          <section className="px-4 py-16 bg-obsidian-800/40 border-t border-gold-800/20 mt-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-700/20 border border-gold-700/30 text-gold-400 text-xs font-sans mb-3">
                  <Star size={12} /> Join Our Roster
                </div>
                <h2 className="font-serif font-bold text-2xl gold-text">
                  Are You a Performer?
                </h2>
                <p className="font-sans text-sm text-obsidian-100 mt-2">
                  Apply to join the MSTC GLOBAL talent roster. We connect the
                  best performers with premium clients across India.
                </p>
              </div>

              {applySubmitted ? (
                <div
                  className="flex flex-col items-center gap-4 py-10 text-center"
                  data-ocid="talent.apply_success_state"
                >
                  <CheckCircle2 size={44} className="text-emerald-400" />
                  <h3 className="font-serif text-lg text-gold-200">
                    Application Received!
                  </h3>
                  <p className="font-sans text-sm text-obsidian-100">
                    Thank you for applying. Our team will review your profile
                    and contact you within 3–5 business days.
                  </p>
                  <button
                    type="button"
                    onClick={() => setApplySubmitted(false)}
                    className="mt-2 px-5 py-2 rounded-lg border border-gold-700/40 text-gold-400 text-sm font-sans hover:border-gold-500/60 transition-colors"
                  >
                    Apply Again
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleApply}
                  className="flex flex-col gap-4"
                  data-ocid="talent.apply_form"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans text-gold-400 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={applyForm.name}
                        onChange={(e) =>
                          setApplyForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="Your name or group name"
                        className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                        data-ocid="talent.apply_name_input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans text-gold-400 mb-1">
                        Performer Type *
                      </label>
                      <select
                        required
                        value={applyForm.type}
                        onChange={(e) =>
                          setApplyForm((f) => ({ ...f, type: e.target.value }))
                        }
                        className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                        data-ocid="talent.apply_type_select"
                      >
                        <option value="">Select category</option>
                        <option>Music Artist</option>
                        <option>Athlete / Sports</option>
                        <option>Cultural Performer</option>
                        <option>Media / Celebrity</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-sans text-gold-400 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={applyForm.location}
                        onChange={(e) =>
                          setApplyForm((f) => ({
                            ...f,
                            location: e.target.value,
                          }))
                        }
                        placeholder="City / State"
                        className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                        data-ocid="talent.apply_location_input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans text-gold-400 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={applyForm.phone}
                        onChange={(e) =>
                          setApplyForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        placeholder="+91 XXXXXXXXXX"
                        className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                        data-ocid="talent.apply_phone_input"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-sans text-gold-400 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={applyForm.email}
                        onChange={(e) =>
                          setApplyForm((f) => ({ ...f, email: e.target.value }))
                        }
                        placeholder="your@email.com"
                        className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                        data-ocid="talent.apply_email_input"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-sans text-gold-400 mb-1">
                        Brief Bio / Portfolio Link *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={applyForm.bio}
                        onChange={(e) =>
                          setApplyForm((f) => ({ ...f, bio: e.target.value }))
                        }
                        placeholder="Describe your act, years of experience, notable performances, or paste a link to your portfolio/YouTube."
                        className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60 resize-none"
                        data-ocid="talent.apply_bio_textarea"
                      />
                    </div>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyForm.agreed}
                      onChange={(e) =>
                        setApplyForm((f) => ({
                          ...f,
                          agreed: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-5 h-5 rounded accent-gold-500"
                      data-ocid="talent.apply_terms_checkbox"
                    />
                    <span className="font-sans text-xs text-obsidian-100 leading-relaxed">
                      I confirm that the information provided is accurate and I
                      agree to the{" "}
                      <span className="text-gold-400">
                        MSTC GLOBAL Terms & Conditions
                      </span>
                      . I understand that my profile will be reviewed and I may
                      be contacted by MSTC GLOBAL for further verification.
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={!applyForm.agreed}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-gold-700 to-gold-500 text-obsidian-900 font-sans font-semibold text-sm hover:from-gold-600 hover:to-gold-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-ocid="talent.apply_submit_button"
                  >
                    Submit Application
                  </button>
                </form>
              )}
            </div>
          </section>
        </main>

        <Footer />
        <BackToTop />

        {/* Booking Modal */}
        {selectedTalent && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center px-4 bg-obsidian-900/80 backdrop-blur-sm"
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeModal();
            }}
            data-ocid="talent.booking_dialog"
          >
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-obsidian-800 border border-gold-700/40 rounded-2xl shadow-gold">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-obsidian-800 border-b border-gold-800/30">
                <div>
                  <h2 className="font-serif font-semibold text-gold-200 text-lg">
                    Book Inquiry
                  </h2>
                  <p className="font-sans text-xs text-gold-400">
                    {selectedTalent.name} — {selectedTalent.subType}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full border border-gold-700/40 flex items-center justify-center text-gold-400 hover:border-gold-500/60 transition-colors"
                  aria-label="Close dialog"
                  data-ocid="talent.booking_close_button"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="px-6 py-5">
                {submitted ? (
                  <div
                    className="flex flex-col items-center gap-4 py-8 text-center"
                    data-ocid="talent.booking_success_state"
                  >
                    <CheckCircle2 size={44} className="text-emerald-400" />
                    <h3 className="font-serif text-lg text-gold-200">
                      Inquiry Sent!
                    </h3>
                    <p className="font-sans text-sm text-obsidian-100">
                      Your booking inquiry for{" "}
                      <span className="text-gold-300">
                        {selectedTalent.name}
                      </span>{" "}
                      has been submitted. Our team will contact you within 24
                      hours.
                    </p>
                    <p className="font-sans text-xs text-obsidian-200">
                      For urgent bookings, call us at{" "}
                      <a
                        href="tel:9512609016"
                        className="text-gold-400 hover:text-gold-300"
                      >
                        +91 9512609016
                      </a>
                    </p>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-2 px-5 py-2 rounded-lg border border-gold-700/40 text-gold-400 text-sm font-sans hover:border-gold-500/60 transition-colors"
                      data-ocid="talent.booking_close_button"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-sans text-gold-400 mb-1">
                          Event Type *
                        </label>
                        <select
                          required
                          value={form.eventType}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              eventType: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                          data-ocid="talent.booking_event_type_select"
                        >
                          <option value="">Select event type</option>
                          <option>Corporate Event</option>
                          <option>Wedding / Reception</option>
                          <option>Cultural Festival</option>
                          <option>Private Party</option>
                          <option>Award Ceremony</option>
                          <option>Conference</option>
                          <option>Brand Launch</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-gold-400 mb-1">
                          Event Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={form.date}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, date: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                          data-ocid="talent.booking_date_input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-gold-400 mb-1">
                          Event Location *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.location}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, location: e.target.value }))
                          }
                          placeholder="City, Venue"
                          className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                          data-ocid="talent.booking_location_input"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-sans text-gold-400 mb-1">
                          Budget Range *
                        </label>
                        <select
                          required
                          value={form.budget}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, budget: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                          data-ocid="talent.booking_budget_select"
                        >
                          <option value="">Select budget range</option>
                          <option>Under ₹25,000</option>
                          <option>₹25,000 – ₹50,000</option>
                          <option>₹50,000 – ₹1,00,000</option>
                          <option>₹1,00,000 – ₹2,50,000</option>
                          <option>₹2,50,000 – ₹5,00,000</option>
                          <option>₹5,00,000+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-gold-400 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          placeholder="Full name"
                          className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                          data-ocid="talent.booking_name_input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-gold-400 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                          }
                          placeholder="+91 XXXXXXXXXX"
                          className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                          data-ocid="talent.booking_phone_input"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-sans text-gold-400 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                          placeholder="your@email.com"
                          className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60"
                          data-ocid="talent.booking_email_input"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-sans text-gold-400 mb-1">
                          Additional Message
                        </label>
                        <textarea
                          rows={3}
                          value={form.message}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, message: e.target.value }))
                          }
                          placeholder="Any specific requirements, duration, or special requests..."
                          className="w-full px-3 py-2.5 rounded-lg bg-obsidian-700/60 border border-gold-800/40 text-gold-100 placeholder:text-obsidian-300 font-sans text-sm focus:outline-none focus:border-gold-500/60 resize-none"
                          data-ocid="talent.booking_message_textarea"
                        />
                      </div>
                    </div>

                    {/* Indemnity */}
                    <div className="p-3 rounded-lg bg-obsidian-700/40 border border-gold-800/20">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.agreed}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, agreed: e.target.checked }))
                          }
                          className="mt-0.5 w-5 h-5 rounded accent-gold-500"
                          data-ocid="talent.booking_terms_checkbox"
                        />
                        <span className="font-sans text-xs text-obsidian-100 leading-relaxed">
                          I agree to the{" "}
                          <span className="text-gold-400">
                            MSTC GLOBAL Terms & Conditions
                          </span>{" "}
                          and understand that this inquiry is non-binding. Final
                          confirmation and pricing will be provided by MSTC
                          GLOBAL. I indemnify MSTC GLOBAL from any liability
                          arising from booking facilitation.
                        </span>
                      </label>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 py-2.5 rounded-lg border border-gold-700/40 text-gold-400 font-sans text-sm hover:border-gold-500/60 transition-colors"
                        data-ocid="talent.booking_cancel_button"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!form.agreed || submitting}
                        className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-gold-700 to-gold-500 text-obsidian-900 font-sans font-semibold text-sm hover:from-gold-600 hover:to-gold-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        data-ocid="talent.booking_submit_button"
                      >
                        {submitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-obsidian-900/50 border-t-obsidian-900 rounded-full animate-spin" />{" "}
                            Sending...
                          </>
                        ) : (
                          "Send Inquiry"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivacyGate>
  );
}
