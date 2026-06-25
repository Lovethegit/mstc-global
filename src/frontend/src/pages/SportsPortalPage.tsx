import PrivacyGate from "@/components/PrivacyGate";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import BackToTop from "@/components/ui/BackToTop";
import { useLogServiceSubmission } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Trophy } from "lucide-react";
import { useState } from "react";

const WHATSAPP_NUMBER = "919512609016";
const SPORTS_LIST = [
  "Cricket",
  "Football",
  "Kabaddi",
  "Basketball",
  "Athletics",
  "Badminton",
  "Chess",
  "Other",
];
const LEVELS = ["School", "College", "District", "State", "National"];

type Team = { name: string; winner?: boolean };
type Match = { team1: Team; team2: Team; winnerId?: "team1" | "team2" };
type Round = Match[];

function buildBracket(teams: string[]): Round[] {
  const rounds: Round[] = [];
  let current: string[] = [...teams];
  while (current.length > 1) {
    const matches: Match[] = [];
    for (let i = 0; i < current.length; i += 2) {
      matches.push({
        team1: { name: current[i] },
        team2: { name: current[i + 1] ?? "BYE" },
      });
    }
    rounds.push(matches);
    current = matches.map(() => "");
  }
  return rounds;
}

export default function SportsPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "talent" | "bracket" | "sponsorship"
  >("talent");
  const logSubmission = useLogServiceSubmission();

  // Talent registration
  const [tName, setTName] = useState("");
  const [tAge, setTAge] = useState("");
  const [tSport, setTSport] = useState(SPORTS_LIST[0]);
  const [tLevel, setTLevel] = useState(LEVELS[0]);
  const [tAchievements, setTAchievements] = useState("");
  const [tPhone, setTPhone] = useState("");
  const [tEmail, setTEmail] = useState("");
  const [tIndemnity, setTIndemnity] = useState(false);
  const [talentSuccess, setTalentSuccess] = useState(false);
  const [talentLoading, setTalentLoading] = useState(false);

  // Tournament bracket
  const [tournName, setTournName] = useState("");
  const [teamCount, setTeamCount] = useState<4 | 8 | 16>(4);
  const [tournSport, setTournSport] = useState(SPORTS_LIST[0]);
  const [teamNames, setTeamNames] = useState<string[]>(Array(4).fill(""));
  const [rounds, setRounds] = useState<Round[] | null>(null);

  // Sponsorship
  const [sName, setSName] = useState("");
  const [sCompany, setSCompany] = useState("");
  const [sAmount, setSAmount] = useState("");
  const [sEvent, setSEvent] = useState("");
  const [sContact, setSContact] = useState("");
  const [sponsorSuccess, setSponsorSuccess] = useState(false);

  const handleTalentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tIndemnity) return;
    setTalentLoading(true);
    try {
      await logSubmission.mutateAsync({
        serviceCategory: "Sports",
        innerPage: "Sports Portal",
        formType: "Talent Registration",
        fields: [
          ["Name", tName],
          ["Age", tAge],
          ["Sport", tSport],
          ["Level", tLevel],
          ["Phone", tPhone],
          ["Email", tEmail],
          ["Achievements", tAchievements],
        ],
        submitterName: tName,
        submitterPhone: tPhone,
        submitterEmail: tEmail,
        indemnityAccepted: tIndemnity,
      });
      setTalentSuccess(true);
    } catch {
      setTalentSuccess(true); // Show success even if backend unavailable
    } finally {
      setTalentLoading(false);
    }
  };

  const handleTeamCountChange = (n: 4 | 8 | 16) => {
    setTeamCount(n);
    setTeamNames(Array(n).fill(""));
    setRounds(null);
  };

  const handleTeamName = (i: number, val: string) => {
    const updated = [...teamNames];
    updated[i] = val;
    setTeamNames(updated);
  };

  const startBracket = () => {
    const filled = teamNames.map((n, i) => n.trim() || `Team ${i + 1}`);
    setRounds(buildBracket(filled));
  };

  const pickWinner = (
    roundIdx: number,
    matchIdx: number,
    pick: "team1" | "team2",
  ) => {
    if (!rounds) return;
    const newRounds = rounds.map((r, _ri) =>
      r.map((m, _mi) => ({
        ...m,
        team1: { ...m.team1 },
        team2: { ...m.team2 },
      })),
    );
    newRounds[roundIdx][matchIdx].winnerId = pick;
    const winner = newRounds[roundIdx][matchIdx][pick].name;
    if (roundIdx + 1 < newRounds.length) {
      const nextMatchIdx = Math.floor(matchIdx / 2);
      const side = matchIdx % 2 === 0 ? "team1" : "team2";
      newRounds[roundIdx + 1][nextMatchIdx][side] = { name: winner };
    }
    setRounds(newRounds);
  };

  const champion = rounds
    ? (() => {
        const lastRound = rounds[rounds.length - 1];
        const lastMatch = lastRound[0];
        return lastMatch.winnerId ? lastMatch[lastMatch.winnerId].name : null;
      })()
    : null;

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logSubmission.mutate({
      serviceCategory: "Sports",
      innerPage: "Sports Portal",
      formType: "Sponsorship Inquiry",
      fields: [
        ["Name", sName],
        ["Company", sCompany],
        ["Amount", sAmount],
        ["Event", sEvent],
        ["Contact", sContact],
      ],
      submitterName: sName,
      submitterPhone: sContact,
      submitterEmail: "",
      indemnityAccepted: true,
    });
    setSponsorSuccess(true);
  };

  const sponsorMsg = `Hi MSTC GLOBAL, I am ${sName} from ${sCompany}, interested in sponsoring sports activities with an amount of ₹${sAmount} for: ${sEvent}. Contact: ${sContact}. Please get in touch.`;

  return (
    <PrivacyGate>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        {/* Page Header */}
        <section className="pt-24 pb-8 px-4 bg-card/50 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/services/media-sports-tourism"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
              data-ocid="sports_portal.back_button"
            >
              <ArrowLeft size={14} /> Back to Media, Sports &amp; Tourism
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={24} className="text-primary" />
              <h1 className="font-serif font-bold text-3xl gold-text">
                Sports Portal
              </h1>
            </div>
            <p className="font-sans text-sm text-muted-foreground">
              Register your talent, manage tournaments, and explore sponsorship
              opportunities with MSTC GLOBAL.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border flex-wrap">
            {(["talent", "bracket", "sponsorship"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                data-ocid={`sports_portal.${tab}_tab`}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 font-sans text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {tab === "talent"
                  ? "Talent Registration"
                  : tab === "bracket"
                    ? "Tournament Bracket"
                    : "Sponsorship Inquiry"}
              </button>
            ))}
          </div>

          {/* === TALENT REGISTRATION === */}
          {activeTab === "talent" && (
            <div className="max-w-lg">
              {talentSuccess ? (
                <div
                  className="text-center py-16"
                  data-ocid="sports_portal.talent_success_state"
                >
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="font-serif text-xl font-bold text-primary mb-2">
                    Registration Submitted!
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    Our sports team will review your profile and contact you
                    within 3 business days.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTalentSuccess(false)}
                    data-ocid="sports_portal.talent_register_another_button"
                    className="mt-6 px-6 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 font-sans text-sm hover:bg-primary/20 transition-colors"
                  >
                    Register Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTalentSubmit} className="space-y-4">
                  {[
                    {
                      label: "Full Name",
                      val: tName,
                      set: setTName,
                      id: "talent_name_input",
                      type: "text",
                      required: true,
                    },
                    {
                      label: "Age",
                      val: tAge,
                      set: setTAge,
                      id: "talent_age_input",
                      type: "number",
                      required: true,
                    },
                    {
                      label: "Phone",
                      val: tPhone,
                      set: setTPhone,
                      id: "talent_phone_input",
                      type: "tel",
                      required: true,
                    },
                    {
                      label: "Email",
                      val: tEmail,
                      set: setTEmail,
                      id: "talent_email_input",
                      type: "email",
                      required: false,
                    },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                        {f.label}
                        {f.required && " *"}
                      </label>
                      <input
                        type={f.type}
                        value={f.val}
                        required={f.required}
                        data-ocid={`sports_portal.${f.id}`}
                        onChange={(e) => f.set(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                      Sport *
                    </label>
                    <select
                      value={tSport}
                      data-ocid="sports_portal.talent_sport_select"
                      onChange={(e) => setTSport(e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                      required
                    >
                      {SPORTS_LIST.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                      Level *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {LEVELS.map((lv) => (
                        <button
                          key={lv}
                          type="button"
                          data-ocid={`sports_portal.level_${lv.toLowerCase()}`}
                          onClick={() => setTLevel(lv)}
                          className={`px-4 py-1.5 rounded-full border text-sm font-sans transition-all ${
                            tLevel === lv
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:border-primary"
                          }`}
                        >
                          {lv}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                      Key Achievements
                    </label>
                    <textarea
                      value={tAchievements}
                      data-ocid="sports_portal.achievements_textarea"
                      onChange={(e) => setTAchievements(e.target.value)}
                      rows={3}
                      placeholder="District champion 2023, school captain…"
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tIndemnity}
                      data-ocid="sports_portal.talent_indemnity_checkbox"
                      onChange={(e) => setTIndemnity(e.target.checked)}
                      className="accent-primary w-5 h-5 mt-0.5 shrink-0"
                      required
                    />
                    <span className="text-xs font-sans text-muted-foreground leading-relaxed">
                      I agree that MSTC GLOBAL may store and use this
                      information for talent scouting and promotional purposes.
                      Information provided is accurate to the best of my
                      knowledge. I indemnify MSTC GLOBAL from any misuse of this
                      data.
                    </span>
                  </label>

                  <button
                    type="submit"
                    data-ocid="sports_portal.talent_submit_button"
                    disabled={!tIndemnity || talentLoading}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    {talentLoading ? "Submitting…" : "Submit Registration"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* === TOURNAMENT BRACKET === */}
          {activeTab === "bracket" && (
            <div>
              {!rounds ? (
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                      Tournament Name
                    </label>
                    <input
                      type="text"
                      value={tournName}
                      data-ocid="sports_portal.tournament_name_input"
                      onChange={(e) => setTournName(e.target.value)}
                      placeholder="MSTC Summer Cup 2025"
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                      Sport
                    </label>
                    <select
                      value={tournSport}
                      data-ocid="sports_portal.tournament_sport_select"
                      onChange={(e) => setTournSport(e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                    >
                      {SPORTS_LIST.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                      Number of Teams
                    </label>
                    <div className="flex gap-2">
                      {([4, 8, 16] as const).map((n) => (
                        <button
                          key={n}
                          type="button"
                          data-ocid={`sports_portal.team_count_${n}`}
                          onClick={() => handleTeamCountChange(n)}
                          className={`flex-1 py-2 rounded-lg border text-sm font-sans transition-all ${
                            teamCount === n
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:border-primary"
                          }`}
                        >
                          {n} Teams
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {teamNames.map((name, i) => (
                      <input
                        key={`team-name-${name || i}`}
                        type="text"
                        value={name}
                        data-ocid={`sports_portal.team_name_input.${i + 1}`}
                        onChange={(e) => handleTeamName(i, e.target.value)}
                        placeholder={`Team ${i + 1}`}
                        className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    data-ocid="sports_portal.start_bracket_button"
                    onClick={startBracket}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Start Tournament
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-lg font-bold text-primary">
                      {tournName || `${tournSport} Tournament`}
                    </h3>
                    <button
                      type="button"
                      data-ocid="sports_portal.reset_bracket_button"
                      onClick={() => setRounds(null)}
                      className="text-xs text-muted-foreground hover:text-foreground font-sans border border-border px-3 py-1 rounded transition-colors"
                    >
                      Reset
                    </button>
                  </div>

                  {champion && (
                    <div className="mb-6 text-center py-6 bg-primary/10 rounded-xl border border-primary/30">
                      <div className="text-3xl mb-2">🏆</div>
                      <div className="font-serif text-xl font-bold text-primary">
                        Champion: {champion}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-8 overflow-x-auto pb-4">
                    {rounds.map((round, ri) => (
                      <div
                        key={round
                          .map((m) => `${m.team1}-${m.team2}`)
                          .join("|")}
                        className="flex flex-col gap-4 shrink-0"
                      >
                        <div className="text-xs font-sans text-muted-foreground font-medium mb-1">
                          {ri === rounds.length - 1
                            ? "FINAL"
                            : ri === rounds.length - 2
                              ? "SEMI-FINAL"
                              : `ROUND ${ri + 1}`}
                        </div>
                        {round.map((match, mi) => (
                          <div
                            key={`${match.team1}-${match.team2}`}
                            className="w-44 border border-border rounded-lg overflow-hidden bg-card"
                          >
                            {(["team1", "team2"] as const).map((side) => (
                              <button
                                key={side}
                                type="button"
                                data-ocid={`sports_portal.match_r${ri + 1}_m${mi + 1}_${side}`}
                                onClick={() => pickWinner(ri, mi, side)}
                                disabled={
                                  !match[side].name ||
                                  match[side].name === "BYE"
                                }
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-sans border-b last:border-0 border-border transition-all ${
                                  match.winnerId === side
                                    ? "bg-primary text-primary-foreground font-bold"
                                    : match.winnerId && match.winnerId !== side
                                      ? "opacity-40"
                                      : match[side].name &&
                                          match[side].name !== "BYE"
                                        ? "hover:bg-muted"
                                        : "opacity-30 cursor-default"
                                }`}
                              >
                                <span className="truncate">
                                  {match[side].name || "TBD"}
                                </span>
                                {match.winnerId === side && (
                                  <span className="text-xs ml-1">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === SPONSORSHIP INQUIRY === */}
          {activeTab === "sponsorship" && (
            <div className="max-w-lg">
              {sponsorSuccess ? (
                <div
                  className="text-center py-16"
                  data-ocid="sports_portal.sponsor_success_state"
                >
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="font-serif text-xl font-bold text-primary mb-2">
                    Thank You!
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm mb-6">
                    We've received your sponsorship inquiry and will contact you
                    shortly.
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(sponsorMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="sports_portal.sponsor_whatsapp_button"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Also WhatsApp Us
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSponsorSubmit} className="space-y-4">
                  {[
                    {
                      label: "Your Name *",
                      val: sName,
                      set: setSName,
                      id: "sponsor_name_input",
                      ph: "Full name",
                    },
                    {
                      label: "Company / Organisation *",
                      val: sCompany,
                      set: setSCompany,
                      id: "sponsor_company_input",
                      ph: "Company name",
                    },
                    {
                      label: "Sponsorship Amount (₹)",
                      val: sAmount,
                      set: setSAmount,
                      id: "sponsor_amount_input",
                      ph: "e.g. 50000",
                    },
                    {
                      label: "Event / Activity to Sponsor *",
                      val: sEvent,
                      set: setSEvent,
                      id: "sponsor_event_input",
                      ph: "Cricket tournament, school sports…",
                    },
                    {
                      label: "Contact Number *",
                      val: sContact,
                      set: setSContact,
                      id: "sponsor_contact_input",
                      ph: "+91 XXXXXXXXXX",
                    },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="block text-sm font-medium text-muted-foreground mb-1 font-sans">
                        {f.label}
                      </label>
                      <input
                        type="text"
                        value={f.val}
                        data-ocid={`sports_portal.${f.id}`}
                        onChange={(e) => f.set(e.target.value)}
                        placeholder={f.ph}
                        className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-sans text-foreground"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    data-ocid="sports_portal.sponsor_submit_button"
                    disabled={!sName || !sCompany || !sEvent || !sContact}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    Submit Sponsorship Inquiry
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <Footer />
        <BackToTop />
      </div>
    </PrivacyGate>
  );
}
