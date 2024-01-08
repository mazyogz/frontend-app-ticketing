export async function fetchEventData() {
  const response = await fetch("https://backend-app-ticketing-v12-production.up.railway.app/v1/api/events");
  const data = await response.json();

  return data;
}

