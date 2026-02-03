import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardContent } from "./DashboardContent";
import { ManualInvestigatorContent } from "./ManualInvestigatorContent";
import { EscalationsContent } from "./EscalationsContent";
import { EvidenceLibraryContent } from "./EvidenceLibraryContent";
import { AddRemoveInvestigatorsContent } from "./AddRemoveInvestigatorsContent";
import { ResetPasswordsContent } from "./ResetPasswordsContent";
import { Setup2FAContent } from "./Setup2FAContent";
import { InvestigatorsManagementContent } from "./InvestigatorsManagementContent";
import { ComplaintsViewContent } from "./ComplaintsViewContent";
import { InvestigatorActivityContent } from "./InvestigatorActivityContent";
import { InvestigatorStatusContent } from "./InvestigatorStatusContent";
import { InvestigatorCommunicationContent } from "./InvestigatorCommunicationContent";
import { AIFraudDetectionContent } from "./AIFraudDetectionContent";
import { AccessRequestsContent } from "./AccessRequestsContent";

export type MenuItem = 
  | "dashboard" 
  | "manual-investigator"
  | "investigators-management"
  | "investigator-activity"
  | "investigator-status"
  | "investigator-communication"
  | "escalations" 
  | "evidence-library" 
  | "complaints-view"
  | "fraud-detection"
  | "rl-engine"
  | "access-requests" 
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
      case "manual-investigator":
        return <ManualInvestigatorContent />;
      case "investigators-management":
        return <InvestigatorsManagementContent />;
      case "investigator-activity":
        return <InvestigatorActivityContent />;
      case "investigator-status":
        return <InvestigatorStatusContent />;
      case "investigator-communication":
        return <InvestigatorCommunicationContent />;
      case "escalations":
        return <EscalationsContent />;
      case "evidence-library":
        return <EvidenceLibraryContent />;
      case "complaints-view":
        return <ComplaintsViewContent />;
      case "fraud-detection":
        return <AIFraudDetectionContent />;
      case "rl-engine":
        return <AIFraudDetectionContent />;
      case "access-requests":
        return <AccessRequestsContent />;
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