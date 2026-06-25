import SecureAppGate from "@/components/shared/SecureAppGate";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Brain,
  Globe,
  Lock,
  Settings,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";

function Toggle({
  checked,
  onChange,
  id,
}: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
        checked ? "bg-gold-600" : "bg-muted/60"
      }`}
      data-ocid={`settings.${id}.toggle`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  id,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (n: number) => void;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <Label className="text-sm text-foreground">{label}</Label>
        <span className="text-sm font-medium text-gold-400">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold-500"
        data-ocid={`settings.${id}.slider`}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
}

function ObserverCodesTab() {
  return (
    <div className="p-4 text-muted-foreground font-sans text-sm">
      Observer codes are managed from Master Control. Navigate to /master to
      generate and revoke observer access codes.
    </div>
  );
}

function TrustArchitectureTab() {
  return (
    <div className="p-4 text-muted-foreground font-sans text-sm">
      Trust architecture settings are configured in the Security App. Navigate
      to /security to manage AI decision authority and trust levels.
    </div>
  );
}

export default function SettingsPage() {
  // General
  const [language, setLanguage] = useState("English");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Security
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [lockoutThreshold, setLockoutThreshold] = useState(3);
  const [deviceBinding, setDeviceBinding] = useState(true);
  const [twoFA, setTwoFA] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState("192.168.1.0/24\n10.0.0.0/8");

  // AI Config
  const [escalationThreshold, setEscalationThreshold] = useState(100);
  const [autonomousDeploy, setAutonomousDeploy] = useState(true);
  const [learningMode, setLearningMode] = useState("Balanced");
  const [tutorialAI, setTutorialAI] = useState(true);

  // Notifications
  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>({
    CRM: true,
    Properties: true,
    Legal: true,
    Security: true,
    Finance: true,
    Events: false,
  });
  const [emailDigest, setEmailDigest] = useState("Daily");

  // Integrations
  const [integrationToggles, setIntegrationToggles] = useState<
    Record<string, boolean>
  >({
    "Google Maps": true,
    "WhatsApp Business": true,
    "RERA Gujarat": true,
    "RBI Data Feed": true,
    "News API": true,
    OpenAI: true,
    Claude: false,
  });

  const [saved, setSaved] = useState(false);
  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SecureAppGate appName="Settings">
      <div
        className="min-h-screen bg-background pb-20"
        data-ocid="settings.page"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gold-800/30 bg-card/90 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gold-400" />
              <h1 className="font-serif font-bold text-base sm:text-lg text-foreground">
                Platform Settings
              </h1>
            </div>
            <button
              type="button"
              onClick={save}
              className="px-3 py-1.5 rounded-lg bg-gold-700 hover:bg-gold-600 text-background text-xs font-semibold transition-colors"
              data-ocid="settings.save_button"
            >
              {saved ? "Saved ✓" : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="px-4 py-4 max-w-2xl mx-auto">
          <Tabs defaultValue="general" className="w-full">
            <TabsList
              className="w-full bg-muted/20 border border-gold-800/20 mb-5 h-auto flex flex-wrap gap-1 p-1"
              data-ocid="settings.tabs"
            >
              {[
                "general",
                "security",
                "ai-config",
                "notifications",
                "integrations",
              ].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 min-w-[80px] text-xs capitalize data-[state=active]:bg-gold-700 data-[state=active]:text-background"
                  data-ocid={`settings.${tab}.tab`}
                >
                  {tab.replace("-", " ")}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* GENERAL */}
            <TabsContent value="general" className="space-y-4">
              <div className="rounded-xl border border-gold-800/30 bg-card p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-gold-400" />
                  <h2 className="font-serif font-semibold text-foreground">
                    General Settings
                  </h2>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Platform Name
                  </Label>
                  <input
                    readOnly
                    value="MSTC GLOBAL"
                    className="w-full bg-muted/20 border border-gold-800/20 rounded-lg px-3 py-2 text-sm text-foreground"
                    data-ocid="settings.platform_name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Timezone
                  </Label>
                  <input
                    readOnly
                    value="Asia/Kolkata (IST, UTC+5:30)"
                    className="w-full bg-muted/20 border border-gold-800/20 rounded-lg px-3 py-2 text-sm text-foreground"
                    data-ocid="settings.timezone.input"
                  />
                </div>
                <Separator className="bg-gold-800/20" />
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Language
                  </Label>
                  <div className="flex gap-3 flex-wrap">
                    {["English", "Hindi", "Gujarati"].map((lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-1.5 text-sm cursor-pointer"
                        data-ocid={`settings.lang.${lang.toLowerCase()}.radio`}
                      >
                        <input
                          type="radio"
                          name="language"
                          value={lang}
                          checked={language === lang}
                          onChange={() => setLanguage(lang)}
                          className="accent-gold-500"
                        />
                        <span className="text-foreground">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Date Format
                  </Label>
                  <div className="flex gap-3 flex-wrap">
                    {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((fmt) => (
                      <label
                        key={fmt}
                        className="flex items-center gap-1.5 text-sm cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="dateFormat"
                          value={fmt}
                          checked={dateFormat === fmt}
                          onChange={() => setDateFormat(fmt)}
                          className="accent-gold-500"
                          data-ocid={"settings.date_format.radio"}
                        />
                        <span className="text-foreground font-mono text-xs">
                          {fmt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Currency
                  </Label>
                  <input
                    readOnly
                    value="INR — Indian Rupee (₹)"
                    className="w-full bg-muted/20 border border-gold-800/20 rounded-lg px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>
            </TabsContent>

            {/* SECURITY */}
            <TabsContent value="security" className="space-y-4">
              <div className="rounded-xl border border-gold-800/30 bg-card p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-gold-400" />
                  <h2 className="font-serif font-semibold text-foreground">
                    Security Settings
                  </h2>
                </div>
                <SliderField
                  label="Session Timeout"
                  value={sessionTimeout}
                  min={15}
                  max={480}
                  step={15}
                  unit="min"
                  onChange={setSessionTimeout}
                  id="session_timeout"
                />
                <Separator className="bg-gold-800/20" />
                <SliderField
                  label="Failed Attempt Lockout"
                  value={lockoutThreshold}
                  min={1}
                  max={10}
                  unit="attempts"
                  onChange={setLockoutThreshold}
                  id="lockout_threshold"
                />
                <Separator className="bg-gold-800/20" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">Device Binding</p>
                    <p className="text-xs text-muted-foreground">
                      Tie sessions to specific devices
                    </p>
                  </div>
                  <Toggle
                    checked={deviceBinding}
                    onChange={setDeviceBinding}
                    id="device_binding"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Require 2FA on all logins
                    </p>
                  </div>
                  <Toggle checked={twoFA} onChange={setTwoFA} id="2fa" />
                </div>
                <Separator className="bg-gold-800/20" />
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    IP Whitelist (one per line)
                  </Label>
                  <textarea
                    rows={3}
                    value={ipWhitelist}
                    onChange={(e) => setIpWhitelist(e.target.value)}
                    className="w-full bg-muted/20 border border-gold-800/20 rounded-lg px-3 py-2 text-xs text-foreground font-mono resize-none focus:outline-none focus:border-gold-700/40"
                    data-ocid="settings.ip_whitelist.textarea"
                  />
                </div>
              </div>
            </TabsContent>

            {/* AI CONFIG */}
            <TabsContent value="ai-config" className="space-y-4">
              <div className="rounded-xl border border-gold-800/30 bg-card p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-gold-400" />
                  <h2 className="font-serif font-semibold text-foreground">
                    AI Configuration
                  </h2>
                </div>
                <SliderField
                  label="Escalation Threshold (deal size)"
                  value={escalationThreshold}
                  min={10}
                  max={500}
                  step={10}
                  unit="L ₹"
                  onChange={setEscalationThreshold}
                  id="escalation_threshold"
                />
                <p className="text-[10px] text-muted-foreground -mt-2">
                  Deals above ₹{escalationThreshold}L escalate to owner for
                  approval
                </p>
                <Separator className="bg-gold-800/20" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">Autonomous Deploy</p>
                    <p className="text-xs text-muted-foreground">
                      Allow Aria to deploy minor changes without approval
                    </p>
                  </div>
                  <Toggle
                    checked={autonomousDeploy}
                    onChange={setAutonomousDeploy}
                    id="autonomous_deploy"
                  />
                </div>
                <Separator className="bg-gold-800/20" />
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    AI Learning Mode
                  </Label>
                  <div className="flex gap-3 flex-wrap">
                    {["Conservative", "Balanced", "Aggressive"].map((mode) => (
                      <label
                        key={mode}
                        className="flex items-center gap-1.5 text-sm cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="learningMode"
                          value={mode}
                          checked={learningMode === mode}
                          onChange={() => setLearningMode(mode)}
                          className="accent-gold-500"
                          data-ocid={`settings.learning_mode.${mode.toLowerCase()}.radio`}
                        />
                        <span className="text-foreground">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Separator className="bg-gold-800/20" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">
                      Tutorial Improvement AI
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Allow AI to continuously improve tutorial content
                    </p>
                  </div>
                  <Toggle
                    checked={tutorialAI}
                    onChange={setTutorialAI}
                    id="tutorial_ai"
                  />
                </div>
              </div>
            </TabsContent>

            {/* NOTIFICATIONS */}
            <TabsContent value="notifications" className="space-y-4">
              <div className="rounded-xl border border-gold-800/30 bg-card p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-4 h-4 text-gold-400" />
                  <h2 className="font-serif font-semibold text-foreground">
                    Notification Settings
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose which apps send you notifications
                </p>
                <div className="space-y-3">
                  {Object.keys(notifToggles).map((app) => (
                    <div
                      key={app}
                      className="flex items-center justify-between"
                      data-ocid={`settings.notif.${app.toLowerCase()}.toggle`}
                    >
                      <p className="text-sm text-foreground">{app}</p>
                      <Toggle
                        checked={notifToggles[app]}
                        onChange={(v) =>
                          setNotifToggles((prev) => ({ ...prev, [app]: v }))
                        }
                        id={`notif_${app.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
                <Separator className="bg-gold-800/20" />
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Email Digest Frequency
                  </Label>
                  <div className="flex gap-3 flex-wrap">
                    {["Real-time", "Daily", "Weekly"].map((freq) => (
                      <label
                        key={freq}
                        className="flex items-center gap-1.5 text-sm cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="emailDigest"
                          value={freq}
                          checked={emailDigest === freq}
                          onChange={() => setEmailDigest(freq)}
                          className="accent-gold-500"
                          data-ocid={`settings.email_digest.${freq.toLowerCase().replace("-", "")}.radio`}
                        />
                        <span className="text-foreground">{freq}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* INTEGRATIONS */}
            <TabsContent value="integrations" className="space-y-4">
              <div className="rounded-xl border border-gold-800/30 bg-card p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  {integrationToggles["Google Maps"] ? (
                    <ToggleRight className="w-4 h-4 text-gold-400" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-gold-400" />
                  )}
                  <h2 className="font-serif font-semibold text-foreground">
                    Integration Toggles
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Quickly enable or disable each integration
                </p>
                <div className="space-y-3">
                  {Object.keys(integrationToggles).map((name) => (
                    <div
                      key={name}
                      className="flex items-center justify-between"
                      data-ocid={`settings.integration.${name.toLowerCase().replace(/\s+/g, "_")}.toggle`}
                    >
                      <p className="text-sm text-foreground">{name}</p>
                      <Toggle
                        checked={integrationToggles[name]}
                        onChange={(v) =>
                          setIntegrationToggles((prev) => ({
                            ...prev,
                            [name]: v,
                          }))
                        }
                        id={`int_${name.toLowerCase().replace(/\s+/g, "_")}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* OBSERVER CODES */}
            <TabsContent value="observer" className="space-y-4">
              <ObserverCodesTab />
            </TabsContent>

            {/* TRUST AI */}
            <TabsContent value="trust-ai" className="space-y-4">
              <TrustArchitectureTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SecureAppGate>
  );
}
