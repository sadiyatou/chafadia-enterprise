import { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../context/StoreContext";

function ManageProducts() {
  const {
    products = [],
    addProduct,
    updateProduct,
    deleteProduct,
    setProductAvailability,
  } = useStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    price: "",
    stock: "",
    addStock: "",
    status: "Available",
  });

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    video: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [fullImagePreview, setFullImagePreview] = useState(null);

  const formatMoney = (amount) =>
    `${Number(amount || 0).toLocaleString()} FCFA`;

  const fileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    fileToBase64(file, (base64) => {
      setForm((prev) => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file.");
      return;
    }

    fileToBase64(file, (base64) => {
      setForm((prev) => ({ ...prev, video: base64 }));
      setVideoPreview(base64);
    });
  };

  const resetAddForm = () => {
    setForm({
      name: "",
      price: "",
      category: "",
      stock: "",
      image: "",
      video: "",
    });
    setImagePreview("");
    setVideoPreview("");
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return alert("Please enter product name.");
    if (Number(form.price) <= 0) return alert("Please enter a valid price.");
    if (Number(form.stock) < 0) return alert("Stock cannot be negative.");

    addProduct({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      status: Number(form.stock) <= 0 ? "Out of Stock" : "Available",
      image: form.image,
      video: form.video,
    });

    resetAddForm();
    alert("Product added successfully.");
  };

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = `${product.name} ${product.category} ${product.collection || ""}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0
  );
  const lowStock = products.filter(
    (product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
  ).length;
  const outOfStock = products.filter(
    (product) => Number(product.stock || 0) <= 0
  ).length;
  const productsWithVideos = products.filter((product) => product.video).length;
  const totalValue = products.reduce(
    (sum, product) =>
      sum + Number(product.price || 0) * Number(product.stock || 0),
    0
  );

  const getStockLabel = (stock) => {
    const quantity = Number(stock || 0);
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= 5) return "Low Stock";
    return "Available";
  };

  const stockClass = (stock) => {
    const quantity = Number(stock || 0);
    if (quantity <= 0) return "stock-badge stock-out";
    if (quantity <= 5) return "stock-badge stock-low";
    return "stock-badge stock-available";
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      price: String(product.price || ""),
      stock: String(product.stock || 0),
      addStock: "",
      status: product.status || (Number(product.stock || 0) <= 0 ? "Out of Stock" : "Available"),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      price: "",
      stock: "",
      addStock: "",
      status: "Available",
    });
  };

  const saveProductChanges = (product) => {
    const directStock = Number(editForm.stock || 0);
    const extraStock = Number(editForm.addStock || 0);
    const finalStock = directStock + extraStock;
    const finalPrice = Number(editForm.price || 0);

    if (finalPrice <= 0) return alert("Please enter a valid price.");
    if (directStock < 0 || extraStock < 0) {
      return alert("Stock quantity cannot be negative.");
    }

    const finalStatus =
      finalStock <= 0 ? "Out of Stock" : editForm.status || "Available";

    updateProduct(product.id, {
      price: finalPrice,
      stock: finalStock,
      status: finalStatus,
      updatedAt: new Date().toISOString(),
    });

    alert("Product price and stock updated successfully.");
    cancelEdit();
  };

  const quickAddStock = (product, amount) => {
    const quantity = Number(amount || 0);
    if (quantity <= 0) return alert("Please enter a valid stock quantity.");

    const newStock = Number(product.stock || 0) + quantity;

    updateProduct(product.id, {
      stock: newStock,
      status: "Available",
      updatedAt: new Date().toISOString(),
    });

    alert(`${quantity} item(s) added to stock.`);
  };

  const markOutOfStock = (product) => {
    if (!window.confirm(`Mark "${product.name}" as out of stock?`)) return;

    if (typeof setProductAvailability === "function") {
      setProductAvailability(product.id, "Out of Stock");
    }

    updateProduct(product.id, {
      stock: 0,
      status: "Out of Stock",
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteProductSafely = (product) => {
    const stock = Number(product.stock || 0);

    if (stock > 0) {
      const confirmDelete = window.confirm(
        `"${product.name}" still has ${stock} item(s) in stock. Delete it anyway?`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm(
        `Delete "${product.name}" from products? This item is out of stock.`
      );
      if (!confirmDelete) return;
    }

    deleteProduct(product.id);
  };

  const openFullImage = (product) => {
    if (!product?.image) {
      alert("This product does not have an image to preview.");
      return;
    }

    setFullImagePreview({
      src: product.image,
      name: product.name || "Product Image",
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
  };

  const closeFullImage = () => {
    setFullImagePreview(null);
  };

  return (
    <>
      <Navbar />

      <div className="products-admin-page">
        <style>{`
          .products-admin-page {
            min-height: 100vh;
            padding: 28px;
            background:
              radial-gradient(circle at 8% 8%, rgba(212, 175, 55, 0.24), transparent 26%),
              radial-gradient(circle at 88% 14%, rgba(0, 74, 173, 0.16), transparent 28%),
              radial-gradient(circle at 90% 92%, rgba(212, 175, 55, 0.12), transparent 28%),
              linear-gradient(135deg, #f6f8ff 0%, #ffffff 48%, #f6f8ff 100%);
          }

          .products-admin-container {
            max-width: 1320px;
            margin: 0 auto;
          }

          .products-admin-hero {
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 28px;
            padding: 34px;
            border-radius: 36px;
            margin-bottom: 22px;
            background:
              radial-gradient(circle at top right, rgba(212,175,55,.18), transparent 30%),
              linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,248,255,0.93));
            border: 1px solid rgba(212, 175, 55, 0.38);
            box-shadow:
              0 28px 75px rgba(0, 31, 77, 0.14),
              inset 0 1px 0 rgba(255,255,255,0.96);
          }

          .products-admin-hero::before {
            content: "";
            position: absolute;
            width: 320px;
            height: 320px;
            right: -145px;
            top: -150px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.32), transparent 68%);
          }

          .products-hero-content {
            position: relative;
            z-index: 2;
          }

          .products-label {
            display: inline-flex;
            padding: 8px 15px;
            border-radius: 999px;
            margin-bottom: 14px;
            background: rgba(212, 175, 55, 0.15);
            color: #001f4d;
            border: 1px solid rgba(212, 175, 55, 0.35);
            font-size: 12px;
            font-weight: 950;
            letter-spacing: 0.9px;
            text-transform: uppercase;
            box-shadow: 0 10px 25px rgba(212, 175, 55, 0.12);
          }

          .products-admin-hero h1 {
            color: #001f4d;
            font-size: clamp(32px, 5vw, 56px);
            font-weight: 950;
            letter-spacing: -1.2px;
            margin-bottom: 10px;
          }

          .products-admin-hero h1 span {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .products-admin-hero p {
            color: #667085;
            max-width: 780px;
            line-height: 1.76;
            font-weight: 680;
            font-size: 15px;
          }

          .products-hero-badge {
            position: relative;
            z-index: 2;
            min-width: 145px;
            min-height: 145px;
            border-radius: 36px;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow:
              0 22px 50px rgba(0,31,77,0.23),
              inset 0 1px 0 rgba(255,255,255,0.22);
            border: 1px solid rgba(255,255,255,0.25);
          }

          .products-hero-badge strong {
            font-size: 42px;
            color: #d4af37;
            line-height: 1;
          }

          .products-hero-badge span {
            margin-top: 7px;
            font-size: 12px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .products-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(155px, 190px));
            justify-content: center;
            gap: 14px;
            margin-bottom: 24px;
          }

          .product-stat-card {
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.98);
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 23px;
            padding: 16px;
            box-shadow: 0 15px 38px rgba(0,31,77,0.085);
            transition: 0.3s ease;
          }

          .product-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 22px 48px rgba(0,31,77,0.13);
          }

          .product-stat-card h3 {
            color: #667085;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .product-stat-card h2 {
            color: #d4af37;
            font-size: 24px;
            font-weight: 950;
          }

          .products-main-grid {
            display: grid;
            grid-template-columns: minmax(350px, 420px) minmax(0, 1fr);
            gap: 22px;
            align-items: start;
          }

          .add-product-card,
          .premium-product-card {
            background: rgba(255,255,255,0.99);
            border-radius: 27px;
            border: 1px solid rgba(212,175,55,0.18);
            box-shadow: 0 18px 45px rgba(0,31,77,0.1);
          }

          .add-product-card {
            position: sticky;
            top: 95px;
            overflow: hidden;
          }

          .add-product-head {
            padding: 21px;
            background: linear-gradient(135deg, rgba(0,74,173,0.08), rgba(212,175,55,0.13));
            border-bottom: 1px solid rgba(0,74,173,0.08);
          }

          .add-product-head h2 {
            color: #001f4d;
            font-size: 22px;
            margin-bottom: 7px;
          }

          .add-product-head p {
            color: #667085;
            font-size: 13.3px;
            line-height: 1.6;
            font-weight: 650;
          }

          .add-product-form {
            padding: 21px;
            display: grid;
            gap: 12px;
          }

          input,
          select {
            width: 100%;
            padding: 13px 14px;
            border-radius: 16px;
            border: 1px solid rgba(0,74,173,0.14);
            background: #fff;
            color: #001f4d;
            font-weight: 750;
            outline: none;
            transition: 0.28s ease;
          }

          input:focus,
          select:focus {
            border-color: #d4af37;
            box-shadow: 0 0 0 4px rgba(212,175,55,0.14);
          }

          .file-upload-group {
            display: grid;
            gap: 10px;
          }

          .upload-label {
            display: block;
            padding: 14px;
            border-radius: 17px;
            border: 1.5px dashed rgba(0,74,173,0.25);
            background: linear-gradient(135deg, #f8fbff, #ffffff);
            color: #001f4d;
            font-weight: 900;
            cursor: pointer;
            text-align: center;
            transition: 0.3s ease;
          }

          .upload-label:hover {
            border-color: #d4af37;
            background: #fff9e6;
            transform: translateY(-1px);
          }

          .upload-label small {
            display: block;
            color: #667085;
            margin-top: 5px;
            font-size: 12px;
            font-weight: 700;
          }

          .hidden-file-input {
            display: none;
          }

          .media-preview-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 11px;
          }

          .media-preview-box {
            min-height: 118px;
            border-radius: 17px;
            overflow: hidden;
            background: #f8fbff;
            border: 1px solid rgba(0,74,173,0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #667085;
            font-size: 13px;
            font-weight: 800;
            text-align: center;
          }

          .media-preview-box img,
          .media-preview-box video {
            width: 100%;
            height: 118px;
            object-fit: cover;
            display: block;
          }

          .primary-btn,
          .save-btn,
          .stock-btn,
          .edit-btn,
          .delete-product-btn,
          .cancel-btn,
          .out-stock-btn {
            width: 100%;
            border: none;
            padding: 12px 14px;
            border-radius: 16px;
            cursor: pointer;
            font-weight: 950;
            transition: 0.3s ease;
          }

          .primary-btn,
          .save-btn {
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: white;
            box-shadow: 0 14px 30px rgba(0,31,77,0.18);
          }

          .primary-btn:hover,
          .save-btn:hover,
          .stock-btn:hover,
          .edit-btn:hover,
          .delete-product-btn:hover,
          .cancel-btn:hover,
          .out-stock-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.03);
          }

          .stock-btn {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
          }

          .edit-btn {
            background: #eaf1ff;
            color: #001f4d;
            border: 1px solid rgba(0,74,173,0.12);
          }

          .cancel-btn {
            background: #f3f4f6;
            color: #374151;
          }

          .out-stock-btn {
            background: #fff7d6;
            color: #92400e;
            border: 1px solid rgba(146,64,14,0.16);
          }

          .delete-product-btn {
            background: #dc2626;
            color: white;
          }

          .view-full-btn {
            grid-column: 1 / -1;
            background: linear-gradient(135deg, #ffffff, #f8fbff);
            color: #001f4d;
            border: 1px solid rgba(0,74,173,0.12);
          }

          .image-preview-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: rgba(0, 31, 77, 0.82);
            backdrop-filter: blur(9px);
          }

          .image-preview-modal {
            position: relative;
            width: min(1120px, 96vw);
            max-height: 94vh;
            padding: 18px;
            border-radius: 30px;
            background:
              radial-gradient(circle at top right, rgba(212,175,55,0.18), transparent 28%),
              linear-gradient(135deg, #ffffff, #f8fbff);
            border: 1px solid rgba(212,175,55,0.45);
            box-shadow: 0 36px 110px rgba(0,0,0,0.42);
            overflow: hidden;
          }

          .image-preview-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            padding: 4px 58px 14px 4px;
          }

          .image-preview-head h2 {
            color: #001f4d;
            font-size: clamp(20px, 3vw, 30px);
            line-height: 1.15;
            margin: 0 0 6px;
            font-weight: 950;
          }

          .image-preview-head p {
            color: #667085;
            font-size: 13px;
            font-weight: 750;
            line-height: 1.6;
            margin: 0;
          }

          .image-preview-price {
            color: #b8860b;
            font-weight: 950;
          }

          .image-preview-modal img {
            width: 100%;
            max-height: 76vh;
            object-fit: contain;
            display: block;
            border-radius: 22px;
            background: #ffffff;
            border: 1px solid rgba(0,74,173,0.08);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.7);
          }

          .close-preview {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #004aad, #001f4d);
            color: white;
            font-size: 22px;
            font-weight: 950;
            cursor: pointer;
            display: grid;
            place-items: center;
            box-shadow: 0 16px 34px rgba(0,31,77,0.24);
            transition: 0.3s ease;
          }

          .close-preview:hover {
            background: linear-gradient(135deg, #fff7d6, #d4af37, #b8860b);
            color: #001f4d;
            transform: rotate(90deg) scale(1.05);
          }

          .products-panel {
            display: grid;
            gap: 18px;
          }

          .products-tools {
            display: grid;
            grid-template-columns: minmax(0, 1.5fr) 220px;
            gap: 14px;
          }

          .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
            gap: 18px;
          }

          .premium-product-card {
            position: relative;
            overflow: hidden;
            transition: 0.3s ease;
          }

          .premium-product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 24px 56px rgba(0,31,77,0.14);
          }

          .product-image-wrap {
            position: relative;
            height: 160px;
            overflow: hidden;
            background: linear-gradient(135deg, #004aad, #001f4d);
          }

          .product-image-wrap img,
          .product-image-wrap video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: 0.4s ease;
          }

          .product-image-wrap img {
            cursor: zoom-in;
          }

          .view-image-tag {
            position: absolute;
            left: 12px;
            bottom: 12px;
            z-index: 3;
            padding: 7px 11px;
            border: none;
            border-radius: 999px;
            background: rgba(255,255,255,0.92);
            color: #001f4d;
            font-size: 10.5px;
            font-weight: 950;
            cursor: pointer;
            box-shadow: 0 10px 24px rgba(0,31,77,0.16);
            transition: 0.3s ease;
          }

          .view-image-tag:hover {
            background: linear-gradient(135deg, #fff7d6, #d4af37);
            transform: translateY(-2px);
          }

          .premium-product-card:hover .product-image-wrap img,
          .premium-product-card:hover .product-image-wrap video {
            transform: scale(1.045);
          }

          .product-placeholder {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 42px;
            font-weight: 950;
            color: #d4af37;
            background:
              radial-gradient(circle at top right, rgba(212,175,55,0.35), transparent 35%),
              linear-gradient(135deg, #004aad, #001f4d);
          }

          .product-floating-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 2;
          }

          .video-tag {
            position: absolute;
            left: 12px;
            top: 12px;
            z-index: 2;
            padding: 7px 11px;
            border-radius: 999px;
            background: rgba(0,31,77,0.82);
            color: #fff7d6;
            font-size: 11px;
            font-weight: 950;
          }

          .product-body {
            padding: 16px;
          }

          .product-body h3 {
            color: #001f4d;
            font-size: 17px;
            line-height: 1.2;
            margin-bottom: 6px;
          }

          .product-category {
            color: #667085;
            font-size: 12.5px;
            font-weight: 750;
            margin-bottom: 12px;
          }

          .product-info {
            display: grid;
            gap: 7px;
            margin-bottom: 13px;
          }

          .product-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 8px 0;
            border-bottom: 1px dashed rgba(0,31,77,0.12);
            color: #001f4d;
            font-weight: 850;
            font-size: 13px;
          }

          .product-row span {
            color: #667085;
            font-weight: 700;
          }

          .stock-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 7px 11px;
            border-radius: 999px;
            font-size: 10.5px;
            font-weight: 950;
            border: 1px solid transparent;
            box-shadow: 0 8px 16px rgba(0,31,77,0.055);
          }

          .stock-badge::before {
            content: "";
            width: 7px;
            height: 7px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .stock-available {
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            color: #166534;
            border-color: rgba(22,101,52,0.12);
          }

          .stock-available::before {
            background: #16a34a;
            box-shadow: 0 0 0 4px rgba(22,163,74,0.12);
          }

          .stock-low {
            background: linear-gradient(135deg, #fff7d6, #fde68a);
            color: #92400e;
            border-color: rgba(146,64,14,0.12);
          }

          .stock-low::before {
            background: #d97706;
            box-shadow: 0 0 0 4px rgba(217,119,6,0.12);
          }

          .stock-out {
            background: linear-gradient(135deg, #fff1f2, #fee2e2);
            color: #991b1b;
            border-color: rgba(153,27,27,0.13);
          }

          .stock-out::before {
            background: #dc2626;
            box-shadow: 0 0 0 4px rgba(220,38,38,0.12);
          }

          .product-actions,
          .edit-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 9px;
            margin-top: 10px;
          }

          .edit-panel {
            display: grid;
            gap: 10px;
            padding: 13px;
            margin: 12px 0;
            border-radius: 18px;
            background: linear-gradient(135deg, #f8fbff, #ffffff);
            border: 1px solid rgba(0,74,173,0.09);
          }

          .edit-panel label {
            display: grid;
            gap: 6px;
            color: #001f4d;
            font-size: 12px;
            font-weight: 950;
          }

          .quick-stock-row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 8px;
          }

          .empty-products {
            background: rgba(255,255,255,0.99);
            border-radius: 25px;
            padding: 34px;
            color: #667085;
            text-align: center;
            font-weight: 750;
            box-shadow: 0 16px 42px rgba(0,31,77,0.09);
            border: 1px solid rgba(212,175,55,0.18);
          }

          @media (max-width: 980px) {
            .products-admin-hero {
              flex-direction: column;
              align-items: flex-start;
            }

            .products-hero-badge {
              min-width: 120px;
              min-height: 95px;
              border-radius: 24px;
            }

            .products-hero-badge strong {
              font-size: 34px;
            }

            .products-main-grid {
              grid-template-columns: 1fr;
            }

            .add-product-card {
              position: static;
            }

            .products-tools {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 600px) {
            .products-admin-page {
              padding: 14px;
            }

            .products-admin-hero {
              padding: 22px 16px;
              border-radius: 26px;
            }

            .products-stats {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .products-grid {
              grid-template-columns: 1fr;
            }

            .product-image-wrap {
              height: 150px;
            }

            .media-preview-grid,
            .product-actions,
            .edit-actions {
              grid-template-columns: 1fr;
            }

            .image-preview-overlay {
              padding: 12px;
            }

            .image-preview-modal {
              border-radius: 22px;
              padding: 12px;
            }

            .image-preview-head {
              padding: 4px 48px 10px 4px;
            }

            .image-preview-modal img {
              max-height: 72vh;
              border-radius: 16px;
            }
          }
        `}</style>

        <div className="products-admin-container">
          <div className="products-admin-hero">
            <div className="products-hero-content">
              <span className="products-label">Admin Product Control</span>
              <h1>
                Manage <span>Products</span>
              </h1>
              <p>
                Add new goods, edit prices of products already in the system,
                increase stock quantity, mark items out of stock and delete
                products that are no longer available.
              </p>
            </div>

            <div className="products-hero-badge">
              <strong>{totalProducts}</strong>
              <span>Products</span>
            </div>
          </div>

          <div className="products-stats">
            <div className="product-stat-card">
              <h3>Total Products</h3>
              <h2>{totalProducts}</h2>
            </div>
            <div className="product-stat-card">
              <h3>Total Stock</h3>
              <h2>{totalStock}</h2>
            </div>
            <div className="product-stat-card">
              <h3>Low Stock</h3>
              <h2>{lowStock}</h2>
            </div>
            <div className="product-stat-card">
              <h3>Out of Stock</h3>
              <h2>{outOfStock}</h2>
            </div>
            <div className="product-stat-card">
              <h3>With Videos</h3>
              <h2>{productsWithVideos}</h2>
            </div>
            <div className="product-stat-card">
              <h3>Stock Value</h3>
              <h2>{formatMoney(totalValue)}</h2>
            </div>
          </div>

          <div className="products-main-grid">
            <div className="add-product-card">
              <div className="add-product-head">
                <h2>Add New Product</h2>
                <p>
                  Add new goods into stock with product name, price, category,
                  quantity, image and optional video.
                </p>
              </div>

              <form className="add-product-form" onSubmit={handleAdd}>
                <input
                  placeholder="Product Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  type="number"
                  min="1"
                  placeholder="Price in FCFA"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <select
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="Feminine Secrets">Feminine Secrets</option>
                  <option value="Elegant Dresses">Elegant Dresses</option>
                  <option value="Hand Bags">Hand Bags</option>
                  <option value="Shoes & Footwear">Shoes & Footwear</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Crips Co.">Crips Co.</option>
                  <option value="Cleaning & Hygiene">Cleaning & Hygiene</option>
                  <option value="Halal Drinks">Halal Drinks</option>
                  <option value="Botanicals">Botanicals</option>
                  <option value="Wellness">Wellness</option>
                </select>

                <input
                  type="number"
                  min="0"
                  placeholder="Stock Quantity"
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />

                <div className="file-upload-group">
                  <label className="upload-label">
                    Upload Product Image
                    <small>PNG, JPG, JPEG, WEBP accepted</small>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden-file-input"
                      onChange={handleImageUpload}
                    />
                  </label>

                  <label className="upload-label">
                    Upload Product Video
                    <small>MP4, WEBM and other video files accepted</small>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden-file-input"
                      onChange={handleVideoUpload}
                    />
                  </label>
                </div>

                <div className="media-preview-grid">
                  <div className="media-preview-box">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Product preview" />
                    ) : (
                      "Image preview"
                    )}
                  </div>

                  <div className="media-preview-box">
                    {videoPreview ? (
                      <video src={videoPreview} controls />
                    ) : (
                      "Video preview"
                    )}
                  </div>
                </div>

                <button className="primary-btn" type="submit">
                  Add Product to Stock
                </button>
              </form>
            </div>

            <div className="products-panel">
              <div className="products-tools">
                <input
                  type="search"
                  placeholder="Search product name, category or collection..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="products-grid">
                {filteredProducts.length === 0 ? (
                  <div className="empty-products">No products found.</div>
                ) : (
                  filteredProducts.map((product) => {
                    const isEditing = editingId === product.id;

                    return (
                      <div className="premium-product-card" key={product.id}>
                        <div className="product-image-wrap">
                          {product.video ? (
                            <>
                              <span className="video-tag">Video</span>
                              <video src={product.video} controls />
                            </>
                          ) : product.image ? (
                            <>
                              <img
                                src={product.image}
                                alt={product.name}
                                onClick={() => openFullImage(product)}
                                title="Click to view full image"
                              />
                              <button
                                type="button"
                                className="view-image-tag"
                                onClick={() => openFullImage(product)}
                              >
                                View Full Image
                              </button>
                            </>
                          ) : (
                            <div className="product-placeholder">
                              {product.name?.charAt(0) || "P"}
                            </div>
                          )}

                          <div className="product-floating-badge">
                            <span className={stockClass(product.stock)}>
                              {getStockLabel(product.stock)}
                            </span>
                          </div>
                        </div>

                        <div className="product-body">
                          <h3>{product.name}</h3>
                          <p className="product-category">
                            {product.category}
                            {product.collection ? ` • ${product.collection}` : ""}
                          </p>

                          <div className="product-info">
                            <div className="product-row">
                              <span>Price</span>
                              <strong>{formatMoney(product.price)}</strong>
                            </div>

                            <div className="product-row">
                              <span>Stock</span>
                              <strong>{Number(product.stock || 0)}</strong>
                            </div>

                            <div className="product-row">
                              <span>Value</span>
                              <strong>
                                {formatMoney(
                                  Number(product.price || 0) *
                                    Number(product.stock || 0)
                                )}
                              </strong>
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="edit-panel">
                              <label>
                                Edit Price
                                <input
                                  type="number"
                                  min="1"
                                  value={editForm.price}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      price: e.target.value,
                                    })
                                  }
                                />
                              </label>

                              <label>
                                Current Stock
                                <input
                                  type="number"
                                  min="0"
                                  value={editForm.stock}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      stock: e.target.value,
                                    })
                                  }
                                />
                              </label>

                              <label>
                                Add More Stock
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Example: 5"
                                  value={editForm.addStock}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      addStock: e.target.value,
                                    })
                                  }
                                />
                              </label>

                              <label>
                                Product Status
                                <select
                                  value={editForm.status}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      status: e.target.value,
                                    })
                                  }
                                >
                                  <option value="Available">Available</option>
                                  <option value="Out of Stock">Out of Stock</option>
                                </select>
                              </label>

                              <div className="edit-actions">
                                <button
                                  type="button"
                                  className="save-btn"
                                  onClick={() => saveProductChanges(product)}
                                >
                                  Save Changes
                                </button>

                                <button
                                  type="button"
                                  className="cancel-btn"
                                  onClick={cancelEdit}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="quick-stock-row">
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="Add stock"
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      addStock: e.target.value,
                                    })
                                  }
                                />
                                <button
                                  type="button"
                                  className="stock-btn"
                                  onClick={() =>
                                    quickAddStock(product, editForm.addStock)
                                  }
                                >
                                  Add
                                </button>
                              </div>

                              <div className="product-actions">
                                <button
                                  type="button"
                                  className="edit-btn view-full-btn"
                                  onClick={() => openFullImage(product)}
                                >
                                  View Full Image
                                </button>

                                <button
                                  type="button"
                                  className="edit-btn"
                                  onClick={() => startEdit(product)}
                                >
                                  Edit Price / Stock
                                </button>

                                <button
                                  type="button"
                                  className="out-stock-btn"
                                  onClick={() => markOutOfStock(product)}
                                >
                                  Mark Out
                                </button>

                                <button
                                  type="button"
                                  className="delete-product-btn"
                                  onClick={() => deleteProductSafely(product)}
                                >
                                  Delete Product
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {fullImagePreview && (
          <div className="image-preview-overlay" onClick={closeFullImage}>
            <div
              className="image-preview-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="close-preview"
                onClick={closeFullImage}
                aria-label="Close full image preview"
              >
                ×
              </button>

              <div className="image-preview-head">
                <div>
                  <h2>{fullImagePreview.name}</h2>
                  <p>
                    {fullImagePreview.category || "Product"} •{" "}
                    <span className="image-preview-price">
                      {formatMoney(fullImagePreview.price)}
                    </span>{" "}
                    • Stock: {Number(fullImagePreview.stock || 0)}
                  </p>
                </div>
              </div>

              <img src={fullImagePreview.src} alt={fullImagePreview.name} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ManageProducts;
