/* Edit this list to change your products. */
export const PRODUCTS = [
  { id: 1,  name: "Leather Bifold Wallet", cat: "Wallets", price: 2200, old: 2800, emoji: "👛", hue: 28 },
  { id: 2,  name: "Slim Card Holder",      cat: "Wallets", price: 1200, emoji: "💳", hue: 200 },
  { id: 3,  name: "Classic Leather Belt",  cat: "Belts",   price: 1800, old: 2200, emoji: "🪢", hue: 20 },
  { id: 4,  name: "Reversible Formal Belt",cat: "Belts",   price: 2400, emoji: "➰", hue: 45 },
  { id: 5,  name: "Steel Analog Watch",    cat: "Watches", price: 5500, old: 6500, emoji: "⌚", hue: 210 },
  { id: 6,  name: "Minimal Black Watch",   cat: "Watches", price: 4200, emoji: "🕰️", hue: 260 },
  { id: 7,  name: "Aviator Sunglasses",    cat: "Eyewear", price: 1900, emoji: "🕶️", hue: 50 },
  { id: 8,  name: "Round Frame Glasses",   cat: "Eyewear", price: 1500, emoji: "👓", hue: 150 },
  { id: 9,  name: "Silk Tie",              cat: "Formal",  price: 1300, emoji: "👔", hue: 350 },
  { id: 10, name: "Cufflinks Set",         cat: "Formal",  price: 1600, old: 1900, emoji: "🔘", hue: 190 },
  { id: 11, name: "Baseball Cap",          cat: "Casual",  price: 900,  emoji: "🧢", hue: 120 },
  { id: 12, name: "Winter Muffler",        cat: "Casual",  price: 1400, emoji: "🧣", hue: 5 }
];
export const CATS = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.cat)))];
export const FREE_OVER = 5000;
export const SHIPPING = 250;
export const rs = n => "Rs. " + n.toLocaleString("en-PK");
export const tile = h => ({ background: `linear-gradient(135deg, hsl(${h} 60% 82%), hsl(${h} 55% 68%))` });
