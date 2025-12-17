import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { WeatherDay } from '../types';

interface Props {
  data: WeatherDay[];
}

const TemperatureChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map(day => ({
    name: day.day.substring(0, 3), // Mon, Tue
    max: day.maxTemp,
    min: day.minTemp,
    fullDate: day.date
  }));

  return (
    <div className="w-full h-72 bg-[#eef2f6] rounded-[24px] p-6 shadow-sm">
      <h3 className="text-[#43474e] font-medium mb-6 text-sm tracking-wide">Temperature Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 25,
          }}
        >
          <defs>
            <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#006492" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#006492" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c3c7cf" />
          <XAxis 
            dataKey="name" 
            stroke="#43474e" 
            tick={{fontSize: 12}} 
            tickLine={false} 
            axisLine={false}
            tickMargin={10} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: '#1a1c1e', 
                color: '#fdfcff',
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
            }}
            itemStyle={{ color: '#e2e2e6' }}
            labelStyle={{ color: '#c4c7c5', marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="max" 
            stroke="#006492" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMax)" 
            name="High"
          />
          <Area 
            type="monotone" 
            dataKey="min" 
            stroke="#72777f" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={0} 
            name="Low"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;