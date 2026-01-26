import { MapPin } from "lucide-react";
import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

interface ThreatLocation {
  country: string;
  threats: number;
  coordinates: [number, number];
  region: string;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function ThreatMap() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const threatLocations: ThreatLocation[] = [
    { country: "United States", threats: 156, coordinates: [-95.7129, 37.0902], region: "North America" },
    { country: "Russia", threats: 142, coordinates: [105.3188, 61.5240], region: "Europe/Asia" },
    { country: "China", threats: 128, coordinates: [104.1954, 35.8617], region: "Asia" },
    { country: "North Korea", threats: 94, coordinates: [127.5101, 40.3399], region: "Asia" },
    { country: "Iran", threats: 87, coordinates: [53.6880, 32.4279], region: "Middle East" },
    { country: "Ukraine", threats: 73, coordinates: [31.1656, 48.3794], region: "Europe" },
    { country: "Brazil", threats: 62, coordinates: [-51.9253, -14.2350], region: "South America" },
    { country: "India", threats: 58, coordinates: [78.9629, 20.5937], region: "Asia" },
    { country: "Germany", threats: 45, coordinates: [10.4515, 51.1657], region: "Europe" },
    { country: "United Kingdom", threats: 41, coordinates: [-3.4360, 55.3781], region: "Europe" },
    { country: "Nigeria", threats: 38, coordinates: [8.6753, 9.0820], region: "Africa" },
    { country: "Vietnam", threats: 34, coordinates: [108.2772, 14.0583], region: "Asia" },
    { country: "Romania", threats: 29, coordinates: [24.9668, 45.9432], region: "Europe" },
    { country: "Netherlands", threats: 27, coordinates: [5.2913, 52.1326], region: "Europe" },
    { country: "Pakistan", threats: 24, coordinates: [69.3451, 30.3753], region: "Asia" },
  ];

  const getThreatSize = (threats: number) => {
    if (threats > 100) return 8;
    if (threats > 50) return 6;
    if (threats > 30) return 5;
    return 4;
  };

  const getThreatColor = (threats: number) => {
    if (threats > 100) return { fill: "#ef4444", border: "border-red-400", text: "text-red-400", bg: "bg-red-500" };
    if (threats > 50) return { fill: "#f97316", border: "border-orange-400", text: "text-orange-400", bg: "bg-orange-500" };
    if (threats > 30) return { fill: "#eab308", border: "border-yellow-400", text: "text-yellow-400", bg: "bg-yellow-500" };
    return { fill: "#10b981", border: "border-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500" };
  };

  return (
    <div>
      {/* Real World Map Container */}
      <div className="relative h-[500px] bg-black/60 border border-emerald-500/20 rounded-lg overflow-hidden mb-6">
        {/* Ambient glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(239,68,68,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none"></div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 147,
            center: [0, 20]
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgba(16, 185, 129, 0.1)"
                    stroke="rgba(16, 185, 129, 0.3)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { 
                        fill: "rgba(16, 185, 129, 0.2)", 
                        outline: "none",
                        transition: "all 0.3s"
                      },
                      pressed: { outline: "none" }
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Threat Markers */}
            {threatLocations.map((location, index) => {
              const size = getThreatSize(location.threats);
              const colors = getThreatColor(location.threats);
              
              return (
                <Marker key={index} coordinates={location.coordinates}>
                  <g
                    onMouseEnter={() => setHoveredLocation(location.country)}
                    onMouseLeave={() => setHoveredLocation(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Outer pulse ring */}
                    <circle
                      r={size * 2}
                      fill={colors.fill}
                      fillOpacity={0.1}
                      className="animate-ping"
                    />
                    {/* Main marker */}
                    <circle
                      r={size}
                      fill={colors.fill}
                      fillOpacity={0.9}
                      className="animate-pulse"
                    />
                    {/* Center dot */}
                    <circle
                      r={size * 0.4}
                      fill="white"
                      fillOpacity={0.9}
                    />
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Hover Tooltip */}
        {hoveredLocation && (
          <div className="absolute top-4 left-4 z-50 pointer-events-none animate-in fade-in slide-in-from-left-2 duration-200">
            {(() => {
              const location = threatLocations.find(l => l.country === hoveredLocation);
              if (!location) return null;
              const colors = getThreatColor(location.threats);
              
              return (
                <div className={`bg-black/95 border ${colors.border} rounded-lg p-4 shadow-2xl backdrop-blur-xl min-w-[200px]`}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className={`w-5 h-5 ${colors.text}`} />
                    <div className={`${colors.text} font-mono`}>{location.country}</div>
                  </div>
                  <div className="text-gray-400 text-xs font-mono mb-2">{location.region}</div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-gray-500 text-sm">Threats:</span>
                    <span className={`${colors.text} font-mono text-lg`}>{location.threats}</span>
                  </div>
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                    <div className={`h-full ${colors.bg} transition-all`} style={{ width: `${(location.threats / 156) * 100}%` }}></div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-black/90 border border-emerald-500/30 rounded-lg p-3 backdrop-blur-xl z-10">
          <div className="text-xs text-gray-400 font-mono mb-2">Threat Level</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-500 font-mono">Critical (100+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-500 font-mono">High (50-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-500 font-mono">Medium (30-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-gray-500 font-mono">Low (&lt;30)</span>
            </div>
          </div>
        </div>

        {/* Controls Hint */}
        <div className="absolute top-4 right-4 bg-black/80 border border-cyan-500/30 rounded-lg px-3 py-2 backdrop-blur-xl z-10">
          <p className="text-xs text-cyan-400 font-mono">🖱️ Scroll to zoom • Drag to pan</p>
        </div>
      </div>

      {/* Threat Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {threatLocations.slice(0, 9).map((location, index) => {
          const colors = getThreatColor(location.threats);
          return (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 bg-black/40 border ${colors.border} border-opacity-20 rounded-lg hover:border-opacity-40 transition-all cursor-pointer group`}
              onMouseEnter={() => setHoveredLocation(location.country)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${colors.text} group-hover:scale-110 transition-transform`} />
                <div>
                  <div className="text-gray-300 text-sm">{location.country}</div>
                  <div className="text-gray-600 text-xs font-mono">{location.region}</div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-mono bg-black/60 border ${colors.border} rounded ${colors.text}`}>
                {location.threats}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-red-950/30 to-black/60 border border-red-500/30 rounded-lg">
          <div className="text-2xl text-red-400 mb-1">{threatLocations.filter(l => l.threats > 100).length}</div>
          <div className="text-xs text-gray-500 font-mono">Critical Regions</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-orange-950/30 to-black/60 border border-orange-500/30 rounded-lg">
          <div className="text-2xl text-orange-400 mb-1">{threatLocations.filter(l => l.threats > 50 && l.threats <= 100).length}</div>
          <div className="text-xs text-gray-500 font-mono">High Risk Regions</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-yellow-950/30 to-black/60 border border-yellow-500/30 rounded-lg">
          <div className="text-2xl text-yellow-400 mb-1">{threatLocations.filter(l => l.threats > 30 && l.threats <= 50).length}</div>
          <div className="text-xs text-gray-500 font-mono">Medium Risk</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-emerald-950/30 to-black/60 border border-emerald-500/30 rounded-lg">
          <div className="text-2xl text-emerald-400 mb-1">{threatLocations.reduce((sum, l) => sum + l.threats, 0)}</div>
          <div className="text-xs text-gray-500 font-mono">Total Threats</div>
        </div>
      </div>
    </div>
  );
}