import { Database, Search, Download, Upload, FileText, Image, Video, File, Folder, ChevronRight, ChevronDown, Eye, Archive } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface FileItem {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "zip" | "file";
  size: string;
  uploaded: string;
  uploadedBy: string;
}

interface FolderItem {
  walletAddress: string;
  dateCreated: string;
  fileCount: number;
  totalSize: string;
  files: FileItem[];
}

export function EvidenceLibraryContent() {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const folders: FolderItem[] = [
    {
      walletAddress: "0x742d35Cc6634C0532925a3b8D",
      dateCreated: "2024-11-18",
      fileCount: 8,
      totalSize: "156.7 MB",
      files: [
        { id: "EV-001", name: "Transaction Screenshot.png", type: "image", size: "2.4 MB", uploaded: "1/19/2024, 3:30:00 PM", uploadedBy: "Detective Smith" },
        { id: "EV-002", name: "Wallet Analysis Report.pdf", type: "document", size: "5.2 MB", uploaded: "1/19/2024, 4:15:00 PM", uploadedBy: "Agent Johnson" },
        { id: "EV-003", name: "Communication Logs.txt", type: "document", size: "1.8 MB", uploaded: "1/20/2024, 9:00:00 AM", uploadedBy: "Detective Smith" },
        { id: "EV-004", name: "Blockchain Evidence.zip", type: "zip", size: "45.3 MB", uploaded: "1/20/2024, 10:15:00 AM", uploadedBy: "Tech Analyst" },
        { id: "EV-005", name: "Surveillance Footage.mp4", type: "video", size: "98.5 MB", uploaded: "1/20/2024, 11:00:00 AM", uploadedBy: "Field Agent" },
        { id: "EV-006", name: "Network Logs.txt", type: "document", size: "3.5 MB", uploaded: "1/20/2024, 2:30:00 PM", uploadedBy: "Security Analyst" },
      ],
    },
    {
      walletAddress: "0x8f7A1B2C3D4E5F6A7B8C9D0E1F",
      dateCreated: "2024-11-17",
      fileCount: 5,
      totalSize: "89.2 MB",
      files: [
        { id: "EV-007", name: "Phishing Email.pdf", type: "document", size: "1.2 MB", uploaded: "1/17/2024, 10:00:00 AM", uploadedBy: "Investigator Lee" },
        { id: "EV-008", name: "Transaction History.zip", type: "zip", size: "34.6 MB", uploaded: "1/17/2024, 11:30:00 AM", uploadedBy: "Data Analyst" },
        { id: "EV-009", name: "Suspect Photo.jpg", type: "image", size: "4.8 MB", uploaded: "1/17/2024, 2:00:00 PM", uploadedBy: "Detective Brown" },
        { id: "EV-010", name: "Audio Recording.mp3", type: "file", size: "12.4 MB", uploaded: "1/17/2024, 3:15:00 PM", uploadedBy: "Field Agent" },
        { id: "EV-011", name: "Complete Case Files.zip", type: "zip", size: "36.2 MB", uploaded: "1/17/2024, 4:45:00 PM", uploadedBy: "Case Manager" },
      ],
    },
    {
      walletAddress: "0x9cA8e8F8c1C0F8f8F8F8F8F8F",
      dateCreated: "2024-11-15",
      fileCount: 6,
      totalSize: "124.5 MB",
      files: [
        { id: "EV-012", name: "Financial Records.pdf", type: "document", size: "8.7 MB", uploaded: "1/15/2024, 9:00:00 AM", uploadedBy: "Forensic Accountant" },
        { id: "EV-013", name: "Bank Statements.zip", type: "zip", size: "67.8 MB", uploaded: "1/15/2024, 10:30:00 AM", uploadedBy: "Financial Investigator" },
        { id: "EV-014", name: "Chat Logs.txt", type: "document", size: "2.3 MB", uploaded: "1/15/2024, 1:00:00 PM", uploadedBy: "Digital Forensics" },
        { id: "EV-015", name: "Evidence Photos.zip", type: "zip", size: "45.7 MB", uploaded: "1/15/2024, 2:30:00 PM", uploadedBy: "Crime Scene Tech" },
      ],
    },
  ];

  const toggleFolder = (walletAddress: string) => {
    setExpandedFolders((prev) =>
      prev.includes(walletAddress)
        ? prev.filter((addr) => addr !== walletAddress)
        : [...prev, walletAddress]
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return FileText;
      case "image": return Image;
      case "video": return Video;
      case "zip": return Archive;
      default: return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document": return "cyan";
      case "image": return "purple";
      case "video": return "orange";
      case "zip": return "emerald";
      default: return "gray";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Evidence Library
          </h1>
          <p className="text-gray-500 font-mono text-sm">Secure Digital Evidence Repository - Organized by Wallet Address</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 font-mono">
          <Upload className="w-4 h-4 mr-2" />
          Upload Evidence
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search by wallet address, file name, or evidence ID..."
          className="pl-10 bg-black/60 border-emerald-500/40 text-gray-100 font-mono focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Folders", value: folders.length.toString(), icon: Folder },
          { label: "Total Files", value: folders.reduce((acc, f) => acc + f.fileCount, 0).toString(), icon: FileText },
          { label: "ZIP Archives", value: folders.reduce((acc, f) => acc + f.files.filter(file => file.type === "zip").length, 0).toString(), icon: Archive },
          { label: "Total Size", value: "370.4 MB", icon: Database },
        ].map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg p-4 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600/20 border border-emerald-500/30 rounded-lg">
                <stat.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl text-gray-100">{stat.value}</div>
                <div className="text-xs text-gray-500 font-mono">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Folders List */}
      <div className="space-y-3">
        {folders.map((folder) => {
          const isExpanded = expandedFolders.includes(folder.walletAddress);
          return (
            <div
              key={folder.walletAddress}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg overflow-hidden hover:border-emerald-500/40 transition-all"
            >
              {/* Folder Header */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer group"
                onClick={() => toggleFolder(folder.walletAddress)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-emerald-400 transition-transform" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    )}
                    <div className="p-3 bg-emerald-600/20 border border-emerald-500/30 rounded-lg">
                      <Folder className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-100 font-mono mb-1">{folder.walletAddress}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                      <span className="text-cyan-400">{folder.fileCount} files</span>
                      <span>•</span>
                      <span>{folder.totalSize}</span>
                      <span>•</span>
                      <span>Created: {folder.dateCreated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 font-mono text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Archive className="w-3 h-3 mr-1" />
                    Download All
                  </Button>
                </div>
              </div>

              {/* Files List */}
              {isExpanded && (
                <div className="border-t border-emerald-500/10 bg-black/20">
                  <div className="p-4 space-y-2">
                    {folder.files.map((file) => {
                      const IconComponent = getFileIcon(file.type);
                      const color = getTypeColor(file.type);
                      return (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-4 bg-black/40 border border-emerald-500/10 rounded-lg hover:border-emerald-500/30 hover:bg-black/60 transition-all group/file"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-2 bg-${color}-950/40 border border-${color}-500/30 rounded`}>
                              <IconComponent className={`w-4 h-4 text-${color}-400`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-300 font-mono text-sm truncate">{file.name}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mt-1">
                                <span className="text-cyan-400">{file.id}</span>
                                <span>•</span>
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>{file.uploadedBy}</span>
                                <span>•</span>
                                <span>{file.uploaded}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover/file:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-mono text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 font-mono text-xs"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
