import { useState } from "react";
import Navbar from "../../components/Navbar";

function PromotionsDiscounts() {
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState("");
  const [coupon, setCoupon] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [promotions, setPromotions] = useState([
    {
      id: 1,
      title: "Eid Special Sale",
      discount: 20,
      coupon: "EID20",
      startDate: "2026-06-15",
      endDate: "2026-06-30",
      active: true,
    },
  ]);

  const addPromotion = () => {
    if (
      !title ||
      !discount ||
      !coupon ||
      !startDate ||
      !endDate
    ) {
      alert("Please complete all fields.");
      return;
    }

    const newPromotion = {
      id: Date.now(),
      title,
      discount,
      coupon,
      startDate,
      endDate,
      active: true,
    };

    setPromotions([newPromotion, ...promotions]);

    setTitle("");
    setDiscount("");
    setCoupon("");
    setStartDate("");
    setEndDate("");
  };

  const deletePromotion = (id) => {
    setPromotions(
      promotions.filter((promo) => promo.id !== id)
    );
  };

  const togglePromotion = (id) => {
    setPromotions(
      promotions.map((promo) =>
        promo.id === id
          ? { ...promo, active: !promo.active }
          : promo
      )
    );
  };

  return (
    <>
      <Navbar />

      <div className="promo-page">
        <style>{`
          .promo-page{
            min-height:100vh;
            padding:25px;
            background:
            radial-gradient(circle at top left,
            rgba(212,175,55,.18),
            transparent 30%),
            #f6f8ff;
          }

          .promo-container{
            max-width:1300px;
            margin:auto;
          }

          .promo-hero{
            background:white;
            padding:30px;
            border-radius:30px;
            margin-bottom:25px;
            box-shadow:0 15px 40px rgba(0,31,77,.08);
          }

          .promo-hero h1{
            color:#001f4d;
            font-size:42px;
            margin-bottom:10px;
          }

          .promo-hero span{
            color:#d4af37;
          }

          .promo-hero p{
            color:#667085;
            line-height:1.7;
          }

          .stats{
            display:grid;
            grid-template-columns:
            repeat(auto-fit,minmax(180px,1fr));
            gap:15px;
            margin-bottom:25px;
          }

          .stat-card{
            background:white;
            padding:20px;
            border-radius:22px;
            text-align:center;
            box-shadow:0 10px 30px rgba(0,31,77,.08);
          }

          .stat-card h2{
            color:#d4af37;
            font-size:34px;
          }

          .main-grid{
            display:grid;
            grid-template-columns:380px 1fr;
            gap:25px;
          }

          .card{
            background:white;
            padding:22px;
            border-radius:25px;
            box-shadow:0 15px 40px rgba(0,31,77,.08);
          }

          .card h2{
            color:#001f4d;
            margin-bottom:20px;
          }

          .card input{
            width:100%;
            padding:14px;
            border:1px solid #ddd;
            border-radius:14px;
            margin-bottom:14px;
          }

          .create-btn{
            width:100%;
            padding:14px;
            border:none;
            border-radius:14px;
            background:
            linear-gradient(
            135deg,
            #004aad,
            #001f4d
            );
            color:white;
            font-weight:800;
            cursor:pointer;
          }

          .promo-list{
            display:flex;
            flex-direction:column;
            gap:18px;
          }

          .promo-item{
            background:white;
            padding:20px;
            border-radius:22px;
            box-shadow:0 12px 30px rgba(0,31,77,.08);
          }

          .promo-top{
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:15px;
          }

          .promo-title{
            color:#001f4d;
            font-size:20px;
            font-weight:800;
          }

          .discount{
            color:#d4af37;
            font-size:26px;
            font-weight:900;
          }

          .promo-details{
            margin-top:12px;
            color:#667085;
            line-height:1.8;
          }

          .coupon{
            display:inline-block;
            margin-top:10px;
            padding:8px 14px;
            border-radius:999px;
            background:#fff3c4;
            color:#001f4d;
            font-weight:800;
          }

          .status-active{
            color:#16a34a;
            font-weight:800;
          }

          .status-inactive{
            color:#dc2626;
            font-weight:800;
          }

          .actions{
            display:flex;
            gap:10px;
            margin-top:16px;
          }

          .toggle-btn{
            background:#004aad;
            color:white;
            border:none;
            padding:10px 14px;
            border-radius:12px;
            cursor:pointer;
            font-weight:700;
          }

          .delete-btn{
            background:#dc2626;
            color:white;
            border:none;
            padding:10px 14px;
            border-radius:12px;
            cursor:pointer;
            font-weight:700;
          }

          @media(max-width:900px){
            .main-grid{
              grid-template-columns:1fr;
            }

            .promo-hero h1{
              font-size:32px;
            }
          }
        `}</style>

        <div className="promo-container">

          <div className="promo-hero">
            <h1>
              Promotions <span>& Discounts</span>
            </h1>

            <p>
              Create discount campaigns, coupon codes,
              special offers and promotional sales for
              customers.
            </p>
          </div>

          <div className="stats">
            <div className="stat-card">
              <h2>{promotions.length}</h2>
              <p>Total Promotions</p>
            </div>

            <div className="stat-card">
              <h2>
                {
                  promotions.filter(
                    (promo) => promo.active
                  ).length
                }
              </h2>
              <p>Active Promotions</p>
            </div>

            <div className="stat-card">
              <h2>
                {
                  promotions.filter(
                    (promo) => !promo.active
                  ).length
                }
              </h2>
              <p>Inactive Promotions</p>
            </div>
          </div>

          <div className="main-grid">

            <div className="card">
              <h2>Create Promotion</h2>

              <input
                placeholder="Promotion Title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Discount (%)"
                value={discount}
                onChange={(e) =>
                  setDiscount(e.target.value)
                }
              />

              <input
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) =>
                  setCoupon(e.target.value)
                }
              />

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
              />

              <button
                className="create-btn"
                onClick={addPromotion}
              >
                Create Promotion
              </button>
            </div>

            <div className="promo-list">

              {promotions.map((promo) => (
                <div
                  className="promo-item"
                  key={promo.id}
                >
                  <div className="promo-top">
                    <div>
                      <div className="promo-title">
                        {promo.title}
                      </div>

                      <div className="coupon">
                        {promo.coupon}
                      </div>
                    </div>

                    <div className="discount">
                      {promo.discount}% OFF
                    </div>
                  </div>

                  <div className="promo-details">
                    Start: {promo.startDate}
                    <br />
                    End: {promo.endDate}
                    <br />

                    <span
                      className={
                        promo.active
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {promo.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <div className="actions">
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        togglePromotion(promo.id)
                      }
                    >
                      {promo.active
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deletePromotion(promo.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PromotionsDiscounts;