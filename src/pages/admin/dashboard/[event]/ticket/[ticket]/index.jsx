import { Fragment, useState, useRef, useEffect, Suspense } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import {
  Bars3CenterLeftIcon,
  BellIcon,
  ClockIcon,
  CogIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import NavbarADmin from "@/components/ui/NavbarAdmin";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const cancelButtonRef = useRef(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  const router = useRouter();
  const eventId = router.query.event;
  const ticketId = router.query.ticket;



  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("adminToken");
      Cookies.remove("adminToken");
      router.push("/admin/auth/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eventId) {
        let adminToken = null;

        const cookiesArray = document.cookie.split("; ");
        const adminTokenCookie = cookiesArray.find((cookie) =>
          cookie.startsWith("adminToken=")
        );

        if (adminTokenCookie) {
          adminToken = adminTokenCookie.split("=")[1];
        }

        if (!adminToken) {
          router.push("/admin/auth/login");
          return;
        }

        const response = await fetch(
          `https://backend-app-ticketing-v12-production-7d84.up.railway.app/v1/api/admin/event/${eventId}/ticket/${ticketId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              price: price,
              status: status,
            }),
          }
        );

        if (response.ok) {
          setSuccessDialogOpen(true);
          console.log("Ticket Successfully Added!");
        } else {
          console.error(
            "Failed to place order:",
            response.status,
            response.statusText
          );
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  useEffect(() => {
    // Mengecek nilai isLoggedIn di localStorage atau sessionStorage saat halaman dimuat
    const isLoggedInLocalStorage = localStorage.getItem("isLoggedIn");
    const isLoggedInSessionStorage = sessionStorage.getItem("isLoggedIn");

    if (isLoggedInLocalStorage || isLoggedInSessionStorage) {
      setIsLoggedIn(true);
    } else {
      router.push("/admin/auth/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (eventId && ticketId) {
          let adminToken = null;

          const cookiesArray = document.cookie.split("; ");
        const adminTokenCookie = cookiesArray.find((cookie) =>
          cookie.startsWith("adminToken=")
        );

        if (adminTokenCookie) {
          adminToken = adminTokenCookie.split("=")[1];
        }

        if (!adminToken) {
          router.push("/admin/auth/login");
          return;
        }

          const response = await fetch(
            `https://backend-app-ticketing-v12-production-7d84.up.railway.app/v1/api/admin/event/${eventId}/ticket/${ticketId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log(data)

            const firstTicket = data.data?.ticketData?.[0] || {};
            console.log(firstTicket)

            // Mengasumsikan struktur data seperti { name, price, status }
            // setEventData(data);

            setTicketData(data.data.ticketData);

            setName(firstTicket.name || "");
            setPrice(firstTicket.price || "");
            setStatus(firstTicket.status || "");
          } else {
            console.error(
              "Gagal mengambil data tiket:",
              response.status,
              response.statusText
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data tiket:", error);
      }
    };

    fetchData(); // Panggil fungsi async
  }, [eventId, ticketId]);

 useEffect(() => {
    const isValid =
    name?.trim() !== "" && price?.toString().trim() !== "" && status?.trim() !== "";
  setIsFormValid(isValid);
}, [name, price, status]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-full">
        <NavbarADmin />

        <div className="flex flex-1 flex-col lg:pl-64">
          <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:border-none">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Search bar */}
            <div className="flex flex-1 justify-between px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
              <div className="flex flex-1"></div>
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                      <span className="absolute -inset-1.5 lg:hidden" />
                      <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                        <span className="sr-only">Open user menu for </span>
                        Admin
                      </span>
                      <ChevronDownIcon
                        className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main className="flex-1 pb-8">
            {/* START PAGE */}
            {/* Page header */}
            <div className="bg-white shadow">
              <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
                <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                  <div className="min-w-0 flex-1">
                    {/* Profile */}
                    <div className="flex items-center">
                      <div>
                        <div className="px-4 sm:px-0">
                          <h1 className="text-xl font-bold leading-7 text-gray-900">
                            Create New Ticket
                          </h1>
                          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                            Create new ticket for event
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="m-8" onSubmit={handleSubmit}>
                <div className="space-y-12 sm:space-y-16">
                  <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Ticket Information
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>

                    <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Ticket Name
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Presale 1"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Price
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="100000"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Status
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          >
                            <option disabled hidden value="">
                              Select Status
                            </option>
                            <option>Available</option>
                            <option>Sold Out</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
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
                        Update Berhasil
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Tiket Berhasil diupdate
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
                        router.push(`/admin/dashboard/${eventId}`);
                      }}
                    >
                      Lihat Tiket
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
    </Suspense>
  );
}
