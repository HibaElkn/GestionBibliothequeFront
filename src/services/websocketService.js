import { useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const useWebSocket = () => {
  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    // Add the token to the headers
    stompClient.connect(
      {
        Authorization: `Bearer ${token}` // Pass the token as an Authorization header
      },
      (frame) => {
        console.log('Connected: ' + frame);

        stompClient.subscribe('/user/notifications', (message) => {
          const notification = JSON.parse(message.body);

          if (notification.type === 'RESERVATION_STATUS_CHANGED') {
            const reservationStatus = notification.message.split(",")[0].split(":")[1];
            if (reservationStatus === "ACCEPTED") {
              alert("Your reservation has been accepted! Reservation ID: " + notification.message.split(",")[1].split(":")[1]);
            }
          }
        });
      },
      (error) => {
        console.error("WebSocket connection error: ", error);
      }
    );

    // Cleanup on component unmount
    return () => {
      stompClient.disconnect();
    };
  }, []); // Empty array ensures this only runs once, when the component mounts.
};

export default useWebSocket;
