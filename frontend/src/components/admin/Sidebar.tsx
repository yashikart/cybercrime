import { 
  LayoutDashboard, 
  FolderOpen, 
  AlertTriangle, 
  Database, 
  Phone, 
  FileText, 
  Cpu, 
  Users, 
  UserPlus, 
  KeyRound, 
  Shield,
  ChevronDown,
  Terminal,
  Activity,
  LogOut,
  User
} from "lucide-react";
import { MenuItem } from "./AdminDashboard";
import { useState } from "react";

interface SidebarProps {
  activeItem: MenuItem;
  setActiveItem: (item: MenuItem) => void;
  onLogout?: () => void;
}

export function Sidebar({ activeItem, setActiveItem, onLogout }: SidebarProps) {
  const [userManagementOpen, setUserManagementOpen] = useState(false);

  const menuItems = [
    { id: "dashboard" as MenuItem, label: "Dashboard", icon: LayoutDashboard },
    { id: "case-manager" as MenuItem, label: "Case Manager", icon: FolderOpen },
    { id: "escalations" as MenuItem, label: "Escalations", icon: AlertTriangle },
    { id: "evidence-library" as MenuItem, label: "Evidence Library", icon: Database },
    { id: "contact-police" as MenuItem, label: "Contact Police", icon: Phone },
    { id: "system-logs" as MenuItem, label: "System Logs", icon: FileText },
    { id: "rl-engine" as MenuItem, label: "RL Engine", icon: Cpu },
  ];

  const userManagementItems = [
    { id: "add-remove-investigators" as MenuItem, label: "Add / Remove Investigators", icon: UserPlus },
    { id: "reset-passwords" as MenuItem, label: "Reset Passwords", icon: KeyRound },
    { id: "setup-2fa" as MenuItem, label: "Setup 2FA", icon: Shield },
  ];

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-emerald-500/20 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="p-6 border-b border-emerald-500/20 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Terminal className="w-6 h-6 text-black" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-emerald-400 font-mono">CYBERCRIME</h1>
            <p className="text-xs text-gray-500 font-mono">Admin Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 mt-3">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span className="font-mono">System Active</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  activeItem === item.id
                    ? "bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/40 text-emerald-400"
                    : "text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeItem === item.id ? "text-emerald-400" : "text-gray-500 group-hover:text-emerald-400"}`} />
                <span className="font-mono text-sm">{item.label}</span>
                {activeItem === item.id && (
                  <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </button>
            </li>
          ))}

          {/* User Management Dropdown */}
          <li>
            <button
              onClick={() => setUserManagementOpen(!userManagementOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                ["add-remove-investigators", "reset-passwords", "setup-2fa"].includes(activeItem)
                  ? "bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/40 text-emerald-400"
                  : "text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5"
              }`}
            >
              <Users className={`w-5 h-5 ${["add-remove-investigators", "reset-passwords", "setup-2fa"].includes(activeItem) ? "text-emerald-400" : "text-gray-500 group-hover:text-emerald-400"}`} />
              <span className="font-mono text-sm">User Management</span>
              <ChevronDown className={`ml-auto w-4 h-4 transition-transform ${userManagementOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Submenu */}
            {userManagementOpen && (
              <ul className="mt-1 ml-4 space-y-1 border-l border-emerald-500/20 pl-4">
                {userManagementItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveItem(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group ${
                        activeItem === item.id
                          ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400"
                          : "text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/5"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-mono text-xs">{item.label}</span>
                      {activeItem === item.id && (
                        <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-500/20 flex-shrink-0 space-y-3">
        {/* Admin User Info */}
        <div className="flex items-center gap-3 p-3 bg-black/40 border border-emerald-500/20 rounded-lg">
          <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 font-mono text-sm truncate">Admin User</p>
            <p className="text-gray-600 font-mono text-xs">admin@cybercrime.gov</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-600/20 hover:border-red-500/50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-mono text-sm">Logout</span>
        </button>

        {/* System Info */}
        <div className="pt-2 border-t border-emerald-500/10">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="font-mono">v3.7.2-QUANTUM</span>
          </div>
          <div className="mt-2 flex gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
              <span className="font-mono">Secured</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span className="font-mono">Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}