export async function fetchOrderData(eventId, ticketId, accessToken) {
    const apiUrl = `https://backend-app-ticketing-v12-production-7d84.up.railway.app/v1/api/order/${eventId}/${ticketId}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json', // Sesuaikan dengan kebutuhan API Anda
        },
        // Anda dapat menambahkan body jika diperlukan
        // body: JSON.stringify({ key: 'value' }),
      });
    
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to fetch order data');
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      throw error;
    }
  }