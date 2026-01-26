import { AdminDashboard } from "./components/admin/AdminDashboard";
import { CyberBackground } from "./components/CyberBackground";
import { ScanLines } from "./components/ScanLines";

export default function Admin() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <CyberBackground />
      <ScanLines />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
      
      <div className="relative z-10">
        <AdminDashboard />
      </div>
    </div>
  );
}
