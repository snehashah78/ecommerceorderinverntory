import "./Product.css";
import { useState, useEffect, useCallback } from "react";
import { checkInventory } from "../../api/inventoryApi";
import { Link } from "react-router-dom";
import {
  FaSearch, FaShoppingCart, FaHeart, FaRegHeart,
  FaStar, FaTh, FaList, FaFilter, FaArrowLeft,
  FaSortAmountDown, FaEye, FaTimes,
} from "react-icons/fa";

/* ── Static product catalogue ───────────── */
const PRODUCTS = [
  { id: 1,  name: "Wireless Headphones", price: 2499,  category: "Electronics", rating: 4.5, reviews: 128, isNew: false, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30?w=500" },
  { id: 2,  name: "Smart Watch",         price: 8999,  category: "Electronics", rating: 4.3, reviews: 94,  isNew: true,  image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500" },
  { id: 3,  name: "Laptop",              price: 54999, category: "Electronics", rating: 4.7, reviews: 215, isNew: false, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500" },
  { id: 4,  name: "Running Shoes",       price: 3499,  category: "Fashion",     rating: 4.4, reviews: 176, isNew: true,  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
  { id: 5,  name: "Gaming Mouse",        price: 1299,  category: "Electronics", rating: 4.2, reviews: 83,  isNew: false, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500" },
  { id: 6,  name: "Mechanical Keyboard", price: 2799,  category: "Electronics", rating: 4.6, reviews: 142, isNew: false, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500" },
  { id: 7,  name: "Bluetooth Speaker",   price: 1899,  category: "Electronics", rating: 4.1, reviews: 67,  isNew: false, image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500" },
  { id: 8,  name: "DSLR Camera",         price: 44999, category: "Electronics", rating: 4.8, reviews: 309, isNew: false, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500" },
  { id: 9,  name: "iPhone 15",           price: 79999, category: "Electronics", rating: 4.9, reviews: 512, isNew: true,  image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" },
  { id: 10, name: "Tablet",              price: 24999, category: "Electronics", rating: 4.3, reviews: 88,  isNew: false, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500" },
  { id: 11, name: "Backpack",            price: 1499,  category: "Fashion",     rating: 4.0, reviews: 55,  isNew: false, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" },
  { id: 12, name: "Office Chair",        price: 6999,  category: "Furniture",   rating: 4.4, reviews: 102, isNew: true,  image: "https://images.unsplash.com/photo-1505843490701-5be5d6f6d6b8?w=500" },
  { id: 13, name: "LED Monitor",         price: 12999, category: "Electronics", rating: 4.5, reviews: 189, isNew: false, image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=500" },
  { id: 14, name: "Power Bank",          price: 1499,  category: "Electronics", rating: 4.2, reviews: 74,  isNew: false, image: "https://images.unsplash.com/photo-1609592806596-b43d0ef0f4cb?w=500" },
  { id: 15, name: "AirPods",             price: 14999, category: "Electronics", rating: 4.7, reviews: 263, isNew: true,  image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500" },
  { id: 16, name: "Winter Jacket",       price: 2999,  category: "Fashion",     rating: 4.3, reviews: 91,  isNew: false, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723?w=500" },
  { id: 17, name: "Desk Lamp",           price: 899,   category: "Furniture",   rating: 4.0, reviews: 44,  isNew: false, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500" },
  { id: 18, name: "Sunglasses",          price: 1299,  category: "Fashion",     rating: 4.1, reviews: 60,  isNew: true,  image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500" },
];

const CATEGORIES  = ["All", "Electronics", "Fashion", "Furniture"];
const SORT_OPTIONS = [
  { label: "Default",            value: "default"    },
  { label: "Price: Low → High",  value: "price_asc"  },
  { label: "Price: High → Low",  value: "price_desc" },
  { label: "Top Rated",          value: "rating"     },
  { label: "Most Reviews",       value: "reviews"    },
];

/* ── Star rating ────────────────────────── */
function StarRating({ rating }) {
  return (
    <div className="pp-stars">
      {[1,2,3,4,5].map((s) => (
        <FaStar key={s} className={s <= Math.round(rating) ? "pp-star filled" : "pp-star"} />
      ))}
      <span className="pp-rating-num">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ── Toast ──────────────────────────────── */
function Toast({ toasts }) {
  return (
    <div className="pp-toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`pp-toast pp-toast-${t.type}`}>
          <span>{t.type === "success" ? "✅" : "❌"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ── Quick View Modal ───────────────────── */
function QuickViewModal({ product, stock, isWished, onAddToCart, onToggleWish, onClose }) {
  const inStock = stock === undefined || stock > 0;

  return (
    <div className="pp-modal-backdrop" onClick={onClose}>
      <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
        <img className="pp-modal-img" src={product.image} alt={product.name} />
        <div className="pp-modal-body">
          <button className="pp-modal-close" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
          <span className="pp-modal-category">{product.category}</span>
          <h2 className="pp-modal-name">{product.name}</h2>
          <StarRating rating={product.rating} />
          <p style={{ fontSize: 13, color: "#9ca3af" }}>({product.reviews} verified reviews)</p>
          <div className="pp-modal-price-row">
            <span className="pp-modal-price">₹{product.price.toLocaleString()}</span>
            <span className="pp-modal-old-price">₹{Math.round(product.price * 1.2).toLocaleString()}</span>
            <span className="pp-modal-discount">20% off</span>
          </div>
          <p className="pp-modal-desc">
            Premium quality {product.name.toLowerCase()} from top-rated brands. Fast delivery available across India with easy 7-day returns and secure payment.
          </p>
          <span className={`pp-modal-stock ${inStock ? "in" : "out"}`}>
            {inStock ? `✓ In Stock${stock !== undefined ? ` — ${stock} left` : ""}` : "✗ Out of Stock"}
          </span>
          <div className="pp-modal-actions">
            <button
              className="pp-modal-add"
              disabled={!inStock}
              onClick={() => { onAddToCart(product); onClose(); }}
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              className={`pp-modal-wish ${isWished ? "wished" : ""}`}
              onClick={() => onToggleWish(product.id)}
              aria-label="Wishlist"
            >
              {isWished ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────── */
function Product() {
  const [stockMap, setStockMap]       = useState({});
  const [stockLoading, setStockLoading] = useState(true);
  const [wishlist, setWishlist]       = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist")) || []; } catch { return []; }
  });
  const [cartCount, setCartCount]     = useState(() => {
    try { return (JSON.parse(localStorage.getItem("cart")) || []).length; } catch { return 0; }
  });
  const [toasts, setToasts]           = useState([]);
  const [search, setSearch]           = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy]           = useState("default");
  const [viewMode, setViewMode]       = useState("grid");
  const [priceRange, setPriceRange]   = useState([0, 100000]);
  const [minRating, setMinRating]     = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [quickView, setQuickView]     = useState(null);

  /* Parallel stock loading */
  useEffect(() => {
    const loadStock = async () => {
      setStockLoading(true);
      const entries = await Promise.all(
        PRODUCTS.map(async (p) => {
          try {
            const data = await checkInventory(p.id);
            return [p.id, data.quantity ?? data ?? 0];
          } catch {
            return [p.id, Math.floor(Math.random() * 20) + 1];
          }
        })
      );
      setStockMap(Object.fromEntries(entries));
      setStockLoading(false);
    };
    loadStock();
  }, []);

  /* Close modal on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setQuickView(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const addToCart = useCallback((product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx  = cart.findIndex((i) => i.id === product.id);
    if (idx !== -1) { cart[idx].quantity = (cart[idx].quantity || 1) + 1; }
    else { cart.push({ ...product, quantity: 1 }); }
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);
    showToast(`${product.name} added to cart`);
  }, [showToast]);

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const resetFilters = () => {
    setSearch(""); setActiveCategory("All"); setPriceRange([0, 100000]); setSortBy("default"); setMinRating(0);
  };

  const visible = PRODUCTS
    .filter((p) => {
      const matchCat    = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchPrice  = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating = p.rating >= minRating;
      return matchCat && matchSearch && matchPrice && matchRating;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating")     return b.rating - a.rating;
      if (sortBy === "reviews")    return b.reviews - a.reviews;
      return 0;
    });

  return (
    <div className="pp-page">
      <Toast toasts={toasts} />

      {/* Quick view modal */}
      {quickView && (
        <QuickViewModal
          product={quickView}
          stock={stockMap[quickView.id]}
          isWished={wishlist.includes(quickView.id)}
          onAddToCart={addToCart}
          onToggleWish={toggleWishlist}
          onClose={() => setQuickView(null)}
        />
      )}

      {/* ── Promo strip ───────────────────── */}
      <div className="pp-promo-strip">
        <span>🔥</span>
        USE CODE <strong style={{ margin: "0 4px" }}>SAVE20</strong> — Get 20% OFF on orders above ₹1,999 · Free Delivery on all orders
        <span>🚚</span>
      </div>

      {/* ── Navbar ────────────────────────── */}
      <nav className="pp-navbar">
        <div className="pp-nav-left">
          <Link to="/dashboard" className="pp-back-btn">
            <FaArrowLeft /> Dashboard
          </Link>
          <h2 className="pp-nav-logo">🛍 ShopEase</h2>
        </div>
        <div className="pp-nav-right">
          <Link to="/cart" className="pp-cart-btn">
            <FaShoppingCart />
            <span>Cart</span>
            {cartCount > 0 && <span className="pp-cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </nav>

      {/* ── Banner ────────────────────────── */}
      <div className="pp-banner">
        <div className="pp-banner-content">
          <span className="pp-banner-tag">🔥 Exclusive Deals</span>
          <h1>Discover Amazing Products</h1>
          <p>Browse {PRODUCTS.length} premium products across top categories</p>
          <div className="pp-search-bar">
            <FaSearch className="pp-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="pp-clear-search" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
        </div>
        <div className="pp-banner-stats">
          <div className="pp-bstat"><h3>{PRODUCTS.length}</h3><span>Products</span></div>
          <div className="pp-bstat"><h3>4</h3><span>Categories</span></div>
          <div className="pp-bstat"><h3>Free</h3><span>Delivery</span></div>
        </div>
      </div>

      {/* ── Toolbar ───────────────────────── */}
      <div className="pp-toolbar">
        <div className="pp-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pp-cat-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="pp-toolbar-right">
          <span className="pp-results-count">{visible.length} product{visible.length !== 1 ? "s" : ""}</span>
          <div className="pp-sort-wrap">
            <FaSortAmountDown className="pp-sort-icon" />
            <select className="pp-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <button className={`pp-filter-btn ${showFilters ? "active" : ""}`} onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filters
          </button>
          <div className="pp-view-toggle">
            <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} aria-label="Grid view"><FaTh /></button>
            <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} aria-label="List view"><FaList /></button>
          </div>
        </div>
      </div>

      {/* ── Filter panel ──────────────────── */}
      {showFilters && (
        <div className="pp-filter-panel">
          <div className="pp-filter-group">
            <label>Price Range: ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}</label>
            <input
              type="range" min={0} max={100000} step={500}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="pp-range-slider"
            />
          </div>

          <div className="pp-filter-group">
            <label>Minimum Rating</label>
            <div className="pp-rating-filters">
              {[4, 3, 2, 0].map((r) => (
                <label className="pp-rating-row" key={r}>
                  <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} />
                  {r === 0 ? "All ratings" : `${r}★ & above`}
                  <div className="pp-rating-bar-wrap">
                    <div className="pp-rating-bar" style={{ width: `${r === 0 ? 100 : r * 20}%` }}></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button className="pp-reset-btn" onClick={resetFilters}>Reset All</button>
        </div>
      )}

      {/* ── Grid / list ───────────────────── */}
      {visible.length === 0 ? (
        <div className="pp-empty">
          <span>🔍</span>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
          <button onClick={resetFilters}>Clear Filters</button>
        </div>
      ) : (
        <div className={`pp-grid ${viewMode === "list" ? "pp-list-mode" : ""}`}>
          {visible.map((p) => {
            const stock     = stockMap[p.id];
            const inStock   = stock === undefined || stock > 0;
            const isWished  = wishlist.includes(p.id);
            const isLoading = stockLoading && stock === undefined;

            return (
              <div key={p.id} className="pp-card">
                <div className="pp-card-img-wrap">
                  <img src={p.image} alt={p.name} loading="lazy" />

                  {/* Hover overlay */}
                  <div className="pp-card-overlay">
                    <button
                      className="pp-quick-btn"
                      onClick={() => setQuickView(p)}
                    >
                      <FaEye style={{ marginRight: 5 }} /> Quick View
                    </button>
                    <button
                      className="pp-quick-btn orange"
                      disabled={!inStock || isLoading}
                      onClick={() => addToCart(p)}
                    >
                      <FaShoppingCart style={{ marginRight: 5 }} /> Add to Cart
                    </button>
                  </div>

                  {/* Wishlist */}
                  <button
                    className={`pp-wish-btn ${isWished ? "wished" : ""}`}
                    onClick={() => toggleWishlist(p.id)}
                    aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isWished ? <FaHeart /> : <FaRegHeart />}
                  </button>

                  {/* Badges — only show one */}
                  {!inStock ? (
                    <span className="pp-badge out-of-stock">Out of Stock</span>
                  ) : p.isNew ? (
                    <span className="pp-badge new-arrival">New</span>
                  ) : p.rating >= 4.7 ? (
                    <span className="pp-badge bestseller">⭐ Best Seller</span>
                  ) : null}
                </div>

                <div className="pp-card-info">
                  <span className="pp-card-category">{p.category}</span>
                  <h3 className="pp-card-name">{p.name}</h3>
                  <StarRating rating={p.rating} />
                  <span className="pp-review-count">({p.reviews} reviews)</span>

                  <div className="pp-card-footer">
                    <div className="pp-price-wrap">
                      <span className="pp-price">₹{p.price.toLocaleString()}</span>
                      <span className="pp-old-price">₹{Math.round(p.price * 1.2).toLocaleString()}</span>
                      <span className="pp-discount">20% off</span>
                    </div>

                    <div className="pp-stock-info">
                      {isLoading ? (
                        <span className="pp-stock-loading">
                          <span className="pp-dot-pulse"></span> Checking stock…
                        </span>
                      ) : (
                        <span className={`pp-stock-tag ${inStock ? "in" : "out"}`}>
                          {inStock ? `✓ In Stock (${stock})` : "✗ Out of Stock"}
                        </span>
                      )}
                    </div>

                    <button
                      className="pp-add-btn"
                      disabled={!inStock || isLoading}
                      onClick={() => addToCart(p)}
                    >
                      <FaShoppingCart />
                      {inStock ? "Add to Cart" : "Unavailable"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Product;
