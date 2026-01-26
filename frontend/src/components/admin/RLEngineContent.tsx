import { Cpu, Activity, Zap, TrendingUp, BarChart3, Settings } from "lucide-react";
import { Button } from "../ui/button";

export function RLEngineContent() {
  const metrics = [
    { label: "Cases Analyzed", value: "1,247", change: "+23%", color: "emerald" },
    { label: "Threat Detection Rate", value: "94.7%", change: "+2.3%", color: "cyan" },
    { label: "False Positives", value: "5.3%", change: "-1.1%", color: "purple" },
    { label: "Processing Speed", value: "847ms", change: "-12%", color: "orange" },
  ];

  const modelPerformance = [
    { name: "Phishing Detection", accuracy: 96.2, confidence: 98.1 },
    { name: "Malware Classification", accuracy: 94.8, confidence: 95.4 },
    { name: "Behavioral Analysis", accuracy: 89.3, confidence: 91.7 },
    { name: "Network Anomaly", accuracy: 92.5, confidence: 94.2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            RL Engine
          </h1>
          <p className="text-gray-500 font-mono text-sm">Reinforcement Learning Analytics & Threat Detection</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-950/30 border border-purple-500/30 rounded-lg">
            <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-purple-400 font-mono text-sm">Processing</span>
          </div>
          <Button variant="outline" className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-mono">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg p-6 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <Cpu className={`w-6 h-6 text-${metric.color}-400`} />
              <span className={`text-xs font-mono px-2 py-1 bg-${metric.color}-950/40 border border-${metric.color}-500/30 rounded text-${metric.color}-400`}>
                {metric.change}
              </span>
            </div>
            <div className="text-2xl text-gray-100 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-500 font-mono">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Performance */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg p-6">
          <h2 className="text-emerald-400 font-mono mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Model Performance
          </h2>
          <div className="space-y-4">
            {modelPerformance.map((model, index) => (
              <div key={index} className="p-4 bg-black/40 border border-emerald-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">{model.name}</span>
                  <span className="text-emerald-400 font-mono text-sm">{model.accuracy}%</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 font-mono">Accuracy</span>
                      <span className="text-cyan-400 font-mono">{model.accuracy}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{ width: `${model.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 font-mono">Confidence</span>
                      <span className="text-purple-400 font-mono">{model.confidence}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-cyan-400"
                        style={{ width: `${model.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Status */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg p-6">
            <h2 className="text-emerald-400 font-mono mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Active Training
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-950/40 to-cyan-950/40 border border-purple-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300">Advanced Threat Model v4.2</span>
                  <span className="text-purple-400 font-mono text-sm">87%</span>
                </div>
                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 transition-all"
                    style={{ width: "87%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span>Epoch 174/200</span>
                  <span>ETA: 2h 34m</span>
                </div>
              </div>

              <div className="p-4 bg-black/40 border border-emerald-500/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300 text-sm">Training Metrics</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-1">Loss</div>
                    <div className="text-emerald-400 font-mono">0.0234</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-1">Val Accuracy</div>
                    <div className="text-cyan-400 font-mono">96.8%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-1">Learning Rate</div>
                    <div className="text-purple-400 font-mono">0.001</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-1">Batch Size</div>
                    <div className="text-orange-400 font-mono">128</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-emerald-500/20 rounded-lg p-6">
            <h2 className="text-emerald-400 font-mono mb-4">Recent Detections</h2>
            <div className="space-y-2">
              {[
                { threat: "Ransomware Pattern", confidence: 98.2, time: "2m ago" },
                { threat: "Phishing Email", confidence: 94.7, time: "8m ago" },
                { threat: "Anomalous Network Traffic", confidence: 87.3, time: "15m ago" },
              ].map((detection, index) => (
                <div key={index} className="p-3 bg-black/40 border border-emerald-500/10 rounded-lg text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">{detection.threat}</span>
                    <span className="text-emerald-400 font-mono">{detection.confidence}%</span>
                  </div>
                  <span className="text-xs text-gray-600 font-mono">{detection.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
