import { Link } from "react-router-dom";
import "./Home.css";

const categories = [
  {
    name: "Electronics",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    count: "120+ Products",
  },
  {
    name: "Fashion",
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500",
    count: "80+ Products",
  },
  {
    name: "Furniture",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
    count: "55+ Products",
  },
  {
    name: "Beauty",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500",
    count: "40+ Products",
  },
];

const trending = [
  {
    name: "Nike Air Sneakers",
    price: "₹4,999",
    oldPrice: "₹7,999",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    badge: "Hot",
  },
  {
    name: "Apple Watch Series",
    price: "₹29,999",
    oldPrice: "₹34,999",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    badge: "New",
  },
  {
    name: "Pro Headphones",
    price: "₹2,499",
    oldPrice: "₹3,999",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30?w=500",
    badge: "Sale",
  },
  {
    name: "Winter Jacket",
    price: "₹1,999",
    oldPrice: "₹3,499",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723?w=500",
    badge: "50% Off",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Regular Customer",
    avatar: "https://i.pravatar.cc/100?img=47",
    text: "ShopEase has completely changed how I shop online. The delivery is lightning fast and the products are always top quality!",
    rating: 5,
  },
  {
    name: "Rahul Mehta",
    role: "Verified Buyer",
    avatar: "https://i.pravatar.cc/100?img=11",
    text: "Incredible selection of products and the prices are unbeatable. I've been shopping here for over a year now.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Fashion Enthusiast",
    avatar: "https://i.pravatar.cc/100?img=45",
    text: "The fashion collection is amazing! Easy returns and the customer support team is super responsive.",
    rating: 4,
  },
];

function StarRating({ count }) {
  return (
    <div className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </div>
  );
}

function Home() {
  return (
    <div className="home">
      {/* Background blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      {/* ── Navbar ─────────────────────────────── */}
      <nav className="navbar">
        <h2 className="logo">
          Shop<span>Ease</span>
        </h2>

        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#categories">Categories</a></li>
          <li><a href="#trending">Trending</a></li>
          <li><a href="#testimonials">Reviews</a></li>
        </ul>

        <div className="nav-actions">
          <Link to="/login">
            <button className="nav-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button className="nav-btn primary">Get Started</button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────── */}
      <section className="hero">
        <div className="hero-left">
          <span className="offer-tag">🔥 Biggest Sale of 2026</span>

          <h1>
            Discover Amazing
            <br />
            <span>Products</span> At
            <br />
            Unbeatable Prices
          </h1>

          <p>
            Shop the latest electronics, fashion, furniture and lifestyle
            products from trusted brands — with secure payments and
            lightning-fast delivery across India.
          </p>

          <div className="hero-cta">
            <Link to="/signup">
              <button className="shop-btn">Start Shopping →</button>
            </Link>
            <Link to="/login">
              <button className="outline-btn">Explore Store</button>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <h3>50K+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <h3>12K+</h3>
              <p>Products</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <h3>500+</h3>
              <p>Brands</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-wrapper">
            <img
              className="hero-main-img"
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900"
              alt="Featured Product"
            />

            <div className="floating-card card-top">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"
                alt="Nike Air"
              />
              <div>
                <h4>Nike Air</h4>
                <span>₹4,999</span>
              </div>
            </div>

            <div className="floating-card card-bottom">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30?w=200"
                alt="Headphones"
              />
              <div>
                <h4>Headphones</h4>
                <span>₹2,499</span>
              </div>
            </div>

            <div className="rating-badge">
              <span className="badge-star">⭐</span>
              <div>
                <strong>4.9/5</strong>
                <p>12K Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ────────────────────────── */}
      <div className="trust-strip">
        <div className="trust-item">🚚 <span>Free Delivery across India</span></div>
        <div className="trust-item">🔐 <span>100% Secure Payments</span></div>
        <div className="trust-item">↩ <span>7-Day Easy Returns</span></div>
        <div className="trust-item">🏷 <span>Best Price Guaranteed</span></div>
        <div className="trust-item">🎧 <span>24/7 Customer Support</span></div>
      </div>

      {/* ── Features ───────────────────────────── */}
      <section className="features-section" id="features">
        <div className="section-header">
          <p className="section-label">Why Choose Us</p>
          <h2>Shopping Made Simple</h2>
          <p className="section-sub">
            Everything you need for a seamless shopping experience, all in one place.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Free Delivery</h3>
            <p>Free shipping on all orders above ₹499. Delivered within 2–5 business days.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Payment</h3>
            <p>Multiple payment methods with bank-level encryption keeping your money safe.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Premium Quality</h3>
            <p>Every product is quality-checked and sourced from verified trusted brands.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">↩</div>
            <h3>Easy Returns</h3>
            <p>Not satisfied? Return anything within 7 days, no questions asked.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎧</div>
            <h3>24/7 Support</h3>
            <p>Our support team is always here to help you with any issues or questions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏷</div>
            <h3>Best Prices</h3>
            <p>We match any price. Shop confidently knowing you're getting the best deal.</p>
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────── */}
      <section className="categories-section" id="categories">
        <div className="section-header">
          <p className="section-label">Browse</p>
          <h2>Shop By Category</h2>
          <p className="section-sub">
            Find exactly what you're looking for across our wide range of categories.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <div className="category-card" key={cat.name}>
              <div className="category-img-wrap">
                <img src={cat.img} alt={cat.name} />
                <div className="category-overlay">
                  <button>Explore →</button>
                </div>
              </div>
              <div className="category-info">
                <h3>{cat.name}</h3>
                <p>{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Offer Banner ───────────────────────── */}
      <section className="offer-section">
        <div className="offer-content">
          <span className="offer-pill">⚡ Limited Time Deal</span>
          <h2>Flat 50% OFF on Summer Collection</h2>
          <p>
            Don't miss out on our biggest sale. Grab premium fashion,
            electronics and accessories at half the price.
          </p>
          <div className="offer-actions">
            <Link to="/signup">
              <button className="shop-btn">Shop the Sale</button>
            </Link>
            <div className="countdown">
              <div className="time-block"><span>12</span><p>Hours</p></div>
              <span className="colon">:</span>
              <div className="time-block"><span>45</span><p>Mins</p></div>
              <span className="colon">:</span>
              <div className="time-block"><span>30</span><p>Secs</p></div>
            </div>
          </div>
        </div>
        <div className="offer-img">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
            alt="Summer Sale"
          />
        </div>
      </section>

      {/* ── Trending Products ──────────────────── */}
      <section className="trending-section" id="trending">
        <div className="section-header">
          <p className="section-label">What's Hot</p>
          <h2>Trending Products</h2>
          <p className="section-sub">
            Handpicked products loved by thousands of customers this week.
          </p>
        </div>

        <div className="products-grid">
          {trending.map((p) => (
            <div className="product-card" key={p.name}>
              <div className="product-img-wrap">
                <img src={p.img} alt={p.name} />
                <span className="product-badge">{p.badge}</span>
                <div className="product-actions">
                  <button className="wish-btn">♡</button>
                </div>
              </div>
              <div className="product-info">
                <h4>{p.name}</h4>
                <div className="product-pricing">
                  <span className="price">{p.price}</span>
                  <span className="old-price">{p.oldPrice}</span>
                </div>
                <Link to="/signup">
                  <button className="add-cart-btn">Add to Cart</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="see-more-wrap">
          <Link to="/signup">
            <button className="see-more-btn">View All Products →</button>
          </Link>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────── */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <p className="section-label">Customer Love</p>
          <h2>What Our Customers Say</h2>
          <p className="section-sub">
            Real reviews from real customers who trust ShopEase every day.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <StarRating count={t.rating} />
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <img src={t.avatar} alt={t.name} />
                <div>
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────── */}
      <section className="newsletter-section">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h2>Get Exclusive Deals in Your Inbox</h2>
            <p>Subscribe and be the first to know about sales, new arrivals and special offers.</p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="home-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="logo">Shop<span>Ease</span></h2>
            <p>Your one-stop destination for premium products at the best prices, delivered fast and safely.</p>
            <div className="social-links">
              <a href="#!" aria-label="Facebook">📘</a>
              <a href="#!" aria-label="Instagram">📸</a>
              <a href="#!" aria-label="Twitter">🐦</a>
              <a href="#!" aria-label="YouTube">▶️</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#categories">Electronics</a></li>
              <li><a href="#categories">Fashion</a></li>
              <li><a href="#categories">Furniture</a></li>
              <li><a href="#categories">Beauty</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/signup">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/orders">Orders</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#!">Help Center</a></li>
              <li><a href="#!">Returns</a></li>
              <li><a href="#!">Track Order</a></li>
              <li><a href="#!">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 ShopEase. All rights reserved.</p>
          <div className="footer-badges">
            <span>🔐 SSL Secured</span>
            <span>💳 UPI · Cards · NetBanking</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
