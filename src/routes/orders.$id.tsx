import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, IdCard, MapPin, ShoppingBag, Star, Clock } from "lucide-react";
import { useOrders } from "@/lib/orders-store";
import { getListing, getOutlet } from "@/lib/demo-data";
import { DeadlineChip, DemoModeBadge, btnClass } from "@/components/fs/ui";
import { statusStyle } from "./orders.index";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Pickup ticket — Food Saarthi" },
      { name: "description", content: "Show this pickup code at the outlet counter to collect your rescued meal." },
      { property: "og:title", content: "Pickup ticket — Food Saarthi" },
      { property: "og:description", content: "Your rescued meal pickup ticket." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ticket,
});

/** Decorative pseudo-QR derived from the code (demo only). */
function PseudoQR({ seed }: { seed: string }) {
  const cells = Array.from({ length: 121 }, (_, i) => ((seed.charCodeAt(i % seed.length) * (i + 7)) % 5) < 2);
  return (
    <div className="grid grid-cols-11 gap-[2px] rounded-xl bg-card p-3" aria-label="Pickup QR code (simulated)" role="img">
      {cells.map((on, i) => <span key={i} className={cn("aspect-square rounded-[1px]", on ? "bg-forest-deep" : "bg-transparent")} />)}
    </div>
  );
}

function Ticket() {
  const { id } = Route.useParams();
  const orders = useOrders();
  const o = orders.find((x) => x.id === id);
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(0);
  if (!o) return <div className="py-24 text-center"><p className="text-lg">Order not found.</p><Link to="/orders" className="font-semibold text-primary">Back to orders</Link></div>;
  const l = getListing(o.listingId)!;
  const out = getOutlet(l.outletId);
  const active = o.status === "Paid" || o.status === "Ready for pickup";

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      {o.status === "Paid" && <p className="rise-in mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-primary"><Check className="size-4" /> Simulated payment confirmed</p>}
      <div data-tour="ticket" className="rise-in overflow-hidden rounded-[2rem] bg-primary text-primary-foreground shadow-lift">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyle[o.status])}>{o.status}</span>
            <DemoModeBadge label="Simulation" />
          </div>
          <h1 className="mt-4 text-3xl">{l.name} × {o.qty}</h1>
          <p className="text-sm opacity-80">{out.name}</p>
          {active && <div className="mt-4"><DeadlineChip endsInMin={l.endsInMin} /></div>}
        </div>
        <div className="relative border-t-2 border-dashed border-primary-foreground/25 bg-forest-deep p-6">
          <span className="absolute -left-4 -top-4 size-8 rounded-full bg-background" aria-hidden />
          <span className="absolute -right-4 -top-4 size-8 rounded-full bg-background" aria-hidden />
          <div className="flex items-center gap-5">
            <div className="w-32 shrink-0"><PseudoQR seed={o.code + o.id} /></div>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-70">Pickup code</p>
              <p className="font-display text-3xl tabular-nums tracking-wider text-saffron">{o.code}</p>
              <button onClick={() => { navigator.clipboard?.writeText(o.code.replace(" ", "")); setCopied(true); }} className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold hover:bg-primary-foreground/20">
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />} {copied ? "Copied" : "Copy code"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-6 space-y-4 rounded-3xl border bg-card p-5">
        <div className="flex gap-3"><MapPin className="size-5 shrink-0 text-coral" /><div><p className="font-semibold">{out.pickupPoint}</p><p className="text-sm text-muted-foreground">{out.name} · {out.distance} away</p></div></div>
        <div className="relative h-28 overflow-hidden rounded-2xl bg-accent" aria-label="Map preview (illustrative)">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:22px_22px]" />
          <span className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-coral text-coral-foreground shadow-lift"><MapPin className="size-4" /></span>
        </div>
        <div>
          <p className="font-semibold">What to bring</p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex gap-2"><IdCard className="size-4" /> Your college ID</li>
            <li className="flex gap-2"><ShoppingBag className="size-4" /> A carry bag</li>
            <li className="flex gap-2"><Clock className="size-4" /> Arrive before the window closes</li>
          </ul>
        </div>
        <div className="flex justify-between border-t pt-3 text-sm"><span>Total paid (simulated)</span><strong>₹{o.total}</strong></div>
      </section>

      {o.status === "Completed" && (
        <section className="mt-6 rounded-3xl border bg-card p-5">
          <p className="font-semibold">Rate this meal</p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}><Star className={cn("size-7", n <= rating ? "fill-saffron text-saffron" : "text-muted-foreground")} /></button>
            ))}
          </div>
        </section>
      )}
      <div className="mt-6 flex gap-3">
        <Link to="/orders" className={btnClass("outline") + " flex-1"}>All orders</Link>
        <Link to="/support" className={btnClass("ghost") + " flex-1"}>Get help</Link>
      </div>
    </div>
  );
}
