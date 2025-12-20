import AdminRoutes from "./router/AdminRoutes";
import { AdminNotificationProvider } from "./context/AdminNotificationContext";

function App() {
  return (
    <AdminNotificationProvider>
      <AdminRoutes />
    </AdminNotificationProvider>
  );
}

export default App;
