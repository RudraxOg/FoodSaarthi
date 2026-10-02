import thali from "@/assets/meal-thali.jpg";
import biryani from "@/assets/meal-biryani.jpg";
import bakery from "@/assets/meal-bakery.jpg";

/** Demo mode flag. Synthetic data only — never mixed with production records. */
export const DEMO_MODE = true;

export type Outlet = { id: string; name: string; kind: string; pickupPoint: string; verified: boolean; distance: string };
export type Listing = {
  id: string;
  outletId: string;
  name: string;
  image: string;
  veg: boolean;
  originalPrice: number;
  price: number;
  quantity: number;
  quantityLeft: number;
  preparedAt: string;
  pickupStart: string;
  /** minutes from page load until pickup window closes */
  endsInMin: number;
  allergens: string[];
  ingredients: string;
  packaging: string;
  partnerConfirmed: boolean;
};

export const outlets: Outlet[] = [
  { id: "o1", name: "Annapurna Hostel Mess", kind: "Mess", pickupPoint: "Block C counter, ground floor", verified: true, distance: "350 m" },
  { id: "o2", name: "Royal Bites Canteen", kind: "Canteen", pickupPoint: "Main canteen, window 2", verified: true, distance: "600 m" },
  { id: "o3", name: "Crumb & Co. Bakery", kind: "Bakery", pickupPoint: "Library gate kiosk", verified: true, distance: "900 m" },
  { id: "o4", name: "Chai Point Stall", kind: "Food stall", pickupPoint: "Sports complex entrance", verified: true, distance: "1.2 km" },
];

export const listings: Listing[] = [
  { id: "l1", outletId: "o1", name: "Veg Thali Box", image: thali, veg: true, originalPrice: 120, price: 55, quantity: 12, quantityLeft: 5, preparedAt: "7:30 PM", pickupStart: "9:15 PM", endsInMin: 48, allergens: ["Dairy", "Gluten"], ingredients: "Rice, dal tadka, paneer butter masala, chana sabzi, 2 rotis", packaging: "Sealed kraft box, tamper sticker", partnerConfirmed: true },
  { id: "l2", outletId: "o2", name: "Chicken Biryani", image: biryani, veg: false, originalPrice: 160, price: 79, quantity: 8, quantityLeft: 2, preparedAt: "8:00 PM", pickupStart: "9:30 PM", endsInMin: 14, allergens: ["Dairy"], ingredients: "Basmati rice, chicken, yoghurt marinade, fried onion, spices", packaging: "Sealed container with label", partnerConfirmed: true },
  { id: "l3", outletId: "o3", name: "Bakery Surprise Box", image: bakery, veg: true, originalPrice: 200, price: 89, quantity: 6, quantityLeft: 4, preparedAt: "4:00 PM", pickupStart: "8:45 PM", endsInMin: 95, allergens: ["Gluten", "Dairy", "Egg"], ingredients: "Butter croissants, banana bread, veg puffs", packaging: "Sealed kraft box with paper band", partnerConfirmed: true },
  { id: "l4", outletId: "o1", name: "Rajma Chawal Bowl", image: thali, veg: true, originalPrice: 90, price: 40, quantity: 10, quantityLeft: 0, preparedAt: "7:45 PM", pickupStart: "9:15 PM", endsInMin: 40, allergens: [], ingredients: "Rajma curry, jeera rice, onion salad", packaging: "Sealed bowl with lid", partnerConfirmed: true },
  { id: "l5", outletId: "o2", name: "Egg Curry Combo", image: biryani, veg: false, originalPrice: 110, price: 50, quantity: 6, quantityLeft: 3, preparedAt: "8:10 PM", pickupStart: "9:30 PM", endsInMin: 62, allergens: ["Egg"], ingredients: "Egg curry, steamed rice, papad", packaging: "Sealed container with label", partnerConfirmed: true },
  { id: "l6", outletId: "o4", name: "Samosa & Chai Pack", image: bakery, veg: true, originalPrice: 60, price: 25, quantity: 15, quantityLeft: 9, preparedAt: "6:30 PM", pickupStart: "8:30 PM", endsInMin: 30, allergens: ["Gluten"], ingredients: "2 aloo samosas, chutney, sealed chai cup", packaging: "Sealed paper bag", partnerConfirmed: true },
];

export const PLATFORM_FEE = 5;

export const getListing = (id: string) => listings.find((l) => l.id === id);
export const getOutlet = (id: string) => outlets.find((o) => o.id === id)!;

export type OrderStatus = "Reserved" | "Paid" | "Ready for pickup" | "Completed" | "Cancelled" | "Refunded";
export type Order = { id: string; code: string; listingId: string; qty: number; total: number; saved: number; status: OrderStatus; createdAt: string; demo: true };

export const seedOrders: Order[] = [
  { id: "FS-DEMO1", code: "482 913", listingId: "l1", qty: 1, total: 60, saved: 65, status: "Ready for pickup", createdAt: "Today, 8:52 PM", demo: true },
  { id: "FS-DEMO0", code: "220 417", listingId: "l3", qty: 1, total: 94, saved: 111, status: "Completed", createdAt: "Yesterday, 8:40 PM", demo: true },
  { id: "FS-DEMOX", code: "903 115", listingId: "l2", qty: 1, total: 84, saved: 81, status: "Refunded", createdAt: "Mon, 9:20 PM", demo: true },
];
