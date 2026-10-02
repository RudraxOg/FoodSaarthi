import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { useGuidedDemo } from "@/components/fs/guided-demo";
import { Btn, DemoDataNotice, DemoModeBadge } from "@/components/fs/ui";
import { CheckRow } from "@/components/fs/forms";
import { adminComplaint, adminListings, adminPartners, type AdminPartner, type ModStatus } from "@/lib/demo-roles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin console — Food Saarthi" },
      { name: "description", content: "Verify partners, moderate listings, resolve complaints and track campus impact." },
      { property: "og:title", content: "Admin console — Food Saarthi" },
      { property: "og:description", content: "Pilot admin console (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const pill = (s: string) =>
  cn("rounded-full px-2.5 py-0.5 text-xs font-semibold",
    s === "Approved" || s === "Live" || s === "Demo refund issued" ? "bg-accent text-accent-foreground"
    : s.includes("clarification") || s.includes("Correction") ? "bg-saffron/40 text-saffron-foreground"
    : s.includes("paused") || s.includes("expired") || s === "Rejected" ? "bg-coral/15 text-coral"
    : "bg-muted text-foreground");

function Admin() {
  const { start } = useGuidedDemo();
  const [partners, setPartners] = useState(adminPartners);
  const [selected, setSelected] = useState(adminPartners[0]!.id);
  const [checks, setChecks] = useState([false, false, false]);
  const [items, setItems] = useState(adminListings);
  const [refunded, setRefunded] = useState(false);
  const sel = partners.find((p) => p.id === selected)!;
  const setStatus = (id: string, status: AdminPartner["status"]) => setPartners((ps) => ps.map((p) => (p.id === id ? { ...p, status } : p)));
  const mod = (id: string, status: ModStatus) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status } : x)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-muted-foreground">North Campus pilot</p><h1 className="text-4xl">Admin console</h1></div>
        <Btn variant="ghost" onClick={() => start("admin", { fresh: true })}><Sparkles className="size-4" /> Admin tour</Btn>
      </div>
      <div className="mt-4"><DemoDataNotice>Admin actions here only change demo records on this device.</DemoDataNotice></div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section data-tour="verify-queue" className="rounded-3xl border bg-card p-6">
          <h2 className="text-2xl">Partner verification</h2>
          <ul className="mt-4 space-y-2">
            {partners.map((p) => (
              <li key={p.id}>
                <button onClick={() => { setSelected(p.id); setChecks([false, false, false]); }} className={cn("flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left", selected === p.id && "border-primary bg-accent/40")}>
                  <span><span className="block font-semibold">{p.name}</span><span className="text-xs text-muted-foreground">{p.type} · FSSAI {p.fssai}</span></span>
                  <span className={pill(p.status)}>{p.status}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section data-tour="doc-review" className="rounded-3xl bg-secondary p-6">
          <h2 className="text-2xl">Review: {sel.name}</h2>
          <p className="text-xs text-muted-foreground">Documents are fictional placeholders</p>
          <div className="mt-4 space-y-2">
            {["Licence / FSSAI status checked", "Packaging photos acceptable", "Safety declaration signed (4/4)"].map((t, i) => (
              <CheckRow key={t} checked={checks[i]!} onChange={(b) => setChecks((c) => c.map((x, j) => (j === i ? b : x)))}>{t}</CheckRow>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Btn disabled={!checks.every(Boolean)} onClick={() => setStatus(sel.id, "Approved")}>Approve</Btn>
            <Btn variant="ghost" onClick={() => setStatus(sel.id, "Needs safety clarification")}>Ask for clarification</Btn>
          </div>
        </section>
      </div>

      <section data-tour="moderation" className="mt-6 rounded-3xl border bg-card p-6">
        <h2 className="text-2xl">Listing moderation</h2>
        <ul className="mt-4 divide-y">
          {items.map((x) => (
            <li key={x.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{x.name}</p>
                <p className="text-xs text-muted-foreground">{x.outlet}{x.issue && <span className="ml-2 inline-flex items-center gap-1 text-coral"><AlertTriangle className="size-3" /> {x.issue}</span>}</p>
              </div>
              <span className={pill(x.status)}>{x.status}</span>
              {x.status !== "Pickup window expired" && (
                <div className="flex gap-1">
                  <button onClick={() => mod(x.id, "Live")} className="min-h-10 rounded-full border px-3 text-xs font-semibold hover:bg-muted">Approve</button>
                  <button onClick={() => mod(x.id, "Correction requested")} className="min-h-10 rounded-full border px-3 text-xs font-semibold hover:bg-muted">Request correction</button>
                  <button onClick={() => mod(x.id, "Listing paused")} className="min-h-10 rounded-full border px-3 text-xs font-semibold text-coral hover:bg-muted">Pause</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section data-tour="complaints" className="rounded-3xl border bg-card p-6">
          <div className="flex items-center justify-between"><h2 className="text-2xl">Complaint {adminComplaint.id}</h2><span className={pill(refunded ? "Demo refund issued" : "Open")}>{refunded ? "Demo refund issued" : "Open"}</span></div>
          <p className="mt-1 text-sm">{adminComplaint.issue}</p>
          <ol className="mt-4 space-y-3 border-l-2 border-primary/20 pl-4 text-sm">
            {[...adminComplaint.timeline, ...(refunded ? ["Now · Demo refund issued, case resolved"] : [])].map((t) => (
              <li key={t} className="relative"><span className="absolute -left-[1.4rem] top-1.5 size-2.5 rounded-full bg-primary" />{t}</li>
            ))}
          </ol>
          {!refunded ? <Btn className="mt-4" onClick={() => setRefunded(true)}>Issue demo refund & resolve</Btn> : <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary"><CheckCircle2 className="size-4" /> Resolved</p>}
        </section>
        <section data-tour="impact" className="rounded-3xl bg-primary p-6 text-primary-foreground">
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl">Campus impact</h2><DemoModeBadge label="Demo metrics" /></div>
          <dl className="mt-6 grid grid-cols-2 gap-6">
            {[["1,284", "Meals rescued"], ["612", "Customers served"], ["14 / 18", "Partners participating"], ["~385 kg", "Waste prevented (est.)"]].map(([v, k]) => (
              <div key={k}><dt className="text-xs opacity-75">{k}</dt><dd className="font-display text-3xl text-saffron">{v}</dd></div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
