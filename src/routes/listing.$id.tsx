import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, BadgeCheck, ChefHat, Clock, MapPin, Minus, Package, Plus, ShieldCheck } from "lucide-react";
import { getListing, getOutlet, PLATFORM_FEE } from "@/lib/demo-data";
import { addOrder } from "@/lib/orders-store";
import { Btn, CountdownRing, DemoModeBadge, VegMark } from "@/components/fs/ui";

export const Route = createFileRoute("/listing/$id")({
  loader: ({ params }) => {
    const l = getListing(params.id);
    if (!l) throw notFound();
    return { l };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.l.name ?? "Meal"} — Food Saarthi` },
      { name: "description", content: `Rescued ${loaderData?.l.name} for ₹${loaderData?.l.price}. Pickup from a verified outlet.` },
      { property: "og:title", content: `${loaderData?.l.name ?? "Meal"} — Food Saarthi` },
      { property: "og:description", content: "Safe, sealed surplus meal with a fixed pickup window." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-3xl">This meal is no longer available</h1>
      <Link to="/explore" className="mt-4 inline-block font-semibold text-primary">Browse other meals →</Link>
    </div>
  ),
  errorComponent: () => <p className="py-24 text-center">Couldn't load this meal.</p>,
  component: ListingPage,
});

function ListingPage() {
  const { l } = Route.useLoaderData();
  const o = getOutlet(l.outletId);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState(false);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();
  const soldOut = l.quantityLeft === 0;
  const subtotal = l.price * qty;
  const total = subtotal + PLATFORM_FEE;

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      const id = "FS-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      addOrder({ id, code: String(Math.floor(100000 + Math.random() * 900000)).replace(/(\d{3})(\d{3})/, "$1 $2"), listingId: l.id, qty, total, saved: (l.originalPrice - l.price) * qty, status: "Paid", createdAt: "Just now", demo: true });
      navigate({ to: "/orders/$id", params: { id } });
    }, 900);
  };

  const fields = [
    { i: ChefHat, k: "Prepared at", v: l.preparedAt },
    { i: Clock, k: "Pickup window", v: `${l.pickupStart} onwards` },
    { i: Package, k: "Packaging", v: l.packaging },
    { i: MapPin, k: "Pickup point", v: o.pickupPoint },
  ];

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <img src={l.image} alt={l.name} width={912} height={736} className="aspect-[5/4] w-full rounded-3xl object-cover shadow-soft" />
        <section data-tour="safety-fields" className="mt-6 rounded-3xl border bg-card p-6">
          <h2 className="flex items-center gap-2 text-xl"><ShieldCheck className="size-5 text-primary" /> Safety & pickup details</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.k} className="flex gap-3">
                <f.i className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div><dt className="text-xs text-muted-foreground">{f.k}</dt><dd className="text-sm font-medium">{f.v}</dd></div>
              </div>
            ))}
          </dl>
          <div className="mt-5 rounded-2xl bg-coral/10 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-coral"><AlertTriangle className="size-4" /> Allergen & ingredient alert</p>
            <p className="mt-1 text-sm">{l.allergens.length ? `Contains: ${l.allergens.join(", ")}` : "No common allergens declared"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{l.ingredients}</p>
          </div>
          {l.partnerConfirmed && (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-primary"><BadgeCheck className="size-4" /> Partner confirmed: safe, unserved and sealed</p>
          )}
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <VegMark veg={l.veg} /> {l.veg ? "Veg" : "Non-veg"} · {o.name}
            {o.verified && <BadgeCheck className="size-4 text-primary" aria-label="Verified outlet" />}
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl">{l.name}</h1>
          <div className="mt-5 flex items-center justify-between gap-4">
            <div data-tour="price">
              <p className="flex items-baseline gap-3">
                <span className="font-display text-5xl font-semibold text-primary">₹{l.price}</span>
                <span className="text-lg text-muted-foreground line-through">₹{l.originalPrice}</span>
              </p>
              <p className="mt-1 inline-block rounded-full bg-saffron/30 px-2.5 py-0.5 text-sm font-semibold text-saffron-foreground">You save ₹{l.originalPrice - l.price}</p>
            </div>
            <CountdownRing endsInMin={l.endsInMin} />
          </div>

          <div data-tour="reserve" className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-muted p-2">
              <button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} disabled={soldOut || qty <= 1} className="flex size-10 items-center justify-center rounded-xl bg-card disabled:opacity-40"><Minus className="size-4" /></button>
              <span className="text-center"><span className="block text-lg font-bold tabular-nums">{qty}</span><span className="text-xs text-muted-foreground">{l.quantityLeft} left</span></span>
              <button aria-label="Increase quantity" onClick={() => setQty(Math.min(l.quantityLeft, qty + 1))} disabled={soldOut || qty >= l.quantityLeft} className="flex size-10 items-center justify-center rounded-xl bg-card disabled:opacity-40"><Plus className="size-4" /></button>
            </div>
            {qty >= l.quantityLeft && !soldOut && <p className="text-xs text-coral">That's all the remaining stock.</p>}
            {!review ? (
              <Btn className="w-full" disabled={soldOut} onClick={() => setReview(true)}>{soldOut ? "Sold out — all rescued" : `Reserve · ₹${total}`}</Btn>
            ) : (
              <div className="rise-in space-y-3 rounded-2xl border p-4">
                <div className="flex items-center justify-between"><p className="font-semibold">Order review</p><DemoModeBadge label="Simulated payment" /></div>
                <div className="space-y-1 text-sm">
                  <Row k={`${l.name} × ${qty}`} v={`₹${subtotal}`} />
                  <Row k="Platform fee" v={`₹${PLATFORM_FEE}`} />
                  <div className="border-t pt-2"><Row k={<strong>Final total</strong>} v={<strong>₹{total}</strong>} /></div>
                </div>
                <p className="flex items-center gap-2 rounded-xl bg-muted p-3 text-xs"><Clock className="size-4 shrink-0" /> Collect from {o.pickupPoint} before the pickup window closes.</p>
                <Btn variant="saffron" className="w-full" onClick={pay} disabled={paying}>{paying ? "Confirming…" : "Confirm simulated payment"}</Btn>
                <button onClick={() => setReview(false)} className="w-full text-sm text-muted-foreground">Change quantity</button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="tabular-nums">{v}</span></div>;
}
