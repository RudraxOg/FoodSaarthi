import { useEffect, useState } from "react";
import { seedOrders, type Order } from "./demo-data";

const KEY = "fs_demo_orders";
const listeners = new Set<() => void>();

function read(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addOrder(o: Order) {
  localStorage.setItem(KEY, JSON.stringify([o, ...read()]));
  listeners.forEach((l) => l());
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  useEffect(() => {
    const sync = () => setOrders([...read(), ...seedOrders]);
    sync();
    listeners.add(sync);
    return () => void listeners.delete(sync);
  }, []);
  return orders;
}
