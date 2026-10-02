import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useGuidedDemo } from "@/components/fs/guided-demo";
import { DeliveryDashboard, FutureBanner } from "@/components/fs/delivery";
import { Btn } from "@/components/fs/ui";

export const Route = createFileRoute("/demo/delivery-partner/preview")({
  head: () => ({
    meta: [
      { title: "Future delivery simulation — Food Saarthi" },
      { name: "description", content: "A labelled future-pilot simulation. Delivery is not active in the pickup-first Food Saarthi MVP." },
      { property: "og:title", content: "Future delivery simulation — Food Saarthi" },
      { property: "og:description", content: "Future pilot concept — not active." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => {
    const { start } = useGuidedDemo();
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <FutureBanner />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl md:text-4xl">Simulation dashboard preview</h1>
          <Btn variant="ghost" onClick={() => start("delivery", { fresh: true })}><Sparkles className="size-4" /> Simulation tour</Btn>
        </div>
        <DeliveryDashboard />
      </div>
    );
  },
});
