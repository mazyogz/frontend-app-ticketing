"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

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
            body: JSON.stringify({
            }),
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

  return (
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
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg
                              className="h-6 w-6 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
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
  );
}

export default EventDetail;
