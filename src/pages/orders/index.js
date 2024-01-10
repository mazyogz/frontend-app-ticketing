import React, { useEffect, useState } from "react";

const statuses = {
  settlement: "text-green-700 bg-green-50 ring-green-600/20",
  "In progress": "text-gray-600 bg-gray-50 ring-gray-500/10",
  unpaid: "text-red-800 bg-red-50 ring-red-600/20",
  expire: "text-red-800 bg-red-50 ring-red-600/20",
  pending: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Order() {
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let accessToken = null;

        if (typeof window !== "undefined") {
          // Check if running on the client side
          const cookiesArray = document.cookie.split("; ");
          const accessTokenCookie = cookiesArray.find((cookie) =>
            cookie.startsWith("accessToken=")
          );

          if (accessTokenCookie) {
            accessToken = accessTokenCookie.split("=")[1];
          }

          const response = await fetch(
            `https://backend-app-ticketing-v12-production.up.railway.app/v1/api/order-all`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          setOrderDetail(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log(orderDetail);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ul>
        {orderDetail?.data.map((order) => (
          <li
            key={order.id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {order.event_id}
                </p>
                <p
                  className={classNames(
                    statuses[order.status],
                    "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                  )}
                >
                  {order.status}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">
                  Tanggal Pemesanan{" "}
                  <time dateTime={order.date_order}>{order.date_order}</time>
                </p>
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className="truncate">Order Id {order.order_id_unik}</p>
              </div>
            </div>
            <button className="flex flex-none items-center gap-x-4">
              <a
                href={order.href}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                Payment<span className="sr-only">, {order.name}</span>
              </a>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Order;
