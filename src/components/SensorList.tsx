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
    <div className="bg-white border border-slate-200 rounded-lg p-[0.8vh] h-full shadow-sm">
      <div className="flex items-center gap-[0.5vw] mb-[0.8vh]">
        <Thermometer className="w-[1.2vw] h-[1.2vw] lg:w-[1vw] lg:h-[1vw] xl:w-[0.8vw] xl:h-[0.8vw] text-purple-500" />
        <h2 className="text-[1.8vw] lg:text-[1.4vw] xl:text-[1.2vw] font-semibold text-slate-900">Sensores</h2>
      </div>
      
      <div className="space-y-[0.4vh] h-[calc(100%-3vh)] overflow-y-auto pr-[0.5vw] sensor-list-scroll">
        {sensors.map(sensor => (
          <div
            key={sensor.id}
            onClick={() => onSensorSelect(sensor.id)}
            className={`p-[0.6vh] rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedSensorId === sensor.id
                ? 'bg-purple-600 border-purple-500 shadow-lg shadow-purple-500/20'
                : sensor.status === 'critical'
                ? 'bg-red-50 border-red-400 hover:bg-red-100 animate-pulse'
                : sensor.status === 'warning'
                ? 'bg-amber-50 border-amber-400 hover:bg-amber-100 animate-pulse'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-[0.4vh]">
              <div className="flex items-center gap-[0.4vw] flex-1 min-w-0">
                <h3 className={`font-medium text-[1.4vw] lg:text-[1.2vw] xl:text-[1vw] truncate ${
                  selectedSensorId === sensor.id ? 'text-white' : 'text-slate-900'
                }`}>{sensor.name}</h3>
                <div className={`text-[1.6vw] lg:text-[1.3vw] xl:text-[1.1vw] font-bold ${
                  selectedSensorId === sensor.id ? 'text-white' : 'text-slate-900'
                }`}>
                  {formatTemperature(sensor.currentTemperature)}
                </div>
              </div>
              <StatusLED status={sensor.status} size="sm" />
            </div>
            
            <div className={`flex items-center gap-[0.3vw] text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] mb-[0.4vh] ${
              selectedSensorId === sensor.id ? 'text-purple-100' : 'text-slate-600'
            }`}>
              <MapPin className="w-[0.8vw] h-[0.8vw] lg:w-[0.7vw] lg:h-[0.7vw] xl:w-[0.6vw] xl:h-[0.6vw] flex-shrink-0" />
              <span className="truncate">{sensor.location}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-[0.3vw] text-[1.1vw] lg:text-[0.9vw] xl:text-[0.7vw] ${
                selectedSensorId === sensor.id ? 'text-purple-200' : 'text-slate-500'
              }`}>
                <Clock className="w-[0.7vw] h-[0.7vw] lg:w-[0.6vw] lg:h-[0.6vw] xl:w-[0.5vw] xl:h-[0.5vw] flex-shrink-0" />
                <span className="truncate">{sensor.lastUpdate.toLocaleTimeString('pt-BR')}</span>
              </div>
              
              <div className="text-[1.1vw] lg:text-[0.9vw] xl:text-[0.7vw]">
                <span className={`font-medium ${
                  selectedSensorId === sensor.id 
                    ? 'text-white'
                    : sensor.status === 'normal' ? 'text-emerald-600' :
                      sensor.status === 'warning' ? 'text-amber-600' : 'text-red-600'
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