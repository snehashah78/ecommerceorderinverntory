import { useState, useEffect } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaClipboardList,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaBoxOpen,
  FaUsers,
  FaRupeeSign,
} from "react-icons/fa";
import {
  getOrderCount,
  getProductCount,
  getSales,
  getUserCount,
} from "../../api/dashboardApi";

function Dashboard() {
  const [orders, setOrders] = useState(0);
  const [products, setProducts] = useState(0);
  const [sales, setSales] = useState(0);
  const [customers, setCustomers] = useState(0);

  const loadDashboard = async () => {
    try {
      const orderRes = await getOrderCount();
      const productRes = await getProductCount();
      const salesRes = await getSales();
      const userRes = await getUserCount();

      setOrders(orderRes.data);
      setProducts(productRes.data);
      setSales(Number(salesRes.data) || 0);
      setCustomers(userRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">🛍 ShopEase</h2>

        <nav>
          <Link to="/">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link to="/products">
            <FaShoppingBag />
            <span>Products</span>
          </Link>
          <Link to="/cart">
            <FaShoppingCart />
            <span>Cart</span>
          </Link>
          <Link to="/orders">
            <FaClipboardList />
            <span>Orders</span>
          </Link>
          <Link to="/login">
            <FaSignOutAlt />
            <span>Logout</span>
          </Link>
        </nav>

        <div className="sale-card">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
            alt="Sale"
          />
          <h3>Big Summer Sale</h3>
          <p>Up to 50% OFF</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Topbar */}
        <div className="topbar">
          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder="Search products..." />
          </div>

          <div className="top-right">
            <div className="notify">
              <FaBell />
            </div>

            <div className="profile">
              <img src="https://i.pravatar.cc/150?img=32" alt="Profile" />
              <div>
                <h4>Sneha Shah</h4>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome */}
        <div className="welcome">
          <h1>Welcome Back 👋</h1>
          <p>Manage your ecommerce business from one dashboard.</p>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="card">
            <div className="card-icon blue">
              <FaClipboardList />
            </div>
            <h4>Total Orders</h4>
            <h2>{orders}</h2>
          </div>

          <div className="card">
            <div className="card-icon purple">
              <FaBoxOpen />
            </div>
            <h4>Products</h4>
            <h2>{products}</h2>
          </div>

          <div className="card">
            <div className="card-icon green">
              <FaRupeeSign />
            </div>
            <h4>Total Sales</h4>
            <h2>₹{sales.toLocaleString()}</h2>
          </div>

          <div className="card">
            <div className="card-icon orange">
              <FaUsers />
            </div>
            <h4>Customers</h4>
            <h2>{customers}</h2>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="hero-left">
            <span className="offer-badge">🔥 NEW COLLECTION 2026</span>
            <h1>Upgrade Your Shopping Experience</h1>
            <p>
              Discover premium fashion, electronics, furniture and accessories
              with exclusive discounts available today.
            </p>
            <div className="hero-buttons">
              <Link to="/products">
                <button className="primary-btn">Shop Now</button>
              </Link>
              <Link to="/orders">
                <button className="secondary-btn">View Orders</button>
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900"
              alt="Shopping"
            />
          </div>
        </div>

        {/* Shop By Category */}
        <div className="section-title">
          <h2>Shop By Category</h2>
          <Link to="/products">View All →</Link>
        </div>

        <div className="categories">
          <div className="category-card">
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
              alt="Electronics"
            />
            <h3>Electronics</h3>
            <p>120 Products</p>
          </div>

          <div className="category-card">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500"
              alt="Fashion"
            />
            <h3>Fashion</h3>
            <p>80 Products</p>
          </div>

          <div className="category-card">
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500"
              alt="Furniture"
            />
            <h3>Furniture</h3>
            <p>55 Products</p>
          </div>

          <div className="category-card">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500"
              alt="Beauty"
            />
            <h3>Beauty</h3>
            <p>40 Products</p>
          </div>
        </div>

        {/* Trending Products */}
        <div className="section-title">
          <h2>Trending Products</h2>
          <Link to="/products">See More →</Link>
        </div>

        <div className="featured-products">
          <div className="product-card">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
              alt="Nike Sneakers"
            />
            <h4>Nike Sneakers</h4>
            <p>₹4,999</p>
            <button>View Product</button>
          </div>

          <div className="product-card">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
              alt="Apple Watch"
            />
            <h4>Apple Watch</h4>
            <p>₹29,999</p>
            <button>View Product</button>
          </div>

          <div className="product-card">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30?w=500"
              alt="Headphones"
            />
            <h4>Headphones</h4>
            <p>₹2,499</p>
            <button>View Product</button>
          </div>

          <div className="product-card">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723?w=500"
              alt="Jacket"
            />
            <h4>Jacket</h4>
            <p>₹1,999</p>
            <button>View Product</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-title">
          <h2>Quick Actions</h2>
        </div>

        <div className="quick-actions">
          <Link to="/products" className="action-card">
            <div className="action-icon">🛍</div>
            <h3>Browse Products</h3>
            <p>View all available products</p>
          </Link>

          <Link to="/cart" className="action-card">
            <div className="action-icon">🛒</div>
            <h3>Shopping Cart</h3>
            <p>Check your cart items</p>
          </Link>

          <Link to="/orders" className="action-card">
            <div className="action-icon">📦</div>
            <h3>Orders</h3>
            <p>Track recent orders</p>
          </Link>

          <Link to="/" className="action-card">
            <div className="action-icon">🏠</div>
            <h3>Home Page</h3>
            <p>Back to website</p>
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Recent Activity */}
          <div className="activity-card">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-dot green"></span>
                <div>
                  <h4>New Order Received</h4>
                  <p>2 minutes ago</p>
                </div>
              </div>

              <div className="activity-item">
                <span className="activity-dot blue"></span>
                <div>
                  <h4>Payment Successful</h4>
                  <p>15 minutes ago</p>
                </div>
              </div>

              <div className="activity-item">
                <span className="activity-dot purple"></span>
                <div>
                  <h4>Product Added</h4>
                  <p>1 hour ago</p>
                </div>
              </div>

              <div className="activity-item">
                <span className="activity-dot orange"></span>
                <div>
                  <h4>Order Delivered</h4>
                  <p>Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Orders */}
          <div className="latest-orders">
            <h2>Latest Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#1001</td>
                  <td>Rahul</td>
                  <td>
                    <span className="status completed">Delivered</span>
                  </td>
                  <td>₹2,499</td>
                </tr>
                <tr>
                  <td>#1002</td>
                  <td>Anjali</td>
                  <td>
                    <span className="status pending">Pending</span>
                  </td>
                  <td>₹1,899</td>
                </tr>
                <tr>
                  <td>#1003</td>
                  <td>Rohit</td>
                  <td>
                    <span className="status shipped">Shipped</span>
                  </td>
                  <td>₹5,999</td>
                </tr>
                <tr>
                  <td>#1004</td>
                  <td>Sneha</td>
                  <td>
                    <span className="status completed">Delivered</span>
                  </td>
                  <td>₹999</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Offer Banner */}
        <div className="offer-banner">
          <div>
            <h1>🎉 Flat 50% OFF</h1>
            <p>
              Enjoy exclusive discounts on fashion, electronics and furniture
              this week.
            </p>
            <Link to="/products">
              <button>Shop Collection</button>
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700"
            alt="Offer"
          />
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <div>© 2026 ShopEase Dashboard</div>
          <div>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/login">Logout</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
