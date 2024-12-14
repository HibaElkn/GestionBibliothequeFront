import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import "../styles/Header.css"; // Adjust the path if necessary

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const socketUrl = "http://localhost:8080/ws"; // Backend WebSocket connection path

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      debug: (str) => console.log("STOMP Debug:", str), // Logs all debugging info
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("Connected to WebSocket.");
        client.subscribe(
          "/user/all-bibliocataire/notifications", // Path to subscribe
          (message) => {
            const newNotification = JSON.parse(message.body); // Parse the incoming notification
            console.log("New Notification Received:", newNotification); // Display notification in the console

            // Only store the message (ignoring type and other fields)
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              { message: newNotification.message }, // Only store the message
            ]);
          }
        );
      },

      onError: (error) => {
        console.error("STOMP Connection Error:", error);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
      console.log("WebSocket connection closed.");
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="notifications-container">
      <span
        className={`notification-icon-outline ${
          notifications.length > 0 ? "has-notification" : ""
        }`}
        onClick={toggleDropdown}
      >
        🔔
      </span>
      {notifications.length > 0 && <span className="notification-dot"></span>}
      {isDropdownVisible && (
        <div className="notification-dropdown">
          <h5>Notifications</h5>
          {notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index} className="notification-item">
                  <p>{notification.message || "No details available."}</p>
                  <span>{formatTimestamp(notification.timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
