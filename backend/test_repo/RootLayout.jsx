import { Outlet } from "react-router-dom";
import AuthWrapper from "./components/AuthWrapper";
import ScrollToTop from "./components/ScrollToTop";

const RootLayout = () => {
  return (
    <AuthWrapper>
      <ScrollToTop />
      <Outlet />
    </AuthWrapper>
  );
};

export default RootLayout;
