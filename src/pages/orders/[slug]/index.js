import { useEffect, useState } from 'react';
import { fetchOrderData } from "@/pages/api/order/order";
import { useRouter } from 'next/router';

function Orderpage({ initialOrderDetail }) {
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState(initialOrderDetail);
  const { slug } = router.query;

  console.log(orderDetail);
  console.log(slug);

  useEffect(() => {
    // Mengambil accessToken dari sessionStorage
    const accessToken = sessionStorage.getItem('accessToken');

    // Mendapatkan eventId dan ticketId dari slug
    if (slug) {
      const [eventId] = slug[0];
      const [ticketId] = slug[2];

      // Memanggil fetchOrderData dengan accessToken, eventId, dan ticketId
      const fetchData = async () => {
        try {
          const response = await fetchOrderData(eventId, ticketId, accessToken);
          setOrderDetail(response.data);
        } catch (error) {
          console.error('Error fetching order data:', error);
        }
      };

      // Memanggil fetchData saat komponen dipasang
      fetchData();
    } else {
      console.error('Slug is undefined');
    }
  }, [slug]);

  return (
    <div>
      <h1>{orderDetail.orderId}</h1>
      {/* Tampilkan detail pesanan lainnya sesuai kebutuhan */}
    </div>
  );
}

export default Orderpage;
