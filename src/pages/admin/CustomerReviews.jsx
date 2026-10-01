import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";

function CustomerReviews() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [reviews, setReviews] = useState([
    {
      id: 1,
      customerName: "Aisha Bello",
      email: "aisha@gmail.com",
      product: "Pineapple Juice",
      rating: 5,
      status: "Pending",
      priority: "Featured",
      date: "2026-06-16",
      review:
        "The pineapple juice was very fresh, natural and well packaged. I really loved the taste.",
      adminReply: "",
    },
    {
      id: 2,
      customerName: "Fatima Sadiq",
      email: "fatima@gmail.com",
      product: "Family Body Lotion",
      rating: 4,
      status: "Approved",
      priority: "Normal",
      date: "2026-06-15",
      review:
        "The lotion is smooth and moisturizing. My family enjoyed using it.",
      adminReply:
        "Thank you for trusting Chafadia Enterprise. We are happy your family loved it.",
    },
    {
      id: 3,
      customerName: "Mariam N.",
      email: "mariam@gmail.com",
      product: "Banana Chips",
      rating: 3,
      status: "Rejected",
      priority: "Normal",
      date: "2026-06-14",
      review:
        "The taste was good, but I would prefer the chips to be more crunchy next time.",
      adminReply: "",
    },
  ]);

  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const text = `${review.customerName} ${review.email} ${review.product} ${review.review}`
        .toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        review.status === filter ||
        review.priority === filter ||
        String(review.rating) === filter;

      return matchesSearch && matchesFilter;
    });
  }, [reviews, search, filter]);

  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(
    (review) => review.status === "Pending"
  ).length;
  const approvedReviews = reviews.filter(
    (review) => review.status === "Approved"
  ).length;
  const featuredReviews = reviews.filter(
    (review) => review.priority === "Featured"
  ).length;

  const averageRating =
    reviews.length === 0
      ? 0
      : (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1);

  const openReview = (review) => {
    setSelectedReview(review);
    setReplyText(review.adminReply || "");
  };

  const updateReview = (id, changes) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, ...changes } : review
      )
    );

    if (selectedReview?.id === id) {
      setSelectedReview((prev) => ({
        ...prev,
        ...changes,
      }));
    }
  };

  const approveReview = (id) => {
    updateReview(id, { status: "Approved" });
  };

  const rejectReview = (id) => {
    updateReview(id, { status: "Rejected" });
  };

  const toggleFeatured = (id) => {
    const currentReview = reviews.find((review) => review.id === id);

    updateReview(id, {
      priority:
        currentReview?.priority === "Featured" ? "Normal" : "Featured",
    });
  };

  const saveReply = () => {
    if (!selectedReview) return;

    if (!replyText.trim()) {
      alert("Please write a reply before saving.");
      return;
    }

    updateReview(selectedReview.id, {
      adminReply: replyText,
      status: "Approved",
    });

    alert("Reply saved successfully.");
  };

  const deleteReview = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    setReviews((prev) => prev.filter((review) => review.id !== id));

    if (selectedReview?.id === id) {
      setSelectedReview(null);
      setReplyText("");
    }
  };

  const statusClass = (status) => {
    if (status === "Pending") return "review-pending";
    if (status === "Approved") return "review-approved";
    if (status === "Rejected") return "review-rejected";
    return "review-pending";
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <>
      <Navbar />

      <div className="reviews-page">
        <style>{`
          .reviews-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at top left, rgba(212, 175, 55, 0.16), transparent 28%),
              radial-gradient(circle at bottom right, rgba(0, 74, 173, 0.13), transparent 30%),
              #f6f8ff;
          }

          .reviews-container {
            max-width: 1250px;
            margin: 0 auto;
          }

          .reviews-hero {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            padding: 30px;
            border-radius: 30px;
            background:
              linear-gradient(135deg, rgba(255,255,255,0.97), rgba(246,248,255,0.93));
            border: 1px solid rgba(212, 175, 55, 0.3);
            box-shadow: 0 24px 55px rgba(0, 31, 77, 0.13);
            margin-bottom: 24px;
            position: relative;
            overflow: hidden;
          }

          .reviews-hero::after {
            content: "";
            position: absolute;
            width: 220px;
            height: 220px;
            right: -90px;
            top: -90px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.26), transparent 70%);
          }

          .reviews-hero h1 {
            color: #001f4d;
            font-size: clamp(30px, 5vw, 48px);
            font-weight: 950;
            margin-bottom: 8px;
          }

          .reviews-hero h1 span {
            color: #d4af37;
          }

          .reviews-hero p {
            color: #667085;
            max-width: 720px;
            line-height: 1.7;
            font-weight: 600;
          }

          .reviews-badge {
            padding: 12px 18px;
            border-radius: 999px;
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
            font-weight: 950;
            white-space: nowrap;
            box-shadow: 0 14px 30px rgba(212,175,55,0.22);
            position: relative;
            z-index: 2;
          }

          .reviews-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(165px, 210px));
            justify-content: center;
            gap: 16px;
            margin-bottom: 24px;
          }

          .review-stat-card {
            background: rgba(255,255,255,0.97);
            border: 1px solid rgba(212,175,55,0.18);
            border-radius: 22px;
            padding: 17px;
            box-shadow: 0 14px 35px rgba(0,31,77,0.09);
            transition: 0.3s ease;
          }

          .review-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 45px rgba(0,31,77,0.14);
          }

          .review-stat-card h3 {
            color: #667085;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .review-stat-card h2 {
            color: #d4af37;
            font-size: 27px;
            font-weight: 950;
          }

          .reviews-tools {
            display: grid;
            grid-template-columns: 1.5fr 0.7fr;
            gap: 14px;
            margin-bottom: 22px;
          }

          .reviews-tools input,
          .reviews-tools select {
            width: 100%;
            padding: 14px 16px;
            border-radius: 16px;
            border: 1px solid rgba(0,74,173,0.14);
            background: #fff;
            font-weight: 750;
            color: #001f4d;
            box-shadow: 0 10px 25px rgba(0,31,77,0.06);
          }

          .reviews-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            align-items: start;
          }

          .reviews-list {
            display: grid;
            gap: 14px;
          }

          .review-card {
            background: rgba(255,255,255,0.98);
            border-radius: 22px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 14px 35px rgba(0,31,77,0.09);
            padding: 17px;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .review-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 45px rgba(0,31,77,0.14);
          }

          .review-card.active {
            border-color: #d4af37;
            box-shadow: 0 22px 50px rgba(212,175,55,0.18);
          }

          .review-top {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
          }

          .review-top h3 {
            color: #001f4d;
            font-size: 17px;
            margin-bottom: 5px;
          }

          .review-top p,
          .review-meta {
            color: #667085;
            font-size: 13px;
            line-height: 1.5;
          }

          .review-product {
            color: #001f4d;
            font-weight: 900;
            margin-bottom: 7px;
          }

          .review-stars {
            color: #d4af37;
            font-size: 18px;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .review-preview {
            color: #667085;
            font-size: 14px;
            line-height: 1.6;
          }

          .review-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
          }

          .tag {
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 900;
          }

          .review-pending {
            background: #fff7d6;
            color: #92400e;
          }

          .review-approved {
            background: #dcfce7;
            color: #166534;
          }

          .review-rejected {
            background: #fee2e2;
            color: #991b1b;
          }

          .featured-tag {
            background: linear-gradient(135deg, #fff7d6, #d4af37);
            color: #001f4d;
          }

          .normal-tag {
            background: #dbeafe;
            color: #1e3a8a;
          }

          .review-details {
            position: sticky;
            top: 95px;
            background: rgba(255,255,255,0.98);
            border-radius: 26px;
            border: 1px solid rgba(212,175,55,0.2);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
            padding: 22px;
          }

          .review-details h2 {
            color: #001f4d;
            margin-bottom: 8px;
            font-size: 24px;
          }

          .details-stars {
            color: #d4af37;
            font-size: 24px;
            margin: 12px 0;
          }

          .details-info {
            display: grid;
            gap: 10px;
            margin: 18px 0;
          }

          .info-row {
            display: flex;
            justify-content: space-between;
            gap: 14px;
            padding: 10px 0;
            border-bottom: 1px dashed rgba(0,31,77,0.12);
            color: #001f4d;
            font-weight: 850;
          }

          .info-row span {
            color: #667085;
            font-weight: 700;
          }

          .full-review {
            margin: 18px 0;
            padding: 16px;
            border-radius: 18px;
            background: #f8fbff;
            color: #001f4d;
            line-height: 1.7;
            border: 1px solid rgba(0,74,173,0.08);
          }

          .reply-box textarea {
            width: 100%;
            min-height: 120px;
            padding: 14px;
            border-radius: 18px;
            border: 1px solid rgba(0,74,173,0.14);
            resize: vertical;
            font-family: inherit;
            font-size: 14px;
            color: #001f4d;
            background: #fff;
          }

          .review-actions,
          .review-mini-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 12px;
          }

          .review-actions button,
          .review-mini-actions button {
            padding: 12px;
            border-radius: 14px;
            border: none;
            font-weight: 900;
            cursor: pointer;
            transition: 0.3s ease;
          }

          .primary-btn {
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
          }

          .gold-btn {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .danger-btn {
            background: #dc2626;
            color: #fff;
          }

          .review-actions button:hover,
          .review-mini-actions button:hover {
            transform: translateY(-2px);
          }

          .empty-reviews,
          .empty-details {
            background: #fff;
            border-radius: 24px;
            padding: 35px;
            color: #667085;
            text-align: center;
            font-weight: 750;
            box-shadow: 0 16px 40px rgba(0,31,77,0.09);
          }

          @media (max-width: 950px) {
            .reviews-hero {
              flex-direction: column;
              align-items: flex-start;
            }

            .reviews-tools {
              grid-template-columns: 1fr;
            }

            .reviews-layout {
              grid-template-columns: 1fr;
            }

            .review-details {
              position: static;
            }
          }

          @media (max-width: 600px) {
            .reviews-page {
              padding: 14px;
            }

            .reviews-hero {
              padding: 22px 16px;
              border-radius: 22px;
            }

            .reviews-stats {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .review-stat-card {
              padding: 14px;
              border-radius: 18px;
            }

            .review-stat-card h2 {
              font-size: 22px;
            }

            .review-top {
              flex-direction: column;
            }

            .review-actions,
            .review-mini-actions {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div className="reviews-container">
          <div className="reviews-hero">
            <div>
              <h1>
                Customer <span>Reviews</span>
              </h1>
              <p>
                Review customer feedback, approve testimonials, reject poor or
                inappropriate reviews, reply professionally and feature the best
                reviews on Chafadia Enterprise.
              </p>
            </div>

            <div className="reviews-badge">
              {averageRating} ★ Average
            </div>
          </div>

          <div className="reviews-stats">
            <div className="review-stat-card">
              <h3>Total Reviews</h3>
              <h2>{totalReviews}</h2>
            </div>

            <div className="review-stat-card">
              <h3>Pending</h3>
              <h2>{pendingReviews}</h2>
            </div>

            <div className="review-stat-card">
              <h3>Approved</h3>
              <h2>{approvedReviews}</h2>
            </div>

            <div className="review-stat-card">
              <h3>Featured</h3>
              <h2>{featuredReviews}</h2>
            </div>
          </div>

          <div className="reviews-tools">
            <input
              type="search"
              placeholder="Search by customer, email, product or review..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Reviews</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Featured">Featured</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="reviews-layout">
            <div className="reviews-list">
              {filteredReviews.length === 0 ? (
                <div className="empty-reviews">
                  No reviews found.
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className={
                      selectedReview?.id === review.id
                        ? "review-card active"
                        : "review-card"
                    }
                    onClick={() => openReview(review)}
                  >
                    <div className="review-top">
                      <div>
                        <h3>{review.customerName}</h3>
                        <p>{review.email}</p>
                      </div>

                      <span className={`tag ${statusClass(review.status)}`}>
                        {review.status}
                      </span>
                    </div>

                    <div className="review-product">
                      {review.product}
                    </div>

                    <div className="review-stars">
                      {renderStars(review.rating)}
                    </div>

                    <p className="review-preview">
                      {review.review.length > 115
                        ? `${review.review.slice(0, 115)}...`
                        : review.review}
                    </p>

                    <div className="review-tags">
                      <span
                        className={
                          review.priority === "Featured"
                            ? "tag featured-tag"
                            : "tag normal-tag"
                        }
                      >
                        {review.priority}
                      </span>

                      <span className="review-meta">
                        {review.date}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedReview ? (
              <div className="review-details">
                <h2>{selectedReview.product}</h2>
                <p className="review-meta">
                  Review from {selectedReview.customerName}
                </p>

                <div className="details-stars">
                  {renderStars(selectedReview.rating)}
                </div>

                <div className="details-info">
                  <div className="info-row">
                    <span>Customer</span>
                    <strong>{selectedReview.customerName}</strong>
                  </div>

                  <div className="info-row">
                    <span>Email</span>
                    <strong>{selectedReview.email}</strong>
                  </div>

                  <div className="info-row">
                    <span>Status</span>
                    <strong>{selectedReview.status}</strong>
                  </div>

                  <div className="info-row">
                    <span>Priority</span>
                    <strong>{selectedReview.priority}</strong>
                  </div>

                  <div className="info-row">
                    <span>Date</span>
                    <strong>{selectedReview.date}</strong>
                  </div>
                </div>

                <div className="full-review">
                  {selectedReview.review}
                </div>

                <div className="reply-box">
                  <textarea
                    placeholder="Write a professional public reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />

                  <div className="review-actions">
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={saveReply}
                    >
                      Save Reply
                    </button>

                    <button
                      type="button"
                      className="gold-btn"
                      onClick={() => approveReview(selectedReview.id)}
                    >
                      Approve
                    </button>
                  </div>
                </div>

                <div className="review-mini-actions">
                  <button
                    type="button"
                    className="gold-btn"
                    onClick={() => toggleFeatured(selectedReview.id)}
                  >
                    Feature / Unfeature
                  </button>

                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => rejectReview(selectedReview.id)}
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => deleteReview(selectedReview.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-details">
                Select a review to view details and manage it.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerReviews;