import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardContent } from "./DashboardContent";
import { CaseManagerContent } from "./CaseManagerContent";
import { EscalationsContent } from "./EscalationsContent";
import { EvidenceLibraryContent } from "./EvidenceLibraryContent";
import { ContactPoliceContent } from "./ContactPoliceContent";
import { SystemLogsContent } from "./SystemLogsContent";
import { RLEngineContent } from "./RLEngineContent";
import { AddRemoveInvestigatorsContent } from "./AddRemoveInvestigatorsContent";
import { ResetPasswordsContent } from "./ResetPasswordsContent";
import { Setup2FAContent } from "./Setup2FAContent";

export type MenuItem = 
  | "dashboard" 
  | "case-manager" 
  | "escalations" 
  | "evidence-library" 
  | "contact-police" 
  | "system-logs" 
  | "rl-engine" 
  | "add-remove-investigators" 
  | "reset-passwords" 
  | "setup-2fa";

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeItem, setActiveItem] = useState<MenuItem>("dashboard");

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <DashboardContent />;
      case "case-manager":
        return <CaseManagerContent />;
      case "escalations":
        return <EscalationsContent />;
      case "evidence-library":
        return <EvidenceLibraryContent />;
      case "contact-police":
        return <ContactPoliceContent />;
      case "system-logs":
        return <SystemLogsContent />;
      case "rl-engine":
        return <RLEngineContent />;
      case "add-remove-investigators":
        return <AddRemoveInvestigatorsContent />;
      case "reset-passwords":
        return <ResetPasswordsContent />;
      case "setup-2fa":
        return <Setup2FAContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} onLogout={onLogout} />
      <main className="flex-1 ml-72 p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
}