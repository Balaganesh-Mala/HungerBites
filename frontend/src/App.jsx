import AdminRoutes from "./router/AdminRoutes";
import UserRoutes from "./router/UserRoutes";

function App() {
  const isAdmin = window.location.pathname.startsWith("/admin");
  return isAdmin ? <AdminRoutes /> : <UserRoutes />;
}

export default App;
