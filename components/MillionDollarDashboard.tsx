
import React, { useState, useEffect } from 'react';
import { BusinessProfile, GeneratedAsset } from '../types';
import { generateBusinessStrategy, fetchMarketTrends, generateBrandAsset, generatePromoVideo } from '../services/geminiService';
import { 
  BarChart3, 
  MessageSquare, 
  Layout, 
  Video, 
  Settings, 
  ChevronRight, 
  Loader2, 
  ExternalLink, 
  TrendingUp, 
  ShieldCheck,
  Play,
  Download,
  Plus,
  // Fix: Adding missing icon imports used in the dashboard
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Props {
  business: BusinessProfile;
  onReset: () => void;
}

const MillionDollarDashboard: React.FC<Props> = ({ business, onReset }) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'media' | 'trends'>('strategy');
  const [strategy, setStrategy] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState<string | null>(null);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [videoStatus, setVideoStatus] = useState<string>('');

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setLoading(true);
    try {
      const [strat, trendData] = await Promise.all([
        generateBusinessStrategy(business.concept),
        fetchMarketTrends(business.industry)
      ]);
      setStrategy(strat);
      setTrends(trendData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createBrandAsset = async () => {
    setMediaLoading('image');
    try {
      const url = await generateBrandAsset(`${strategy?.brandName} ${business.industry} logo and product mockup`);
      const newAsset: GeneratedAsset = {
        id: Math.random().toString(),
        type: 'image',
        url,
        prompt: `Branding for ${strategy?.brandName}`,
        timestamp: Date.now()
      };
      setAssets([newAsset, ...assets]);
    } catch (e) {
      console.error(e);
    } finally {
      setMediaLoading(null);
    }
  };

  const createVideoAsset = async () => {
    setMediaLoading('video');
    try {
      const url = await generatePromoVideo(`${strategy?.brandName} cinematic promo for ${business.concept}`, setVideoStatus);
      const newAsset: GeneratedAsset = {
        id: Math.random().toString(),
        type: 'video',
        url,
        prompt: `Cinematic Commercial for ${strategy?.brandName}`,
        timestamp: Date.now()
      };
      setAssets([newAsset, ...assets]);
    } catch (e) {
      console.error(e);
      setVideoStatus('Generation failed. Ensure payment plan is active.');
    } finally {
      setMediaLoading(null);
      setVideoStatus('');
    }
  };

  const revenueData = [
    { month: 'M1', revenue: 5000 },
    { month: 'M2', revenue: 45000 },
    { month: 'M3', revenue: 120000 },
    { month: 'M4', revenue: 350000 },
    { month: 'M5', revenue: 780000 },
    { month: 'M6', revenue: 1050000 },
  ];

  return (
    <div className="flex h-screen bg-[#050505]">
      {/* Sidebar */}
      <div className="w-20 md:w-64 border-r border-white/5 flex flex-col bg-black/50 overflow-y-auto">
        <div className="p-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-outfit font-black text-xl mb-8 cursor-pointer" onClick={onReset}>
            V
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'strategy', label: 'Strategy', icon: <BarChart3 className="w-5 h-5" /> },
              { id: 'media', label: 'Media Forge', icon: <Video className="w-5 h-5" /> },
              { id: 'trends', label: 'Insights', icon: <TrendingUp className="w-5 h-5" /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="hidden md:block font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="hidden md:block p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
            <div className="flex items-center text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3 h-3 mr-2" />
              Vision Quality
            </div>
            <div className="text-sm font-medium text-white mb-2">Architecting Success</div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[85%] rounded-full"></div>
            </div>
          </div>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-zinc-500 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span className="hidden md:block">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="text-zinc-500 text-sm mb-1 uppercase tracking-tighter font-bold">Project: {business.concept}</div>
            <h1 className="text-3xl font-outfit font-bold">{strategy?.brandName || 'Initializing Venture...'}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Target Monthly Revenue</div>
              <div className="text-xl font-bold text-emerald-400">$1,000,000.00</div>
            </div>
            <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-white/5 hover:scale-105 transition-transform">
              Launch Venture
            </button>
          </div>
        </header>

        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-zinc-500">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="animate-pulse">Thinking in millions of tokens...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Variable Content */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'strategy' && (
                <>
                  <section className="glass p-8 rounded-3xl space-y-6">
                    <h2 className="text-xl font-bold flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                      Executive Strategy
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-zinc-500 font-bold uppercase">Value Proposition</label>
                          <p className="text-zinc-300 leading-relaxed">{strategy?.valueProposition}</p>
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500 font-bold uppercase">Monetization Model</label>
                          <p className="text-zinc-300 leading-relaxed">{strategy?.monetizationModel}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-zinc-500 font-bold uppercase">Marketing Engine</label>
                          <p className="text-zinc-300 leading-relaxed">{strategy?.marketingStrategy}</p>
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500 font-bold uppercase">Scalability Plan</label>
                          <p className="text-zinc-300 leading-relaxed">{strategy?.scalabilityPlan}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="glass p-8 rounded-3xl space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">Projected Hyper-Growth</h2>
                      <div className="flex space-x-2">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 uppercase font-bold">Organic</span>
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 uppercase font-bold">Paid</span>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                          <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                            itemStyle={{ color: '#10b981' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">CAC Payback</div>
                        <div className="text-lg font-bold">2.4 Weeks</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">CLTV</div>
                        <div className="text-lg font-bold">$12,400</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Burn Multiple</div>
                        <div className="text-lg font-bold text-emerald-400">0.12x</div>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={createBrandAsset}
                      disabled={!!mediaLoading}
                      className="glass p-10 rounded-3xl flex flex-col items-center justify-center space-y-4 hover:border-white/20 transition-all group relative overflow-hidden"
                    >
                      {mediaLoading === 'image' ? <Loader2 className="w-8 h-8 animate-spin text-blue-500" /> : <ImageIcon className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />}
                      <div className="text-center">
                        <h3 className="font-bold">Generate Brand Identity</h3>
                        <p className="text-xs text-zinc-500 mt-1">Logo, Style Guide, Mockups</p>
                      </div>
                      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </button>
                    <button 
                      onClick={createVideoAsset}
                      disabled={!!mediaLoading}
                      className="glass p-10 rounded-3xl flex flex-col items-center justify-center space-y-4 hover:border-white/20 transition-all group relative overflow-hidden"
                    >
                      {mediaLoading === 'video' ? <Loader2 className="w-8 h-8 animate-spin text-purple-500" /> : <Video className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />}
                      <div className="text-center">
                        <h3 className="font-bold">Generate Promo Video</h3>
                        <p className="text-xs text-zinc-500 mt-1">Cinematic Ad via Veo 3.1</p>
                      </div>
                      <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </button>
                  </div>

                  {videoStatus && (
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm flex items-center animate-pulse">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {videoStatus}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {assets.map(asset => (
                      <div key={asset.id} className="glass rounded-2xl overflow-hidden group">
                        <div className="aspect-video relative bg-black/40">
                          {asset.type === 'image' ? (
                            <img src={asset.url} className="w-full h-full object-cover" alt="Generated Asset" />
                          ) : (
                            <video src={asset.url} className="w-full h-full object-cover" controls />
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                            <button className="p-3 bg-white/10 rounded-full hover:bg-white/20"><Download className="w-5 h-5" /></button>
                          </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <div className="text-xs text-zinc-500 uppercase font-bold">{asset.type} Asset</div>
                            <div className="text-sm font-medium truncate max-w-[150px]">{asset.prompt}</div>
                          </div>
                          <div className="text-[10px] text-zinc-600">
                            {new Date(asset.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {assets.length === 0 && !mediaLoading && (
                      <div className="col-span-full py-20 text-center text-zinc-600 border-2 border-dashed border-white/5 rounded-3xl">
                        No assets forged yet. Select an option above to begin.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'trends' && (
                <div className="space-y-6">
                  <section className="glass p-8 rounded-3xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                      Market Intelligence
                    </h2>
                    <div className="prose prose-invert max-w-none mb-8 text-zinc-300">
                      {trends?.text}
                    </div>
                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Verified Sources</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {trends?.sources.map((source: any, i: number) => (
                          <a 
                            key={i} 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors"
                          >
                            <span className="text-sm font-medium truncate pr-4">{source.title}</span>
                            <ExternalLink className="w-4 h-4 text-zinc-500 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Right Column - Side Panels */}
            <div className="space-y-6">
              <section className="glass p-6 rounded-3xl border border-blue-500/20 bg-blue-500/[0.02]">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Million Dollar Checklist</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Market Validation', status: true },
                    { label: 'Brand Guidelines', status: assets.some(a => a.type === 'image') },
                    { label: 'Acquisition Video', status: assets.some(a => a.type === 'video') },
                    { label: 'Go-to-Market Deck', status: !!strategy },
                    { label: 'Unit Economics Fix', status: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/20">
                      <span className="text-sm font-medium text-zinc-300">{item.label}</span>
                      {item.status ? (
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <ChevronRight className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 border border-zinc-700 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass p-6 rounded-3xl">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-xs">
                      <div className="text-zinc-200 font-medium">Venture Architecture Created</div>
                      <div className="text-zinc-500 mt-0.5">Gemini 3 Pro generated full strategy docs.</div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-xs">
                      <div className="text-zinc-200 font-medium">Market Trends Syncing</div>
                      <div className="text-zinc-500 mt-0.5">Google Search grounding verified local demand.</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="glass p-6 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Growth Engine</h3>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs mb-2 font-medium">
                      <span className="text-zinc-500">Infrastructure Stability</span>
                      <span className="text-white">99.9%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full">
                      <div className="h-full bg-blue-500 w-full rounded-full"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <div className="text-xl font-bold">14s</div>
                      <div className="text-[10px] text-zinc-500 uppercase">Avg Response</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <div className="text-xl font-bold">4.8</div>
                      <div className="text-[10px] text-zinc-500 uppercase">Model Score</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MillionDollarDashboard;
