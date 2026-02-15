"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { GlassDefs } from "@/components/ui/glass-defs";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { Waves } from "@/components/ui/wave-background";


/* ===========================
   Data
   =========================== */
interface Product {
  id: number;
  name: string;
  botanical: string | null;
  category: string;
  price: number;
  size: string;
  badge: string | null;
  hue: number;
}

const PRODUCTS: Product[] = [
  { id:1, name:"Bird of Paradise", botanical:"Strelitzia reginae", category:"indigenous-plants", price:89.95, size:"17cm pot", badge:"Featured", hue:28 },
  { id:2, name:"King Protea", botanical:"Protea cynaroides", category:"indigenous-plants", price:249.95, size:"17.5cm pot", badge:"Best Seller", hue:340 },
  { id:3, name:"Spekboom", botanical:"Portulacaria afra", category:"succulents-aloes", price:49.95, size:"17cm pot", badge:"Best Seller", hue:130 },
  { id:4, name:"Spiral Aloe", botanical:"Aloe polyphylla", category:"succulents-aloes", price:349.95, size:"20cm pot", badge:"Rare", hue:115 },
  { id:5, name:"White Stinkwood", botanical:"Celtis africana", category:"trees-shrubs", price:189.95, size:"10L bag", badge:null, hue:105 },
  { id:6, name:"Cape Honeysuckle", botanical:"Tecoma capensis", category:"trees-shrubs", price:54.95, size:"17cm pot", badge:"Best Seller", hue:22 },
  { id:7, name:"Bypass Pruner Pro", botanical:null, category:"tools-equipment", price:289.95, size:"21cm blade", badge:"Featured", hue:210 },
  { id:8, name:"Copper Watering Can", botanical:null, category:"tools-equipment", price:445.00, size:"5L capacity", badge:"New", hue:25 },
  { id:9, name:"Indigenous Plant Mix", botanical:null, category:"soil-compost", price:89.95, size:"30L bag", badge:"Best Seller", hue:35 },
  { id:10, name:"Organic Compost", botanical:null, category:"soil-compost", price:69.95, size:"30L bag", badge:null, hue:30 },
  { id:11, name:"Terracotta Cylinder", botanical:null, category:"pots-planters", price:179.95, size:"30cm diameter", badge:null, hue:18 },
  { id:12, name:"Concrete Bowl Planter", botanical:null, category:"pots-planters", price:325.00, size:"40cm diameter", badge:"New", hue:200 },
  { id:13, name:"Wildflower Seed Mix", botanical:null, category:"seeds-bulbs", price:45.95, size:"50g packet", badge:"Featured", hue:55 },
  { id:14, name:"Agapanthus Bulbs", botanical:"Agapanthus praecox", category:"seeds-bulbs", price:89.95, size:"Pack of 5", badge:null, hue:240 },
  { id:15, name:"Garden Kneeler", botanical:null, category:"tools-equipment", price:195.00, size:"One size", badge:null, hue:90 },
];

const CATEGORIES = [
  { slug:"indigenous-plants", name:"Indigenous Plants", icon:<><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 1.5-.5 1.5-1s0-.5-.5-1c-.5-.5-.5-1-.5-1.5 0-1 1-2 2-2h2.5c3 0 5.5-2.5 5.5-5.5C22 5.5 17.5 2 12 2z"/><circle cx="7.5" cy="11" r="1.5"/><circle cx="10" cy="7.5" r="1.5"/><circle cx="15" cy="7.5" r="1.5"/><circle cx="17" cy="11" r="1.5"/></> },
  { slug:"succulents-aloes", name:"Succulents & Aloes", icon:<><path d="M12 22c-4-3-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-4 9-8 12z"/><path d="M12 6v8"/><path d="m8 10 4 4 4-4"/></> },
  { slug:"trees-shrubs", name:"Trees & Shrubs", icon:<><path d="M12 22V8"/><path d="M5 12H2l10-10 10 10h-3"/><path d="M8 18H4l8-8 8 8h-4"/></> },
  { slug:"tools-equipment", name:"Tools & Equipment", icon:<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/> },
  { slug:"soil-compost", name:"Soil & Compost", icon:<><path d="M2 22h20"/><path d="M6 22V6a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v16"/><path d="M6 12h12"/><path d="M6 16h12"/></> },
  { slug:"pots-planters", name:"Pots & Planters", icon:<><path d="M4 10h16l-2 10H6z"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/></> },
  { slug:"seeds-bulbs", name:"Seeds & Bulbs", icon:<><circle cx="12" cy="12" r="3"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/></> },
];

const TRUST_DATA = [
  { title:"Locally Grown", text:"Every plant nursery-raised in Gauteng and Western Cape.", icon:<><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></> },
  { title:"Expert Advice", text:"Horticulturists on hand for planting guidance and care tips.", icon:<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> },
  { title:"Carbon Neutral", text:"All deliveries offset. Packaging made from recycled materials.", icon:<><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/><path d="M8 12h4l2-3"/><path d="M12 6v2"/></> },
  { title:"30-Day Guarantee", text:"If your plant doesn\u2019t thrive, we\u2019ll replace it \u2014 no questions.", icon:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></> },
];

const REVIEWS = [
  { text:"The King Protea arrived beautifully packaged and is thriving on my stoep. Exceptional quality.", author:"Sarah M., Cape Town", stars:5 },
  { text:"Finally a garden store that understands indigenous. The soil mix is perfect for my fynbos bed.", author:"James K., Johannesburg", stars:5 },
  { text:"Ordered the copper watering can \u2014 it\u2019s even more stunning in person. Studio Garden gets it.", author:"Priya N., Durban", stars:5 },
];

const PRODUCT_DETAILS: Record<number, { description: string; specs: string[] }> = {
  1:  { description: "A striking subtropical icon with bold orange blooms that attract sunbirds year-round.", specs: ["Full sun to part shade", "Water weekly", "Frost-tender"] },
  2:  { description: "South Africa\u2019s national flower. A sculptural showpiece with large, silvery-pink blooms.", specs: ["Full sun", "Low water once established", "Acidic, well-drained soil"] },
  3:  { description: "The ultimate low-maintenance succulent\u2014fast-growing, carbon-absorbing, and drought-proof.", specs: ["Full sun to part shade", "Minimal watering", "Drought-hardy"] },
  4:  { description: "A rare geometric marvel with perfectly spiralled rosettes. Collector\u2019s favourite.", specs: ["Bright indirect light", "Well-drained soil", "Cool highland conditions"] },
  5:  { description: "A graceful indigenous shade tree with a spreading canopy, ideal for larger gardens.", specs: ["Full sun", "Water regularly when young", "Evergreen, frost-hardy"] },
  6:  { description: "Masses of tubular orange flowers from autumn through winter\u2014a hummingbird magnet.", specs: ["Full sun", "Low to moderate water", "Fast-growing, frost-tolerant"] },
  7:  { description: "Professional-grade secateurs with a razor-sharp bypass blade and ergonomic grip.", specs: ["21cm hardened steel blade", "Soft-grip handles", "Lifetime warranty"] },
  8:  { description: "Hand-finished copper with a living patina that deepens over time. Functional art.", specs: ["5L capacity", "Removable brass rose", "Solid copper construction"] },
  9:  { description: "Custom-blended for fynbos, aloes, and indigenous perennials. Low-phosphorus formula.", specs: ["30L resealable bag", "Low phosphorus", "Added mycorrhizae"] },
  10: { description: "Rich, dark compost from locally sourced green waste. SABS-certified organic.", specs: ["30L bag", "Certified organic", "Weed-free, pasteurised"] },
  11: { description: "Classic Italian-style terracotta with a warm, earthy finish that ages beautifully.", specs: ["30cm diameter", "Drainage hole included", "Frost-resistant clay"] },
  12: { description: "Minimalist concrete planter with a raw, contemporary silhouette and smooth finish.", specs: ["40cm diameter", "Lightweight fibre-cement", "UV & weather resistant"] },
  13: { description: "A curated mix of indigenous wildflowers for meadow-style planting and pollinator support.", specs: ["50g covers \u00b115m\u00b2", "Sow spring or autumn", "No fertiliser needed"] },
  14: { description: "Evergreen perennial bulbs producing tall blue flower clusters from late spring.", specs: ["Pack of 5 bulbs", "Full sun to part shade", "Drought-tolerant once established"] },
  15: { description: "Cushioned foam kneeler that doubles as a raised seat. Foldable with tool pouches.", specs: ["Dual-purpose design", "EVA foam cushion", "Steel frame, 120kg rated"] },
};

/* ===========================
   Types
   =========================== */
interface CartItem extends Product {
  quantity: number;
}

/* ===========================
   Icons
   =========================== */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>
);

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
);

/* ===========================
   Main Page Component
   =========================== */
export default function StudioGardenPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fulfilmentMode, setFulfilmentMode] = useState<"delivery" | "collect">("delivery");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const [toastProduct, setToastProduct] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Hero parallax tilt refs
  const heroRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const accentARef = useRef<HTMLDivElement>(null);
  const accentBRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useRef(false);
  const isTouchDevice = useRef(false);
  const shopRef = useRef<HTMLElement>(null);
  const [isInShop, setIsInShop] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Hero image load
  useEffect(() => {
    const img = new Image();
    img.src = "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80&fit=crop&auto=format";
    img.onload = () => setHeroLoaded(true);
  }, []);

  // Hero parallax — detect capabilities + cleanup
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isTouchDevice.current = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setCanAnimate(!prefersReducedMotion.current && !isTouchDevice.current);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion.current || isTouchDevice.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = heroRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (heroBgRef.current)
        heroBgRef.current.style.transform = `perspective(1200px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg) translate(${x * 10}px, ${y * 10}px) scale(1.03)`;
      if (accentARef.current)
        accentARef.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      if (accentBRef.current)
        accentBRef.current.style.transform = `translate(${x * 32}px, ${y * 32}px)`;
    });
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (heroBgRef.current) heroBgRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translate(0,0) scale(1.03)";
    if (accentARef.current) accentARef.current.style.transform = "translate(0,0)";
    if (accentBRef.current) accentBRef.current.style.transform = "translate(0,0)";
  }, []);

  // Intersection observer for reveals
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll(".reveal");
    if (reducedMotion) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    // Stagger
    document.querySelectorAll(".category-grid, .product-grid, .trust-grid, .reviews-row").forEach((grid) => {
      Array.from(grid.children).forEach((child, i) => {
        (child as HTMLElement).style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
      });
    });
    setTimeout(() => els.forEach((el) => observer.observe(el)), 100);
    return () => observer.disconnect();
  }, []);

  // Re-observe product cards after filter changes
  useEffect(() => {
    const cards = document.querySelectorAll(".product-card.reveal:not(.visible)");
    if (cards.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      cards.forEach((el) => el.classList.add("visible"));
      return;
    }

    cards.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const timer = setTimeout(() => cards.forEach((el) => observer.observe(el)), 50);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeCategory, debouncedSearch]);

  // Shop section visibility for FAB
  useEffect(() => {
    if (!shopRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInShop(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(shopRef.current);
    return () => observer.disconnect();
  }, []);

  // Body overflow lock
  useEffect(() => {
    document.body.style.overflow = cartOpen || checkoutOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, checkoutOpen]);

  // Reset clear-cart confirm when drawer closes
  useEffect(() => {
    if (!cartOpen) setClearConfirm(false);
  }, [cartOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (checkoutOpen) setCheckoutOpen(false);
        else if (cartOpen) setCartOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [cartOpen, checkoutOpen]);

  // Debounced search
  const handleSearch = useCallback((val: string) => {
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedSearch(val), 250);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastProduct) return;
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastProduct(null), 1600);
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, [toastProduct]);

  // Cart operations
  const addToCart = useCallback((id: number) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        if (existing.quantity >= 10) return prev;
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToastProduct(product.name);
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i));
    });
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = fulfilmentMode === "collect" ? 0 : subtotal >= 750 ? 0 : 65;
  const total = subtotal + deliveryFee;
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Filter products
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const q = debouncedSearch.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.botanical && p.botanical.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  // Checkout
  const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const inputs = form.querySelectorAll<HTMLInputElement>("input[required]");
    let valid = true;
    inputs.forEach((inp) => {
      inp.classList.remove("invalid");
      if (!inp.value.trim() || (inp.type === "email" && !inp.value.includes("@"))) {
        inp.classList.add("invalid");
        valid = false;
      }
    });
    if (!valid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setCheckoutSuccess(true);
      setIsSubmitting(false);
      setCart([]);
    }, 1500);
  };

  const openCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
    setCheckoutSuccess(false);
    setIsSubmitting(false);
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
    setCheckoutSuccess(false);
  };

  return (
    <div className="sg-page">
      <GlassDefs />
      <a href="#main" className="skip-link">Skip to main content</a>

      {/* ======= HEADER ======= */}
      <header ref={headerRef} className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="sg-container header-inner">
          <a className="brand" href="#">
            <span className="brand-name">Studio Garden</span>
            <span className="brand-tagline">Garden Supply</span>
          </a>
          <div className="header-search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search plants, tools, soil..."
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <div className="delivery-toggle" role="radiogroup" aria-label="Fulfilment method">
              <button
                role="radio"
                aria-checked={fulfilmentMode === "delivery"}
                className={`toggle-option ${fulfilmentMode === "delivery" ? "active" : ""}`}
                onClick={() => setFulfilmentMode("delivery")}
              >
                Delivery
              </button>
              <button
                role="radio"
                aria-checked={fulfilmentMode === "collect"}
                className={`toggle-option ${fulfilmentMode === "collect" ? "active" : ""}`}
                onClick={() => setFulfilmentMode("collect")}
              >
                Collect
              </button>
            </div>
            <button
              className="cart-btn"
              aria-label="Open cart"
              aria-expanded={cartOpen}
              onClick={() => setCartOpen(!cartOpen)}
            >
              <CartIcon />
              <span className={`cart-count ${cartCount > 0 ? "show" : ""}`} aria-live="polite">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
        <div className="sg-container mobile-search">
          <div className="header-search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search plants, tools, soil..."
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* ======= MAIN ======= */}
      <main id="main">
        {/* HERO */}
        <section ref={heroRef} className="hero" aria-label="Welcome" onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}>
          <div ref={heroBgRef} className="hero-bg" data-loaded={heroLoaded ? "true" : undefined} style={{ transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)", willChange: "transform" }} />
          <svg className="hero-leaf" viewBox="0 0 100 300" fill="currentColor" color="rgba(255,255,255,0.9)" aria-hidden="true">
            <path d="M50 0 C20 60, 0 120, 10 180 C15 210, 30 250, 50 300 C70 250, 85 210, 90 180 C100 120, 80 60, 50 0Z" opacity="0.5"/>
            <path d="M50 30 C35 80, 15 130, 25 185 C30 210, 40 245, 50 280" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          </svg>
          <div className="hero-scrim-bl" aria-hidden="true" />
          <div className="hero-scrim-br" aria-hidden="true" />
          <div ref={accentARef} className="hero-accent hero-accent--a" aria-hidden="true" style={{ transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)", willChange: "transform" }}>
            <svg viewBox="0 0 120 280" fill="none">
              <path d="M60 280 C60 220, 35 180, 45 120 C50 80, 75 50, 60 0" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
              <path d="M45 120 C25 100, 15 70, 35 55" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
              <path d="M60 160 C80 140, 90 110, 75 90" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
            </svg>
          </div>
          <div ref={accentBRef} className="hero-accent hero-accent--b" aria-hidden="true" style={{ transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)", willChange: "transform" }}>
            <svg viewBox="0 0 80 160" fill="none">
              <path d="M40 160 C40 120, 20 90, 30 50 C35 30, 50 15, 40 0" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
              <path d="M30 50 C18 38, 12 20, 25 12" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
            </svg>
          </div>
          {canAnimate && (
            <div className="hero-wave-accent" aria-hidden="true">
              <Waves
                className="h-full w-full"
                foregroundColor="rgba(27,67,50,0.25)"
                backgroundColor="transparent"
                speed={0.5}
                amplitude={0}
                peakHeight={30}
              />
            </div>
          )}
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-heading">Rooted in<br/>South African Soil</h1>
              <p className="hero-sub">Indigenous plants, premium tools &amp; organic soil<br/>for outdoor spaces that endure.</p>
            </div>
            <div className="hero-cta">
              <a href="#products">
                <LiquidButton size="xl">Shop the Collection</LiquidButton>
              </a>
              <p className="hero-cta-note">Free delivery on orders over R750</p>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="sg-section" aria-labelledby="cat-heading" id="categories">
          <div className="sg-container">
            <h2 id="cat-heading" className="sg-section-heading reveal">Shop by Category</h2>
            <div className="category-grid">
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  className="category-card glass-surface reveal"
                  data-category={c.slug}
                  aria-pressed={activeCategory === c.slug}
                  aria-label={`Filter by ${c.name}`}
                  onClick={() => {
                    const next = activeCategory === c.slug ? "all" : c.slug;
                    setActiveCategory(next);
                    requestAnimationFrame(() => {
                      const el = document.getElementById("products");
                      if (!el) return;
                      const headerH = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
                      const y = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    });
                  }}
                >
                  <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {c.icon}
                  </svg>
                  <span className="category-label">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section ref={shopRef} className="sg-section sg-section--alt" aria-labelledby="prod-heading" id="products">
          <div className="sg-container">
            <div className="sg-section-heading-row reveal">
              <h2 id="prod-heading" className="sg-section-heading" style={{ marginBottom: 0 }}>Our Collection</h2>
              {activeCategory !== "all" && (
                <div className="active-filter-label">
                  <span>Showing: {CATEGORIES.find((c) => c.slug === activeCategory)?.name}</span>
                  <button className="clear-filter-btn" onClick={() => { setActiveCategory("all"); setSearchQuery(""); setDebouncedSearch(""); }}>
                    View all
                  </button>
                </div>
              )}
            </div>
            <div className="product-grid" role="list">
              {filteredProducts.map((p) => {
                const details = PRODUCT_DETAILS[p.id];
                return (
                  <LiquidGlassCard
                    key={p.id}
                    variant="elevated"
                    className="product-card reveal"
                    role="listitem"
                    style={{ "--hue": p.hue } as React.CSSProperties}
                  >
                    <div className="product-img">
                      <div
                        className="product-img-bg"
                        style={{
                          background: `linear-gradient(135deg, hsla(${p.hue}, 15%, 91%, 1) 0%, hsla(${p.hue}, 12%, 86%, 1) 100%)`,
                        }}
                      />
                      {p.badge && <span className="product-badge">{p.badge}</span>}
                      {details && (
                        <div className="product-overlay" aria-hidden="true">
                          <p className="product-overlay-desc">{details.description}</p>
                          <ul className="product-overlay-specs">
                            {details.specs.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{p.name}</h3>
                      <p className="product-botanical">{p.botanical || "\u00A0"}</p>
                      <p className="product-size">{p.size}</p>
                      <div className="product-footer">
                        <span className="product-price">R{p.price.toFixed(2)}</span>
                        <LiquidButton
                          size="sm"
                          onClick={() => addToCart(p.id)}
                          aria-label={`Add ${p.name} to cart`}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <PlusIcon /> Add
                          </span>
                        </LiquidButton>
                      </div>
                    </div>
                  </LiquidGlassCard>
                );
              })}
            </div>
            {filteredProducts.length === 0 && (
              <p className="no-results show">No products match your search.</p>
            )}
          </div>
        </section>

        {/* TRUST / REVIEWS */}
        <section className="sg-section" aria-labelledby="trust-heading" id="trust">
          <div className="sg-container">
            <h2 id="trust-heading" className="sg-section-heading reveal">Why Gardeners Trust Us</h2>
            <div className="trust-grid">
              {TRUST_DATA.map((t) => (
                <div key={t.title} className="trust-card glass-surface reveal">
                  <svg className="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {t.icon}
                  </svg>
                  <h3 className="trust-title">{t.title}</h3>
                  <p className="trust-text">{t.text}</p>
                </div>
              ))}
            </div>
            <div className="reviews-row">
              {REVIEWS.map((r) => (
                <blockquote key={r.author} className="review-card glass-surface reveal">
                  <div className="review-stars" aria-label={`${r.stars} out of 5 stars`}>
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <p className="review-text">&ldquo;{r.text}&rdquo;</p>
                  <cite className="review-author">&mdash; {r.author}</cite>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ======= FOOTER ======= */}
      <footer className="site-footer">
        <div className="sg-container footer-inner">
          <div className="footer-brand">
            <span className="brand-name">Studio Garden</span>
            <p>Premium garden supplies rooted in South African soil. Curated for gardeners who value quality.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#categories">Indigenous Plants</a></li>
              <li><a href="#categories">Succulents &amp; Aloes</a></li>
              <li><a href="#categories">Tools &amp; Equipment</a></li>
              <li><a href="#categories">Soil &amp; Compost</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <ul>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Nursery Visits</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><a href="#">Delivery &amp; Returns</a></li>
              <li><a href="#">Plant Care Guides</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Studio Garden. All rights reserved.</p>
            <p>All prices in ZAR (R). Delivery to all major South African cities.</p>
          </div>
        </div>
      </footer>

      {/* ======= CART DRAWER ======= */}
      <aside
        className={`cart-drawer ${cartOpen ? "open" : ""}`}
        aria-label="Shopping cart"
        aria-hidden={!cartOpen}
        role="dialog"
      >
        <div className="cart-overlay" aria-hidden="true" onClick={() => setCartOpen(false)} />
        <div className="cart-panel glass-panel">
          <div className="cart-drag-handle" aria-hidden="true" />
          <div className="cart-header">
            <h2>Your Cart</h2>
            <button className="cart-close" aria-label="Close cart" onClick={() => setCartOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="cart-body">
            {cartCount === 0 ? (
              <div className="cart-empty">
                <CartIcon />
                <p style={{ marginTop: "12px" }}>Your cart is empty</p>
                <button
                  className="sg-btn sg-btn--ghost"
                  style={{ marginTop: "16px" }}
                  onClick={() => setCartOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="cart-items" role="list">
                {cart.map((i) => (
                  <div key={i.id} className="cart-item" role="listitem">
                    <div className="cart-item-img">
                      <div
                        className="cart-item-img-bg"
                        style={{
                          background: `linear-gradient(135deg, hsla(${i.hue},25%,90%,1), hsla(${i.hue},18%,84%,1))`,
                        }}
                      />
                    </div>
                    <div>
                      <div className="cart-item-name">{i.name}</div>
                      <div className="cart-item-meta">{i.size}</div>
                    </div>
                    <div className="cart-item-right">
                      <span className="cart-item-price">R{(i.price * i.quantity).toFixed(2)}</span>
                      <div className="qty-controls">
                        <button className="qty-btn" aria-label={`Decrease quantity of ${i.name}`} onClick={() => updateQuantity(i.id, -1)}>&minus;</button>
                        <span className="qty-val" aria-live="polite">{i.quantity}</span>
                        <button className="qty-btn" aria-label={`Increase quantity of ${i.name}`} onClick={() => updateQuantity(i.id, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cartCount > 0 && (
            <div className="cart-footer-section">
              <div className="cart-actions">
                <button
                  className="sg-btn sg-btn--ghost"
                  onClick={() => setCartOpen(false)}
                >
                  Continue Shopping
                </button>
                {!clearConfirm ? (
                  <button
                    className="cart-clear-btn"
                    onClick={() => setClearConfirm(true)}
                  >
                    Clear cart
                  </button>
                ) : (
                  <span className="cart-clear-confirm" role="alert">
                    Clear all items?
                    <button
                      className="cart-clear-confirm-btn cancel"
                      onClick={() => setClearConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="cart-clear-confirm-btn destructive"
                      onClick={() => { setCart([]); setClearConfirm(false); }}
                    >
                      Clear
                    </button>
                  </span>
                )}
              </div>
              <div className="cart-delivery-note" aria-live="polite">
                {fulfilmentMode === "collect"
                  ? "Free collection from our Centurion store"
                  : deliveryFee > 0
                    ? `Delivery fee: R${deliveryFee.toFixed(2)} (free over R750)`
                    : "Free delivery on this order"}
              </div>
              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-amount">R{total.toFixed(2)}</span>
              </div>
              <LiquidButton
                size="lg"
                onClick={openCheckout}
                className="w-full justify-center"
              >
                Proceed to Checkout
              </LiquidButton>
            </div>
          )}
        </div>
      </aside>

      {/* ======= CHECKOUT MODAL ======= */}
      <div
        className={`modal-overlay ${checkoutOpen ? "open" : ""}`}
        aria-hidden={!checkoutOpen}
        role="dialog"
        aria-labelledby="checkout-heading"
        aria-modal="true"
        onClick={(e) => { if (e.target === e.currentTarget) closeCheckout(); }}
      >
        <div className="modal-panel glass-panel">
          <div className="modal-header">
            <h2 id="checkout-heading">Checkout</h2>
            <button className="modal-close" aria-label="Close checkout" onClick={closeCheckout}>
              <CloseIcon />
            </button>
          </div>
          {!checkoutSuccess ? (
            <form onSubmit={handleCheckout} noValidate>
              <fieldset>
                <legend>Contact Details</legend>
                <div className="form-field">
                  <label htmlFor="co-name">Full Name</label>
                  <input type="text" id="co-name" required autoComplete="name" />
                </div>
                <div className="form-field">
                  <label htmlFor="co-email">Email</label>
                  <input type="email" id="co-email" required autoComplete="email" />
                </div>
                <div className="form-field">
                  <label htmlFor="co-phone">Phone</label>
                  <input type="tel" id="co-phone" required autoComplete="tel" />
                </div>
              </fieldset>
              {fulfilmentMode === "delivery" && (
                <fieldset>
                  <legend>Delivery Address</legend>
                  <div className="form-field">
                    <label htmlFor="co-address">Street Address</label>
                    <input type="text" id="co-address" required autoComplete="street-address" />
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="co-city">City</label>
                      <input type="text" id="co-city" required autoComplete="address-level2" />
                    </div>
                    <div className="form-field">
                      <label htmlFor="co-postal">Postal Code</label>
                      <input type="text" id="co-postal" required autoComplete="postal-code" />
                    </div>
                  </div>
                </fieldset>
              )}
              <div className="checkout-summary">
                <p className="checkout-summary-items">
                  {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
                </p>
                <div className="checkout-summary-row">
                  <span>Subtotal</span><span>R{subtotal.toFixed(2)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>{fulfilmentMode === "delivery" ? "Delivery" : "Collection"}</span>
                  <span>{fulfilmentMode === "delivery" ? (deliveryFee > 0 ? `R${deliveryFee.toFixed(2)}` : "Free") : "Free"}</span>
                </div>
                <div className="checkout-summary-row total">
                  <span>Total</span><span>R{total.toFixed(2)}</span>
                </div>
              </div>
              <LiquidButton
                size="lg"
                className={`w-full justify-center ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
              >
                {isSubmitting ? "Processing..." : "Place Order (Simulated)"}
              </LiquidButton>
              <button
                type="button"
                className="checkout-continue"
                onClick={() => {
                  closeCheckout();
                  document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Continue Shopping
              </button>
            </form>
          ) : (
            <div className="checkout-success" role="alert">
              <CheckIcon />
              <h3>Order Placed!</h3>
              <p>This is a simulated checkout. No payment was processed and no real order was created.</p>
              <LiquidButton size="lg" onClick={closeCheckout}>
                Continue Shopping
              </LiquidButton>
            </div>
          )}
        </div>
      </div>

      {/* Add-to-cart toast */}
      <div
        className={`cart-toast ${toastProduct ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        Added to cart
      </div>

      {/* Floating cart button */}
      <button
        className={`cart-fab ${isInShop && cartCount > 0 ? "show" : ""}`}
        aria-label="Open cart"
        aria-hidden={!(isInShop && cartCount > 0)}
        tabIndex={isInShop && cartCount > 0 ? 0 : -1}
        onClick={() => setCartOpen(true)}
      >
        <CartIcon />
        {cartCount > 0 && (
          <span className="cart-fab-badge" aria-hidden="true">{cartCount}</span>
        )}
      </button>
    </div>
  );
}
