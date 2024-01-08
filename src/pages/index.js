import { fetchEventData } from "@/pages/api/event/events";

export async function getServerSideProps() {
  const eventData = await fetchEventData();
  return {
    props: {
      eventData,
    },
  };
}

export default function Home({ eventData }) {
  return (
    <div>
      <h1>List of Events</h1>
      <div className="flex m-2">
        {eventData.data.map((event) => (
          <div key={event.id} className="m-2 bg-current rounded-md flex-row size-auto">
            <a href={`/events/${event.id}`}>
              <img src={event.picture} alt={event.event_name} className="rounded-md"/>
              <p className="text-white">{event.event_name}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
