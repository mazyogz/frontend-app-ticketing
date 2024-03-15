import React, { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { useRouter } from "next/router";

const statuses = {
  settlement: "text-green-700 bg-green-50 ring-green-600/20",
  "In progress": "text-gray-600 bg-gray-50 ring-gray-500/10",
  unpaid: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  expire: "text-red-800 bg-red-50 ring-red-600/20",
  refund: "text-red-800 bg-red-50 ring-red-600/20",
  pending: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
};

const formatCurrency = (value) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return formatter.format(value);
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Order() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    // Mengecek nilai isLoggedIn di localStorage atau sessionStorage saat halaman dimuat
    const isLoggedInLocalStorage = localStorage.getItem("isLoggedIn");
    const isLoggedInSessionStorage = sessionStorage.getItem("isLoggedIn");

    if (isLoggedInLocalStorage || isLoggedInSessionStorage) {
      setIsLoggedIn(true);
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const handlePayment = async (orderId) => {
    try {
      let accessToken = null;

      const cookiesArray = document.cookie.split("; ");
      const accessTokenCookie = cookiesArray.find((cookie) =>
        cookie.startsWith("accessToken=")
      );

      if (accessTokenCookie) {
        accessToken = accessTokenCookie.split("=")[1];
      }

      const response = await fetch(
        `https://backend-app-ticketing-v12-production.up.railway.app/v1/api/payment/${orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();
      window.snap.pay(data.token);

      if (response.ok) {
        console.log("success");
      } else {
        console.error(
          "Failed to place order:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleInvoices = async (orderId) => {
    try {
      let accessToken = null;

      const cookiesArray = document.cookie.split("; ");
      const accessTokenCookie = cookiesArray.find((cookie) =>
        cookie.startsWith("accessToken=")
      );

      if (accessTokenCookie) {
        accessToken = accessTokenCookie.split("=")[1];
      }

      const response = await fetch(
        `https://backend-app-ticketing-v12-production.up.railway.app/v1/api/invoice/${orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.success) {
        if (data.message === "Invoice already generated!") {
          // Kasus "Invoice already generated!", arahkan ke endpoint kedua
          const resendResponse = await fetch(
            `https://backend-app-ticketing-v12-production.up.railway.app/v1/api/invoice/${orderId}/resend`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            }
          );
          const resendData = await resendResponse.json();
          console.log(resendData);
        } else {
          console.error("Error:", data.message);
        }
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error handling invoices:", error);
    }
  };

  useEffect(() => {

    if (!isLoggedIn) {
      return;
    } else {
      
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
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = "SB-Mid-client-HV7aOKK1G2a7GXBn";

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  console.log(orderDetail);

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-60">
        {orderDetail?.status === false && (
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                Belum ada riwayat pembelian, silakan melakukan pembelian
              </p>
              <p
                className={classNames(
                  "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                )}
              ></p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p className="whitespace-nowrap">
                <time></time>
              </p>
              <p className="truncate">Data Pembelian kosong</p>
            </div>

            <button className="flex flex-none items-center gap-x-4">
              <a
                href={"/"}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                Pilih Tiket<span className="sr-only"></span>
              </a>
            </button>
          </div>
        )}
        {orderDetail?.status !== false && orderDetail?.data.length > 0 && (
          <ul>
            {orderDetail?.data.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-x-6 py-5"
              >
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {order.event.event_name} - {formatCurrency(order.gross)}
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
                      Tanggal{" "}
                      <time dateTime={order.date_order}>
                        {order.date_order}
                      </time>
                    </p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p className="truncate">Order Id {order.order_id_unik}</p>
                    {order.status === "settlement"  && (
                      <a href={'/refund/' + order.order_id_unik} className="truncate">
                        Ajukan refund?
                      </a>
                    )}
                  </div>
                </div>
                {["unpaid", "pending"].includes(order.status) && (
                  <button
                    onClick={() => handlePayment(order.order_id_unik)}
                    className="flex flex-none items-center gap-x-4"
                  >
                    <a
                      href={order.href}
                      className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                    >
                      Pembayaran<span className="sr-only">, {order.name}</span>
                    </a>
                  </button>
                )}

                {["settlement", "succes"].includes(order.status) && (
                  <button
                    onClick={() => handleInvoices(order.order_id_unik)}
                    className="flex flex-none items-center gap-x-4"
                  >
                    <a
                      href={order.href}
                      className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                    >
                      Kirim ke Email
                      <span className="sr-only">, {order.name}</span>
                    </a>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Order;
