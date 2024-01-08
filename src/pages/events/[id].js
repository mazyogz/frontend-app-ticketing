import { fetchEventDetailData } from "@/pages/api/event/events-detail";

export async function getServerSideProps({ params }) {
  const eventDetail = await fetchEventDetailData(params.id);
  return {
    props: {
      eventDetail: eventDetail.data,
    },
  };
}

function EventDetail({ eventDetail }) {
  return (
    <div>
      <h1>{eventDetail.eventData.event_name}</h1>
      <p>Date: {eventDetail.eventData.date}</p>
      <p>Venue: {eventDetail.eventData.venue}</p>
      {/* tambahkan detail lainnya sesuai kebutuhan */}
      <img
        src={eventDetail.eventData.picture}
        alt={eventDetail.eventData.event_name}
      />
      <h2>Ticket Options</h2>
      <div className="flex">
        {eventDetail.ticketData.map((ticket) => (
          <div
            key={ticket.id}
            className="border-2 flex-row size-auto bg-lime-500 rounded-md"
          >
            <a href={`/orders/${eventDetail.eventData.id}-${ticket.id}`}>
              <p>{ticket.name}</p>
              <p>{ticket.price}</p>
              <p>{ticket.status}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventDetail;
