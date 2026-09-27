import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../services/api';
import { StateMetrics } from '../../types';
import { 
  Map, 
  Layers, 
  Filter, 
  Globe, 
  Info, 
  Sliders, 
  Building2, 
  AlertTriangle, 
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import L from 'leaflet';

interface GISExplorerProps {
  onNavigate: (view: string) => void;
}

export const GISExplorer: React.FC<GISExplorerProps> = ({ onNavigate }) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<string>('cadastral_digitization');
  const [selectedState, setSelectedState] = useState<StateMetrics | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    fetchGISData();
  }, []);

  const fetchGISData = async () => {
    setLoading(true);
    try {
      const data = await api.getStatesGeoJSON();
      setGeoJsonData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!geoJsonData || loading) return;

    // Initialize Leaflet Map
    const container = document.getElementById('leaflet-map-container');
    if (!container) return;

    if (!mapRef.current) {
      const map = L.map('leaflet-map-container', {
        center: [20.5937, 78.9629], // Centered on India
        zoom: 5,
        zoomControl: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear previous GeoJSON layer if any
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    // Color mapper based on active layer metric
    const getColor = (featureProps: any) => {
      if (activeLayer === 'cadastral_digitization') {
        const val = featureProps.cadastral_map_digitization_pct;
        return val >= 92 ? '#10B981' : val >= 88 ? '#F59E0B' : '#EF4444';
      } else if (activeLayer === 'climate_vulnerability') {
        const val = featureProps.climate_vulnerability_index;
        return val >= 0.75 ? '#EF4444' : val >= 0.65 ? '#F59E0B' : '#10B981';
      } else if (activeLayer === 'dispute_hotspots') {
        const val = featureProps.land_disputes_pending;
        return val >= 40000 ? '#EF4444' : val >= 20000 ? '#F59E0B' : '#10B981';
      } else {
        const val = featureProps.forest_area_pct;
        return val >= 25 ? '#10B981' : val >= 15 ? '#0284C7' : '#F59E0B';
      }
    };

    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: (feature) => ({
        fillColor: getColor(feature?.properties),
        weight: 2,
        opacity: 0.9,
        color: '#38BDF8',
        fillOpacity: 0.55
      }),
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ fillOpacity: 0.8, weight: 3 });
          },
          mouseout: (e) => {
            const l = e.target;
            l.setStyle({ fillOpacity: 0.55, weight: 2 });
          },
          click: () => {
            setSelectedState(props);
          }
        });
        layer.bindTooltip(`<strong>${props.state_name}</strong><br/>Cadastral Digitization: ${props.cadastral_map_digitization_pct}%`, {
          direction: 'auto',
          sticky: true
        });
      }
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;
  }, [geoJsonData, activeLayer, loading]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/20 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Requirement 10 & 4
            </span>
            <span className="text-xs text-slate-400">ISRO / DoLR Spatial Analytics</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 heading-font">
            Interactive GIS Explorer & Land Governance Map
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Spatial visualization of state cadastral vectorization, climate vulnerability indices, land use patterns, and litigation hotspots across India.
          </p>
        </div>

        {/* Layer Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700 text-xs">
          <Layers className="w-4 h-4 text-sky-400 ml-2" />
          <button
            onClick={() => setActiveLayer('cadastral_digitization')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeLayer === 'cadastral_digitization' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cadastral Vectorization
          </button>
          <button
            onClick={() => setActiveLayer('climate_vulnerability')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeLayer === 'climate_vulnerability' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Climate Risk Index
          </button>
          <button
            onClick={() => setActiveLayer('dispute_hotspots')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeLayer === 'dispute_hotspots' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dispute Hotspots
          </button>
        </div>
      </div>

      {/* Main Map & Metadata Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-2xl border border-slate-800 relative h-[520px]">
          {loading && (
            <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center text-slate-300 text-xs">
              Loading GeoJSON Spatial Layers...
            </div>
          )}
          <div id="leaflet-map-container" className="w-full h-full rounded-xl overflow-hidden z-10"></div>

          {/* Map Legend Floating Box */}
          <div className="absolute bottom-6 left-6 z-20 glass-panel p-3 rounded-xl border border-slate-700 text-[11px] space-y-1.5 shadow-xl">
            <span className="font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-1">
              Legend: {activeLayer.replace('_', ' ')}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300">Optimal / High Progress (&gt;90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-300">Moderate / Watch Zone (85-90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-slate-300">High Risk / Lagging Zone (&lt;85%)</span>
            </div>
          </div>
        </div>

        {/* Selected State Details Sidebar */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          {selectedState ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    STATE CODE: {selectedState.state_code}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 heading-font mt-1">
                    {selectedState.state_name}
                  </h3>
                </div>
                <span className="text-xs text-slate-400">{selectedState.total_area_sq_km.toLocaleString()} sq km</span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">RoR Computerization</span>
                  <span className="text-base font-extrabold text-emerald-400">{selectedState.dilrmp_record_digitization_pct}%</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Cadastral Vectorization</span>
                  <span className="text-base font-extrabold text-sky-400">{selectedState.cadastral_map_digitization_pct}%</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Pending Disputes</span>
                  <span className="text-base font-extrabold text-amber-400">{selectedState.land_disputes_pending.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">SVAMITVA Cards</span>
                  <span className="text-base font-extrabold text-indigo-400">{(selectedState.svamitva_cards_issued / 1000).toFixed(0)}k</span>
                </div>
              </div>

              {/* Land Use Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Land Cover Distribution</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Agriculture Area</span>
                    <span className="font-semibold text-slate-200">{selectedState.agriculture_area_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full" style={{ width: `${selectedState.agriculture_area_pct}%` }}></div>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Forest Cover</span>
                    <span className="font-semibold text-slate-200">{selectedState.forest_area_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${selectedState.forest_area_pct}%` }}></div>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Urban Built-up</span>
                    <span className="font-semibold text-slate-200">{selectedState.urban_area_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${selectedState.urban_area_pct}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Key Issues */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Priority Governance Challenges</h4>
                <ul className="text-xs space-y-1">
                  {selectedState.major_issues?.map((issue, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => onNavigate('simulation')}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors shadow-md mt-2"
              >
                Run Policy Simulator for {selectedState.state_name}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-6 space-y-3">
              <Info className="w-8 h-8 text-sky-400 animate-bounce" />
              <h4 className="text-sm font-bold text-slate-200">Select a State Polygon</h4>
              <p className="text-xs">
                Click any state region on the GIS map to inspect detailed spatial metrics, land record vectorization stats, and climate vulnerability indicators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
