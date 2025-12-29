'use client';

import { Sensor } from '@/types/temperature';
import { formatTemperature } from '@/utils/temperatureUtils';
import StatusLED from './StatusLED';
import { Thermometer, MapPin, Clock } from 'lucide-react';

interface SensorListProps {
  sensors: Sensor[];
  selectedSensorId: string | null;
  onSensorSelect: (sensorId: string) => void;
}

export default function SensorList({ sensors, selectedSensorId, onSensorSelect }: SensorListProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-[1vh] h-full">
      <div className="flex items-center gap-[0.5vw] mb-[1vh]">
        <Thermometer className="w-[1.5vw] h-[1.5vw] lg:w-[1.2vw] lg:h-[1.2vw] xl:w-[1vw] xl:h-[1vw] text-purple-400" />
        <h2 className="text-[1.5vw] lg:text-[1.2vw] xl:text-[1vw] font-semibold text-white">Sensores</h2>
      </div>
      
      <div className="space-y-[0.5vh] h-[calc(100%-4vh)] overflow-y-auto pr-[0.5vw] sensor-list-scroll">
        {sensors.map(sensor => (
          <div
            key={sensor.id}
            onClick={() => onSensorSelect(sensor.id)}
            className={`p-[1vh] rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedSensorId === sensor.id
                ? 'bg-purple-600 border-purple-500 shadow-lg shadow-purple-500/20'
                : sensor.status === 'critical'
                ? 'bg-red-900/30 border-red-500 hover:bg-red-900/40 animate-pulse'
                : sensor.status === 'warning'
                ? 'bg-yellow-900/30 border-yellow-500 hover:bg-yellow-900/40 animate-pulse'
                : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-[0.5vh]">
              <h3 className="font-medium text-white text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] truncate">{sensor.name}</h3>
              <StatusLED status={sensor.status} size="sm" />
            </div>
            
            <div className="flex items-center gap-[0.3vw] text-gray-400 text-[1vw] lg:text-[0.8vw] xl:text-[0.6vw] mb-[0.5vh]">
              <MapPin className="w-[1vw] h-[1vw] lg:w-[0.8vw] lg:h-[0.8vw] xl:w-[0.6vw] xl:h-[0.6vw] flex-shrink-0" />
              <span className="truncate">{sensor.location}</span>
            </div>
            
            <div className="text-center mb-[0.5vh]">
              <div className={`text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw] font-bold ${
                selectedSensorId === sensor.id ? 'text-white' : 'text-gray-200'
              }`}>
                {formatTemperature(sensor.currentTemperature)}
              </div>
            </div>
            
            <div className="flex items-center gap-[0.3vw] text-gray-500 text-[0.9vw] lg:text-[0.7vw] xl:text-[0.5vw] mb-[0.5vh]">
              <Clock className="w-[0.8vw] h-[0.8vw] lg:w-[0.6vw] lg:h-[0.6vw] xl:w-[0.5vw] xl:h-[0.5vw] flex-shrink-0" />
              <span className="truncate">{sensor.lastUpdate.toLocaleTimeString('pt-BR')}</span>
            </div>
            
            <div className="pt-[0.5vh] border-t border-gray-700">
              <div className="text-[0.9vw] lg:text-[0.7vw] xl:text-[0.5vw] truncate">
                Status: <span className={`font-medium ${
                  sensor.status === 'normal' ? 'text-green-400' :
                  sensor.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {sensor.status === 'normal' ? 'Normal' :
                   sensor.status === 'warning' ? 'Atenção' : 'Crítico'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}