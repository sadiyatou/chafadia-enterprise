import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

function Checkout() {
  const { currentUser } = useAuth();
  const { cart, placeOrder } = useStore();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handleOrder = () => {
    if (!currentUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    placeOrder(currentUser);
    alert("Order placed successfully.");
    navigate("/customer/orders");
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="container">
          <h1 className="logo-text">Checkout</h1>

          <div className="card" style={{ marginTop: "20px" }}>
            <h2>Total: {total} FCFA</h2>
            <p>Payment Methods:</p>
            <p>MTN Mobile Money • Orange Money • Bank Payment • Cash</p>

            <br />

            <button className="btn" onClick={handleOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;