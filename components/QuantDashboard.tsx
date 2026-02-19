
import React, { useState, useEffect, useMemo } from 'react';
import { MarketUniverse, QuantModule, QuantReport } from '../types';
import { generateQuantAnalysis, fetchMarketGrounding } from '../services/geminiService';
import { 
  Activity, 
  Binary, 
  BarChart3, 
  CircleDot, 
  Waves, 
  Layers, 
  Loader2, 
  ChevronRight, 
  Terminal, 
  Database,
  Cpu,
  BookOpen,
  Settings,
  RefreshCcw,
  GitBranch
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, Area, 
  LineChart, Line, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  BarChart, Bar,
  ScatterChart, Scatter,
  ZAxis
} from 'recharts';

interface Props {
  universe: MarketUniverse;
  onReset: () => void;
}

const QuantDashboard: React.FC<Props> = ({ universe, onReset }) => {
  const [activeModule, setActiveModule] = useState<QuantModule>(QuantModule.INTENSITY);
  const [report, setReport] = useState<QuantReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [grounding, setGrounding] = useState<any>(null);

  useEffect(() => {
    loadModuleData();
  }, [activeModule]);

  const loadModuleData = async () => {
    setLoading(true);
    try {
      const moduleName = activeModule.toString();
      const [res, groundRes] = await Promise.all([
        generateQuantAnalysis(moduleName, `Market: ${universe.symbol}, Freq: ${universe.frequency}`),
        fetchMarketGrounding(`${moduleName} quant model latest research 2024`)
      ]);
      setReport(res);
      setGrounding(groundRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generators for visualizations
  const intensityData = useMemo(() => Array.from({length: 40}, (_, i) => ({
    time: i, 
    pnl: 100 + Math.sin(i/5)*10 + (Math.random()-0.5)*15 + i*2,
    intensity: Math.abs(Math.cos(i/3)*20 + Math.random()*10)
  })), []);

  const rmtData = useMemo(() => Array.from({length: 50}, (_, i) => ({
    idx: i,
    empirical: Math.exp(-i/5) * 10,
    marchenkoPastur: i < 20 ? 8 : 0.5
  })), []);

  const volData = useMemo(() => Array.from({length: 30}, (_, i) => ({
    day: i,
    realized: 15 + Math.random()*10,
    forecast: 15 + Math.random()*8
  })), []);

  const impactData = useMemo(() => Array.from({length: 20}, (_, i) => ({
    x: i,
    y: 100 - (i * i * 0.2),
    linear: 100 - i * 4
  })), []);

  const labelingData = useMemo(() => Array.from({length: 60}, (_, i) => ({
    x: i,
    y: (Math.random()-0.5)*2,
    type: Math.random() > 0.7 ? 'hit' : Math.random() > 0.4 ? 'neutral' : 'miss'
  })), []);

  const hawkesMatrix = useMemo(() => [
    { name: 'Asset A', a: 0.8, b: 0.2, c: 0.1 },
    { name: 'Asset B', a: 0.3, b: 0.7, c: 0.4 },
    { name: 'Asset C', a: 0.1, b: 0.5, c: 0.9 },
  ], []);

  const renderModuleViz = () => {
    switch(activeModule) {
      case QuantModule.INTENSITY:
        return (
          <div className="space-y-6">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">P&L Backtest: Inventory-Neutral MM</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <AreaChart data={intensityData}>
                  <defs>
                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #222'}} />
                  <Area type="monotone" dataKey="pnl" stroke="#10b981" fill="url(#pnlGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case QuantModule.PORTFOLIO:
        return (
          <div className="space-y-6">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Spectral Density: Empirical vs Marchenko-Pastur</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={rmtData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="idx" hide />
                  <YAxis stroke="#444" fontSize={10} />
                  <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #222'}} />
                  <Bar dataKey="empirical" fill="#3b82f6" opacity={0.8} />
                  <Line type="monotone" dataKey="marchenkoPastur" stroke="#ef4444" dot={false} strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case QuantModule.VOLATILITY:
        return (
          <div className="space-y-6">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">HAR-RV Forecast Calibration</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <LineChart data={volData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="day" hide />
                  <YAxis stroke="#444" fontSize={10} />
                  <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #222'}} />
                  <Line type="step" dataKey="realized" stroke="#10b981" strokeWidth={2} dot={false} name="Realized Vol" />
                  <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="HAR-RV" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case QuantModule.EXECUTION:
        return (
          <div className="space-y-6">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Price Impact Decay: Almgren-Chriss</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <LineChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="x" hide />
                  <YAxis stroke="#444" fontSize={10} />
                  <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #222'}} />
                  <Line type="basis" dataKey="y" stroke="#8b5cf6" strokeWidth={3} dot={false} name="Quadratic Impact" />
                  <Line type="monotone" dataKey="linear" stroke="#444" strokeWidth={1} dot={false} name="Linear Benchmark" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case QuantModule.LABELING:
        return (
          <div className="space-y-6">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Triple-Barrier Meta-Labeling</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="x" name="Sample" stroke="#444" hide />
                  <YAxis dataKey="y" name="Return" stroke="#444" fontSize={10} />
                  <ZAxis range={[50, 200]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Barrier Hits" data={labelingData} fill="#10b981" shape="circle" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-600 px-2">
              <span>Upper Barrier: +1.5%</span>
              <span>Lower Barrier: -1.0%</span>
              <span>Vertical: 24h</span>
            </div>
          </div>
        );
      case QuantModule.HAWKES:
        return (
          <div className="space-y-6">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Cross-Asset Branching Ratio Heatmap</h3>
            <div className="grid grid-cols-3 gap-2">
              {hawkesMatrix.map((row, i) => (
                <React.Fragment key={i}>
                  <div className="h-16 flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/10" style={{opacity: row.a}}>{row.a}</div>
                  <div className="h-16 flex items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold border border-blue-500/10" style={{opacity: row.b}}>{row.b}</div>
                  <div className="h-16 flex items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-bold border border-purple-500/10" style={{opacity: row.c}}>{row.c}</div>
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-center items-center space-x-4 pt-4 border-t border-white/5">
              <div className="flex items-center space-x-2 text-[10px] font-mono">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Self-Exciting</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Cross-Infecting</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505]">
      {/* Sidebar Navigation */}
      <div className="w-16 md:w-64 border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-xl">
        <div className="p-6">
          <div 
            onClick={onReset}
            className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center font-outfit font-black text-xl mb-12 cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            A
          </div>
          
          <nav className="space-y-1.5">
            {[
              { id: QuantModule.INTENSITY, label: 'Order Intensity', icon: <Activity className="w-4 h-4" /> },
              { id: QuantModule.HAWKES, label: 'Hawkes Alpha', icon: <GitBranch className="w-4 h-4" /> },
              { id: QuantModule.EXECUTION, label: 'Execution Lab', icon: <Waves className="w-4 h-4" /> },
              { id: QuantModule.PORTFOLIO, label: 'RMT Portfolio', icon: <Layers className="w-4 h-4" /> },
              { id: QuantModule.VOLATILITY, label: 'Vol Predictor', icon: <BarChart3 className="w-4 h-4" /> },
              { id: QuantModule.LABELING, label: 'Meta-Labeling', icon: <CircleDot className="w-4 h-4" /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeModule === item.id 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="hidden md:block text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-zinc-500 hover:text-white transition-colors group">
            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest">Global Config</span>
          </button>
        </div>
      </div>

      {/* Main Research Terminal */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-600 mb-2 uppercase tracking-[0.2em]">
                <Database className="w-3 h-3" />
                <span>Active Universe: {universe.symbol} // {universe.frequency}</span>
              </div>
              <h1 className="text-4xl font-outfit font-black tracking-tight flex items-center">
                {activeModule.toString().replace('_', ' ')}
                <div className="ml-4 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-500 font-mono animate-pulse">
                  CALIBRATED
                </div>
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={loadModuleData}
                disabled={loading}
                className="p-2.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-zinc-400"
              >
                <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="bg-emerald-500 text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Export Signal
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Workspace */}
            <div className="lg:col-span-2 space-y-6">
              <section className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Terminal className="w-4 h-4 text-zinc-700" />
                </div>
                {renderModuleViz()}
              </section>

              {/* Research Narrative */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-4">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center">
                    <Cpu className="w-3 h-3 mr-2 text-blue-500" />
                    Model Diagnostics
                  </h3>
                  {loading ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-white/5 rounded w-3/4"></div>
                      <div className="h-4 bg-white/5 rounded w-1/2"></div>
                      <div className="h-4 bg-white/5 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400 font-mono leading-relaxed italic">
                      {report?.diagnostics}
                    </p>
                  )}
                </div>
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-4">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center">
                    <BookOpen className="w-3 h-3 mr-2 text-emerald-500" />
                    Mathematical Foundations
                  </h3>
                  {loading ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-white/5 rounded w-full"></div>
                      <div className="h-4 bg-white/5 rounded w-2/3"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                      {report?.mathNotes}
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Right Intelligence Panel */}
            <div className="space-y-6">
              <section className="glass p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.02] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">MLE Estimation Report</h3>
                  <div className="text-[10px] text-emerald-500 font-mono px-2 py-0.5 bg-emerald-500/10 rounded">L-BFGS-B</div>
                </div>
                <div className="font-mono text-sm text-zinc-300 leading-relaxed min-h-[150px]">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-32 space-y-3">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                      <span className="text-[10px] text-zinc-600 animate-pulse">CALIBRATING PARAMETERS...</span>
                    </div>
                  ) : report?.mleResults}
                </div>
                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                    <div className="text-[8px] text-zinc-600 uppercase font-bold mb-1">Convergence</div>
                    <div className="text-md font-mono text-emerald-500 font-bold">SUCCESS</div>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                    <div className="text-[8px] text-zinc-600 uppercase font-bold mb-1">Log-Likelihood</div>
                    <div className="text-md font-mono text-zinc-300 font-bold">-428.14</div>
                  </div>
                </div>
              </section>

              <section className="glass p-8 rounded-3xl border border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                  Real-World Grounding
                  <RefreshCcw className="w-3 h-3 text-zinc-700" />
                </h3>
                <div className="space-y-3">
                  {grounding?.sources.slice(0, 3).map((source: any, i: number) => (
                    <a 
                      key={i} 
                      href={source.url} 
                      target="_blank" 
                      className="group flex items-start space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                    >
                      <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center shrink-0 group-hover:bg-zinc-700 transition-colors">
                        <ChevronRight className="w-3 h-3 text-zinc-500" />
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-200 line-clamp-2 leading-tight">
                        {source.title}
                      </span>
                    </a>
                  ))}
                  {loading && <div className="h-20 bg-white/5 rounded-xl animate-pulse"></div>}
                </div>
              </section>

              <section className="glass p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-900 to-black">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Strategy Outlook</h3>
                <div className="text-xs text-zinc-400 font-mono leading-relaxed">
                  {loading ? 'Synthesizing strategy...' : report?.strategySummary}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuantDashboard;
