import { useState, useEffect } from 'react';
import { Sensor, TemperatureReading } from '@/types/temperature';
import { generateMockTemperature, getTemperatureStatus } from '@/utils/temperatureUtils';

// Mock de sensores
const mockSensors: Omit<Sensor, 'currentTemperature' | 'status' | 'lastUpdate'>[] = [
  { id: 'sensor-1', name: 'Câmara Fria 01', location: 'Setor A - Carnes Bovinas' },
  { id: 'sensor-2', name: 'Câmara Fria 02', location: 'Setor B - Laticínios' },
  { id: 'sensor-3', name: 'Câmara Fria 03', location: 'Setor C - Congelados' },
  { id: 'sensor-4', name: 'Câmara Fria 04', location: 'Setor D - Frutas e Verduras' },
  { id: 'sensor-5', name: 'Câmara Fria 05', location: 'Setor E - Aves e Suínos' },
  { id: 'sensor-6', name: 'Câmara Fria 06', location: 'Setor F - Bebidas' },
  { id: 'sensor-7', name: 'Câmara Fria 07', location: 'Setor G - Pescados' },
  { id: 'sensor-8', name: 'Câmara Fria 08', location: 'Setor H - Sorvetes' },
  { id: 'sensor-9', name: 'Câmara Fria 09', location: 'Setor I - Medicamentos' },
  { id: 'sensor-10', name: 'Câmara Fria 10', location: 'Setor J - Produtos Orgânicos' },
];

const generateExtendedHistoricalData = (sensorId: string, months: number = 6): TemperatureReading[] => {
  const data: TemperatureReading[] = [];
  const now = new Date();
  const totalHours = months * 30 * 24; // Aproximadamente
  
  for (let i = totalHours; i >= 0; i--) {
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

const generateRecentData = (sensorId: string, count: number = 100): TemperatureReading[] => {
  const data: TemperatureReading[] = [];
  const now = new Date();
  
  for (let i = count; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000); // A cada 15 minutos
    const temperature = generateMockTemperature();
    
    data.push({
      id: `${sensorId}-recent-${i}`,
      sensorId,
      temperature,
      timestamp,
      status: getTemperatureStatus(temperature)
    });
  }
  
  return data;
};

export function useTemperatureData() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [recentData, setRecentData] = useState<Record<string, TemperatureReading[]>>({});
  const [extendedData, setExtendedData] = useState<Record<string, TemperatureReading[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar dados
  useEffect(() => {
    const initializeData = () => {
      const initialSensors: Sensor[] = mockSensors.map(sensor => {
        const temperature = generateMockTemperature();
        return {
          ...sensor,
          currentTemperature: temperature,
          status: getTemperatureStatus(temperature),
          lastUpdate: new Date()
        };
      });

      const initialRecentData: Record<string, TemperatureReading[]> = {};
      const initialExtendedData: Record<string, TemperatureReading[]> = {};
      
      mockSensors.forEach(sensor => {
        initialRecentData[sensor.id] = generateRecentData(sensor.id);
        initialExtendedData[sensor.id] = generateExtendedHistoricalData(sensor.id);
      });

      setSensors(initialSensors);
      setRecentData(initialRecentData);
      setExtendedData(initialExtendedData);
      setSelectedSensorId(mockSensors[0].id); // Selecionar primeiro sensor por padrão
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prevSensors => 
        prevSensors.map(sensor => {
          const newTemperature = generateMockTemperature();
          return {
            ...sensor,
            currentTemperature: newTemperature,
            status: getTemperatureStatus(newTemperature),
            lastUpdate: new Date()
          };
        })
      );

      // Adicionar novos pontos aos dados recentes
      setRecentData(prevData => {
        const newData = { ...prevData };
        Object.keys(newData).forEach(sensorId => {
          const temperature = generateMockTemperature();
          const newReading: TemperatureReading = {
            id: `${sensorId}-${Date.now()}`,
            sensorId,
            temperature,
            timestamp: new Date(),
            status: getTemperatureStatus(temperature)
          };
          
          // Manter apenas as últimas 100 leituras
          newData[sensorId] = [...newData[sensorId].slice(1), newReading];
        });
        return newData;
      });
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const getAlertsCount = () => {
    const warnings = sensors.filter(s => s.status === 'warning').length;
    const critical = sensors.filter(s => s.status === 'critical').length;
    return { warnings, critical };
  };

  const getAverageTemperature = () => {
    if (sensors.length === 0) return 0;
    const sum = sensors.reduce((acc, sensor) => acc + sensor.currentTemperature, 0);
    return sum / sensors.length;
  };

  const getStatusStats = (sensorId: string, period: 'week' | 'month' = 'month') => {
    const data = extendedData[sensorId] || [];
    const now = new Date();
    const periodMs = period === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    const cutoff = new Date(now.getTime() - periodMs);
    
    const periodData = data.filter(reading => reading.timestamp >= cutoff);
    
    const normal = periodData.filter(r => r.status === 'normal').length;
    const warning = periodData.filter(r => r.status === 'warning').length;
    const critical = periodData.filter(r => r.status === 'critical').length;
    const total = periodData.length;
    
    return {
      normal: { count: normal, percentage: total > 0 ? (normal / total) * 100 : 0 },
      warning: { count: warning, percentage: total > 0 ? (warning / total) * 100 : 0 },
      critical: { count: critical, percentage: total > 0 ? (critical / total) * 100 : 0 },
      total
    };
  };

  const getAverageDataPoints = (sensorId: string, period: 'week' | 'month', points: number = 30) => {
    const data = extendedData[sensorId] || [];
    const now = new Date();
    const periodMs = period === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    const cutoff = new Date(now.getTime() - periodMs);
    
    const periodData = data.filter(reading => reading.timestamp >= cutoff);
    
    if (periodData.length === 0) return [];
    
    const chunkSize = Math.ceil(periodData.length / points);
    const averagedData = [];
    
    for (let i = 0; i < periodData.length; i += chunkSize) {
      const chunk = periodData.slice(i, i + chunkSize);
      const avgTemp = chunk.reduce((sum, reading) => sum + reading.temperature, 0) / chunk.length;
      const timestamp = chunk[Math.floor(chunk.length / 2)].timestamp;
      
      averagedData.push({
        id: `avg-${i}`,
        sensorId,
        temperature: Number(avgTemp.toFixed(1)),
        timestamp,
        status: getTemperatureStatus(avgTemp)
      });
    }
    
    return averagedData;
  };

  return {
    sensors,
    selectedSensorId,
    setSelectedSensorId,
    recentData,
    extendedData,
    isLoading,
    getAlertsCount,
    getAverageTemperature,
    getStatusStats,
    getAverageDataPoints
  };
}