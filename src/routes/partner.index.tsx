import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BadgeCheck, CheckCircle2, Plus, Sparkles, Wallet } from "lucide-react";
import { useGuidedDemo } from "@/components/fs/guided-demo";
import { Btn, DeadlineChip, DemoDataNotice, VegMark, btnClass } from "@/components/fs/ui";
import { CheckRow, inputClass } from "@/components/fs/forms";
import { listings } from "@/lib/demo-data";
import { partnerPickups, partnerStatement } from "@/lib/demo-roles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/partner/")({
  head: () => ({
    meta: [
      { title: "Partner workspace — Food Saarthi" },
      { name: "description", content: "Manage rescued-meal listings, verify pickups and see payouts." },
      { property: "og:title", content: "Partner workspace — Food Saarthi" },
      { property: "og:description", content: "A simple workspace for busy mess and stall owners (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PartnerHome,
});

function PartnerHome() {
  const { start } = useGuidedDemo();
  const mine = listings.filter((l) => l.outletId === "o1");
  const [qty, setQty] = useState<Record<string, number>>(Object.fromEntries(mine.map((l) => [l.id, l.quantityLeft])));
  const [paused, setPaused] = useState<Record<string, boolean>>({});

  // Simulated real-time reservations on the first listing.
  useEffect(() => {
    const t = setInterval(() => setQty((q) => ({ ...q, l1: Math.max(1, (q['l1'] ?? 1) - 1) })), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Annapurna Hostel Mess</p>
          <h1 className="text-4xl">Tonight's surplus</h1>
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={() => start("partner", { fresh: true })}><Sparkles className="size-4" /> Partner tour</Btn>
          <Link to="/partner/listings/new" className={btnClass("primary")}><Plus className="size-4" /> Create listing</Link>
        </div>
      </div>
      <div className="mt-4"><DemoDataNotice>Partner workspace in demo mode — fictional outlet, orders and payouts.</DemoDataNotice></div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section data-tour="verification" className="rounded-3xl bg-primary p-6 text-primary-foreground">
          <BadgeCheck className="size-7 text-saffron" />
          <p className="mt-4 text-sm opacity-80">Verification status</p>
          <p className="font-display text-2xl">Approved (demo)</p>
          <p className="mt-2 text-sm opacity-80">FSSAI on file · Safety declaration signed · Pickup point: Block C counter</p>
        </section>
        <section className="rounded-3xl border bg-card p-6 lg:col-span-2">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[["Active listings", mine.filter((l) => !paused[l.id] && (qty[l.id] ?? 0) > 0).length], ["Pending pickups", partnerPickups.length], ["Completed today", 7]].map(([k, v]) => (
              <div key={k as string}><p className="font-display text-4xl text-primary">{v}</p><p className="text-xs text-muted-foreground">{k}</p></div>
            ))}
          </div>
        </section>
      </div>

      <section data-tour="inventory" className="mt-6 rounded-3xl border bg-card p-6">
        <h2 className="text-2xl">Live inventory</h2>
        <ul className="mt-4 divide-y">
          {mine.map((l) => {
            const q = qty[l.id] ?? 0;
            const status = paused[l.id] ? "Paused" : q === 0 ? "Sold out" : "Active";
            return (
              <li key={l.id} className="flex flex-wrap items-center gap-4 py-3">
                <img src={l.image} alt="" className="size-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-semibold"><VegMark veg={l.veg} /> {l.name}</p>
                  <p className="text-xs text-muted-foreground">₹{l.price} · auto-closes at pickup end</p>
                </div>
                <span aria-live="polite" className="w-20 text-center"><span className="block font-display text-2xl tabular-nums">{q}</span><span className="text-[11px] text-muted-foreground">left</span></span>
                <DeadlineChip endsInMin={l.endsInMin} soldOut={q === 0} />
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", status === "Active" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>{status}</span>
                {q > 0 && <button onClick={() => setPaused((p) => ({ ...p, [l.id]: !p[l.id] }))} className="min-h-10 rounded-full border px-4 text-xs font-semibold hover:bg-muted">{paused[l.id] ? "Resume" : "Pause"}</button>}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <PickupQueue />
        <section data-tour="payouts" className="rounded-3xl bg-secondary p-6">
          <h2 className="flex items-center gap-2 text-2xl"><Wallet className="size-5" /> Payout statement</h2>
          <p className="text-xs text-muted-foreground">This week · simulated</p>
          {(() => {
            const c = Math.round(partnerStatement.gross * partnerStatement.commissionRate);
            const net = partnerStatement.gross - c - partnerStatement.refunds;
            return (
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt>Gross sales</dt><dd className="tabular-nums">₹{partnerStatement.gross}</dd></div>
                <div className="flex justify-between"><dt>Platform commission (10%)</dt><dd className="tabular-nums">− ₹{c}</dd></div>
                <div className="flex justify-between"><dt>Refunds</dt><dd className="tabular-nums">− ₹{partnerStatement.refunds}</dd></div>
                <div className="flex justify-between border-t border-foreground/10 pt-3 text-base font-semibold"><dt>Net payout</dt><dd className="font-display text-2xl text-primary">₹{net}</dd></div>
              </dl>
            );
          })()}
          <p className="mt-4 rounded-xl bg-card p-3 text-sm">42 meals rescued this week instead of going to waste (demo).</p>
        </section>
      </div>
    </div>
  );
}

function PickupQueue() {
  const [code, setCode] = useState("");
  const [match, setMatch] = useState<(typeof partnerPickups)[number] | null>(null);
  const [error, setError] = useState("");
  const [checks, setChecks] = useState([false, false, false]);
  const [done, setDone] = useState<string[]>([]);

  const verify = () => {
    const m = partnerPickups.find((p) => p.code === code.replace(/\s/g, ""));
    if (!m) return setError("No pending pickup with that code. Check the customer's ticket.");
    if (done.includes(m.id)) return setError("This pickup was already completed.");
    setError(""); setMatch(m); setChecks([false, false, false]);
  };

  return (
    <section data-tour="pickup-queue" className="rounded-3xl border bg-card p-6">
      <h2 className="text-2xl">Pickup queue</h2>
      <p className="text-xs text-muted-foreground">Try code 482913 (simulated)</p>
      <div className="mt-4 flex gap-2">
        <input aria-label="Customer pickup code" inputMode="numeric" maxLength={7} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter 6-digit code" className={inputClass} />
        <Btn onClick={verify} className="shrink-0">Verify</Btn>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
      {match && (
        <div className="rise-in mt-4 space-y-2 rounded-2xl bg-accent/50 p-4">
          <p className="font-semibold">{match.customer} · {match.item}</p>
          {["Pack is sealed and labelled", "Customer showed matching code", "Within pickup window"].map((t, i) => (
            <CheckRow key={t} checked={checks[i]!} onChange={(b) => setChecks((c) => c.map((x, j) => (j === i ? b : x)))}>{t}</CheckRow>
          ))}
          <Btn className="w-full" disabled={!checks.every(Boolean)} onClick={() => { setDone((d) => [...d, match.id]); setMatch(null); setCode(""); }}>Confirm handover</Btn>
        </div>
      )}
      <ul className="mt-4 space-y-2">
        {partnerPickups.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
            <span>{p.customer} · {p.item}</span>
            {done.includes(p.id) ? <span className="flex items-center gap-1 text-xs font-semibold text-primary"><CheckCircle2 className="size-4" /> Completed</span> : <span className="text-xs text-muted-foreground">{p.due}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
