import { fetchEventData } from "@/pages/api/event/events";
import React, { useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Cookies from "js-cookie";
import Footer from "@/components/ui/Footer";
import TestimonialsComponents from "@/components/ui/TestimonialsComponents";
import SupportComponents from "@/components/ui/SuppportComponents";

const formatDate = (inputDate) => {
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(inputDate).toLocaleDateString("id-ID", options);
};

export async function getServerSideProps() {
  const eventData = await fetchEventData();
  return {
    props: {
      eventData,
    },
  };
}

export default function Home({ eventData }) {
  console.log({ eventData });
  const productsSectionRef = useRef(null);

  const scrollToProducts = () => {
    productsSectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <>
      <Navbar />

      <div className="bg-white">
        <div className="relative bg-gray-900">
          {/* Decorative image and overlay */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gray-900 opacity-50"
          />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
              New arrivals are here
            </h1>
            <p className="mt-4 text-xl text-white">
              The new arrivals have, well, newly arrived. Check out the latest
              options from our summer small-batch release while they're still in
              stock.
            </p>
            <button
              onClick={scrollToProducts}
              className="mt-8 inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Shop New Arrivals
            </button>
          </div>
        </div>
      </div>

      <div ref={productsSectionRef} className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
            {eventData.data.map((event) => (
              <div
                key={event.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75">
                  <img
                    src={event.picture}
                    className="w-full h-full object-cover object-center"
                    alt={event.event_name}
                  />
                </div>
                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    <a href={`/events/${event.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {event.event_name}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(event.date)}
                  </p>
                  <div className="flex flex-1 flex-col justify-end">
                    <p className="text-sm italic text-gray-500">
                      {event.venue}
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {event.guest}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TestimonialsComponents />
      <SupportComponents />
      <Footer />
    </>
  );
}
