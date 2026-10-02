import { Ban, Bike, ClipboardCheck, FlaskConical, Info, PackageCheck } from "lucide-react";
import { deliveryTasks, FUTURE_LABEL } from "@/lib/demo-roles";

export function FutureBanner() {
  return (
    <div data-tour="concept-banner" role="note" className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-coral bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
      <Info className="size-5 shrink-0" /> {FUTURE_LABEL}
    </div>
  );
}

export function DeliveryDashboard() {
  return (
    <div className="space-y-6">
      <section data-tour="tasks" className="rounded-3xl border bg-card p-5">
        <div className="flex items-center justify-between"><h2 className="text-xl">Possible future support tasks</h2><span className="inline-flex items-center gap-1 rounded-full bg-saffron/25 px-2.5 py-0.5 text-xs font-semibold"><FlaskConical className="size-3" /> Simulation</span></div>
        <ul className="mt-4 space-y-2">
          {deliveryTasks.map((t) => (
            <li key={t.id} className="flex items-center gap-3 rounded-2xl border border-dashed p-3 text-sm">
              <Bike className="size-5 text-coral" />
              <span className="flex-1"><strong>{t.outlet}</strong> → {t.to}<span className="block text-xs text-muted-foreground">{t.window} · {t.meals} sealed meals · fictional</span></span>
            </li>
          ))}
        </ul>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        <section data-tour="route" className="rounded-3xl border bg-card p-5">
          <h2 className="text-xl">Simulated pickup route</h2>
          <svg viewBox="0 0 300 140" className="mt-3 w-full rounded-2xl bg-accent" role="img" aria-label="Static illustration of a route, not live tracking">
            <path d="M30 110 C 90 20, 160 130, 270 30" fill="none" strokeWidth="4" strokeDasharray="8 8" className="stroke-coral" />
            <circle cx="30" cy="110" r="9" className="fill-primary" /><circle cx="270" cy="30" r="9" className="fill-saffron" />
          </svg>
          <p className="mt-2 text-xs text-muted-foreground">Static illustration — no live tracking.</p>
        </section>
        <section data-tour="handover" className="rounded-3xl bg-secondary p-5">
          <h2 className="text-xl">Safe handover checklist</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex gap-2"><PackageCheck className="size-4 text-primary" /> Pack sealed with tamper sticker intact</li>
            <li className="flex gap-2"><ClipboardCheck className="size-4 text-primary" /> Deadline checked before handover</li>
            <li className="flex gap-2"><ClipboardCheck className="size-4 text-primary" /> Handover record signed (simulation)</li>
          </ul>
          <p className="mt-4 rounded-xl bg-card p-3 text-sm">Estimated meals helped: <strong>6</strong> <span className="text-xs text-muted-foreground">(fictional)</span></p>
        </section>
      </div>
      <section data-tour="not-active" className="flex items-center gap-3 rounded-3xl bg-forest-deep p-5 text-primary-foreground">
        <Ban className="size-6 shrink-0 text-saffron" />
        <p><strong>No real order is assigned.</strong> This service is not active in the Food Saarthi MVP.</p>
      </section>
    </div>
  );
}
