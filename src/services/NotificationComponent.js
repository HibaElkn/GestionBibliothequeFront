import React, { useEffect, useState } from "react";
import { getEmpruntsByUtilisateur } from "../services/empruntService"; // Ensure this is the correct import
import { getEmailFromToken } from "../services/authService"; // Assuming you have an authService to extract the email from token
import { getUserByEmail } from "../services/userService"; // Assuming you have a service to fetch user by email

const NotificationComponent = () => {
  const [userId, setUserId] = useState(null); // Holds the UUID of the user
  const [notifications, setNotifications] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      try {
        // Extract email from token
        const email = getEmailFromToken();
        console.log('Email extrait du token:', email);

        if (!email) {
          console.error("Aucun email trouvé dans le token.");
          return;
        }

        // Fetch user by email to get the UUID
        const user = await getUserByEmail(email);
        console.log('Utilisateur récupéré:', user);

        if (user && user.id) {
          setUserId(user.id); // Set the userId (UUID)

          // Fetch emprunts for the user
          const empruntsData = await getEmpruntsByUtilisateur(user.id);
          if (empruntsData?.utilisateur?.notifications) {
            const userNotifications = empruntsData.utilisateur.notifications.map(notification => ({
              id: notification.id,
              message: notification.message,
              date: notification.date,
            }));
            setNotifications(userNotifications);
            console.log("User Notifications:", userNotifications);
          }
        }
      } catch (error) {
        console.error("Error fetching user or notifications:", error);
      }
    };

    fetchUserAndNotifications();
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
        className={`notification-icon-outline ${notifications.length > 0 ? "has-notification" : ""}`}
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
              {notifications.map((notification) => (
                <li key={notification.id} className="notification-item">
                  <p>{notification.message || "No details available."}</p>
                  {notification.date && <span>{formatTimestamp(notification.date)}</span>}
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
