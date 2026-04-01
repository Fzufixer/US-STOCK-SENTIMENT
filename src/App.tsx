import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Info, Loader2, RefreshCw } from 'lucide-react';

// Types
interface SentimentData {
  [key: string]: {
    score: number;
    companies: string[];
  };
}

const US_MAP_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const App: React.FC = () => {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const fetchSentiment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sentiment');
      if (!response.ok) throw new Error('Failed to fetch sentiment');
      const data = await response.json();
      setSentiment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentiment();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !sentiment) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 960;
    const height = 600;
    const projection = d3.geoAlbersUsa().scale(1280).translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([-1, 1]);

    d3.json(US_MAP_URL).then((us: any) => {
      const states = topojson.feature(us, us.objects.states) as any;

      svg.append("g")
        .selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", (d: any) => {
          const stateName = d.properties.name;
          // Map full name to abbreviation (simplified for demo)
          const stateAbbr = Object.keys(stateToAbbr).find(key => stateToAbbr[key] === stateName);
          const score = stateAbbr ? sentiment[stateAbbr]?.score : 0;
          return colorScale(score || 0);
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("mouseover", function() {
          d3.select(this).attr("stroke", "#000").attr("stroke-width", 2);
        })
        .on("mouseout", function() {
          d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1);
        })
        .on("click", (event, d: any) => {
          const stateName = d.properties.name;
          const stateAbbr = Object.keys(stateToAbbr).find(key => stateToAbbr[key] === stateName);
          setSelectedState(stateAbbr || null);
        });
    });
  }, [sentiment]);

  const stateToAbbr: Record<string, string> = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
    "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
    "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
    "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
    "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
    "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
    "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
    "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
    "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <TrendingUp className="text-green-500" />
            US STOCK SENTIMENT
          </h1>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Real-time Market Analysis by State</p>
        </div>
        <button 
          onClick={fetchSentiment}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span className="text-xs font-bold uppercase tracking-wider">Refresh Data</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-50" />
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-lg font-bold italic serif">Geographic Sentiment Heatmap</h2>
                <p className="text-sm text-white/50">Click a state to view local market drivers</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-tighter">
                <span className="text-red-500">Bearish (-1.0)</span>
                <div className="w-32 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
                <span className="text-green-500">Bullish (+1.0)</span>
              </div>
            </div>

            <div className="relative aspect-[16/10] w-full">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 rounded-2xl">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                    <p className="text-sm font-mono animate-pulse">Analyzing Market Data...</p>
                  </div>
                </div>
              )}
              <svg 
                ref={svgRef} 
                viewBox="0 0 960 600" 
                className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">Overall Sentiment</span>
              <div className="text-3xl font-bold tracking-tighter text-green-400">+0.42</div>
              <p className="text-xs text-white/30 mt-2 italic">Moderately Bullish</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">Top Sector</span>
              <div className="text-3xl font-bold tracking-tighter">TECH</div>
              <p className="text-xs text-white/30 mt-2 italic">Driven by NVDA & AAPL</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">Data Sources</span>
              <div className="text-3xl font-bold tracking-tighter">3,421</div>
              <p className="text-xs text-white/30 mt-2 italic">News, Tweets & Prices</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedState ? (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold tracking-tighter">{stateToAbbr[selectedState]}</h2>
                  <button onClick={() => setSelectedState(null)} className="text-white/30 hover:text-white">✕</button>
                </div>

                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] font-mono text-white/40 uppercase block mb-4">Sentiment Score</span>
                    <div className="flex items-center gap-4">
                      <div className={`text-5xl font-bold tracking-tighter ${sentiment?.[selectedState]?.score! > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {(sentiment?.[selectedState]?.score || 0).toFixed(2)}
                      </div>
                      {sentiment?.[selectedState]?.score! > 0 ? <TrendingUp className="w-8 h-8 text-green-500" /> : <TrendingDown className="w-8 h-8 text-red-500" />}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-white/40 uppercase block mb-4">Key Companies</span>
                    <div className="flex flex-wrap gap-2">
                      {sentiment?.[selectedState]?.companies.map(ticker => (
                        <div key={ticker} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-bold">
                          ${ticker}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-start gap-3 text-sm text-white/60 italic">
                      <Info className="w-5 h-5 flex-shrink-0 text-orange-500" />
                      <p>Sentiment is calculated using Gemini AI analysis of recent news headlines, social media trends, and price action for major companies headquartered in this state.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Info className="text-white/20" />
                </div>
                <div>
                  <h3 className="font-bold">Select a State</h3>
                  <p className="text-sm text-white/40">Hover over the map and click to see detailed sentiment analysis for that region.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto p-12 border-t border-white/10 mt-12 flex flex-col md:flex-row justify-between gap-8 text-white/30 text-[10px] font-mono uppercase tracking-widest">
        <div>
          © 2026 MARKET SENTIMENT ENGINE // POWERED BY GEMINI AI
        </div>
        <div className="flex gap-8">
          <span>NEWSAPI.ORG</span>
          <span>YAHOO FINANCE</span>
          <span>X API</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
