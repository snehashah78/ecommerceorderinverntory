import { useState } from "react";
import { createOrder } from "../../api/orderApi";
import { makePayment } from "../../api/paymentApi";

function OrderPayment() {

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const placeOrder = async () => {

    try {

      // Create Order
      const orderResponse = await createOrder({
        userId: 1,
        productId: Number(productId),
        quantity: Number(quantity)
      });

      const order = orderResponse.data;

      alert(
        `Order Created Successfully\nOrder ID : ${order.id}`
      );

      // Payment
      const paymentResponse = await makePayment({
        orderId: order.id,
        paymentMethod: paymentMethod
      });

      alert(
        `Payment Success\nPayment ID : ${paymentResponse.data.paymentId}`
      );

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Order & Payment</h2>

      <input
        type="number"
        placeholder="Product Id"
        value={productId}
        onChange={(e) =>
          setProductId(e.target.value)
        }
      />

      <br /><br />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) =>
          setQuantity(e.target.value)
        }
      />

      <br /><br />

      <select
        value={paymentMethod}
        onChange={(e) =>
          setPaymentMethod(e.target.value)
        }
      >
        <option value="UPI">UPI</option>
        <option value="CARD">CARD</option>
        <option value="NETBANKING">
          NET BANKING
        </option>
      </select>

      <br /><br />

      <button onClick={placeOrder}>
        Place Order & Pay
      </button>

    </div>
  );
}

export default OrderPayment;