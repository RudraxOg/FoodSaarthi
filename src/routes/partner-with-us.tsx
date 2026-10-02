import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { btnClass } from "@/components/fs/ui";

export const Route = createFileRoute("/partner-with-us")({
  head: () => ({
    meta: [
      { title: "Partner with us — Food Saarthi" },
      { name: "description", content: "Messes, canteens, cafés and bakeries: turn end-of-day surplus into value with timed pickups." },
      { property: "og:title", content: "Partner with us — Food Saarthi" },
      { property: "og:description", content: "Turn end-of-day surplus into value." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground md:p-14">
        <h1 className="max-w-2xl text-4xl md:text-6xl">Turn end-of-day surplus into value.</h1>
        <p className="mt-4 max-w-lg opacity-80">List sealed, unserved meals in under a minute. Students collect within your pickup window — no delivery to manage.</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {["Quick verification with your food licence", "List with photo, price and pickup window", "Verify pickups with a 6-digit code", "Clear statements: sales, commission, net payout"].map((x) => (
            <li key={x} className="flex gap-2 text-sm"><Check className="size-5 shrink-0 text-saffron" /> {x}</li>
          ))}
        </ul>
        <Link to="/demo" className={btnClass("saffron") + " mt-10"}>Preview the partner workspace</Link>
      </div>
    </div>
  ),
});
