import { Dialog, Transition } from "@headlessui/react";
import {
  CheckIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState, useRef, Fragment} from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/ui/Navbar";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function Example() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const cancelButtonRef = useRef(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [reason, setReason] = useState("");
  const orderId = router.query.orderId;

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

  useEffect(() => {
    if (!isLoggedIn || !orderId) {
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
              `https://backend-app-ticketing-v12-production.up.railway.app/v1/api/order-all/${orderId}`,
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
  }, [isLoggedIn, orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let accessToken = null;

      const cookiesArray = document.cookie.split("; ");
      const accessTokenCookie = cookiesArray.find((cookie) =>
        cookie.startsWith("accessToken=")
      );

      if (accessTokenCookie) {
        accessToken = accessTokenCookie.split("=")[1];
      }

      if (!accessToken) {
        router.push("/orders");
        return;
      }
      const formData = new FormData();
      formData.append("reason", reason);
      
      const response = await fetch(
        `https://backend-app-ticketing-v12-production.up.railway.app/v1/api/refund/${orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setSuccessDialogOpen(true);
        console.log("Refund on process!");
      } else {
        console.error(
          "Failed to place order:",
          response,
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error placing refund:", error);
    }
  };

  return (
    <>
      <Navbar />
      <form className="m-8" onSubmit={handleSubmit}>
        <div className="space-y-12 sm:space-y-16">
          <div>
            <h2 className="text-xl font-semibold leading-7 text-gray-900">
              Refund Menu
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
              Your order will being refund process
            </p>

            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Order ID
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {orderDetail?.data[0]?.order_id_unik}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Event Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {orderDetail?.data[0]?.event.event_name}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Total Amount
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {orderDetail?.data[0]?.gross}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Time Order
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {orderDetail?.data[0]?.time_order}
              </dd>
            </div>

            <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Reason
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <textarea
                    rows={3}
                    className="block w-full px-2 max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a reason why you want to refund.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            refund
          </button>
        </div>
      </form>
      <Transition.Root show={successDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={() => setSuccessDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Refund Success
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Refund proccess successfully
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={() => {
                        setSuccessDialogOpen(false);
                        router.push(`/orders/`);
                      }}
                    >
                      Lihat Pesanan
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setSuccessDialogOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Batal
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
