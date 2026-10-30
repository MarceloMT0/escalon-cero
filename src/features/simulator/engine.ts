export const UNIT_PRICE = 80;
export const SHIPPING_PRICE = 12;
export function intendedOrder(quantity: number, couponApplied: boolean) {
  const subtotal = UNIT_PRICE * quantity;
  const shipping = subtotal >= 160 ? 0 : SHIPPING_PRICE;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  return { subtotal, shipping, discount, total: subtotal + shipping - discount };
}

// Deliberate, deterministic defects belong only to the educational sandbox.
// Keep real billing and the platform's own calculations out of this module.
export function simulatedOrder(quantity: number, couponApplications: number) {
  const subtotal = UNIT_PRICE * quantity;
  const shipping = subtotal > 160 ? 0 : SHIPPING_PRICE;
  const discount = subtotal * 0.1 * Math.min(couponApplications, 5);
  return { subtotal, shipping, discount, total: subtotal + shipping - discount };
}
export function simulatedEmailAccepted(email: string) {
  return email.trim().includes("@");
}
export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
}
