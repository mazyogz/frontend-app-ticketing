import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
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
} from '@heroicons/react/24/outline'
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import NavbarADmin from '@/components/ui/NavbarAdmin'

const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'History', href: '#', icon: ClockIcon, current: false },
  { name: 'Balances', href: '#', icon: ScaleIcon, current: false },
  { name: 'Cards', href: '#', icon: CreditCardIcon, current: false },
  { name: 'Recipients', href: '#', icon: UserGroupIcon, current: false },
  { name: 'Reports', href: '#', icon: DocumentChartBarIcon, current: false },
]
const secondaryNavigation = [
  { name: 'Settings', href: '#', icon: CogIcon },
  { name: 'Help', href: '#', icon: QuestionMarkCircleIcon },
  { name: 'Privacy', href: '#', icon: ShieldCheckIcon },
]
const cards = [
  { name: 'Account balance', href: '#', icon: ScaleIcon, amount: '$30,659.45' },
  // More items...
]
const transactions = [
  {
    id: 1,
    name: 'Payment to Molly Sanders',
    href: '#',
    amount: '$20,000',
    currency: 'USD',
    status: 'success',
    date: 'July 11, 2020',
    datetime: '2020-07-11',
  },
  // More transactions...
]
const statusStyles = {
  active: 'bg-green-100 text-green-800',
  hide: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-gray-100 text-gray-800',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [eventData, setEventData] = useState(null);
  const router = useRouter(); 
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

useEffect(() => {
  if (typeof window !== "undefined") {
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

        const response = await fetch(
          `https://backend-app-ticketing-v12-production.up.railway.app/v1/api/admin/events`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        setEventData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }
}, []);


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

  return (
    <>
      <div className="min-h-full">
        <NavbarADmin/>

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
              <div className="flex flex-1">
              </div>
              <div className="ml-4 flex items-center md:ml-6">

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                      <span className="absolute -inset-1.5 lg:hidden" />
                      <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                        <span className="sr-only">Open user menu for </span>Admin
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
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
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
                        <div className="flex items-center">
                          <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                            Wellcome Back! Admin.
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                    >
                      Add Event
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">

              <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
                All Event Data
              </h2>

              {/* Activity list (smallest breakpoint only) */}
              <div className="shadow sm:hidden">
                <ul role="list" className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
                  {transactions.map((transaction) => (
                    <li key={transaction.id}>
                      <p className="block bg-white px-4 py-4 hover:bg-gray-50">
                        <span className="flex items-center space-x-4">
                          <span className="flex flex-1 space-x-2 truncate">
                            <BanknotesIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            <span className="flex flex-col truncate text-sm text-gray-500">
                              <span className="truncate">transaiki</span>
                              <span>
                                <span className="font-medium text-gray-900">{transaction.amount}</span>{' '}
                                {transaction.currency}
                              </span>
                              <time dateTime={transaction.datetime}>{transaction.date}</time>
                            </span>
                          </span>
                          <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>

                <nav
                  className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
                  aria-label="Pagination"
                >
                  <div className="flex flex-1 justify-between">
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Previous
                    </a>
                    <a
                      href="#"
                      className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Next
                    </a>
                  </div>
                </nav>
              </div>

              {/* Activity table (small breakpoint and up) */}
              <div className="hidden sm:block">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                  <div className="mt-2 flex flex-col">
                    <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th
                              className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                              scope="col"
                            >
                              Events Name
                            </th>
                            <th
                              className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                              scope="col"
                            >
                              Venue
                            </th>
                            <th
                              className="hidden bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:block"
                              scope="col"
                            >
                              Status
                            </th>
                            <th
                              className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                              scope="col"
                            >
                              Date
                            </th>
                            <th
                              className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                              scope="col"
                            >
                              Detail
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {eventData && eventData.data && eventData.data.map((events) => (
                            <tr key={events.id} className="bg-white">
                              <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                <div className="flex">
                                  <p href={events.href} className="group inline-flex space-x-2 truncate text-sm">
                                    <p className="truncate font-medium text-gray-900 group-hover:text-gray-900">
                                      {events.event_name}
                                    </p>
                                  </p>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{events.venue}</span>
                                {events.currency}
                              </td>
                              <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">
                                <span
                                  className={classNames(
                                    statusStyles[events.status],
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize'
                                  )}
                                >
                                  {events.status}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                <time dateTime={events.datetime}>{events.date}</time>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                <a href={`/admin/dashboard/${events.id}`}className='rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600'>Details</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
