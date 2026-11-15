import { useState } from "react";
import { FREE_OVER, rs, tile } from "../data";

export function Totals({ subtotal, shipping, total }) {
  return (<div>
    <div className="sum"><span>Subtotal</span><span>{rs(subtotal)}</span></div>
    <div className="sum"><span>Delivery</span><span>{shipping ? rs(shipping) : "Free"}</span></div>
    <div className="sum t"><span>Total</span><span>{rs(total)}</span></div>
  </div>);
}

export function CartView({ items, setQty, subtotal, shipping, total, onNext, onClose }) {
  if (!items.length) return (<div className="db"><div className="empty">Your cart is empty. Add something you like.</div>
    <button className="big" onClick={onClose}>Keep shopping</button></div>);
  return (<>
    <div className="db">
      {items.map(i => (
        <div className="ci" key={i.id}>
          <div className="ct" style={tile(i.hue)}>{i.emoji}</div>
          <div className="cinfo">
            <strong>{i.name}</strong>
            <div>{rs(i.price)}</div>
            <div className="qty">
              <button onClick={() => setQty(i.id, i.qty - 1)} aria-label={"Decrease " + i.name}>−</button>
              <span>{i.qty}</span>
              <button onClick={() => setQty(i.id, i.qty + 1)} aria-label={"Increase " + i.name}>+</button>
              <button className="link" onClick={() => setQty(i.id, 0)}>Remove</button>
            </div>
          </div>
          <strong>{rs(i.price * i.qty)}</strong>
        </div>
      ))}
      {shipping > 0 && <p className="cat">Add {rs(FREE_OVER - subtotal)} more for free delivery.</p>}
    </div>
    <div className="df"><Totals subtotal={subtotal} shipping={shipping} total={total} />
      <button className="big" onClick={onNext}>Continue to checkout</button></div>
  </>);
}

export function Checkout({ total, subtotal, shipping, onBack, onPlace }) {
  const [f, setF] = useState({ name: "", phone: "", city: "", address: "", pay: "cod" });
  const [err, setErr] = useState({});
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  function submit(e) {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 3) er.name = "Enter your full name.";
    if (!/^(\+92|0)?3\d{9}$/.test(f.phone.replace(/[\s-]/g, ""))) er.phone = "Enter a Pakistani mobile number, like 0300 1234567.";
    if (!f.city.trim()) er.city = "Enter your city.";
    if (f.address.trim().length < 8) er.address = "Enter your full delivery address.";
    setErr(er);
    if (!Object.keys(er).length) onPlace(f);
  }
  const field = (k, label, props = {}) => (<div>
    <label htmlFor={k}>{label}</label>
    <input id={k} className={"f" + (err[k] ? " bad" : "")} value={f[k]} onChange={e => set(k, e.target.value)} {...props} />
    {err[k] && <div className="err">{err[k]}</div>}
  </div>);
  return (<form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
    <div className="db">
      {field("name", "Full name", { autoComplete: "name" })}
      {field("phone", "Mobile number", { type: "tel", autoComplete: "tel", placeholder: "03XX XXXXXXX" })}
      {field("city", "City")}
      {field("address", "Delivery address", { autoComplete: "street-address" })}
      <label>Payment</label>
      <div className="pay">
        <label><input type="radio" name="pay" checked={f.pay === "cod"} onChange={() => set("pay", "cod")} /> Cash on delivery</label>
        <label><input type="radio" name="pay" checked={f.pay === "bank"} onChange={() => set("pay", "bank")} /> Bank transfer</label>
      </div>
    </div>
    <div className="df"><Totals subtotal={subtotal} shipping={shipping} total={total} />
      <button className="big" type="submit">Place order</button>
      <button className="big ghost" type="button" onClick={onBack}>Back to cart</button></div>
  </form>);
}

export function Done({ order, onClose }) {
  return (<div className="db"><div className="done">
    <div className="ok">✅</div>
    <h3>Thank you, {order.info.name.split(" ")[0]}!</h3>
    <p>Order <strong>{order.id}</strong> is confirmed.</p>
    <p>{order.items.length} item{order.items.length > 1 ? "s" : ""}, total <strong>{rs(order.total)}</strong>.</p>
    <p className="cat">{order.info.pay === "cod" ? "Pay in cash when it arrives in " : "We’ll send bank details by phone. Delivering to "}{order.info.city}.</p>
    <button className="big" onClick={onClose}>Continue shopping</button>
  </div></div>);
}
