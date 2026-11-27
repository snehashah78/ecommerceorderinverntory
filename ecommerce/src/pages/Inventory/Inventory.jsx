import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus, FaEdit, FaTrash, FaSearch,
  FaArrowLeft, FaBoxOpen, FaTimes, FaSave,
  FaShieldAlt, FaEye, FaFilter,
} from "react-icons/fa";
import {
  getAllInventory,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../api/inventoryApi";
import { useAuth } from "../../hooks/useAuth";
import "./Inventory.css";

/* ── Default form state ─────────────────── */
const EMPTY_FORM = {
  name:     "",
  category: "",
  price:    "",
  quantity: "",
  image:    "",
  description: "",
};

const CATEGORIES = ["Electronics", "Fashion", "Furniture", "Beauty", "Other"];

/* ── Toast ──────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`inv-toast inv-toast-${toast.type}`}>
      {toast.type === "success" ? "✅" : "❌"} {toast.message}
    </div>
  );
}

/* ── Delete confirmation modal ──────────── */
function DeleteModal({ product, onConfirm, onCancel, loading }) {
  return (
    <div className="inv-backdrop" onClick={onCancel}>
      <div className="inv-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="del-icon">🗑️</div>
        <h3>Delete Product?</h3>
        <p>
          Are you sure you want to delete <strong>{product.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="del-actions">
          <button className="del-cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="del-confirm" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="inv-spinner sm" /> : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Product form modal (Add / Edit) ────── */
function ProductModal({ initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(initial?.id);

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name     = "Name is required";
    if (!form.category)           e.category = "Pick a category";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
                                  e.price    = "Enter a valid price";
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 0)
                                  e.quantity = "Enter a valid quantity";
    return e;
  };

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      ...form,
      price:    Number(form.price),
      quantity: Number(form.quantity),
    });
  };

  return (
    <div className="inv-backdrop" onClick={onClose}>
      <div className="inv-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inv-form-header">
          <h3>{isEdit ? "Edit Product" : "Add New Product"}</h3>
          <button className="inv-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="inv-form">
          {/* Name */}
          <div className="inv-field">
            <label>Product Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              autoFocus
            />
            {errors.name && <span className="inv-err">{errors.name}</span>}
          </div>

          {/* Category + Price row */}
          <div className="inv-row-2">
            <div className="inv-field">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <span className="inv-err">{errors.category}</span>}
            </div>

            <div className="inv-field">
              <label>Price (₹) *</label>
              <input
                name="price"
                type="number"
                min="1"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 2499"
              />
              {errors.price && <span className="inv-err">{errors.price}</span>}
            </div>
          </div>

          {/* Quantity */}
          <div className="inv-field">
            <label>Stock Quantity *</label>
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 50"
            />
            {errors.quantity && <span className="inv-err">{errors.quantity}</span>}
          </div>

          {/* Image URL */}
          <div className="inv-field">
            <label>Image URL <span className="optional">(optional)</span></label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
            />
            {form.image && (
              <img src={form.image} alt="preview" className="inv-img-preview" />
            )}
          </div>

          {/* Description */}
          <div className="inv-field">
            <label>Description <span className="optional">(optional)</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short product description..."
              rows={3}
            />
          </div>

          <div className="inv-form-actions">
            <button type="button" className="inv-cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="inv-save-btn" disabled={loading}>
              {loading
                ? <span className="inv-spinner sm" />
                : <><FaSave /> {isEdit ? "Save Changes" : "Add Product"}</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Inventory page ─────────────────── */
function Inventory() {
  const { isAdmin, role } = useAuth();

  const [products, setProducts]   = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("all"); // all | in | out

  const [showAddModal, setShowAddModal]     = useState(false);
  const [editProduct, setEditProduct]       = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [toast, setToast]                   = useState(null);

  /* ── Load all products ─────────────────── */
  const loadProducts = useCallback(async () => {
    setPageLoading(true);
    try {
      const res = await getAllInventory();
      setProducts(res.data || []);
    } catch {
      // fallback: show empty state rather than crash
      setProducts([]);
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  /* ── Toast helper ─────────────────────── */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── CRUD handlers (admin only) ────────── */
  const handleAdd = async (data) => {
    setActionLoading(true);
    try {
      await addProduct(data);
      await loadProducts();
      setShowAddModal(false);
      showToast(`"${data.name}" added successfully`);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to add product", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (data) => {
    setActionLoading(true);
    try {
      await updateProduct(editProduct.id, data);
      await loadProducts();
      setEditProduct(null);
      showToast(`"${data.name}" updated successfully`);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update product", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      await loadProducts();
      setDeleteTarget(null);
      showToast(`"${deleteTarget.name}" deleted`);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete product", "error");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Filter + search ──────────────────── */
  const visible = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "All" || p.category === catFilter;
    const matchStock  =
      stockFilter === "all"  ? true :
      stockFilter === "in"   ? p.quantity > 0 :
      p.quantity === 0;
    return matchSearch && matchCat && matchStock;
  });

  const totalValue = products.reduce(
    (s, p) => s + (Number(p.price) || 0) * (Number(p.quantity) || 0), 0
  );
  const inStockCount  = products.filter((p) => p.quantity > 0).length;
  const outStockCount = products.filter((p) => p.quantity === 0).length;

  return (
    <div className="inv-page">
      <Toast toast={toast} />

      {/* Modals */}
      {showAddModal && (
        <ProductModal
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
          loading={actionLoading}
        />
      )}
      {editProduct && (
        <ProductModal
          initial={editProduct}
          onSave={handleEdit}
          onClose={() => setEditProduct(null)}
          loading={actionLoading}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}

      {/* ── Navbar ──────────────────────── */}
      <nav className="inv-navbar">
        <div className="inv-nav-left">
          <Link to="/dashboard" className="inv-back-btn">
            <FaArrowLeft /> Dashboard
          </Link>
          <h2 className="inv-nav-logo">🛍 ShopEase</h2>
        </div>

        <div className="inv-nav-right">
          {/* Role badge */}
          <div className={`inv-role-badge ${isAdmin ? "admin" : "viewer"}`}>
            {isAdmin ? <FaShieldAlt /> : <FaEye />}
            {isAdmin ? "Admin" : "Viewer"}
          </div>

          {/* Admin: Add product button */}
          {isAdmin && (
            <button
              className="inv-add-btn"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus /> Add Product
            </button>
          )}
        </div>
      </nav>

      {/* ── Page header ─────────────────── */}
      <div className="inv-header">
        <div>
          <h1 className="inv-title">
            <FaBoxOpen /> Inventory
          </h1>
          <p className="inv-subtitle">
            {isAdmin
              ? "Manage your product catalogue — add, edit or remove products"
              : "Browse all available products and stock levels"}
          </p>
        </div>
      </div>

      {/* ── Stats cards ─────────────────── */}
      <div className="inv-stats">
        <div className="inv-stat-card">
          <div className="inv-stat-icon blue"><FaBoxOpen /></div>
          <div>
            <h4>Total Products</h4>
            <h2>{products.length}</h2>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon green"><span>✓</span></div>
          <div>
            <h4>In Stock</h4>
            <h2>{inStockCount}</h2>
          </div>
        </div>
        <div className="inv-stat-card">
          <div className="inv-stat-icon red"><span>✗</span></div>
          <div>
            <h4>Out of Stock</h4>
            <h2>{outStockCount}</h2>
          </div>
        </div>
        {isAdmin && (
          <div className="inv-stat-card">
            <div className="inv-stat-icon orange"><span>₹</span></div>
            <div>
              <h4>Inventory Value</h4>
              <h2>₹{totalValue.toLocaleString()}</h2>
            </div>
          </div>
        )}
      </div>

      {/* ── Toolbar ─────────────────────── */}
      <div className="inv-toolbar">
        {/* Search */}
        <div className="inv-search">
          <FaSearch className="inv-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="inv-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <div className="inv-toolbar-right">
          {/* Category filter */}
          <div className="inv-filter-wrap">
            <FaFilter className="inv-filter-icon" />
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Stock filter */}
          <div className="inv-stock-pills">
            {["all", "in", "out"].map((v) => (
              <button
                key={v}
                className={`inv-stock-pill ${stockFilter === v ? "active" : ""}`}
                onClick={() => setStockFilter(v)}
              >
                {v === "all" ? "All Stock" : v === "in" ? "In Stock" : "Out of Stock"}
              </button>
            ))}
          </div>

          <span className="inv-count">{visible.length} item{visible.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ── Table ───────────────────────── */}
      {pageLoading ? (
        <div className="inv-loading">
          <span className="inv-spinner lg" />
          <p>Loading inventory…</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="inv-empty">
          <span>📦</span>
          <h3>No products found</h3>
          <p>
            {products.length === 0
              ? isAdmin
                ? 'Click "Add Product" to add your first product'
                : "No products in inventory yet"
              : "Try adjusting your search or filters"}
          </p>
          {products.length === 0 && isAdmin && (
            <button className="inv-add-btn" onClick={() => setShowAddModal(true)}>
              <FaPlus /> Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visible.map((p, idx) => (
                <tr key={p.id} className={p.quantity === 0 ? "row-out" : ""}>
                  <td className="inv-idx">{idx + 1}</td>

                  {/* Product */}
                  <td>
                    <div className="inv-product-cell">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="inv-thumb" />
                      ) : (
                        <div className="inv-thumb-placeholder">
                          {p.name?.[0] ?? "?"}
                        </div>
                      )}
                      <div>
                        <h4>{p.name}</h4>
                        {p.description && (
                          <p className="inv-desc-preview">{p.description}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="inv-cat-tag">{p.category || "—"}</span>
                  </td>

                  <td className="inv-price-cell">
                    ₹{Number(p.price).toLocaleString()}
                  </td>

                  <td className="inv-qty-cell">
                    <span className={`inv-qty ${p.quantity === 0 ? "zero" : p.quantity <= 5 ? "low" : ""}`}>
                      {p.quantity}
                    </span>
                    {p.quantity > 0 && p.quantity <= 5 && (
                      <span className="inv-low-warning">Low</span>
                    )}
                  </td>

                  <td>
                    <span className={`inv-status ${p.quantity > 0 ? "in" : "out"}`}>
                      {p.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>

                  {/* Admin only: edit + delete */}
                  {isAdmin && (
                    <td>
                      <div className="inv-actions">
                        <button
                          className="inv-edit-btn"
                          onClick={() => setEditProduct(p)}
                          title="Edit product"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="inv-del-btn"
                          onClick={() => setDeleteTarget(p)}
                          title="Delete product"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Inventory;
