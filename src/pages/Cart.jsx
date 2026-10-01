import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useStore } from "../context/StoreContext";

function Cart() {
  const { cart, removeFromCart } = useStore();

  const [quantities, setQuantities] = useState(
    cart.reduce((acc, item, index) => {
      acc[index] = item.qty || item.quantity || 1;
      return acc;
    }, {})
  );

  const [deliveryType, setDeliveryType] = useState("Pickup");
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discount, setDiscount] = useState(0);

  const formatMoney = (amount) => {
    return `${Number(amount || 0).toLocaleString()} FCFA`;
  };

  const increaseQty = (index) => {
    setQuantities((prev) => ({
      ...prev,
      [index]: Number(prev[index] || 1) + 1,
    }));
  };

  const decreaseQty = (index) => {
    setQuantities((prev) => ({
      ...prev,
      [index]: Math.max(1, Number(prev[index] || 1) - 1),
    }));
  };

  const getDeliveryFee = () => {
    if (deliveryType === "Home Delivery") return 1000;
    if (deliveryType === "Express Delivery") return 2000;
    return 0;
  };

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item, index) =>
        sum + Number(item.price || 0) * Number(quantities[index] || 1),
      0
    );
  }, [cart, quantities]);

  const deliveryFee = getDeliveryFee();
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);
  const totalItems = cart.reduce(
    (sum, item, index) => sum + Number(quantities[index] || 1),
    0
  );

  const saveCartPreferences = () => {
    const cartCheckoutData = {
      cart,
      quantities,
      deliveryType,
      deliveryFee,
      subtotal,
      discount,
      grandTotal,
      totalItems,
      requestedTab: "orders",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "chafadiaCartCheckoutData",
      JSON.stringify(cartCheckoutData)
    );

    localStorage.setItem("chafadiaCustomerDashboardTab", "orders");
  };

  const applyCoupon = () => {
    const cleanCoupon = coupon.trim().toUpperCase();

    if (!cleanCoupon) {
      setCouponMessage("Please enter a coupon code.");
      setDiscount(0);
      return;
    }

    if (cleanCoupon === "CHAFADIA10") {
      const value = subtotal * 0.1;
      setDiscount(value);
      setCouponMessage("Coupon applied: 10% discount.");
      return;
    }

    if (cleanCoupon === "WELCOME500") {
      setDiscount(500);
      setCouponMessage("Coupon applied: 500 FCFA discount.");
      return;
    }

    setDiscount(0);
    setCouponMessage("Invalid coupon code.");
  };

  return (
    <>
      <Navbar />

      <div className="cart-page">
        <style>{`
          .cart-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.24), transparent 28%),
              radial-gradient(circle at 90% 12%, rgba(0, 74, 173, 0.16), transparent 30%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 52%, #f7f9ff 100%);
          }

          .cart-container {
            max-width: 1280px;
            margin: 0 auto;
          }

          .cart-hero {
            position: relative;
            overflow: hidden;
            border-radius: 38px;
            padding: 34px;
            margin-bottom: 24px;
            background:
              radial-gradient(circle at top right, rgba(212,175,55,0.28), transparent 34%),
              linear-gradient(135deg, #004aad, #001f4d);
            color: #ffffff;
            border: 1px solid rgba(212,175,55,0.45);
            box-shadow: 0 32px 82px rgba(0,31,77,0.24);
          }

          .cart-hero::before {
            content: "";
            position: absolute;
            width: 310px;
            height: 310px;
            right: -135px;
            top: -145px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.38), transparent 68%);
          }

          .cart-label {
            display: inline-flex;
            padding: 9px 16px;
            border-radius: 999px;
            margin-bottom: 16px;
            background: rgba(212,175,55,0.16);
            color: #fff7d6;
            border: 1px solid rgba(212,175,55,0.4);
            font-size: 12px;
            font-weight: 950;
            letter-spacing: 0.9px;
            text-transform: uppercase;
          }

          .cart-hero h1 {
            font-size: clamp(36px, 5vw, 62px);
            line-height: 1.03;
            font-weight: 950;
            letter-spacing: -1.5px;
            margin-bottom: 10px;
          }

          .cart-hero h1 span {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .cart-hero p {
            color: rgba(255,255,255,0.88);
            max-width: 780px;
            line-height: 1.75;
            font-weight: 650;
          }

          .cart-layout {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 380px;
            gap: 22px;
            align-items: start;
          }

          .cart-panel {
            background: rgba(255,255,255,0.985);
            border-radius: 30px;
            border: 1px solid rgba(212,175,55,0.22);
            box-shadow: 0 20px 50px rgba(0,31,77,0.1);
            overflow: hidden;
          }

          .cart-panel-head {
            padding: 22px;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.08), rgba(212,175,55,0.13));
            border-bottom: 1px solid rgba(0,74,173,0.08);
            display: flex;
            justify-content: space-between;
            gap: 14px;
            align-items: center;
          }

          .cart-panel-head h2 {
            color: #001f4d;
            font-size: 24px;
            font-weight: 950;
          }

          .cart-count {
            padding: 8px 13px;
            border-radius: 999px;
            background: linear-gradient(135deg, #fff7d6, #d4af37);
            color: #001f4d;
            font-size: 12px;
            font-weight: 950;
          }

          .cart-items {
            padding: 18px;
            display: grid;
            gap: 14px;
          }

          .cart-item {
            display: grid;
            grid-template-columns: 92px minmax(0, 1fr);
            gap: 15px;
            padding: 16px;
            border-radius: 24px;
            background: #f8fbff;
            border: 1px solid rgba(0,74,173,0.08);
            transition: 0.3s ease;
          }

          .cart-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 18px 38px rgba(0,31,77,0.1);
          }

          .cart-image {
            width: 92px;
            height: 92px;
            border-radius: 22px;
            overflow: hidden;
            background:
              linear-gradient(135deg, rgba(0,74,173,0.12), rgba(212,175,55,0.18));
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .cart-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .cart-placeholder {
            color: #001f4d;
            font-size: 30px;
          }

          .cart-item-main {
            min-width: 0;
          }

          .cart-topline {
            display: flex;
            align-items: start;
            justify-content: space-between;
            gap: 14px;
            margin-bottom: 6px;
          }

          .cart-topline h3 {
            color: #001f4d;
            font-size: 18px;
            line-height: 1.25;
            font-weight: 950;
          }

          .cart-category {
            display: inline-flex;
            padding: 6px 10px;
            border-radius: 999px;
            background: #fff7d6;
            color: #92400e;
            font-size: 11px;
            font-weight: 900;
            margin-bottom: 10px;
          }

          .cart-price {
            color: #b8860b;
            font-size: 19px;
            font-weight: 950;
            white-space: nowrap;
          }

          .cart-actions-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-top: 10px;
          }

          .quantity-box {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 7px;
            border-radius: 999px;
            background: #ffffff;
            border: 1px solid rgba(0,74,173,0.1);
            box-shadow: 0 8px 20px rgba(0,31,77,0.06);
          }

          .qty-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #ffffff;
            font-weight: 950;
            cursor: pointer;
          }

          .qty-value {
            min-width: 26px;
            text-align: center;
            color: #001f4d;
            font-weight: 950;
          }

          .remove-btn {
            border: none;
            padding: 10px 14px;
            border-radius: 999px;
            background: #fee2e2;
            color: #991b1b;
            font-weight: 950;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .remove-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.02);
          }

          .empty-cart {
            padding: 45px 20px;
            text-align: center;
          }

          .empty-icon {
            width: 82px;
            height: 82px;
            border-radius: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 18px;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #d4af37;
            font-size: 38px;
          }

          .empty-cart h2 {
            color: #001f4d;
            font-size: 28px;
            font-weight: 950;
            margin-bottom: 8px;
          }

          .empty-cart p {
            color: #667085;
            line-height: 1.65;
            font-weight: 650;
            max-width: 440px;
            margin: 0 auto 20px;
          }

          .summary-card {
            position: sticky;
            top: 20px;
          }

          .summary-body {
            padding: 22px;
            display: grid;
            gap: 14px;
          }

          .summary-line {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding-bottom: 12px;
            border-bottom: 1px dashed rgba(0,31,77,0.14);
            color: #001f4d;
            font-weight: 850;
          }

          .summary-line span {
            color: #667085;
            font-weight: 750;
          }

          .summary-total {
            padding: 16px;
            border-radius: 20px;
            background: linear-gradient(135deg, #fff7d6, #fff9e8);
            border: 1px solid rgba(212,175,55,0.34);
          }

          .summary-total span {
            color: #001f4d;
          }

          .summary-total strong {
            color: #b8860b;
            font-size: 22px;
          }

          .delivery-select,
          .coupon-input {
            display: grid;
            gap: 8px;
          }

          .delivery-select label,
          .coupon-input label {
            color: #001f4d;
            font-size: 13px;
            font-weight: 950;
          }

          .delivery-select select,
          .coupon-row input {
            width: 100%;
            padding: 13px 15px;
            border-radius: 17px;
            border: 1px solid rgba(0,74,173,0.14);
            color: #001f4d;
            outline: none;
            font-weight: 760;
            background: #ffffff;
          }

          .coupon-row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 8px;
          }

          .coupon-row button {
            border: none;
            border-radius: 17px;
            padding: 0 14px;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #ffffff;
            font-weight: 950;
            cursor: pointer;
          }

          .coupon-message {
            color: #667085;
            font-size: 12px;
            font-weight: 750;
          }

          .checkout-btn {
            min-height: 52px;
            border-radius: 999px;
            border: none;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #ffffff;
            font-weight: 950;
            cursor: pointer;
            width: 100%;
            box-shadow: 0 18px 38px rgba(0,31,77,0.18);
            transition: 0.3s ease;
          }

          .checkout-btn:hover {
            transform: translateY(-3px);
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .checkout-btn:disabled {
            opacity: 0.55;
            cursor: not-allowed;
          }

          .continue-link {
            text-decoration: none;
          }

          .continue-btn {
            min-height: 48px;
            border-radius: 999px;
            border: 1px solid rgba(0,74,173,0.12);
            background: #f8fbff;
            color: #001f4d;
            font-weight: 950;
            cursor: pointer;
            width: 100%;
            transition: 0.3s ease;
          }

          .continue-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 14px 34px rgba(0,31,77,0.1);
          }

          .trust-box {
            padding: 16px;
            border-radius: 22px;
            background: linear-gradient(135deg, #ecfdf3, #dcfce7);
            color: #166534;
            border: 1px solid rgba(22,101,52,0.12);
          }

          .trust-box h3 {
            font-size: 15px;
            font-weight: 950;
            margin-bottom: 8px;
          }

          .trust-box p {
            font-size: 12.5px;
            line-height: 1.55;
            font-weight: 750;
          }

          .cart-benefits {
            margin-top: 22px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 14px;
          }

          .benefit-card {
            padding: 18px;
            border-radius: 24px;
            background: rgba(255,255,255,0.985);
            border: 1px solid rgba(212,175,55,0.2);
            box-shadow: 0 14px 36px rgba(0,31,77,0.08);
          }

          .benefit-card h3 {
            color: #001f4d;
            font-size: 16px;
            font-weight: 950;
            margin-bottom: 6px;
          }

          .benefit-card p {
            color: #667085;
            font-size: 13px;
            line-height: 1.55;
            font-weight: 650;
          }

          @media (max-width: 980px) {
            .cart-layout {
              grid-template-columns: 1fr;
            }

            .summary-card {
              position: static;
            }
          }

          @media (max-width: 620px) {
            .cart-page {
              padding: 14px;
            }

            .cart-hero {
              border-radius: 28px;
              padding: 24px 17px;
            }

            .cart-item {
              grid-template-columns: 1fr;
            }

            .cart-image {
              width: 100%;
              height: 180px;
            }

            .cart-topline,
            .cart-actions-row {
              flex-direction: column;
              align-items: flex-start;
            }

            .coupon-row {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div className="cart-container">
          <section className="cart-hero">
            <span className="cart-label">Shopping Cart</span>

            <h1>
              My <span>Cart</span>
            </h1>

            <p>
              Review your selected Chafadia Enterprise products, adjust
              quantities, apply discounts, choose delivery and continue to
              Make Payments & View Orders inside your Customer Dashboard.
            </p>
          </section>

          <div className="cart-layout">
            <div className="cart-panel">
              <div className="cart-panel-head">
                <h2>Selected Products</h2>
                <span className="cart-count">{totalItems} item(s)</span>
              </div>

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-icon">🛒</div>
                  <h2>Your cart is empty</h2>
                  <p>
                    Add beautiful Chafadia Enterprise products to your cart and
                    come back here to review your order.
                  </p>

                  <Link to="/products" className="continue-link">
                    <button className="checkout-btn">Start Shopping</button>
                  </Link>
                </div>
              ) : (
                <div className="cart-items">
                  {cart.map((item, index) => {
                    const qty = Number(quantities[index] || 1);
                    const itemTotal = Number(item.price || 0) * qty;

                    return (
                      <div className="cart-item" key={index}>
                        <div className="cart-image">
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <div className="cart-placeholder">🛍️</div>
                          )}
                        </div>

                        <div className="cart-item-main">
                          <div className="cart-topline">
                            <div>
                              <h3>{item.name}</h3>
                              <span className="cart-category">
                                {item.category || "Chafadia Product"}
                              </span>
                            </div>

                            <div className="cart-price">
                              {formatMoney(itemTotal)}
                            </div>
                          </div>

                          <p style={{ color: "#667085", fontWeight: 700 }}>
                            Unit Price: {formatMoney(item.price)}
                          </p>

                          <div className="cart-actions-row">
                            <div className="quantity-box">
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => decreaseQty(index)}
                              >
                                −
                              </button>

                              <span className="qty-value">{qty}</span>

                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => increaseQty(index)}
                              >
                                +
                              </button>
                            </div>

                            <button
                              className="remove-btn"
                              onClick={() => removeFromCart(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="cart-panel summary-card">
              <div className="cart-panel-head">
                <h2>Order Summary</h2>
              </div>

              <div className="summary-body">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <strong>{formatMoney(subtotal)}</strong>
                </div>

                <div className="delivery-select">
                  <label>Delivery Option</label>

                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                  >
                    <option value="Pickup">Pickup - Free</option>
                    <option value="Home Delivery">Home Delivery - 1,000 FCFA</option>
                    <option value="Express Delivery">
                      Express Delivery - 2,000 FCFA
                    </option>
                  </select>
                </div>

                <div className="summary-line">
                  <span>Delivery Fee</span>
                  <strong>{formatMoney(deliveryFee)}</strong>
                </div>

                <div className="coupon-input">
                  <label>Coupon Code</label>

                  <div className="coupon-row">
                    <input
                      placeholder="Try CHAFADIA10"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />

                    <button type="button" onClick={applyCoupon}>
                      Apply
                    </button>
                  </div>

                  {couponMessage && (
                    <p className="coupon-message">{couponMessage}</p>
                  )}
                </div>

                <div className="summary-line">
                  <span>Discount</span>
                  <strong>- {formatMoney(discount)}</strong>
                </div>

                <div className="summary-line summary-total">
                  <span>Grand Total</span>
                  <strong>{formatMoney(grandTotal)}</strong>
                </div>

                <Link
                  to="/customer"
                  state={{ openTab: "orders" }}
                  onClick={saveCartPreferences}
                >
                  <button className="checkout-btn" disabled={cart.length === 0}>
                    Go to Make Payments & View Orders
                  </button>
                </Link>

                <Link to="/products" className="continue-link">
                  <button className="continue-btn">Continue Shopping</button>
                </Link>

                <div className="trust-box">
                  <h3>Secure Shopping Promise</h3>
                  <p>
                    Your order summary is saved before moving to the Customer
                    Dashboard, where payments, order tracking and receipts are
                    managed professionally.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-benefits">
            <div className="benefit-card">
              <h3>Worldwide Delivery</h3>
              <p>
                We support local and international customers with professional
                order handling.
              </p>
            </div>

            <div className="benefit-card">
              <h3>Easy Payment</h3>
              <p>
                Pay using MTN MoMo, Orange Money, Bank Transfer, Bank Card or
                Cash inside Make Payments & View Orders.
              </p>
            </div>

            <div className="benefit-card">
              <h3>Official Receipts</h3>
              <p>
                Paid orders generate beautiful receipts that customers can
                download from the Customer Dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
