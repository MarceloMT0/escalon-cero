"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Headphones,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { simulatedOrder, simulatedEmailAccepted, formatMoney, UNIT_PRICE } from "./engine";

export function ShopSimulator() {
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [applications, setApplications] = useState(0);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const order = simulatedOrder(quantity, applications);
  function reset() {
    setQuantity(1);
    setCoupon("");
    setApplications(0);
    setEmail("");
    setNotice("");
    setConfirmed(false);
  }
  return (
    <div className="page-container internal-page">
      <div className="simulator-toolbar">
        <Link href="/practica/" className="back-link">
          <ArrowLeft size={16} />
          Volver a mi práctica
        </Link>
        <span className="sandbox-label">
          <ShieldCheck size={16} />
          Entorno de práctica · Sin cobros reales
        </span>
        <Button variant="ghost" size="small" onClick={reset}>
          <RotateCcw size={15} />
          Reiniciar tienda
        </Button>
      </div>
      <div className="shop-window">
        <div className="shop-header">
          <Link href="/simulador/" className="shop-brand">
            nube<span>®</span>
          </Link>
          <span>Lo esencial, bien hecho.</span>
          <ShoppingBag size={23} />
        </div>
        <div className="shipping-banner">
          <Truck size={17} />
          Envío gratis desde S/ 160 · Cupón BIENVENIDA10: 10 % de descuento
        </div>
        {confirmed ? (
          <section className="shop-success">
            <CheckCircle2 size={56} />
            <span className="quiet-eyebrow">PEDIDO DE PRUEBA</span>
            <h1>¡Gracias por tu compra!</h1>
            <p>
              Pedido ficticio NUBE-DEMO · {quantity} {quantity === 1 ? "unidad" : "unidades"}
            </p>
            <div className="order-total">
              <span>Total confirmado</span>
              <strong>{formatMoney(order.total)}</strong>
            </div>
            <p>
              Correo indicado: <strong>{email}</strong>
            </p>
            <p className="muted">No se realizó ningún pago ni se enviará un correo.</p>
            <div className="button-row">
              <Button onClick={reset} variant="secondary">
                Probar otro escenario
              </Button>
              <Link href="/practica/" className={buttonVariants()}>
                Documentar mis resultados <ArrowRight size={17} />
              </Link>
            </div>
          </section>
        ) : (
          <div className="shop-layout">
            <div className="shop-product">
              <div className="product-stage">
                <span className="product-stage-label">SONIDO PARA TUS IDEAS</span>
                <Headphones size={210} strokeWidth={0.85} />
                <span className="product-stage-caption">nube / audio</span>
              </div>
              <div className="product-thumbnails" aria-hidden="true">
                <span>
                  <Headphones size={30} />
                </span>
                <span>01</span>
                <span>nube</span>
              </div>
              <span className="quiet-eyebrow">TU COMPAÑERO DE TODOS LOS DÍAS</span>
              <h1>Auriculares Nube</h1>
              <p>Diseño ligero, sonido claro y espacio para concentrarte en lo que importa.</p>
              <strong className="product-price">{formatMoney(UNIT_PRICE)}</strong>
              <span className="stock-note">
                <span className="status-dot" />
                Disponible · Color: tinta
              </span>
            </div>
            <form
              className="shop-checkout"
              onSubmit={(event) => {
                event.preventDefault();
                if (!simulatedEmailAccepted(email)) {
                  setNotice("Introduce un correo para continuar.");
                  return;
                }
                setConfirmed(true);
                setNotice("");
              }}
            >
              <span className="section-kicker">
                <ShoppingBag size={18} />
                TU COMPRA
              </span>
              <h2>Un paso más y es tuyo.</h2>
              <label className="field">
                Cantidad
                <select
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(Number(e.target.value));
                    setNotice("");
                  }}
                  aria-label="Cantidad"
                >
                  {[1, 2, 3, 4, 5].map((v) => (
                    <option value={v} key={v}>
                      {v} {v === 1 ? "unidad" : "unidades"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field" htmlFor="coupon">
                ¿Tienes un cupón?
              </label>
              <div className="coupon-field">
                <input
                  id="coupon"
                  value={coupon}
                  maxLength={30}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Introduce tu cupón"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (coupon.trim().toUpperCase() === "BIENVENIDA10") {
                      setApplications((current) => Math.min(current + 1, 5));
                      setNotice("Cupón aplicado a tu compra.");
                    } else setNotice("Ese cupón no está disponible.");
                  }}
                >
                  Aplicar
                </Button>
              </div>
              <div className="order-lines">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatMoney(order.subtotal)}</strong>
                </div>
                <div>
                  <span>Envío</span>
                  <strong>{order.shipping === 0 ? "Gratis" : formatMoney(order.shipping)}</strong>
                </div>
                {applications > 0 ? (
                  <div className="discount-line">
                    <span>Descuento</span>
                    <strong>− {formatMoney(order.discount)}</strong>
                  </div>
                ) : null}
                <div className="order-total">
                  <span>Total</span>
                  <strong>{formatMoney(order.total)}</strong>
                </div>
              </div>
              <label className="field">
                Correo del comprador
                <input
                  type="text"
                  inputMode="email"
                  autoComplete="off"
                  placeholder="prueba@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={150}
                />
              </label>
              <span className="field-help">Utiliza datos ficticios durante la práctica.</span>
              <Button type="submit" className="checkout-button">
                Confirmar pedido de prueba <ArrowRight size={17} />
              </Button>
              {notice ? (
                <p className="feedback" role="status">
                  {notice}
                </p>
              ) : null}
              <p className="shop-disclaimer">
                <ShieldCheck size={15} />
                Esta tienda forma parte de una simulación de QA.
              </p>
            </form>
          </div>
        )}
      </div>
      <p className="simulator-footnote">
        Compara el comportamiento de la tienda con los requisitos del encargo. Puedes reiniciar el
        escenario tantas veces como necesites.
      </p>
    </div>
  );
}
