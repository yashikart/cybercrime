import { useState, useRef, useEffect } from "react";
import { Shield, FileText, Upload, FolderOpen, Brain, Phone, LogOut, Menu, X, Activity, User, RefreshCw, Bot, AlertTriangle, UploadCloud, Check, Lock, Search, Download, Calendar, Clock, Eye, BarChart3, Clipboard, MapPin, Mail, PhoneCall, Filter, MoreVertical } from "lucide-react";
import { IncidentReportDisplay } from "./IncidentReportDisplay";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface InvestigatorDashboardProps {
  setCurrentPage: (page: "landing" | "admin-login" | "investigator-login" | "admin-dashboard" | "investigator-dashboard") => void;
}

type InvestigatorSection = "incident-report" | "evidence-upload" | "evidence-library" | "ai-analysis" | "contact-police";

export function InvestigatorDashboard({ setCurrentPage }: InvestigatorDashboardProps) {
  const [activeSection, setActiveSection] = useState<InvestigatorSection>("incident-report");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    setCurrentPage("landing");
  };

  const navigationItems = [
    { id: "incident-report" as InvestigatorSection, label: "Incident Report", icon: FileText, color: "emerald" },
    { id: "evidence-upload" as InvestigatorSection, label: "Evidence Upload", icon: Upload, color: "cyan" },
    { id: "evidence-library" as InvestigatorSection, label: "Evidence Library", icon: FolderOpen, color: "emerald" },
    { id: "ai-analysis" as InvestigatorSection, label: "AI Analysis History", icon: Brain, color: "cyan" },
    { id: "contact-police" as InvestigatorSection, label: "Contact Police", icon: Phone, color: "emerald" },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 bg-gradient-to-b from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl border-r border-emerald-500/30 flex flex-col relative overflow-hidden`}
      >
        {/* Circuit pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full">
            <pattern id="circuit-sidebar" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#10b981" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#10b981" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#22d3ee" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit-sidebar)" />
          </svg>
        </div>

        {sidebarOpen && (
          <>
            {/* Header */}
            <div className="relative p-6 border-b border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg border border-emerald-500/30">
                    <Shield className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-lg text-emerald-400 font-mono">INVESTIGATOR</h1>
                  <p className="text-xs text-gray-500 font-mono">Field Operations</p>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-emerald-400 font-mono truncate">Agent Field</p>
                  <p className="text-xs text-gray-500 font-mono">Level 2 Access</p>
                </div>
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-mono text-sm group relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400"
                        : "text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 animate-pulse"></div>
                    )}
                    <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-cyan-400"}`} />
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-r"></div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="relative p-4 border-t border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600 font-mono px-2">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  ONLINE
                </span>
                <span className="text-emerald-400">v3.7.2</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 rounded-lg transition-all font-mono text-sm group"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                LOGOUT
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl border-b border-emerald-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-emerald-400 transition hover:bg-emerald-500/10 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-xl text-emerald-400 font-mono">
                  {navigationItems.find((item) => item.id === activeSection)?.label}
                </h2>
                <p className="text-xs text-gray-500 font-mono">Field Agent Operations</p>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-xs text-emerald-400 font-mono">SYSTEM ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === "incident-report" && <IncidentReportSection />}
          {activeSection === "evidence-upload" && <EvidenceUploadSection />}
          {activeSection === "evidence-library" && <EvidenceLibrarySection />}
          {activeSection === "ai-analysis" && <AIAnalysisSection />}
          {activeSection === "contact-police" && <ContactPoliceSection />}
        </div>
      </div>
    </div>
  );
}

// Section Components
function IncidentReportSection() {
  const [walletAddress, setWalletAddress] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const maxCharacters = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:3000/api/v1/incidents/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          description: reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to analyze wallet");
      }

      const data = await response.json();
      setReportData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while analyzing the wallet");
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📄</div>
          <div>
            <p className="text-gray-300">
              Enter a suspicious wallet address and describe what happened. Our AI will analyze the wallet and provide a detailed report on potential fraud or criminal activity.
            </p>
          </div>
        </div>
      </div>

      {/* Report Form */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Wallet ID Field */}
          <div className="space-y-2">
            <Label htmlFor="walletAddress" className="text-gray-300 flex items-center gap-2 font-mono text-sm">
              <span className="text-xl">🔗</span>
              Wallet ID
            </Label>
            <Input
              id="walletAddress"
              type="text"
              placeholder="Enter wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-black/60 border-emerald-500/40 text-gray-100 placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono"
              required
            />
          </div>

          {/* Reason for Reporting */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-gray-300 flex items-center gap-2 font-mono text-sm">
              <span className="text-xl">📝</span>
              Reason for Reporting
            </Label>
            <Textarea
              id="reason"
              placeholder="Describe the suspicious activity in detail..."
              value={reason}
              onChange={(e) => {
                if (e.target.value.length <= maxCharacters) {
                  setReason(e.target.value);
                }
              }}
              className="bg-black/60 border-emerald-500/40 text-gray-100 placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono min-h-[120px] resize-none"
              required
            />
            <div className="flex justify-end">
              <span className={`text-xs font-mono ${reason.length >= maxCharacters ? 'text-red-400' : 'text-gray-500'}`}>
                {reason.length}/{maxCharacters}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:via-orange-500 hover:to-red-500 text-white shadow-lg shadow-red-500/30 transition-all duration-300 h-12 group/btn border border-red-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2 font-mono">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ANALYZING...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 font-mono">
                <span className="text-xl">🚨</span>
                Submit Report & Analyze with AI
                <span className="text-xl">🤖</span>
              </span>
            )}
          </Button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-950/40 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 font-mono">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Report Results */}
      {reportData ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-emerald-400 font-mono">Investigation Report</h2>
            <Button
              onClick={() => {
                setReportData(null);
                setWalletAddress("");
                setReason("");
              }}
              className="bg-gray-800 border border-gray-600 text-gray-300 hover:text-white font-mono text-sm"
            >
              New Report
            </Button>
          </div>
          <IncidentReportDisplay reportData={reportData} />
        </div>
      ) : (
        /* Empty State - Only show when no report data */
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6">
          <div className="p-8 bg-gradient-to-r from-emerald-950/20 to-cyan-950/20 border border-emerald-500/20 rounded-lg text-center">
            <div className="flex flex-col items-center gap-3">
              <AlertTriangle className="w-12 h-12 text-gray-600" />
              <p className="text-gray-500 font-mono">No incident reports found</p>
              <p className="text-xs text-gray-600 font-mono">Submit a report above to see analysis results</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EvidenceUploadSection() {
  const [walletId, setWalletId] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [riskLevel, setRiskLevel] = useState("medium");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      console.log("Evidence uploaded:", { walletId, description, tags, riskLevel, files });
      setIsUploading(false);
      // Reset form
      setWalletId("");
      setDescription("");
      setTags("");
      setRiskLevel("medium");
      setFiles([]);
    }, 2000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-400 border-green-500/40";
      case "medium":
        return "text-yellow-400 border-yellow-500/40";
      case "high":
        return "text-orange-400 border-orange-500/40";
      case "critical":
        return "text-red-400 border-red-500/40";
      default:
        return "text-gray-400 border-gray-500/40";
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Upload evidence linked to your assigned cases</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Add descriptions or notes for each file to provide context</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Every file is securely stored with a hash and timestamp to ensure authenticity</span>
          </li>
        </ul>
      </div>

      {/* Upload Form */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Wallet ID Field */}
          <div className="space-y-2">
            <Label htmlFor="walletId" className="text-gray-300 font-mono text-sm">
              Wallet ID
            </Label>
            <Input
              id="walletId"
              type="text"
              placeholder="Enter wallet address"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="bg-black/60 border-cyan-500/40 text-gray-100 placeholder:text-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-mono"
              required
            />
          </div>

          {/* Description / Notes */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300 font-mono text-sm">
              Description / Notes
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the evidence..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black/60 border-cyan-500/40 text-gray-100 placeholder:text-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-mono min-h-[100px] resize-none"
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-gray-300 font-mono text-sm">File Upload</Label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-cyan-500/40 hover:border-cyan-400 bg-black/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-lg border border-cyan-500/30">
                  <UploadCloud className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <p className="text-cyan-400 font-mono mb-1">📁 Drop files here or click to upload</p>
                  <p className="text-sm text-gray-500">Any file type supported (Max 50MB per file)</p>
                  <p className="text-sm text-gray-500">You can upload multiple files at once</p>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-gray-300 font-mono truncate">{file.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-300 font-mono text-sm">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              type="text"
              placeholder="fraud, suspicious, transaction"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-black/60 border-cyan-500/40 text-gray-100 placeholder:text-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-mono"
            />
          </div>

          {/* Risk Level */}
          <div className="space-y-2">
            <Label htmlFor="riskLevel" className="text-gray-300 font-mono text-sm">
              Risk Level
            </Label>
            <Select value={riskLevel} onValueChange={setRiskLevel}>
              <SelectTrigger className="bg-black/60 border-cyan-500/40 text-gray-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-cyan-500/40">
                <SelectItem value="low" className="font-mono text-green-400 focus:bg-green-950/40 cursor-pointer">
                  Low Risk
                </SelectItem>
                <SelectItem value="medium" className="font-mono text-yellow-400 focus:bg-yellow-950/40 cursor-pointer">
                  Medium Risk
                </SelectItem>
                <SelectItem value="high" className="font-mono text-orange-400 focus:bg-orange-950/40 cursor-pointer">
                  High Risk
                </SelectItem>
                <SelectItem value="critical" className="font-mono text-red-400 focus:bg-red-950/40 cursor-pointer">
                  Critical Risk
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isUploading || files.length === 0}
            className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-600 via-emerald-600 to-cyan-600 hover:from-cyan-500 hover:via-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 h-12 group/btn border border-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
            {isUploading ? (
              <span className="flex items-center justify-center gap-2 font-mono">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                UPLOADING...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 font-mono">
                Upload {files.length} File(s)
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

function EvidenceLibrarySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fileType, setFileType] = useState("all");

  // Mock evidence data
  const evidenceFiles = [
    {
      id: 1,
      filename: "transaction_screenshot_001.png",
      walletId: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      uploadDate: "2025-12-03",
      uploadTime: "14:32:18",
      fileSize: "2.4 MB",
      fileType: "image",
      riskLevel: "high",
      status: "analyzed",
      tags: ["fraud", "suspicious", "transaction"],
    },
  ];

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6">
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>View and download all uploaded evidence files</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>Track the status of all evidence in the system</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>See ML analysis results for all cases</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>Maintain a clear audit trail of all actions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>Access comprehensive evidence management</span>
          </li>
        </ul>
      </div>

      {/* View Only Badge and Search */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6 space-y-4">
        {/* View Only Badge */}
        <div className="flex items-center gap-2 w-fit px-4 py-2 bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-600/40 rounded-lg">
          <Lock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-mono">🔒 View Only</span>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 flex-col sm:flex-row">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search evidence files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/60 border-emerald-500/40 text-gray-100 placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono"
            />
          </div>

          {/* Filter */}
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger className="w-full sm:w-48 bg-black/60 border-emerald-500/40 text-gray-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-emerald-500/40">
              <SelectItem value="all" className="font-mono text-gray-300 focus:bg-emerald-950/40 cursor-pointer">
                All Types
              </SelectItem>
              <SelectItem value="image" className="font-mono text-gray-300 focus:bg-emerald-950/40 cursor-pointer">
                Images
              </SelectItem>
              <SelectItem value="document" className="font-mono text-gray-300 focus:bg-emerald-950/40 cursor-pointer">
                Documents
              </SelectItem>
              <SelectItem value="video" className="font-mono text-gray-300 focus:bg-emerald-950/40 cursor-pointer">
                Videos
              </SelectItem>
              <SelectItem value="other" className="font-mono text-gray-300 focus:bg-emerald-950/40 cursor-pointer">
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Evidence Files List */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg text-emerald-400 font-mono">All Evidence Files</h3>
            <span className="px-2 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded font-mono">
              {evidenceFiles.length} file
            </span>
          </div>
        </div>

        {/* Evidence File Card */}
        <div className="space-y-4">
          {evidenceFiles.map((file) => (
            <div
              key={file.id}
              className="p-5 bg-gradient-to-r from-emerald-950/20 to-cyan-950/20 border border-emerald-500/30 rounded-lg hover:border-emerald-500/60 transition-all group"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-gray-100 font-mono">{file.filename}</h4>
                    <span
                      className={`px-2 py-1 text-xs rounded font-mono ${
                        file.riskLevel === "high"
                          ? "bg-orange-950/40 border border-orange-500/30 text-orange-400"
                          : file.riskLevel === "medium"
                          ? "bg-yellow-950/40 border border-yellow-500/30 text-yellow-400"
                          : "bg-green-950/40 border border-green-500/30 text-green-400"
                      }`}
                    >
                      {file.riskLevel.toUpperCase()} RISK
                    </span>
                    <span className="px-2 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs rounded font-mono">
                      {file.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 font-mono mb-3">Wallet: {file.walletId}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {file.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-800/60 border border-gray-700/40 text-gray-400 text-xs rounded font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {file.uploadDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {file.uploadTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {file.fileSize}
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button className="p-3 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 rounded-lg transition-all group/btn">
                  <Download className="w-5 h-5 group-hover/btn:translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Hash and Timestamp for Authenticity */}
              <div className="pt-3 border-t border-gray-700/40">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-mono">
                  <Lock className="w-3 h-3" />
                  <span>Hash: a7f3d2c8b1e9f4d5a2c6b8e3d7f1a4c9</span>
                  <span className="text-gray-700">|</span>
                  <span>Verified: {file.uploadDate} {file.uploadTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIAnalysisSection() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [filters, setFilters] = useState({
    wallet_address: "",
    risk_level: "",
    status: "",
  });

  // Fetch reports from MongoDB
  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.wallet_address) params.append("wallet_address", filters.wallet_address);
      if (filters.risk_level) params.append("risk_level", filters.risk_level);
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(`http://localhost:3000/api/v1/incidents/reports?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const handleRefresh = () => {
    fetchReports();
  };

  const handleViewReport = async (reportId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/incidents/reports/${reportId}`);
      if (response.ok) {
        const data = await response.json();
        // Convert MongoDB format to display format
        const displayData = {
          wallet: data.wallet_address,
          risk_score: data.risk_score,
          risk_level: data.risk_level,
          detected_patterns: data.detected_patterns,
          summary: data.summary,
          graph_data: data.graph_data,
          timeline: data.timeline,
          system_conclusion: data.system_conclusion,
        };
        setSelectedReport(displayData);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/incidents/reports/${reportId}/status?status=${newStatus}`,
        { method: "PATCH" }
      );
      if (response.ok) {
        fetchReports(); // Refresh list
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "investigating":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "closed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
      case "escalated":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 0.8) return "bg-red-950/40 border-red-500/30 text-red-400";
    if (score >= 0.6) return "bg-orange-950/40 border-orange-500/30 text-orange-400";
    if (score >= 0.4) return "bg-yellow-950/40 border-yellow-500/30 text-yellow-400";
    return "bg-green-950/40 border-green-500/30 text-green-400";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // If a report is selected, show the full report
  if (selectedReport) {
    return (
      <div className="max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-cyan-400 font-mono">Incident Report Details</h2>
          <Button
            onClick={() => setSelectedReport(null)}
            className="bg-gray-800 border border-gray-600 text-gray-300 hover:text-white font-mono text-sm"
          >
            Back to List
          </Button>
        </div>
        <IncidentReportDisplay reportData={selectedReport} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>View all incident reports and analysis history</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Track risk scores, patterns, and case status</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Manage report status and add notes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Filter and search through investigation reports</span>
          </li>
        </ul>
      </div>

      {/* Filters Bar */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-mono">Filters</span>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Search wallet address..."
              value={filters.wallet_address}
              onChange={(e) => setFilters({ ...filters, wallet_address: e.target.value })}
              className="w-48 bg-black/60 border-cyan-500/40 text-gray-100 placeholder:text-gray-600 focus:border-cyan-400 font-mono text-sm"
            />
            
            <Select value={filters.risk_level} onValueChange={(value) => setFilters({ ...filters, risk_level: value })}>
              <SelectTrigger className="w-40 bg-black/60 border-cyan-500/40 text-gray-100 font-mono text-sm">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-cyan-500/40">
                <SelectItem value="" className="font-mono">All Levels</SelectItem>
                <SelectItem value="VERY HIGH" className="font-mono text-red-400">Very High</SelectItem>
                <SelectItem value="HIGH" className="font-mono text-orange-400">High</SelectItem>
                <SelectItem value="MEDIUM" className="font-mono text-yellow-400">Medium</SelectItem>
                <SelectItem value="LOW" className="font-mono text-green-400">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="w-40 bg-black/60 border-cyan-500/40 text-gray-100 font-mono text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-cyan-500/40">
                <SelectItem value="" className="font-mono">All Status</SelectItem>
                <SelectItem value="investigating" className="font-mono text-yellow-400">Investigating</SelectItem>
                <SelectItem value="resolved" className="font-mono text-green-400">Resolved</SelectItem>
                <SelectItem value="closed" className="font-mono text-gray-400">Closed</SelectItem>
                <SelectItem value="escalated" className="font-mono text-red-400">Escalated</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/40 to-emerald-950/40 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 hover:text-cyan-300 font-mono text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg text-cyan-400 font-mono">Incident Reports</h3>
          <span className="px-2 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs rounded font-mono">
            {reports.length} {reports.length === 1 ? "report" : "reports"}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-500/30">
                <th className="text-left py-3 px-4 text-sm text-cyan-400 font-mono">Wallet Address</th>
                <th className="text-left py-3 px-4 text-sm text-cyan-400 font-mono">Risk Assessment</th>
                <th className="text-left py-3 px-4 text-sm text-cyan-400 font-mono">Detected Patterns</th>
                <th className="text-left py-3 px-4 text-sm text-cyan-400 font-mono">Status</th>
                <th className="text-left py-3 px-4 text-sm text-cyan-400 font-mono">Created</th>
                <th className="text-left py-3 px-4 text-sm text-cyan-400 font-mono">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-mono text-sm">Loading reports...</p>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-lg border border-cyan-500/20">
                        <BarChart3 className="w-12 h-12 text-gray-600" />
                      </div>
                      <p className="text-gray-500 font-mono text-sm">No reports found</p>
                      <p className="text-gray-600 text-xs font-mono">Generate a report to see it here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr
                    key={report._id}
                    className="border-b border-cyan-500/10 hover:bg-cyan-950/10 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-mono text-sm text-gray-300 break-all max-w-xs">
                        {report.wallet_address}
                      </div>
                      {report.summary?.pattern_type && (
                        <div className="font-mono text-xs text-cyan-400 mt-1">
                          {report.summary.pattern_type}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded font-mono text-xs border ${getRiskBadgeColor(report.risk_score)}`}>
                          {(report.risk_score * 100).toFixed(0)}%
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                          {report.risk_level}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {report.detected_patterns?.slice(0, 2).map((pattern: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs rounded font-mono"
                          >
                            {pattern.length > 20 ? pattern.substring(0, 20) + "..." : pattern}
                          </span>
                        ))}
                        {report.detected_patterns?.length > 2 && (
                          <span className="px-2 py-1 bg-gray-950/40 border border-gray-500/30 text-gray-400 text-xs rounded font-mono">
                            +{report.detected_patterns.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Select
                        value={report.status || "investigating"}
                        onValueChange={(value) => handleStatusUpdate(report._id, value)}
                      >
                        <SelectTrigger className={`w-32 h-7 text-xs font-mono border ${getStatusBadgeColor(report.status || "investigating")}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-cyan-500/40">
                          <SelectItem value="investigating" className="font-mono text-yellow-400">Investigating</SelectItem>
                          <SelectItem value="resolved" className="font-mono text-green-400">Resolved</SelectItem>
                          <SelectItem value="closed" className="font-mono text-gray-400">Closed</SelectItem>
                          <SelectItem value="escalated" className="font-mono text-red-400">Escalated</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-400 font-mono">{formatDate(report.created_at)}</div>
                      <div className="text-xs text-gray-600 font-mono">{formatTime(report.created_at)}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        onClick={() => handleViewReport(report._id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-950/40 to-emerald-950/40 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 hover:text-cyan-300 rounded transition-all font-mono text-xs"
                      >
                        View Report
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ContactPoliceSection() {
  const [step, setStep] = useState(1);
  const [walletId, setWalletId] = useState("");
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [incidentDescription, setIncidentDescription] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  // Mock case data based on wallet ID - includes existing evidence files
  const caseData = {
    caseId: "CASE-980",
    riskScore: 28,
    investigator: "Current Investigator",
    evidenceFiles: [
      {
        id: 1,
        filename: "transaction_log_analysis.pdf",
        fileSize: "2.3 MB",
        uploadedBy: "Current Investigator",
        uploadDate: "2025-12-03",
        uploadTime: "14:32:18",
        evidenceType: "Transaction Analysis",
      },
      {
        id: 2,
        filename: "wallet_activity_export.csv",
        fileSize: "1.8 MB",
        uploadedBy: "Current Investigator",
        uploadDate: "2025-12-02",
        uploadTime: "09:15:42",
        evidenceType: "Activity Export",
      },
      {
        id: 3,
        filename: "blockchain_trace_report.pdf",
        fileSize: "3.7 MB",
        uploadedBy: "System Analyst",
        uploadDate: "2025-12-01",
        uploadTime: "16:45:30",
        evidenceType: "Blockchain Trace",
      },
      {
        id: 4,
        filename: "suspicious_pattern_screenshot.png",
        fileSize: "845 KB",
        uploadedBy: "Current Investigator",
        uploadDate: "2025-12-03",
        uploadTime: "10:20:15",
        evidenceType: "Visual Evidence",
      },
    ],
  };

  // Mock police stations - multiple options
  const policeStations = [
    {
      id: 1,
      name: "Faizabad Range - Uttar Pradesh",
      zone: "Faizabad Range",
      designation: "DIG",
      mobile: "94544002",
      email: "digrfzd@n",
      telephone: "05278-224, 05278-224",
      location: "Faizabad, Uttar Pradesh",
      specialization: "General Law Enforcement",
    },
    {
      id: 2,
      name: "Cyber Crime Cell - Mumbai",
      zone: "Mumbai Metropolitan",
      designation: "SP Cyber Crime",
      mobile: "9876543210",
      email: "cybermumbai@police.gov.in",
      telephone: "022-2263-5678",
      location: "Mumbai, Maharashtra",
      specialization: "Cyber Crime & Financial Fraud",
    },
    {
      id: 3,
      name: "Economic Offences Wing - Delhi",
      zone: "Delhi NCR",
      designation: "ACP Economic Offences",
      mobile: "9988776655",
      email: "eow.delhi@police.gov.in",
      telephone: "011-2334-5566",
      location: "New Delhi, Delhi",
      specialization: "Economic Crimes & Crypto Fraud",
    },
  ];

  const handleSubmitWallet = () => {
    if (walletId.trim()) {
      setStep(2);
    }
  };

  const handleSelectStation = (station: any) => {
    setSelectedStation(station);
  };

  const handleContinueToReport = () => {
    if (selectedStation) {
      setStep(4);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Step Progress Indicator */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Enter Wallet ID" },
            { num: 2, label: "Evidence Auto-Attach" },
            { num: 3, label: "Police Station" },
          ].map((item, index) => (
            <div key={item.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono border-2 transition-all ${
                    step >= item.num
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-gray-800/60 border-gray-600 text-gray-500"
                  }`}
                >
                  {item.num}
                </div>
                <span
                  className={`mt-2 text-xs font-mono ${
                    step >= item.num ? "text-emerald-400" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`h-0.5 flex-1 -mt-6 transition-all ${
                    step > item.num ? "bg-emerald-500" : "bg-gray-700"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Enter Wallet ID */}
      {step === 1 && (
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6">
          <h3 className="text-lg text-emerald-400 font-mono mb-4">Step 1: Enter Wallet ID</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="walletId" className="text-gray-300 font-mono mb-2 block">
                Wallet ID *
              </Label>
              <Input
                id="walletId"
                type="text"
                placeholder="Enter wallet address..."
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="bg-black/60 border-emerald-500/40 text-gray-100 placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono"
              />
            </div>
            <Button
              onClick={handleSubmitWallet}
              disabled={!walletId.trim()}
              className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 h-12 group/btn border border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2 font-mono">
                Submit
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Evidence Files from Wallet Address */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6">
            <h3 className="text-lg text-emerald-400 font-mono mb-4">Step 2: Evidence Files from Wallet Address</h3>
            
            {/* Wallet Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-mono">Wallet Address:</span>
              </div>
              <p className="text-gray-100 font-mono text-sm break-all">{walletId}</p>
            </div>

            {/* Case Details */}
            <div className="mb-6">
              <h4 className="text-md text-cyan-400 font-mono mb-3">Case Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-mono text-sm">Case ID:</span>
                  <span className="text-emerald-400 font-mono text-sm">{caseData.caseId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-mono text-sm">Risk Score:</span>
                  <span className="px-2 py-1 bg-green-950/40 border border-green-500/30 text-green-400 text-xs rounded font-mono">
                    {caseData.riskScore}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-mono text-sm">Investigator:</span>
                  <span className="text-gray-100 font-mono text-sm">{caseData.investigator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-mono text-sm">Evidence Count:</span>
                  <span className="text-gray-100 font-mono text-sm">{caseData.evidenceFiles.length} files</span>
                </div>
              </div>
            </div>

            {/* Evidence Files Present in Wallet Address */}
            <div>
              <h4 className="text-md text-cyan-400 font-mono mb-3 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Evidence Files Present in Wallet Address
                <span className="px-2 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs rounded font-mono">
                  {caseData.evidenceFiles.length} files
                </span>
              </h4>
              <div className="space-y-3">
                {caseData.evidenceFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 bg-gradient-to-r from-emerald-950/20 to-cyan-950/20 border border-emerald-500/30 rounded-lg hover:border-emerald-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="w-5 h-5 text-emerald-400 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-gray-100 font-mono text-sm">📄 {file.filename}</p>
                            <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded font-mono">
                              {file.evidenceType}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs font-mono mb-2">
                            {file.fileSize} • Uploaded by {file.uploadedBy}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-600 font-mono">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {file.uploadDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {file.uploadTime}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 rounded transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 hover:text-cyan-300 rounded transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs font-mono mt-3 italic">
                ✓ All evidence files from this wallet address will be automatically attached to the police report.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setStep(3)}
            className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 h-12 group/btn border border-emerald-400/30"
          >
            <span className="flex items-center justify-center gap-2 font-mono">
              Continue to Police Station Selection
            </span>
          </Button>
        </div>
      )}

      {/* Step 3: Police Station Selection */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6">
            <h3 className="text-lg text-emerald-400 font-mono mb-4">Step 3: Police Station Selection</h3>
            <div className="space-y-4">
              <Label className="text-gray-300 font-mono mb-3 block">Select Police Station</Label>
              {policeStations.map((station) => (
                <div
                  key={station.id}
                  onClick={() => handleSelectStation(station)}
                  className={`p-5 bg-gradient-to-r from-emerald-950/20 to-cyan-950/20 border rounded-lg transition-all cursor-pointer ${
                    selectedStation?.id === station.id
                      ? "border-emerald-500/80 shadow-lg shadow-emerald-500/20"
                      : "border-emerald-500/30 hover:border-emerald-500/60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-gray-100 font-mono">{station.name}</h4>
                    {selectedStation?.id === station.id && (
                      <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded font-mono flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Selected Station
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 font-mono text-xs">Zone/Range/District:</p>
                      <p className="text-gray-300 font-mono">{station.zone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-mono text-xs">Designation:</p>
                      <p className="text-gray-300 font-mono">{station.designation}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-mono text-xs">Mobile No.:</p>
                      <p className="text-gray-300 font-mono">{station.mobile}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-mono text-xs">E-Mail:</p>
                      <p className="text-gray-300 font-mono">{station.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-mono text-xs">Telephone:</p>
                      <p className="text-gray-300 font-mono">{station.telephone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-mono text-xs">Location:</p>
                      <p className="text-gray-300 font-mono">{station.location}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 font-mono text-xs">Specialization:</p>
                      <p className="text-gray-300 font-mono">{station.specialization}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleContinueToReport}
            disabled={!selectedStation}
            className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 h-12 group/btn border border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2 font-mono">
              Continue to Incident Report
            </span>
          </Button>
        </div>
      )}

      {/* Step 4: Description of Incident */}
      {step === 4 && selectedStation && (
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-6">
          <h3 className="text-lg text-emerald-400 font-mono mb-4">Step 4: Description of Incident</h3>
          
          {/* Selected Station Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-mono text-sm">Reporting to:</span>
            </div>
            <p className="text-gray-100 font-mono">{selectedStation.name}</p>
            <p className="text-gray-500 font-mono text-xs mt-1">{selectedStation.location}</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-lg">
              <p className="text-gray-500 text-xs font-mono mb-1">Wallet ID</p>
              <p className="text-gray-100 font-mono text-sm truncate" title={walletId}>{walletId}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-lg">
              <p className="text-gray-500 text-xs font-mono mb-1">Case ID</p>
              <p className="text-emerald-400 font-mono text-sm">{caseData.caseId}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-lg">
              <p className="text-gray-500 text-xs font-mono mb-1">Risk Score</p>
              <p className="text-green-400 font-mono text-sm">{caseData.riskScore}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-lg">
              <p className="text-gray-500 text-xs font-mono mb-1">Evidence Count</p>
              <p className="text-gray-100 font-mono text-sm">{caseData.evidenceFiles.length} files</p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <Label htmlFor="incident" className="text-gray-300 font-mono mb-2 block">
                Description of Incident *
              </Label>
              <Textarea
                id="incident"
                placeholder="Provide a detailed summary of the incident, suspicious activities, and any relevant information for law enforcement..."
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                rows={6}
                className="bg-black/60 border-emerald-500/40 text-gray-100 placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono resize-none"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-gray-300 font-mono mb-2 block">
                Internal Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any internal notes or additional context..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={3}
                className="bg-black/60 border-emerald-500/40 text-gray-100 placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono resize-none"
              />
            </div>

            <Button
              type="button"
              disabled={!incidentDescription.trim()}
              className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 h-12 group/btn border border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2 font-mono">
                <PhoneCall className="w-5 h-5" />
                Submit Report to Police
              </span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}