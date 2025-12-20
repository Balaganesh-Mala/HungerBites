import { createContext, useContext, useState } from "react";

const AdminNotificationContext = createContext();

export const AdminNotificationProvider = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastSeenCount, setLastSeenCount] = useState(0);

  return (
    <AdminNotificationContext.Provider
      value={{
        unreadMessages,
        setUnreadMessages,
        lastSeenCount,
        setLastSeenCount,
      }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};

export const useAdminNotifications = () =>
  useContext(AdminNotificationContext);
