import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, DemoDataNotice } from "@/components/fs/ui";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Food Saarthi" },
      { name: "description", content: "Raise a question or complaint about a rescued meal order." },
      { property: "og:title", content: "Support — Food Saarthi" },
      { property: "og:description", content: "Get help with your order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Support,
});

function Support() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-4xl">How can we help?</h1>
      <div className="mt-4"><DemoDataNotice>Requests in demo mode are not sent to a real support team.</DemoDataNotice></div>
      {sent ? (
        <p className="rise-in mt-8 rounded-2xl bg-accent p-5 font-medium">Thanks — your request was recorded (simulation).</p>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <label className="block text-sm font-medium">Topic
            <select required className="mt-1 w-full rounded-xl border bg-card px-3 py-2.5">
              <option>Food quality concern</option><option>Pickup issue</option><option>Refund request</option><option>Other</option>
            </select>
          </label>
          <label className="block text-sm font-medium">Details
            <textarea required minLength={10} rows={4} className="mt-1 w-full rounded-xl border bg-card px-3 py-2.5" />
          </label>
          <Btn type="submit" className="w-full">Submit request</Btn>
        </form>
      )}
    </div>
  );
}
