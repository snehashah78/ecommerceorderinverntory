
import { useState, useEffect } from "react";
import { getOrders } from "../../api/orderApi";
import "./Orders.css";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const statusClass = (status) => {
    if (!status) return "processing";
    const key = status.toLowerCase();
    if (key.includes("delivered")) return "delivered";
    if (key.includes("cancel") || key.includes("failed")) return "cancelled";
    if (key.includes("placed") || key.includes("confirmed") || key.includes("shipped")) return "placed";
    return "processing";
  };

  const productImages = [
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1513708928679-4cd25ee9a6ff?auto=format&fit=crop&w=200&q=80"
  ];

  const orderCategory = (index) => ["Electronics", "Home", "Fashion", "Lifestyle"][index % 4];

  const totalOrders = orders.length;
  const placedOrders = orders.filter((o) => o.status === "PLACED").length;
  const deliveredOrders = orders.filter((o) => o.status?.toUpperCase().includes("DELIVERED")).length;
  const cancelledOrders = orders.filter((o) => o.status?.toUpperCase().includes("CANCEL")).length;

  return (
    <div className="orders-page">
      <div className="orders-navbar">
        <Link to="/dashboard">🏠 Dashboard</Link>
        <Link to="/products">🛍 Products</Link>
        <Link to="/cart">🛒 Cart</Link>
      </div>

      <div className="order-stats">
        <div className="stat-card">
          <h2>{totalOrders}</h2>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h2>{placedOrders}</h2>
          <p>Placed</p>
        </div>
        <div className="stat-card">
          <h2>{deliveredOrders}</h2>
          <p>Delivered</p>
        </div>
        <div className="stat-card">
          <h2>{cancelledOrders}</h2>
          <p>Cancelled</p>
        </div>
      </div>

      <div className="orders-list">
        <div className="orders-header">
          <div>
            <h2>📋 Order History</h2>
            <p>{totalOrders} orders found</p>
          </div>
          <Link to="/products" className="browse-btn">
            Browse Products
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No Orders Found</h3>
            <p>Once you place an order, it will show up here.</p>
            <Link to="/products" className="browse-btn secondary">
              Shop Now
            </Link>
          </div>
        ) : (
          orders.map((o, index) => (
            <div className="order-item" key={o.id}>
              <div className="order-card-main">
                <div className="order-thumb-wrap">
                  <img
                    src={productImages[index % productImages.length]}
                    alt="Order preview"
                  />
                </div>
                <div className="order-details">
                  <div className="order-headline">
                    <h3>Order #{o.id}</h3>
                    <span className={`status-pill ${statusClass(o.status)}`}>
                      {o.status || "Processing"}
                    </span>
                  </div>
                  <p className="order-info-line">
                    <strong>{o.productId || "Product"}</strong> · Qty: {o.quantity || 1}
                  </p>
                  <div className="order-category-row">
                    <span className="category-pill">{orderCategory(index)}</span>
                    <span>{o.shippingAddress || "Free delivery"}</span>
                  </div>
                  <p className="order-meta-text">
                    Built for fast checkout, smart delivery updates, and easy invoice access.
                  </p>
                </div>
              </div>

              <div className="order-right-panel">
                <div className="order-total-chip">
                  <span>Total amount</span>
                  <strong>₹{o.totalPrice || 0}</strong>
                </div>
                <div className="order-actions">
                  <Link to="/orders" className="action-btn primary">
                    View invoice
                  </Link>
                  <Link to="/products" className="action-btn secondary">
                    Track order
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
/*import { useState, useEffect } from "react";
import { placeOrder } from "../../api/orderApi";
import { getOrders } from "../../api/orderApi";

function Orders(){

    const [id,setId] = useState("");
    const [result,setResult] = useState("");
    const [orders, setOrders] = useState([]);

 useEffect(() => {

        loadOrders();

    }, []);
    const loadOrders = async () => {

        try {

            const response = await getOrders();
            setOrders(response.data);

        } catch (error) {

            console.error("Error fetching orders", error);

        }

    };

    
    const handleOrder = async ()=>{

       try{ 
        const data =
            await placeOrder(id);

        setResult(data);
         loadOrders();

        } catch(error){
            console.error(error);
            setResult("Order Failed");
        }
    };

    return(

        <div>

            <h2>Order Service</h2>

            <input
                placeholder="Product Id"
                onChange={(e)=>setId(e.target.value)}
            />

            <button onClick={handleOrder}>
                Place Order
            </button>

            <h3>{result}</h3>
            <hr />

            <h2>All Orders</h2>

            {orders.length === 0 ? (
                <p>No Orders Found</p>
            ) : (
                orders.map((o) => (
                    <div
                        key={o.id}
                        style={{
                            border: "1px solid gray",
                            margin: "10px",
                            padding: "10px"
                        }}
                    >
                   <p>Order Id: {o.id}</p>

                        {o.productId && (
                            <p>Product Id: {o.productId}</p>
                        )}

                        {o.status && (
                            <p>Status: {o.status}</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Orders; */