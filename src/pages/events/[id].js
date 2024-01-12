"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/ui/Navbar";

function EventDetail() {
  const [eventDetail, setEventDetail] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const eventId = router.query.id;

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
  console.log(eventDetail)

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
  console.log(eventDetail)
  console.log(eventDetail.data.ticketData)

  return (
    <>
    <Navbar />
    <div>
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
                                anda pilih akan dimasukkan kedalam keranjang dan
                                menunggu pembayaran.
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
    </div>
    </>
  );
}

export default EventDetail;
