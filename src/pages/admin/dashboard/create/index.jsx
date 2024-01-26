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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cancelButtonRef = useRef(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [name, setName] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [guest, setGuest] = useState("");
  const [description, setDescription] = useState("");
  const [syarat, setSyarat] = useState("");
  const [qty, setQty] = useState("");
  const [isImageSelected, setIsImageSelected] = useState(false);

  const router = useRouter();
  const eventId = router.query.event;

  // useEffect(() => {
  //   const isValid = name.trim() !== "" && jamMulai.trim() !== "" && jamSelesai.trim() !== ""
  //   && venue.trim() !== "" && date.trim() !== "" && image.trim() !== ""
  //   && guest.trim() !== "" && description.trim() !== "" && syarat.trim() !== ""
  //   && qty.trim() !== "";

  //   setIsFormValid(isValid);
  // }, [name, jamMulai, jamSelesai, venue, date, image, guest, description, syarat, qty]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Image is selected
      setIsImageSelected(true);

      // You can do something with the file if needed
      setImage(file);
    } else {
      // No image selected
      setIsImageSelected(false);
    }
  };

  const formData = new FormData();
  formData.append("image", image);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      const formData = new FormData();
      formData.append("image", image);

      formData.append("event_name", name);
      formData.append("jam_mulai", jamMulai);
      formData.append("jam_selesai", jamSelesai);
      formData.append("venue", venue);
      formData.append("date", date);
      formData.append("guest", guest);
      formData.append("description", description);
      formData.append("syarat", syarat);
      formData.append("qty", qty);

      const response = await fetch(
        `https://backend-app-ticketing-v12-production.up.railway.app/v1/api/admin/create-event`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setSuccessDialogOpen(true);
        console.log("Event Successfully Added!");
      } else {
        console.error(
          "Failed to place order:",
          response,
          response.status,
          response.statusText
        );
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
                      Profile
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                    <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Event Name
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="PESTAPORA FEST 2024"
                            required
                          />
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Jam Mulai
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            type="text"
                            value={jamMulai}
                            onChange={(e) => setJamMulai(e.target.value)}
                            placeholder="18:00"
                            required
                          />
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Jam Selesai
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            type="text"
                            value={jamSelesai}
                            onChange={(e) => setJamSelesai(e.target.value)}
                            placeholder="21:00"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Venue
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            type="text"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            placeholder="Gelora Bung Karno Stadium"
                            required
                          />
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Date
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="YYYY-MM-DD / 2024-12-23"
                            required
                          />
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Cover photo
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <div className="flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                              <PhotoIcon
                                className="mx-auto h-12 w-12 text-gray-300"
                                aria-hidden="true"
                              />
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                  className={`relative cursor-pointer rounded-md font-semibold ${
                                    isImageSelected
                                      ? "text-green-500"
                                      : "text-indigo-600"
                                  } focus-within:outline-none focus-within:ring-2 ${
                                    isImageSelected
                                      ? "focus-within:ring-green-500"
                                      : "focus-within:ring-indigo-600"
                                  } focus-within:ring-offset-2 hover:text-indigo-500`}
                                >
                                  <span>
                                    {isImageSelected
                                      ? "Change image"
                                      : "Upload a file"}
                                  </span>
                                  <input
                                    id="image"
                                    name="image"
                                    className="sr-only"
                                    type="file"
                                    onChange={handleFileChange}
                                    required
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Guest
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            type="text"
                            value={guest}
                            onChange={(e) => setGuest(e.target.value)}
                            placeholder="DEWA 19, Pamungkas"
                            required
                          />
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Description
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <textarea
                            rows={3}
                            className="px-3 block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            Write a few sentences about event description.
                          </p>
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className=" block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          Terms and Conditions
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <textarea
                            rows={3}
                            className="px-3 block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={syarat}
                            onChange={(e) => setSyarat(e.target.value)}
                            required
                          />
                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            Write a few sentences about event terms and
                            conditions.
                          </p>
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          QTY
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            type="text"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            required
                          />
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
                    // disabled={!isFormValid}
                    className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add
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
                        Pemesanan Berhasil
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Tiket Berhasil ditambahkan
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
                        router.push(`/admin/dashboard/`);
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
    </Suspense>
  );
}
