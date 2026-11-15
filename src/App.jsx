import { useState, useEffect, useMemo } from "react";
import { PRODUCTS, CATS, FREE_OVER, SHIPPING, rs, tile } from "./data";
import { Totals, CartView, Checkout, Done } from "./components/Cart";

function loadCart() { try { return JSON.parse(localStorage.getItem("ansari-cart") || "{}"); } catch (e) { return {}; } }

export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("default");
  const [view, setView] = useState(null); // null | "cart" | "checkout" | "done"
  const [order, setOrder] = useState(null);
  const [toast, setToast] = useState("");
  const [theme, setTheme] = useState(null);

  useEffect(() => { try { localStorage.setItem("ansari-cart", JSON.stringify(cart)); } catch (e) {} }, [cart]);
  useEffect(() => { if (theme) document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 1600); return () => clearTimeout(t); }, [toast]);

  const items = Object.keys(cart).map(id => ({ ...PRODUCTS.find(p => p.id === +id), qty: cart[id] })).filter(i => i.id);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_OVER ? 0 : SHIPPING;
  const total = subtotal + shipping;

  const list = useMemo(() => {
    let r = PRODUCTS.filter(p => (cat === "All" || p.cat === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()));
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [cat, q, sort]);

  const add = p => { setCart(c => ({ ...c, [p.id]: (c[p.id] || 0) + 1 })); setToast(p.name + " added to cart"); };
  const setQty = (id, n) => setCart(c => { const x = { ...c }; if (n <= 0) delete x[id]; else x[id] = n; return x; });
  const toggleTheme = () => {
    const dark = theme ? theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(dark ? "light" : "dark");
  };
  const place = info => {
    setOrder({ id: "AC-" + Math.floor(10000 + Math.random() * 90000), info, items, total });
    setCart({}); setView("done");
  };

  return (
    <div>
      <header><div className="bar">
        <div className="logo">Ansari Clothes<small>Men’s accessories</small></div>
        <button className="ib" onClick={toggleTheme} aria-label="Switch light or dark theme">◐</button>
        <button className="ib cartbtn" onClick={() => setView("cart")} aria-label={"Open cart, " + count + " items"}>Cart ({count})</button>
      </div></header>

      <main>
        <section className="hero">
          <h1>Finish the outfit.</h1>
          <p>Wallets, belts, watches and more. Free delivery on orders over {rs(FREE_OVER)}, and you pay when it arrives.</p>
        </section>

        <div className="tools">
          <input type="search" placeholder="Search products" value={q} onChange={e => setQ(e.target.value)} aria-label="Search products" />
          <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products">
            <option value="default">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
        <div className="chips" role="group" aria-label="Categories">
          {CATS.map(c => <button key={c} className="chip" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
        </div>

        {list.length === 0 ? <div className="empty">No products match “{q}”. Try another search or category.</div> :
        <div className="grid">
          {list.map(p => (
            <article className="p" key={p.id}>
              <div className="tile" style={tile(p.hue)} aria-hidden="true">{p.emoji}</div>
              <div className="pb">
                <span className="cat">{p.cat}</span>
                <h3>{p.name}</h3>
                {p.old && <span className="badge">Save {rs(p.old - p.price)}</span>}
                <div className="row">
                  <span className="price">{rs(p.price)}{p.old && <span className="old">{rs(p.old)}</span>}</span>
                  <button className="add" onClick={() => add(p)}>Add</button>
                </div>
              </div>
            </article>
          ))}
        </div>}
      </main>

      {view && (
        <div className="ov" onClick={e => e.target === e.currentTarget && setView(null)}>
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="Cart and checkout">
            <div className="dh">
              <h2>{view === "cart" ? "Your cart" : view === "checkout" ? "Checkout" : "Order placed"}</h2>
              <button className="ib" onClick={() => setView(null)} aria-label="Close">✕</button>
            </div>
            {view === "cart" && <CartView items={items} setQty={setQty} subtotal={subtotal} shipping={shipping} total={total}
              onNext={() => setView("checkout")} onClose={() => setView(null)} />}
            {view === "checkout" && <Checkout total={total} subtotal={subtotal} shipping={shipping} onBack={() => setView("cart")} onPlace={place} />}
            {view === "done" && order && <Done order={order} onClose={() => setView(null)} />}
          </aside>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
