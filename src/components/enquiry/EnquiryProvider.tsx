"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { L } from "@/lib/i18n";

export type EnquiryItem = {
  key: string;
  productId: string;
  slug: string;
  name: L;
  variant: L;
  sku: string | null;
  image: string;
  quantity: number;
};

export type GiftBrief = {
  occasion?: string;
  budget?: string;
  quantity?: string;
  personalisation?: string[];
  interests?: string[];
  deadline?: string;
};

export type EnquiryNotice = { id: number; name: L; image: string; more: number };

type EnquiryState = {
  items: EnquiryItem[];
  gift: GiftBrief | null;
  ready: boolean;
  add: (item: Omit<EnquiryItem, "key">) => void;
  update: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setGift: (gift: GiftBrief | null) => void;
  drawer: boolean;
  setDrawer: (open: boolean) => void;
  notice: EnquiryNotice | null;
  dismiss: () => void;
};

const STORAGE_KEY = "dg-enquiry-v1";
const Ctx = createContext<EnquiryState | null>(null);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [gift, setGift] = useState<GiftBrief | null>(null);
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [notice, setNotice] = useState<EnquiryNotice | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved?.items) setItems(saved.items);
      if (saved?.gift) setGift(saved.gift);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, gift }));
  }, [items, gift, ready]);

  const add = useCallback((item: Omit<EnquiryItem, "key">) => {
    const key = `${item.productId}:${item.sku ?? item.variant.en}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i));
      return [...prev, { ...item, key }];
    });
    const now = Date.now();
    setNotice((prev) =>
      prev && now - prev.id < 1000 ? { ...prev, id: now, more: prev.more + 1 } : { id: now, name: item.name, image: item.image, more: 0 },
    );
  }, []);

  const dismiss = useCallback(() => setNotice(null), []);

  const update = useCallback((key: string, quantity: number) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i)));
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => {
    setItems([]);
    setGift(null);
  }, []);

  const value = useMemo(
    () => ({ items, gift, ready, add, update, remove, clear, setGift, drawer, setDrawer, notice, dismiss }),
    [items, gift, ready, add, update, remove, clear, drawer, notice, dismiss],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEnquiry must be used inside EnquiryProvider");
  return ctx;
}
