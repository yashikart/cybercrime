import { Activity, Users, AlertTriangle, FolderOpen, TrendingUp, Shield, Database, Zap, MapPin, Bot, Filter, Trash2, Eye, Lock, Unlock, FileWarning, PlayCircle, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ThreatMap } from "./ThreatMap";
import { useState } from "react";

export function DashboardContent() {
  const [showMLResults, setShowMLResults] = useState(true);
  const [riskFilter, setRiskFilter] = useState("all");
  const [violationFilter, setViolationFilter] = useState("all");
  const [walletAddress, setWalletAddress] = useState("");
  const [reportReason, setReportReason] = useState("");

  const stats = [
    { label: "Active Cases", value: "247", change: "+12%", icon: FolderOpen, color: "emerald" },
    { label: "Escalations", value: "18", change: "+3", icon: AlertTriangle, color: "red" },
    { label: "Evidence Items", value: "1,432", change: "+89", icon: Database, color: "cyan" },
    { label: "Active Users", value: "64", change: "+5", icon: Users, color: "purple" },
  ];

  const mlStats = [
    { label: "Critical", value: "1", color: "red" },
    { label: "High", value: "2", color: "orange" },
    { label: "Medium", value: "1", color: "yellow" },
    { label: "Escalated", value: "3", color: "purple" },
  ];

  const suspiciousWallets = [
    { 
      address: "0x742d35...8a2f4e", 
      riskScore: 94, 
      violationType: "Money Laundering", 
      action: "Immediate Freeze",
      details: "Multiple high-value transactions to sanctioned entities",
      analyzed: "5m ago",
      severity: "Critical"
    },
    { 
      address: "0x8f3a21...d4c9b7", 
      riskScore: 87, 
      violationType: "Fraud Detection", 
      action: "Monitor & Report",
      details: "Abnormal transaction patterns detected",
      analyzed: "12m ago",
      severity: "High"
    },
    { 
      address: "0x1a5d89...f3e2c1", 
      riskScore: 89, 
      violationType: "Ransomware Payment", 
      action: "Escalate to Authorities",
      details: "Linked to known ransomware group",
      analyzed: "18m ago",
      severity: "High"
    },
    { 
      address: "0x6c7b45...a9d8f2", 
      riskScore: 72, 
      violationType: "Tax Evasion", 
      action: "Further Investigation",
      details: "Unreported large transactions",
      analyzed: "25m ago",
      severity: "Medium"
    },
  ];

  const activeInvestigations = [
    { id: "INV-2024-047", title: "Dark Web Marketplace Bust", status: "Active", progress: 78, investigator: "Agent_047" },
    { id: "INV-2024-048", title: "Crypto Ponzi Scheme", status: "Active", progress: 92, investigator: "Agent_091" },
    { id: "INV-2024-049", title: "Identity Theft Ring", status: "Active", progress: 45, investigator: "Investigator_12" },
  ];

  const threatLocations = [
    { country: "Russia", threats: 47, lat: 55.7558, lng: 37.6173 },
    { country: "China", threats: 38, lat: 39.9042, lng: 116.4074 },
    { country: "North Korea", threats: 24, lat: 39.0392, lng: 125.7625 },
    { country: "Iran", threats: 19, lat: 35.6892, lng: 51.3890 },
  ];

  const filteredWallets = suspiciousWallets.filter(wallet => {
    const riskMatch = riskFilter === "all" || wallet.severity.toLowerCase() === riskFilter.toLowerCase();
    const violationMatch = violationFilter === "all" || wallet.violationType === violationFilter;
    return riskMatch && violationMatch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "red";
      case "High": return "orange";
      case "Medium": return "yellow";
      default: return "gray";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-500 font-mono text-sm">System Overview & Analytics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/30 border border-emerald-500/30 rounded-lg">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-mono text-sm">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg p-6 hover:border-emerald-500/40 transition-all"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                <span className={`text-xs font-mono px-2 py-1 bg-${stat.color}-950/40 border border-${stat.color}-500/30 rounded text-${stat.color}-400`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl text-gray-100 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 font-mono">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* AI/ML Analysis Section */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-purple-500/20 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/30 to-cyan-950/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-purple-400" />
              <div>
                <h2 className="text-purple-400 font-mono">AI/ML Analysis Results</h2>
                <p className="text-gray-500 text-xs font-mono">Advanced behavioral pattern detection & risk assessment</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMLResults(!showMLResults)}
              className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 font-mono text-xs"
            >
              {showMLResults ? "Hide ML Results" : "Show ML Results"}
            </Button>
          </div>

          {/* ML Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mlStats.map((stat, index) => (
              <div key={index} className={`p-3 bg-${stat.color}-950/30 border border-${stat.color}-500/30 rounded-lg`}>
                <div className={`text-2xl text-${stat.color}-400 mb-1`}>{stat.value}</div>
                <div className="text-xs text-gray-400 font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {showMLResults && (
          <div className="p-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-gray-400 text-xs font-mono mb-2 block flex items-center gap-2">
                  <Filter className="w-3 h-3" />
                  Risk Severity Filter
                </label>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-emerald-500/40 rounded-md text-gray-100 font-mono text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-gray-400 text-xs font-mono mb-2 block flex items-center gap-2">
                  <Filter className="w-3 h-3" />
                  Violation Type Filter
                </label>
                <select
                  value={violationFilter}
                  onChange={(e) => setViolationFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-emerald-500/40 rounded-md text-gray-100 font-mono text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none"
                >
                  <option value="all">All Violation Types</option>
                  <option value="Money Laundering">Money Laundering</option>
                  <option value="Fraud Detection">Fraud Detection</option>
                  <option value="Ransomware Payment">Ransomware Payment</option>
                  <option value="Tax Evasion">Tax Evasion</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRiskFilter("all");
                    setViolationFilter("all");
                  }}
                  className="border-red-500/40 text-red-400 hover:bg-red-500/10 font-mono text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Wallets Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-emerald-500/20 bg-black/40">
                    <th className="text-left p-3 text-emerald-400 font-mono text-xs">Wallet Address</th>
                    <th className="text-left p-3 text-emerald-400 font-mono text-xs">Risk Score</th>
                    <th className="text-left p-3 text-emerald-400 font-mono text-xs">Violation Type</th>
                    <th className="text-left p-3 text-emerald-400 font-mono text-xs">Recommended Action</th>
                    <th className="text-left p-3 text-emerald-400 font-mono text-xs">Analysis Details</th>
                    <th className="text-left p-3 text-emerald-400 font-mono text-xs">Analyzed</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWallets.map((wallet, index) => (
                    <tr key={index} className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition">
                      <td className="p-3 font-mono text-sm text-cyan-400">{wallet.address}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[100px] h-2 bg-black/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-${getSeverityColor(wallet.severity)}-400`}
                              style={{ width: `${wallet.riskScore}%` }}
                            ></div>
                          </div>
                          <span className={`text-${getSeverityColor(wallet.severity)}-400 font-mono text-sm`}>
                            {wallet.riskScore}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs font-mono bg-${getSeverityColor(wallet.severity)}-950/40 border border-${getSeverityColor(wallet.severity)}-500/30 rounded text-${getSeverityColor(wallet.severity)}-400`}>
                          {wallet.violationType}
                        </span>
                      </td>
                      <td className="p-3 text-gray-300 text-sm">{wallet.action}</td>
                      <td className="p-3 text-gray-500 text-sm max-w-[200px] truncate">{wallet.details}</td>
                      <td className="p-3 text-gray-600 font-mono text-xs">{wallet.analyzed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suspicious Wallets Threat Map */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-red-400" />
            <h2 className="text-emerald-400 font-mono">Suspicious Wallets Threat Map</h2>
          </div>

          <ThreatMap />
        </div>

        {/* Smart Contract Enforcement Panel */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg p-6 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-500/10">
            <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-emerald-400 font-mono">Smart Contract Enforcement</h2>
              <p className="text-gray-600 text-xs font-mono">Blockchain Security Operations</p>
            </div>
          </div>

          <form className="space-y-5">
            <div className="relative group">
              <label className="text-gray-400 text-sm font-mono mb-2 flex items-center gap-2">
                <span className="text-cyan-400">●</span> Wallet Address
              </label>
              <div className="relative">
                <Input
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f4A2f4e"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-black/60 border-emerald-500/40 text-gray-100 placeholder:text-gray-600 font-mono text-sm pr-10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
            </div>

            <div className="relative group">
              <label className="text-gray-400 text-sm font-mono mb-2 flex items-center gap-2">
                <span className="text-cyan-400">●</span> Reason for Report <span className="text-gray-600 text-xs">(Optional)</span>
              </label>
              <Textarea
                placeholder="Describe the reason for enforcement action..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={3}
                className="bg-black/60 border-emerald-500/40 text-gray-100 placeholder:text-gray-600 font-mono text-sm resize-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
            </div>

            <div className="pt-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button"
                  className="relative group/btn bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-mono text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg blur opacity-30 group-hover/btn:opacity-60 transition-opacity"></div>
                  <span className="relative flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Freeze
                  </span>
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="relative group/btn border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 font-mono text-sm transition-all"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/0 to-emerald-400/20 rounded-lg blur opacity-0 group-hover/btn:opacity-60 transition-opacity"></div>
                  <span className="relative flex items-center">
                    <Unlock className="w-4 h-4 mr-2" />
                    Unfreeze
                  </span>
                </Button>
              </div>

              <Button 
                type="button"
                variant="outline" 
                className="relative w-full group/btn border-orange-500/40 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 font-mono text-sm transition-all"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/0 to-orange-400/20 rounded-lg blur opacity-0 group-hover/btn:opacity-60 transition-opacity"></div>
                <span className="relative flex items-center justify-center">
                  <FileWarning className="w-4 h-4 mr-2" />
                  Report
                </span>
              </Button>

              <Button 
                type="button"
                className="relative w-full group/btn bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-mono text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-30 group-hover/btn:opacity-60 transition-opacity"></div>
                <span className="relative flex items-center justify-center">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Simulate Transfer + Enforce
                </span>
              </Button>
            </div>
          </form>

          <div className="mt-5 p-4 bg-gradient-to-r from-orange-950/30 to-red-950/30 border border-orange-500/30 rounded-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-orange-500/20 rounded border border-orange-500/40 mt-0.5">
                <AlertTriangle className="w-3 h-3 text-orange-400" />
              </div>
              <p className="text-orange-400 text-xs font-mono leading-relaxed">
                All enforcement actions require supervisor approval and are logged in the audit trail
              </p>
            </div>
          </div>
        </div>

        {/* Active Investigations */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-emerald-400 font-mono">Active Investigations</h2>
          </div>
          <div className="space-y-3">
            {activeInvestigations.map((investigation, index) => (
              <div
                key={index}
                className="p-4 bg-black/40 border border-emerald-500/10 rounded-lg hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-cyan-400 font-mono text-sm">{investigation.id}</span>
                      <span className="px-2 py-0.5 text-xs font-mono bg-emerald-950/40 border border-emerald-500/30 rounded text-emerald-400">
                        {investigation.status}
                      </span>
                    </div>
                    <h3 className="text-gray-100">{investigation.title}</h3>
                    <p className="text-gray-600 font-mono text-xs mt-1">Investigator: {investigation.investigator}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 font-mono">Progress</span>
                    <span className="text-emerald-400 font-mono">{investigation.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
                      style={{ width: `${investigation.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h2 className="text-emerald-400 font-mono">System Status</h2>
        </div>
        <div className="space-y-4">
          {[
            { name: "Database", status: 99.9, color: "emerald" },
            { name: "API Services", status: 100, color: "emerald" },
            { name: "Evidence Storage", status: 87.3, color: "cyan" },
            { name: "Security Protocols", status: 100, color: "emerald" },
          ].map((service, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 font-mono text-sm">{service.name}</span>
                <span className={`text-${service.color}-400 font-mono text-sm`}>{service.status}%</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-${service.color}-400 to-cyan-400 transition-all`}
                  style={{ width: `${service.status}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">All Systems Operational</span>
          </div>
          <p className="text-gray-500 text-xs font-mono">Last checked: 30 seconds ago</p>
        </div>
      </div>
    </div>
  );
}