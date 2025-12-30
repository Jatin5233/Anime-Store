export function getCartCount() {
  if (typeof window === "undefined") return 0;

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  return cart.reduce((sum: number, item: any) => sum + item.qty, 0);
}
