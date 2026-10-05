import { auth } from "@clerk/nextjs/server";
import { OrderType } from "@repo/types";

const fetchOrders = async (): Promise<OrderType[]> => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    const serviceUrl = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL;
    if (!serviceUrl) {
      return [];
    }

    const res = await fetch(`${serviceUrl}/user-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return [];
    }

    const data: OrderType[] = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("Order service offline or unauthenticated:", error);
    return [];
  }
};

const OrdersPage = async () => {
  const orders = await fetchOrders();

  if (!orders) {
    return <div className="">No orders found!</div>;
  }

  console.log(orders);
  return (
    <div className="">
      <h1 className="text-2xl my-4 font-medium">Your Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id} className="flex items-center mb-4">
            <div className="w-1/4">
              <span className="font-medium text-sm text-gray-500">
                Order ID
              </span>
              <p>{order._id}</p>
            </div>
            <div className="w-1/12">
              <span className="font-medium text-sm text-gray-500">Total</span>
              <p>{order.amount / 100}</p>
            </div>
            <div className="w-1/12">
              <span className="font-medium text-sm text-gray-500">Status</span>
              <p>{order.status}</p>
            </div>
            <div className="w-1/8">
              <span className="font-medium text-sm text-gray-500">Date</span>
              <p>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US")
                  : "-"}
              </p>
            </div>
            <div className="">
              <span className="font-medium text-sm text-gray-500">
                Products
              </span>
              <p>{order.products?.map(product=> product.name).join(", ") || "-"}</p>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;
