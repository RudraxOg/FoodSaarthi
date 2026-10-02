import { createFileRoute, Link } from "@tanstack/react-router";
import { HowItWorksStory } from "./index";
import { btnClass } from "@/components/fs/ui";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Food Saarthi" },
      { name: "description", content: "Partners list sealed surplus, you reserve and pay, then collect within a fixed pickup window." },
      { property: "og:title", content: "How it works — Food Saarthi" },
      { property: "og:description", content: "Pickup-first surplus meal rescue in three steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-4xl md:text-6xl">Simple for students. Fair for outlets.</h1>
        <p className="mt-4 text-muted-foreground">Food Saarthi is pickup-first: no delivery fleet, no waiting — just a fixed window at a counter you already know.</p>
      </div>
      <HowItWorksStory />
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <Link to="/demo" className={btnClass("primary")}>Try the guided demo</Link>
      </div>
    </>
  ),
});
