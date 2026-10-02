/** Synthetic records for partner, admin and future-delivery demos. Never production data. */

export const partnerPickups = [
  { id: "p1", customer: "Aarav S.", item: "Veg Thali Box × 1", code: "482913", due: "by 10:00 PM" },
  { id: "p2", customer: "Meera K.", item: "Veg Thali Box × 2", code: "731062", due: "by 10:00 PM" },
  { id: "p3", customer: "Rohan P.", item: "Rajma Chawal Bowl × 1", code: "559204", due: "by 9:45 PM" },
];

export const partnerStatement = { gross: 2340, commissionRate: 0.1, refunds: 55 };

export type AdminPartner = { id: string; name: string; type: string; fssai: string; status: "Pending review" | "Needs safety clarification" | "Approved" | "Rejected" };
export const adminPartners: AdminPartner[] = [
  { id: "ap1", name: "Green Leaf Café", type: "Café", fssai: "Available · 21XXXXXXXXXX45", status: "Pending review" },
  { id: "ap2", name: "Hostel 7 Night Canteen", type: "Canteen", fssai: "Applied", status: "Needs safety clarification" },
  { id: "ap3", name: "Sweet Crumbs Bakery", type: "Bakery", fssai: "Campus verification pending", status: "Pending review" },
];

export type ModStatus = "Live" | "Listing paused" | "Correction requested" | "Pickup window expired";
export const adminListings: { id: string; name: string; outlet: string; issue?: string; status: ModStatus }[] = [
  { id: "al1", name: "Evening Snack Pack", outlet: "Green Leaf Café", status: "Live" },
  { id: "al2", name: "Paneer Wrap Box", outlet: "Hostel 7 Night Canteen", issue: "Allergen note missing", status: "Live" },
  { id: "al3", name: "Fresh Bakery Sandwich Box", outlet: "Crumb & Co. Bakery", status: "Pickup window expired" },
];

export const adminComplaint = {
  id: "C-1042",
  order: "FS-DEMOX",
  customer: "Fictional customer",
  issue: "Pickup counter closed before window ended",
  timeline: ["9:20 PM · Order paid (simulated)", "9:58 PM · Customer reached counter — closed", "10:04 PM · Complaint raised", "10:15 PM · Outlet confirmed early closure"],
};

export const deliveryTasks = [
  { id: "t1", outlet: "Annapurna Hostel Mess", to: "Library reading hall", window: "9:20 – 9:40 PM", meals: 2 },
  { id: "t2", outlet: "Crumb & Co. Bakery", to: "Hostel B reception", window: "9:30 – 9:50 PM", meals: 1 },
  { id: "t3", outlet: "Royal Bites Canteen", to: "Sports complex desk", window: "9:45 – 10:05 PM", meals: 3 },
];

export const FUTURE_LABEL = "Future pilot concept — not active in the current pickup-first service.";
