import { Shield, Terminal, UserCog, Users, ArrowRight, Lock, Activity } from "lucide-react";

interface LandingPageProps {
  setCurrentPage: (page: "landing" | "admin-login" | "investigator-login" | "admin-dashboard" | "investigator-dashboard") => void;
}

export function LandingPage({ setCurrentPage }: LandingPageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative flex items-center justify-center mb-8 h-32">
            {/* Glow effect */}
            <div className="absolute w-40 h-40 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            
            {/* Orbiting rings container - properly centered */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* First orbiting ring */}
              <div className="absolute inset-0 w-32 h-32">
                <div className="w-full h-full border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
              </div>
              {/* Second orbiting ring */}
              <div className="absolute inset-0 w-32 h-32">
                <div className="w-full h-full border-2 border-cyan-400/30 border-b-cyan-400 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "3s" }}></div>
              </div>
              
              {/* Center shield icon */}
              <div className="relative bg-black/80 backdrop-blur-xl p-6 rounded-full border border-emerald-500/30 shadow-lg shadow-emerald-500/20 z-10">
                <Shield className="w-12 h-12 text-emerald-400" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              </div>
            </div>
          </div>

          <h1 className="text-6xl mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            CYBERCRIME PORTAL
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-emerald-400 to-transparent mb-4"></div>
          <p className="text-gray-400 flex items-center justify-center gap-2 font-mono">
            <Lock className="w-4 h-4" />
            SECURE ACCESS TERMINAL
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              SYSTEM ONLINE
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-cyan-400" />
              ENCRYPTED
            </span>
          </div>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Login Card */}
          <button
            onClick={() => setCurrentPage("admin-login")}
            className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-red-500/30 rounded-xl p-8 hover:border-red-500/60 transition-all duration-300"
          >
            {/* Corner brackets */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-red-400 opacity-50 group-hover:opacity-100 transition"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-orange-400 opacity-50 group-hover:opacity-100 transition"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-orange-400 opacity-50 group-hover:opacity-100 transition"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-red-400 opacity-50 group-hover:opacity-100 transition"></div>

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="p-5 bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/40 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <UserCog className="w-12 h-12 text-red-400" />
                </div>
              </div>

              <h2 className="text-2xl mb-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                ADMIN ACCESS
              </h2>
              <p className="text-gray-400 text-sm mb-6 font-mono">
                System administrators and security officers
              </p>

              <div className="flex items-center justify-center gap-2 text-red-400 font-mono text-sm group-hover:gap-3 transition-all">
                <span>Access Control Panel</span>
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="mt-6 pt-6 border-t border-red-500/20">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-600 font-mono">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-red-400" />
                    FULL PRIVILEGES
                  </span>
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-orange-400" />
                    SYSTEM CONTROL
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Investigator Login Card */}
          <button
            onClick={() => setCurrentPage("investigator-login")}
            className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-8 hover:border-emerald-500/60 transition-all duration-300"
          >
            {/* Corner brackets */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-emerald-400 opacity-50 group-hover:opacity-100 transition"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-emerald-400 opacity-50 group-hover:opacity-100 transition"></div>

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="p-5 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 border border-emerald-500/40 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-12 h-12 text-emerald-400" />
                </div>
              </div>

              <h2 className="text-2xl mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                INVESTIGATOR ACCESS
              </h2>
              <p className="text-gray-400 text-sm mb-6 font-mono">
                Field agents and case investigators
              </p>

              <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-sm group-hover:gap-3 transition-all">
                <span>Access Case Portal</span>
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="mt-6 pt-6 border-t border-emerald-500/20">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-600 font-mono">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    CASE ACCESS
                  </span>
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    FIELD TOOLS
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-xs text-gray-600 font-mono flex items-center justify-center gap-2">
            <span className="text-emerald-400">█</span>
            v3.7.2-QUANTUM | Build 20251118.2359
            <span className="text-cyan-400">█</span>
          </p>
          <p className="text-xs text-gray-700 font-mono">
            AES-256 | RSA-4096 | SHA-512 | TLS 1.3
          </p>
        </div>
      </div>
    </div>
  );
}