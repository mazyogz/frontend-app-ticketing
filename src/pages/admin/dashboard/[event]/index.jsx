import { Fragment, useState, useEffect, Suspense, useRef } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { PaperClipIcon } from "@heroicons/react/20/solid";
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
  CheckIcon
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

const navigation = [
  { name: "Home", href: "#", icon: HomeIcon, current: true },
  { name: "History", href: "#", icon: ClockIcon, current: false },
  { name: "Balances", href: "#", icon: ScaleIcon, current: false },
  { name: "Cards", href: "#", icon: CreditCardIcon, current: false },
  { name: "Recipients", href: "#", icon: UserGroupIcon, current: false },
  { name: "Reports", href: "#", icon: DocumentChartBarIcon, current: false },
];
const secondaryNavigation = [
  { name: "Settings", href: "#", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon },
];
const cards = [
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  // More items...
];
const transactions = [
  {
    id: 1,
    name: "Payment to Molly Sanders",
    href: "#",
    amount: "$20,000",
    currency: "USD",
    status: "success",
    date: "July 11, 2020",
    datetime: "2020-07-11",
  },
  // More transactions...
];
const statusStyles = {
  Available: "bg-green-100 text-green-800",
  SoldOut: "bg-red-100 text-red-800",
  active: "bg-green-100 text-green-800",
  hide: "bg-yellow-100 text-yellow-800",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); 
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const eventId = router.query.event;

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

  const handleDelete = async (ticketId) => {
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
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          setSuccessDialogOpen(true);
          console.log("Ticket Successfully Deleted!");
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
    const fetchData = async () => {
      try {
        let adminToken = null;

        // Check if running on the client side
        const cookiesArray = document.cookie.split("; ");
        const adminTokenCookie = cookiesArray.find((cookie) =>
          cookie.startsWith("adminToken=")
        );

        if (adminTokenCookie) {
          adminToken = adminTokenCookie.split("=")[1];
        }

        if (eventId) {
          const response = await fetch(
            `https://backend-app-ticketing-v12-production-7d84.up.railway.app/v1/api/admin/event/${eventId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          setEventData(data.data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [eventId]);

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

  console.log(eventData);

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
                            Event Information
                          </h1>
                          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                            Event details and tickets.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
                    <button
                      onClick={() =>
                        router.push(`/admin/dashboard/${eventId}/ticket/create`)
                      }
                      type="button"
                      className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                    >
                      Add New Ticket
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/admin/dashboard/${eventId}/edit`)
                      }
                      className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                      Edit Event
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-10 mt-5">
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Event name
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {eventData?.eventData.event_name}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Image
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <img src={eventData?.eventData.picture} alt="" />
                      {eventData?.eventData.picture}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Venue
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {eventData?.eventData.venue}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Held On
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {eventData?.eventData.date},{" "}
                      {eventData?.eventData.jam_mulai} -{" "}
                      {eventData?.eventData.jam_selesai}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Guest
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {eventData?.eventData.guest}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {eventData?.eventData.description}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Terms and Conditions
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {eventData?.eventData.syarat}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Event Display Status
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <span
                        className={classNames(
                          statusStyles[eventData?.eventData.status],
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                        )}
                      >
                        {eventData?.eventData.status}
                      </span>
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Tickets
                    </dt>
                    <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <ul
                        role="list"
                        className="divide-y divide-gray-100 rounded-md border border-gray-200"
                      >
                        {eventData?.ticketData.map((tickets) => (
                          <li
                            key={tickets.id}
                            className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                          >
                            <div className="flex w-0 flex-1 items-center">
                              <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                <span className="truncate font-medium">
                                  {tickets.name}
                                </span>
                                <span className="flex-shrink-0 text-black-400">
                                  {tickets.price}
                                </span>
                                <span
                                  className={classNames(
                                    tickets.status === "Sold Out"
                                      ? statusStyles.SoldOut
                                      : statusStyles.Available,
                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                                  )}
                                >
                                  {tickets.status}
                                </span>
                              </div>
                              <div className="ml-auto mx-1">
                                <button
                                 onClick={() => {
                                  router.push(`/admin/dashboard/${eventId}/ticket/${tickets.id}`);
                                }}
                                  type="button"
                                  className="inline-flex items-center rounded-md bg-cyan-600 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                                >
                                  Edit
                                </button>
                              </div>
                              <div className="ml-auto mx-1">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(tickets.id)}
                                  className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
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
                        Sukses Hapus
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Tiket Berhasil dihapus
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
                        window.location.reload();
                      }}
                    >
                      Lihat Event
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
