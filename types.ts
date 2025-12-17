export interface WeatherDay {
  date: string;
  day: string;
  maxTemp: number; // Celsius
  minTemp: number; // Celsius
  condition: string;
  description: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'storm' | 'fog' | 'partly-cloudy';
  precipitationChance: number;
}

export interface WeatherData {
  location: string;
  currentTemp: number;
  currentCondition: string;
  forecast: WeatherDay[];
  sources?: {
    uri: string;
    title: string;
  }[];
}

export interface SearchState {
  query: string;
  loading: boolean;
  error: string | null;
}
