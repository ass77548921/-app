import React from 'react';

interface IconProps {
  type: string;
  className?: string;
}

export const WeatherIcon: React.FC<IconProps> = ({ type, className = "" }) => {
  let iconName = 'question_mark';
  const t = type.toLowerCase();

  // Map weather conditions to Material Symbols Rounded names
  if (t.includes('sun') || t.includes('clear')) iconName = 'sunny';
  else if (t.includes('partly')) iconName = 'partly_cloudy_day';
  else if (t.includes('cloud') || t.includes('overcast')) iconName = 'cloud';
  else if (t.includes('rain') || t.includes('shower')) iconName = 'rainy';
  else if (t.includes('snow')) iconName = 'weather_snowy';
  else if (t.includes('storm') || t.includes('thunder')) iconName = 'thunderstorm';
  else if (t.includes('fog') || t.includes('mist')) iconName = 'foggy';

  return (
    <span className={`material-symbols-rounded ${className} select-none`}>
      {iconName}
    </span>
  );
};