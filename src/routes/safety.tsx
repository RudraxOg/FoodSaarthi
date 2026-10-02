import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Ban, ClipboardList, Clock, Package, LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Food safety — Food Saarthi" },
      { name: "description", content: "Only verified partners list sealed, unserved, labelled surplus within a timed pickup window." },
      { property: "og:title", content: "Food safety — Food Saarthi" },
      { property: "og:description", content: "How Food Saarthi keeps rescued meals safe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Safety,
});

const rules = [
  { i: BadgeCheck, t: "Verified partners only", d: "Outlets submit licence documents and are reviewed before their first listing." },
  { i: Package, t: "Sealed and unserved", d: "Only correctly packed food that was never served may be listed." },
  { i: ClipboardList, t: "Fully labelled", d: "Veg status, ingredients, allergens and preparation time are mandatory fields." },
  { i: Clock, t: "Timed pickup", d: "Listings expire automatically when the pickup window closes." },
  { i: Ban, t: "Never listable", d: "Expired, unsafe, served or unlabelled food is blocked at creation." },
  { i: LifeBuoy, t: "Complaint path", d: "Every order has a support route with tracked refunds." },
];

function Safety() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="max-w-2xl text-4xl md:text-6xl">Rescued doesn't mean compromised.</h1>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rules.map((r) => (
          <div key={r.t} className="rounded-3xl border bg-card p-6">
            <r.i className="size-6 text-primary" />
            <h2 className="mt-4 font-sans text-lg font-semibold">{r.t}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{r.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
