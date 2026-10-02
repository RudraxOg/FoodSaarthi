import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Leaf, PiggyBank } from "lucide-react";
import { useOrders } from "@/lib/orders-store";
import { getListing, getOutlet, type OrderStatus } from "@/lib/demo-data";
import { DemoDataNotice } from "@/components/fs/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "My orders — Food Saarthi" },
      { name: "description", content: "Your rescued meal orders, pickup tickets and impact." },
      { property: "og:title", content: "My orders — Food Saarthi" },
      { property: "og:description", content: "Track rescued meals and savings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Orders,
});

export const statusStyle: Record<OrderStatus, string> = {
  Reserved: "bg-muted text-foreground",
  Paid: "bg-accent text-accent-foreground",
  "Ready for pickup": "bg-saffron text-saffron-foreground",
  Completed: "bg-primary text-primary-foreground",
  Cancelled: "bg-muted text-muted-foreground",
  Refunded: "bg-coral/15 text-coral",
};

function Orders() {
  const orders = useOrders();
  const done = orders.filter((o) => o.status !== "Cancelled" && o.status !== "Refunded");
  const meals = done.reduce((a, o) => a + o.qty, 0);
  const saved = done.reduce((a, o) => a + o.saved, 0);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-4xl">My orders</h1>
      <div data-tour="impact" className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
          <Leaf className="size-5 text-saffron" />
          <p className="mt-3 font-display text-4xl">{meals}</p>
          <p className="text-sm opacity-80">Meals rescued</p>
        </div>
        <div className="rounded-3xl bg-saffron p-5 text-saffron-foreground">
          <PiggyBank className="size-5" />
          <p className="mt-3 font-display text-4xl">₹{saved}</p>
          <p className="text-sm opacity-80">Saved so far</p>
        </div>
      </div>
      <div className="mt-4"><DemoDataNotice>Orders and payments here are simulated demo records.</DemoDataNotice></div>
      <ul className="mt-6 space-y-3">
        {orders.map((o) => {
          const l = getListing(o.listingId)!;
          return (
            <li key={o.id}>
              <Link to="/orders/$id" params={{ id: o.id }} className="flex items-center gap-4 rounded-2xl border bg-card p-3 card-lift">
                <img src={l.image} alt="" className="size-16 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.name} × {o.qty}</p>
                  <p className="truncate text-xs text-muted-foreground">{getOutlet(l.outletId).name} · {o.createdAt}</p>
                  <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold", statusStyle[o.status])}>{o.status}</span>
                </div>
                <span className="font-semibold tabular-nums">₹{o.total}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
