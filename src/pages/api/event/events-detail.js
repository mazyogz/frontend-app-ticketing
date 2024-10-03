export async function fetchEventDetailData(id) {
    const response = await fetch(`https://backend-app-ticketing-v12-production-7d84.up.railway.app/v1/api/events/${id}`);
    const data = await response.json();
  
    return data;
  }