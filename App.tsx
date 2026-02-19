
import React, { useState } from 'react';
import { AppView, MarketUniverse } from './types';
import QuantDashboard from './components/QuantDashboard';
import { Activity, Cpu, LineChart, Binary, ShieldAlert, ArrowRight, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [universe, setUniverse] = useState<MarketUniverse>({
    symbol: 'BTC-USD',
    frequency: '100ms',
    horizon: 'Intraday'
  });

  const handleInitialize = () => {
    if (universe.symbol) {
      setView(AppView.DASHBOARD);
    }
  };

  if (view === AppView.LANDING) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-5xl w-full space-y-12 text-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-4">
              <Zap className="w-3 h-3 mr-2 animate-pulse" />
              AlphaForge v3.0 // High-Frequency Terminal
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-outfit tracking-tighter leading-tight">
              Research <br />
              <span className="gradient-text">Institutional</span> Alpha
            </h1>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed font-mono">
              Calibrated Hawkes processes, RMT eigenvalue denoising, and Almgren-Chriss impact modeling. 
              Powered by Gemini 3 Pro Reasoning.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Instrument Pair</label>
                <input 
                  placeholder="e.g. BTC-USD" 
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all text-emerald-400"
                  value={universe.symbol}
                  onChange={e => setUniverse({...universe, symbol: e.target.value})}
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Sampling Frequency</label>
                <select 
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all appearance-none text-zinc-300"
                  value={universe.frequency}
                  onChange={e => setUniverse({...universe, frequency: e.target.value})}
                >
                  <option value="Tick">Tick-by-Tick</option>
                  <option value="100ms">100ms (High Freq)</option>
                  <option value="1s">1s (Mid Freq)</option>
                  <option value="1m">1m (Standard)</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleInitialize}
              className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-all group"
            >
              Mount Research Universe
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5">
            {[
              { icon: <Activity className="w-5 h-5" />, title: "Order Intensity", desc: "MLE estimation of point processes and market micro-structure." },
              { icon: <Binary className="w-5 h-5" />, title: "Hawkes Alpha", desc: "Multi-dimensional lead-lag stability diagnostics." },
              { icon: <ShieldAlert className="w-5 h-5" />, title: "RMT Portfolio", desc: "Random Matrix Theory spectral denoising for risk parity." }
            ].map((f, i) => (
              <div key={i} className="text-left space-y-3 p-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-emerald-500">
                  {f.icon}
                </div>
                <h3 className="font-bold text-md tracking-tight">{f.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <QuantDashboard universe={universe} onReset={() => setView(AppView.LANDING)} />;
};

export default App;
