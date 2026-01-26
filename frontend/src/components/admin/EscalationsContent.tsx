import { AlertTriangle, Lock, Unlock, Search, Eye, Download, Shield, ExternalLink, FileText, Calendar, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

export function EscalationsContent() {
  const [activeTab, setActiveTab] = useState<"search" | "frozen" | "unfrozen">("search");
  const [searchWallet, setSearchWallet] = useState("");
  const [walletResult, setWalletResult] = useState<any>(null);

  const handleCheckWallet = () => {
    if (searchWallet.trim()) {
      // Mock result - in real app, this would be an API call
      setWalletResult({
        address: searchWallet,
        explorerLink: `https://etherscan.io/address/${searchWallet}`,
        evidenceLibrary: [
          { id: "EV-001", name: "Transaction Screenshot.png", uploadedBy: "Detective Smith", uploadedAt: "1/19/2024, 3:30:00 PM" },
          { id: "EV-002", name: "Wallet Analysis Report.pdf", uploadedBy: "Agent Johnson", uploadedAt: "1/19/2024, 4:15:00 PM" },
          { id: "EV-003", name: "Communication Logs.txt", uploadedBy: "Detective Smith", uploadedAt: "1/20/2024, 9:00:00 AM" },
        ],
        riskScore: 87,
        mlTags: ["Money Laundering", "Suspicious Pattern", "High Volume", "Mixer Related"],
        dateAdded: "1/18/2024, 10:00:00 AM",
        lastUpdated: "1/20/2024, 11:30:00 AM",
      });
    }
  };

  const frozenWallets = [
    {
      address: "0x742d35Cc6634C0532925a3b8D",
      riskScore: 95,
      frozenBy: "Detective Smith",
      freezeReason: "High risk ML score (95) - Suspected money mule activity",
      frozenAt: "1/20/2024, 4:00:00 PM",
    },
    {
      address: "0x8f7A1B2C3D4E5F6A7B8C9D0E1F",
      riskScore: 88,
      frozenBy: "Agent Johnson",
      freezeReason: "Multiple suspicious transactions flagged by RL Engine",
      frozenAt: "1/19/2024, 10:30:00 AM",
    },
  ];

  const unfrozenWallets = [
    {
      address: "0x9cA8e8F8c1C0F8f8F8F8F8F8F",
      riskScore: 45,
      unfrozenBy: "Detective Brown",
      unfreezeReason: "False positive - Investigation cleared wallet",
      unfrozenAt: "1/18/2024, 2:45:00 PM",
    },
    {
      address: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m",
      riskScore: 32,
      unfrozenBy: "Inspector White",
      unfreezeReason: "Wallet owner verified identity - Low risk classification",
      unfrozenAt: "1/17/2024, 9:15:00 AM",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Escalations
          </h1>
          <p className="text-gray-500 font-mono text-sm">Wallet Freeze/Unfreeze Management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("search")}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
            activeTab === "search"
              ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400"
              : "bg-gray-900/50 border border-gray-700/30 text-gray-500 hover:text-gray-300 hover:border-gray-600/40"
          }`}
        >
          <Search className="w-4 h-4" />
          🔍 Search Wallet
        </button>
        <button
          onClick={() => setActiveTab("frozen")}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
            activeTab === "frozen"
              ? "bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/40 text-red-400"
              : "bg-gray-900/50 border border-gray-700/30 text-gray-500 hover:text-gray-300 hover:border-gray-600/40"
          }`}
        >
          <Lock className="w-4 h-4" />
          🔒 Frozen Wallets ({frozenWallets.length})
        </button>
        <button
          onClick={() => setActiveTab("unfrozen")}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
            activeTab === "unfrozen"
              ? "bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/40 text-emerald-400"
              : "bg-gray-900/50 border border-gray-700/30 text-gray-500 hover:text-gray-300 hover:border-gray-600/40"
          }`}
        >
          <Unlock className="w-4 h-4" />
          🔓 Unfrozen Wallets ({unfrozenWallets.length})
        </button>
      </div>

      {/* Search Wallet Tab */}
      {activeTab === "search" && (
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-cyan-400" />
            <h2 className="text-cyan-400 font-mono">🔍 Search / Add Wallet</h2>
          </div>
          
          <div className="flex gap-3">
            <Input
              placeholder="Enter Wallet Address (0x...)"
              value={searchWallet}
              onChange={(e) => setSearchWallet(e.target.value)}
              className="flex-1 bg-black/60 border-cyan-500/40 text-gray-100 placeholder:text-gray-600 font-mono text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
            <Button 
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-mono shadow-lg shadow-cyan-500/20"
              onClick={handleCheckWallet}
            >
              <Search className="w-4 h-4 mr-2" />
              Check Wallet
            </Button>
          </div>

          {/* Wallet Result */}
          {walletResult && (
            <div className="mt-6 space-y-4">
              {/* Wallet Address Card */}
              <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border border-cyan-500/30 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg">
                      <Shield className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-cyan-400 font-mono text-sm">Wallet Address</h3>
                      <p className="text-gray-300 font-mono">{walletResult.address}</p>
                    </div>
                  </div>
                  <a 
                    href={walletResult.explorerLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono text-sm hover:bg-emerald-600/30 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Explorer
                  </a>
                </div>

                {/* Risk Score and ML Tags */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-black/40 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-gray-400 font-mono text-xs">Risk Score</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-black/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
                          style={{ width: `${walletResult.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="text-red-400 font-mono">{walletResult.riskScore}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 border border-cyan-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-400 font-mono text-xs">Date Added</span>
                    </div>
                    <p className="text-gray-300 font-mono text-sm">{walletResult.dateAdded}</p>
                  </div>
                </div>

                {/* ML Tags */}
                <div className="mt-4 p-3 bg-black/40 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-mono text-sm">ML Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {walletResult.mlTags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-950/40 border border-purple-500/30 rounded-full text-purple-300 font-mono text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last Updated */}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 font-mono">
                  <Calendar className="w-3 h-3" />
                  Last Updated: {walletResult.lastUpdated}
                </div>
              </div>

              {/* Evidence Library */}
              <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border border-emerald-500/30 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-emerald-400 font-mono">Uploaded Evidence Library</h3>
                </div>
                
                <div className="space-y-3">
                  {walletResult.evidenceLibrary.map((evidence: any) => (
                    <div 
                      key={evidence.id} 
                      className="flex items-center justify-between p-4 bg-black/40 border border-emerald-500/20 rounded-lg hover:border-emerald-500/40 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600/20 border border-emerald-500/30 rounded">
                          <FileText className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-gray-300 font-mono text-sm">{evidence.name}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mt-1">
                            <span className="text-cyan-400">{evidence.id}</span>
                            <span>•</span>
                            <span>Uploaded by {evidence.uploadedBy}</span>
                            <span>•</span>
                            <span>{evidence.uploadedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-mono text-xs opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 font-mono text-xs opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border border-orange-500/30 rounded-lg p-5">
                <h3 className="text-orange-400 font-mono mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Wallet Actions
                </h3>
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 font-mono shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Freeze Wallet
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 font-mono transition-all"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                </div>
                <p className="text-orange-400/60 text-xs font-mono mt-3 flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Freezing a wallet requires supervisor approval and is logged in the audit trail</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Frozen Wallets Table */}
      {activeTab === "frozen" && (
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-red-500/20 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-red-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 border border-red-500/30 rounded-lg">
                  <Lock className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-red-400 font-mono">🔒 Frozen Wallets</h2>
                  <p className="text-gray-600 text-xs font-mono">{frozenWallets.length} Frozen</p>
                </div>
              </div>
            </div>
            <Input
              placeholder="Search by wallet address or investigator..."
              className="bg-black/60 border-red-500/40 text-gray-100 placeholder:text-gray-600 font-mono text-sm focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
            />
            <p className="text-gray-600 text-xs font-mono mt-2">Wallets temporarily blocked from transacting</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-red-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Wallet Address</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Risk Score</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Frozen By</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Freeze Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Frozen At</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-500/10">
                {frozenWallets.map((wallet, index) => (
                  <tr key={index} className="hover:bg-red-500/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-400" />
                        <span className="text-gray-300 font-mono text-sm">{wallet.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[80px] h-2 bg-black/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                            style={{ width: `${wallet.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-red-400 font-mono text-sm">{wallet.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 font-mono text-sm">{wallet.frozenBy}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 font-mono text-xs max-w-xs block">{wallet.freezeReason}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 font-mono text-xs">{wallet.frozenAt}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-mono text-xs"
                        >
                          <Unlock className="w-3 h-3 mr-1" />
                          Unfreeze
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-mono text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Case
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 font-mono text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download Report
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Unfrozen Wallets Table */}
      {activeTab === "unfrozen" && (
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600/20 border border-emerald-500/30 rounded-lg">
                  <Unlock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-emerald-400 font-mono">🔓 Unfrozen Wallets</h2>
                  <p className="text-gray-600 text-xs font-mono">{unfrozenWallets.length} Unfrozen</p>
                </div>
              </div>
            </div>
            <Input
              placeholder="Search by wallet address or investigator..."
              className="bg-black/60 border-emerald-500/40 text-gray-100 placeholder:text-gray-600 font-mono text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
            />
            <p className="text-gray-600 text-xs font-mono mt-2">Wallets that were previously frozen and have been unfrozen</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-emerald-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Wallet Address</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Risk Score</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Unfrozen By</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Unfreeze Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Unfrozen At</th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {unfrozenWallets.map((wallet, index) => (
                  <tr key={index} className="hover:bg-emerald-500/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-gray-300 font-mono text-sm">{wallet.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[80px] h-2 bg-black/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            style={{ width: `${wallet.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-emerald-400 font-mono text-sm">{wallet.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 font-mono text-sm">{wallet.unfrozenBy}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 font-mono text-xs max-w-xs block">{wallet.unfreezeReason}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 font-mono text-xs">{wallet.unfrozenAt}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-mono text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Case
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 font-mono text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download Report
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}