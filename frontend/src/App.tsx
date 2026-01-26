import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { AdminLogin } from "./components/auth/AdminLogin";
import { InvestigatorLogin } from "./components/auth/InvestigatorLogin";
import Admin from "./admin";
import { InvestigatorDashboard } from "./components/investigator/InvestigatorDashboard";

type Page = "landing" | "admin-login" | "investigator-login" | "admin-dashboard" | "investigator-dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case "admin-login":
        return <AdminLogin setCurrentPage={setCurrentPage} />;
      case "investigator-login":
        return <InvestigatorLogin setCurrentPage={setCurrentPage} />;
      case "admin-dashboard":
        return <Admin />;
      case "investigator-dashboard":
        return <InvestigatorDashboard setCurrentPage={setCurrentPage} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return renderPage();
}

export default App
