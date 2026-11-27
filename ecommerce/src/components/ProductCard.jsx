import { FaShoppingCart, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

/**
 * Reusable ProductCard component.
 *
 * Props:
 *   product  – { id, name, price, image, category, rating, reviews }
 *   stock    – number | undefined
 *   isWished – boolean
 *   onAddToCart   – (product) => void
 *   onToggleWish  – (id) => void
 */
function ProductCard({ product, stock, isWished, onAddToCart, onToggleWish }) {
  const inStock   = stock === undefined || stock > 0;
  const isLoading = stock === undefined;

  return (
    <div className="pp-card">
      <div className="pp-card-img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />

        <button
          className={`pp-wish-btn ${isWished ? "wished" : ""}`}
          onClick={() => onToggleWish(product.id)}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWished ? <FaHeart /> : <FaRegHeart />}
        </button>

        {!inStock && (
          <span className="pp-badge out-of-stock">Out of Stock</span>
        )}
        {inStock && product.rating >= 4.7 && (
          <span className="pp-badge bestseller">⭐ Best Seller</span>
        )}
      </div>

      <div className="pp-card-info">
        <span className="pp-card-category">{product.category}</span>
        <h3 className="pp-card-name">{product.name}</h3>

        <div className="pp-stars">
          {[1, 2, 3, 4, 5].map((s) => (
            <FaStar
              key={s}
              className={s <= Math.round(product.rating) ? "pp-star filled" : "pp-star"}
            />
          ))}
          <span className="pp-rating-num">{product.rating.toFixed(1)}</span>
        </div>
        <span className="pp-review-count">({product.reviews} reviews)</span>

        <div className="pp-card-footer">
          <div className="pp-price-wrap">
            <span className="pp-price">₹{product.price.toLocaleString()}</span>
            <span className="pp-old-price">
              ₹{Math.round(product.price * 1.2).toLocaleString()}
            </span>
            <span className="pp-discount">20% off</span>
          </div>

          <div className="pp-stock-info">
            {isLoading ? (
              <span className="pp-stock-loading">
                <span className="pp-dot-pulse"></span> Checking…
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
            onClick={() => onAddToCart(product)}
          >
            <FaShoppingCart />
            {inStock ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
