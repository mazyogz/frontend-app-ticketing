"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function EventDetail() {
  const [eventDetail, setEventDetail] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const eventId = router.query.id;

  const today = new Date();

  // Mengambil informasi tanggal
  const day = today.getDate();
  const month = today.getMonth() + 1; // Ingat bahwa bulan dimulai dari 0, sehingga perlu ditambah 1
  const year = today.getFullYear();

  // Format tanggal sesuai kebutuhan (contoh: DD/MM/YYYY)
  const formattedDate = `${day}/${month}/${year}`;

  const formatDate = (inputDate) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(inputDate).toLocaleDateString("id-ID", options);
  };

  const products = [
    {
      id: 1,
      name: "Distant Mountains Artwork Tee",
      price: "$36.00",
      description:
        "You awake in a new, mysterious land. Mist hangs low along the distant mountains. What does it mean?",
      address: ["Floyd Miles", "7363 Cynthia Pass", "Toronto, ON N3Y 4H8"],
      email: "f•••@example.com",
      phone: "1•••••••••40",
      href: "#",
      status: "Processing",
      step: 1,
      date: "March 24, 2021",
      datetime: "2021-03-24",
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/confirmation-page-04-product-01.jpg",
      imageAlt:
        "Off-white t-shirt with circular dot illustration on the front of mountain ridges that fade.",
    },
    // More products...
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (eventId) {
          const response = await fetch(
            `https://backend-app-ticketing-v12-production.up.railway.app/v1/api/events/${eventId}`
          );
          const data = await response.json();
          setEventDetail(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [eventId]);

  const toggleModal = (ticketId) => {
    setModalOpen(!isModalOpen);
    setSelectedTicketId(ticketId);
  };
  console.log(eventDetail);

  const handleAgree = async () => {
    try {
      if (eventId && selectedTicketId) {
        let accessToken = null;

        const cookiesArray = document.cookie.split("; ");
        const accessTokenCookie = cookiesArray.find((cookie) =>
          cookie.startsWith("accessToken=")
        );

        if (accessTokenCookie) {
          accessToken = accessTokenCookie.split("=")[1];
        }

        const response = await fetch(
          `https://backend-app-ticketing-v12-production.up.railway.app/v1/api/order/${eventId}/${selectedTicketId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          console.log("Order placed successfully!");
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

  if (!eventDetail) {
    return <div>Loading...</div>;
  }
  console.log(eventDetail);
  console.log(eventDetail.data.ticketData);

  return (
    <>
      <Navbar />
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Events Details
          </h1>

          <div className="mt-2 border-b border-gray-200 pb-5 text-sm sm:flex sm:justify-between">
            <dl className="flex">
              <dt className="text-gray-500">Event number&nbsp;</dt>
              <dd className="font-medium text-gray-900">
                {eventDetail.data.eventData.id}
              </dd>
              <dt>
                <span className="sr-only">Date</span>
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  &middot;
                </span>
              </dt>
              <dd className="font-medium text-gray-900">
                <time>{formatDate(eventDetail.data.eventData.date)}</time>
              </dd>
            </dl>
          </div>

          <div className="mt-8">
            <h2 className="sr-only">Products purchased</h2>
            <div className="space-y-24">
              <div className="grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-8">
                <div className="sm:col-span-4 md:col-span-5 md:row-span-2 md:row-end-2">
                  <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={eventDetail.data.eventData.picture}
                      alt={eventDetail.data.eventData.event_name}
                      className="object-cover object-center"
                    />
                  </div>
                </div>
                <div className="mt-6 sm:col-span-7 sm:mt-0 md:row-end-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    <a href="#">{eventDetail.data.eventData.event_name}</a>
                  </h3>
                  <p className="mt-1 font-medium text-gray-900">
                    {eventDetail.data.eventData.guest}
                  </p>
                  <p className="mt-3 text-gray-500">Deskripsi</p>
                </div>
                <div className="sm:col-span-12 md:col-span-7">
                  <dl className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
                    <div>
                      <dt className="font-medium text-gray-900">
                        Waktu dan Tempat
                      </dt>
                      <dd className="mt-3 text-gray-500">
                        <span className="block">
                          {eventDetail.data.eventData.venue}
                        </span>
                        <span className="block">
                          {eventDetail.data.eventData.jam_mulai} - Selesai
                        </span>
                        <span className="block">
                          {formatDate(eventDetail.data.eventData.date)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-6 font-medium text-gray-900 md:mt-10">
                    Checkout tiket sekarang {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {eventDetail.data.ticketData.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => {
                  if (ticket.status !== "Sold Out") {
                    toggleModal(ticket.id);
                  }
                }}
                disabled={ticket.status === "Sold Out"}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                {isModalOpen && (
                  <div
                    className="relative z-10"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="w-6 h-6"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                  />
                                </svg>
                              </div>
                              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3
                                  className="text-base font-semibold leading-6 text-gray-900"
                                  id="modal-title"
                                >
                                  Lakukan Transaksi
                                </h3>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                    Anda akan melanjutkan transaksi, ticket yang
                                    anda pilih akan dimasukkan kedalam keranjang
                                    dan menunggu pembayaran.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                              onClick={handleAgree}
                            >
                              Setuju
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500">
                          {ticket.name} - {ticket.status}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {ticket.price}
                          </div>
                        </dd>
                      </dl>
                    </div>
                    <div className="flex-shrink-0">
                      {ticket.status === "Sold Out" ? (
                        <XCircleIcon
                          className="h-6 w-6 text-red-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <CheckCircleIcon
                          className="h-6 w-6 text-green-400"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* <div>
        <h1>{eventDetail.data.eventData.event_name}</h1>
        <p>Date: {eventDetail.data.eventData.date}</p>
        <p>Venue: {eventDetail.data.eventData.venue}</p>
        <img
          src={eventDetail.data.eventData.picture}
          alt={eventDetail.data.eventData.event_name}
        />
        <h2>Ticket Options</h2>
        <div className="flex">
          {eventDetail.data.ticketData.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => toggleModal(ticket.id)}
              className="border-2 flex-row size-auto bg-lime-500 rounded-md"
            >
              {isModalOpen && (
                <div
                  className="relative z-10"
                  aria-labelledby="modal-title"
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                />
                              </svg>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                              <h3
                                className="text-base font-semibold leading-6 text-gray-900"
                                id="modal-title"
                              >
                                Lakukan Transaksi
                              </h3>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Anda akan melanjutkan transaksi, ticket yang
                                  anda pilih akan dimasukkan kedalam keranjang
                                  dan menunggu pembayaran.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                            onClick={handleAgree}
                          >
                            Setuju
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <p>{ticket.name}</p>
              <p>{ticket.price}</p>
              <p>{ticket.status}</p>
            </button>
          ))}
        </div>
      </div> */}
      <Footer />
    </>
  );
}

export default EventDetail;
