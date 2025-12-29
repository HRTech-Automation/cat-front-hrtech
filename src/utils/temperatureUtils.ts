import { TemperatureReading, Sensor } from '@/types/temperature';

export const getTemperatureStatus = (temperature: number): 'normal' | 'warning' | 'critical' => {
  if (temperature > -2) return 'critical';
  if (temperature > -6) return 'warning';
  return 'normal';
};

export const generateMockTemperature = (): number => {
  // Gera temperaturas entre -15°C e 2°C com maior probabilidade de estar na faixa ideal
  const random = Math.random();
  
  if (random < 0.7) {
    // 70% chance de estar na faixa ideal (-15°C a -6°C)
    return Number((Math.random() * 9 - 15).toFixed(1));
  } else if (random < 0.9) {
    // 20% chance de estar na faixa de alerta (-6°C a -2°C)
    return Number((Math.random() * 4 - 6).toFixed(1));
  } else {
    // 10% chance de estar na faixa crítica (-2°C a 2°C)
    return Number((Math.random() * 4 - 2).toFixed(1));
  }
};

export const generateHistoricalData = (sensorId: string, hours: number = 24): TemperatureReading[] => {
  const data: TemperatureReading[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const temperature = generateMockTemperature();
    
    data.push({
      id: `${sensorId}-${i}`,
      sensorId,
      temperature,
      timestamp,
      status: getTemperatureStatus(temperature)
    });
  }
  
  return data;
};

export const formatTemperature = (temp: number): string => {
  return `${temp.toFixed(1)}°C`;
};