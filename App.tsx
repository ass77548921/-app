import React, { useState, useEffect } from 'react';
import { getWeatherForecast } from './services/geminiService';
import { WeatherData, SearchState } from './types';
import { WeatherIcon } from './components/Icons';
import TemperatureChart from './components/TemperatureChart';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [search, setSearch] = useState<SearchState>({
    query: '',
    loading: false,
    error: null,
  });

  // Default to a location on first load
  useEffect(() => {
    if ("geolocation" in navigator) {
        setSearch(prev => ({ ...prev, loading: true }));
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                handleSearch(`${latitude}, ${longitude}`);
            },
            (error) => {
                handleSearch("London, UK");
            }
        );
    } else {
        handleSearch("London, UK");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (query: string) => {
    setSearch({ query, loading: true, error: null });
    try {
      const data = await getWeatherForecast(query);
      setWeather(data);
      setSearch(prev => ({ ...prev, loading: false, query: data.location }));
    } catch (err) {
      setSearch(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Connection failed. Please check your API key." 
      }));
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.query.trim()) {
      handleSearch(search.query);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fdfcff] shadow-2xl overflow-hidden relative pb-8 md:max-w-4xl md:grid md:grid-cols-2 md:gap-8 md:p-8 md:bg-transparent md:shadow-none">
      
      {/* Mobile-like Header (Top App Bar) */}
      <header className="sticky top-0 z-50 bg-[#fdfcff]/90 backdrop-blur-sm px-4 py-3 flex items-center gap-4 md:col-span-2 md:bg-transparent md:px-0">
        <div className="flex-1 bg-[#eef2f6] rounded-full flex items-center px-4 h-12 transition-colors focus-within:bg-[#e7ebf0]">
          <span className="material-symbols-rounded text-[#43474e]">search</span>
          <form onSubmit={onSearchSubmit} className="flex-1 ml-3">
            <input
              type="text"
              value={search.query}
              onChange={(e) => setSearch({ ...search, query: e.target.value })}
              placeholder="Search city..."
              className="w-full bg-transparent border-none focus:ring-0 text-[#1a1c1e] placeholder-[#72777f] text-base"
            />
          </form>
          {search.loading && (
             <div className="w-5 h-5 border-2 border-[#006492] border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
        <button className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#eef2f6] transition-colors md:hidden">
            <span className="material-symbols-rounded text-[#1a1c1e]">more_vert</span>
        </button>
      </header>

      {/* Error Banner */}
      {search.error && (
        <div className="mx-4 mt-2 p-4 bg-[#ffdad6] text-[#410002] rounded-[16px] text-sm md:col-span-2">
          {search.error}
        </div>
      )}

      {/* Main Content Area */}
      {!search.loading && weather && (
        <>
            {/* Left Column (Current Weather) */}
            <div className="px-4 mt-2 space-y-4 md:px-0 md:mt-0">
                {/* Hero Card */}
                <section className="bg-[#006492] text-white rounded-[28px] p-6 relative overflow-hidden shadow-lg">
                    {/* Abstract Shapes (Flutter-like) */}
                    <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex flex-col items-center py-6 text-center">
                        <h1 className="text-2xl font-normal mb-1">{weather.location}</h1>
                        <p className="text-[#cce5ff] text-sm mb-6">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        
                        <WeatherIcon type={weather.currentCondition} className="text-6xl text-white mb-4" />
                        
                        <div className="text-7xl font-medium tracking-tighter mb-2">
                            {weather.currentTemp}°
                        </div>
                        <p className="text-xl font-medium capitalize">{weather.currentCondition}</p>
                    </div>

                    <div className="flex justify-around mt-6 border-t border-white/20 pt-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[#cce5ff] text-xs mb-1">High</span>
                            <span className="font-medium text-lg">{weather.forecast[0]?.maxTemp}°</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[#cce5ff] text-xs mb-1">Low</span>
                            <span className="font-medium text-lg">{weather.forecast[0]?.minTemp}°</span>
                        </div>
                         <div className="flex flex-col items-center">
                            <span className="text-[#cce5ff] text-xs mb-1">Rain</span>
                            <span className="font-medium text-lg">{weather.forecast[0]?.precipitationChance}%</span>
                        </div>
                    </div>
                </section>
                
                {/* Chart (Desktop only placement) */}
                <div className="hidden md:block">
                     <TemperatureChart data={weather.forecast} />
                </div>
            </div>

            {/* Right Column (Forecast) */}
            <div className="px-4 mt-6 space-y-6 md:px-0 md:mt-0">
                
                {/* 7-Day List Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[#1a1c1e]">7-Day Forecast</h2>
                    <span className="text-sm text-[#006492] font-medium cursor-pointer">View Calendar</span>
                </div>

                {/* Forecast List (Material Lists) */}
                <div className="bg-[#f0f4f8] rounded-[24px] overflow-hidden">
                    {weather.forecast.map((day, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border-b border-white/50 last:border-0 hover:bg-[#e7ebf0] transition-colors">
                            <div className="w-16 font-medium text-[#1a1c1e]">
                                {idx === 0 ? 'Today' : day.day.substring(0, 3)}
                            </div>
                            <div className="flex flex-col items-center w-12">
                                <WeatherIcon type={day.icon} className={`text-2xl ${day.precipitationChance > 30 ? 'text-[#006492]' : 'text-[#f9b126]'}`} />
                                {day.precipitationChance > 0 && (
                                    <span className="text-[10px] text-[#006492] font-bold mt-0.5">{day.precipitationChance}%</span>
                                )}
                            </div>
                            <div className="flex-1 mx-4 text-sm text-[#43474e] truncate">
                                {day.condition}
                            </div>
                            <div className="flex gap-3 text-right w-20 justify-end">
                                <span className="font-medium text-[#1a1c1e]">{day.maxTemp}°</span>
                                <span className="text-[#72777f]">{day.minTemp}°</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                 {/* Chart (Mobile Only placement) */}
                <div className="md:hidden">
                     <TemperatureChart data={weather.forecast} />
                </div>

                {/* Sources Chip Group */}
                {weather.sources && weather.sources.length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-2">
                        {weather.sources.map((source, i) => (
                            <a 
                                key={i} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eef2f6] text-[#43474e] rounded-lg text-xs hover:bg-[#e7ebf0] transition-colors border border-[#c3c7cf]"
                            >
                                <span className="material-symbols-rounded text-[14px]">public</span>
                                {source.title}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </>
      )}

      {/* Loading State */}
      {search.loading && !weather && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] md:col-span-2">
            <div className="w-12 h-12 border-4 border-[#eef2f6] border-t-[#006492] rounded-full animate-spin mb-4"></div>
            <p className="text-[#43474e] font-medium">Updating forecast...</p>
        </div>
      )}

      {/* Bottom Navigation Bar (Mobile) - Visual Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#fdfcff] border-t border-[#e7ebf0] pb-6 pt-2 px-6 flex justify-between items-center md:hidden">
         <div className="flex flex-col items-center gap-1 opacity-100">
             <span className="material-symbols-rounded bg-[#cce5ff] px-4 py-1 rounded-full text-[#001d32]">home</span>
             <span className="text-xs font-medium text-[#001d32]">Home</span>
         </div>
         <div className="flex flex-col items-center gap-1 opacity-60">
             <span className="material-symbols-rounded px-4 py-1">map</span>
             <span className="text-xs font-medium text-[#43474e]">Radar</span>
         </div>
         <div className="flex flex-col items-center gap-1 opacity-60">
             <span className="material-symbols-rounded px-4 py-1">settings</span>
             <span className="text-xs font-medium text-[#43474e]">Settings</span>
         </div>
      </div>

    </div>
  );
};

export default App;