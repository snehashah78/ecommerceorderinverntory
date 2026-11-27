import { useEffect, useState, useCallback } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";
import { createOrder } from "../../api/orderApi";
import { createRazorpayOrder, makePayment } from "../../api/paymentApi";
import {
  FaTrash, FaShoppingBag, FaArrowLeft,
  FaBoxOpen, FaCheckCircle, FaExclamationTriangle,
  FaShoppingCart, FaTag, FaBolt, FaTimes,
} from "react-icons/fa";

/* ── Helpers ─────────────────────────────── */
const parsePrice = (price) => {
  if (typeof price === "number") return price;
  if (typeof price === "string") return Number(price.replace(/[₹,]/g, "")) || 0;
  return 0;
};

const calcTotals = (items) => {
  const subtotal = items.reduce(
    (s, i) => s + parsePrice(i.price) * (i.quantity || 1), 0
  );
  const shipping   = subtotal >= 2000 ? 0 : 99;
  const discount   = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + shipping - discount;
  return { subtotal, shipping, discount, grandTotal };
};

/* ── Confirm modal shown before any payment ─ */
function ConfirmModal({ items, onConfirm, onCancel, loading }) {
  const { subtotal, shipping, discount, grandTotal } = calcTotals(items);
  const isSingle = items.length === 1;

  return (
    <div className="cm-backdrop" onClick={onCancel}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cm-header">
          <h3>{isSingle ? "Buy This Item" : "Confirm Your Order"}</h3>
          <button className="cm-close" onClick={onCancel} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* Item list */}
        <div className="cm-items">
          {items.map((item) => {
            const unit  = parsePrice(item.price);
            const qty   = item.quantity || 1;
            return (
              <div className="cm-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cm-img" />
                <div className="cm-item-info">
                  <h4>{item.name}</h4>
                  {item.category && <span className="cm-cat">{item.category}</span>}
                  <span className="cm-qty">Qty: {qty}</span>
                </div>
                <span className="cm-item-total">
                  ₹{(unit * qty).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Price breakdown */}
        <div className="cm-breakdown">
          <div className="cm-line">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="cm-line">
            <span>Shipping</span>
            <span className={shipping === 0 ? "cm-free" : ""}>
              {shipping === 0 ? "FREE" : `₹${shipping}`}
            </span>
          </div>
          <div className="cm-line cm-discount">
            <span>Member Discount (5%)</span>
            <span>−₹{discount.toLocaleString()}</span>
          </div>
          <div className="cm-divider" />
          <div className="cm-line cm-total-line">
            <span>Total Payable</span>
            <span>₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="cm-actions">
          <button className="cm-cancel-btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className="cm-pay-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="cm-spinner" /> : <>💳 Pay ₹{grandTotal.toLocaleString()}</>}
          </button>
        </div>

        <p className="cm-trust">🔐 Secured by Razorpay · 256-bit SSL</p>
      </div>
    </div>
  );
}

/* ── Main Cart component ─────────────────── */
function Cart() {
  const [cartItems, setCartItems]   = useState([]);
  const [loadingId, setLoadingId]   = useState(null); // item id | "all" | null
  const [toast, setToast]           = useState(null);
  const [confirmItems, setConfirmItems] = useState(null); // items to confirm/pay

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const persist = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const removeItem   = (id)    => persist(cartItems.filter((i) => i.id !== id));
  const clearCart    = ()      => persist([]);
  const changeQty    = (id, d) => persist(
    cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + d) }
        : item
    )
  );

  /* ── Core Razorpay flow ──────────────────
     items  – the subset to pay for (1 item or all)
     loadKey – "all" | item.id  (drives spinner)
  ─────────────────────────────────────────── */
  const runCheckout = useCallback(async (items, loadKey) => {
    setLoadingId(loadKey);
    setConfirmItems(null);

    const { grandTotal } = calcTotals(items);

    try {
      const orderResponse = await createOrder({
        userId:    1,
        productId: items[0].id,
        quantity:  items.reduce((s, i) => s + (i.quantity || 1), 0),
      });
      const order = orderResponse.data;

      const paymentResponse = await createRazorpayOrder({
        orderId: order.id,
        amount:  grandTotal,
      });
      const razorpayOrder = paymentResponse.data;

      const options = {
        key:         "rzp_test_T5Q9Qm5ljSalb3",
        amount:      razorpayOrder.amount,
        currency:    razorpayOrder.currency,
        order_id:    razorpayOrder.id,
        name:        "ShopEase",
        description: items.length === 1
          ? `Purchase: ${items[0].name}`
          : `Cart Order (${items.length} items)`,
        handler: async function () {
          try {
            await makePayment({ orderId: order.id, paymentMethod: "UPI" });

            // Remove only the paid items from the cart
            const paidIds = new Set(items.map((i) => i.id));
            persist(cartItems.filter((i) => !paidIds.has(i.id)));

            showToast(
              items.length === 1
                ? `${items[0].name} ordered successfully! 🎉`
                : "All items ordered successfully! 🎉",
              "success"
            );
          } catch {
            showToast("Payment captured but saving failed. Contact support.", "error");
          }
        },
        prefill: { name: "Sneha Shah", email: "test@test.com", contact: "9999999999" },
        theme: { color: "#f97316" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Checkout failed. Please try again.",
        "error"
      );
    } finally {
      setLoadingId(null);
    }
  }, [cartItems, showToast]);

  /* Derived totals for the full cart */
  const { subtotal, shipping, discount, grandTotal } = calcTotals(cartItems);

  return (
    <div className="cart-page">

      {/* Toast */}
      {toast && (
        <div className={`cart-toast ${toast.type}`}>
          {toast.type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
          {toast.message}
        </div>
      )}

      {/* Confirm modal */}
      {confirmItems && (
        <ConfirmModal
          items={confirmItems.items}
          loading={loadingId !== null}
          onConfirm={() => runCheckout(confirmItems.items, confirmItems.key)}
          onCancel={() => setConfirmItems(null)}
        />
      )}

      {/* Navbar */}
      <nav className="cart-navbar">
        <Link to="/dashboard" className="cart-nav-btn">
          <FaArrowLeft /> Dashboard
        </Link>
        <h2 className="cart-nav-logo">🛍 ShopEase</h2>
        <div className="cart-nav-right">
          <Link to="/products" className="cart-nav-btn secondary">
            <FaShoppingBag /> Products
          </Link>
          <Link to="/orders" className="cart-nav-btn secondary">
            <FaBoxOpen /> Orders
          </Link>
        </div>
      </nav>

      {/* Page header */}
      <div className="cart-header">
        <div>
          <h1 className="cart-title">
            <FaShoppingCart /> Shopping Cart
          </h1>
          <p className="cart-subtitle">
            {cartItems.length === 0
              ? "Your cart is empty"
              : `${cartItems.length} item${cartItems.length > 1 ? "s" : ""} in your cart`}
          </p>
        </div>
        {cartItems.length > 0 && (
          <button className="cart-clear-btn" onClick={clearCart}>
            <FaTrash /> Clear Cart
          </button>
        )}
      </div>

      {/* Free shipping progress */}
      {cartItems.length > 0 && (
        <div className="cart-progress-card">
          <div className="progress-top">
            {subtotal >= 2000 ? (
              <p>🎉 You've unlocked <strong>Free Shipping!</strong></p>
            ) : (
              <p>
                Add <strong>₹{(2000 - subtotal).toLocaleString()}</strong> more for
                <span className="free-label"> Free Shipping</span>
              </p>
            )}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min((subtotal / 2000) * 100, 100)}%` }}
            />
          </div>
          <div className="progress-labels">
            <span>₹0</span>
            <span>₹2,000</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products">
            <button className="cart-shop-btn">
              <FaShoppingBag /> Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="cart-layout">

          {/* Items list */}
          <div className="cart-items">
            <div className="cart-col-headers">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
              <span></span>
            </div>

            {cartItems.map((item) => {
              const unitPrice  = parsePrice(item.price);
              const lineTotal  = unitPrice * (item.quantity || 1);
              const isBuying   = loadingId === item.id;

              return (
                <div key={item.id} className="cart-row">

                  {/* Product info */}
                  <div className="cart-product-cell">
                    <img src={item.image} alt={item.name} className="cart-image" />
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      {item.category && (
                        <span className="cart-item-cat">{item.category}</span>
                      )}
                      <span className="cart-in-stock">✓ In Stock</span>
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className="cart-price-cell">
                    ₹{unitPrice.toLocaleString()}
                  </div>

                  {/* Quantity */}
                  <div className="cart-qty-cell">
                    <button
                      className="qty-btn"
                      onClick={() => changeQty(item.id, -1)}
                      disabled={loadingId !== null}
                      aria-label="Decrease"
                    >−</button>
                    <span className="qty-num">{item.quantity || 1}</span>
                    <button
                      className="qty-btn"
                      onClick={() => changeQty(item.id, +1)}
                      disabled={loadingId !== null}
                      aria-label="Increase"
                    >+</button>
                  </div>

                  {/* Line total */}
                  <div className="cart-total-cell">
                    ₹{lineTotal.toLocaleString()}
                  </div>

                  {/* ── Buy Now (single item) ── */}
                  <div className="cart-action-cell">
                    <button
                      className="buy-now-btn"
                      disabled={loadingId !== null}
                      onClick={() =>
                        setConfirmItems({
                          items: [{ ...item }],
                          key:   item.id,
                        })
                      }
                      title={`Buy only ${item.name} now`}
                    >
                      {isBuying ? (
                        <span className="bn-spinner" />
                      ) : (
                        <><FaBolt /> Buy Now</>
                      )}
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeItem(item.id)}
                    disabled={loadingId !== null}
                    aria-label={`Remove ${item.name}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="cart-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span className={shipping === 0 ? "free-text" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              <div className="summary-line discount-line">
                <span><FaTag /> Member Discount (5%)</span>
                <span>−₹{discount.toLocaleString()}</span>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Grand Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>

            {/* Checkout ALL items */}
            <button
              className="checkout-btn"
              disabled={loadingId !== null}
              onClick={() =>
                setConfirmItems({ items: cartItems, key: "all" })
              }
            >
              {loadingId === "all" ? (
                <span className="checkout-spinner" />
              ) : (
                <>💳 Checkout All Items</>
              )}
            </button>

            <div className="summary-trust">
              <span>🔐 Secure Payment</span>
              <span>↩ Easy Returns</span>
              <span>🚚 Fast Delivery</span>
            </div>

            <Link to="/products" className="continue-link">
              ← Continue Shopping
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;
