'use client';

import { useState, useEffect } from 'react';
import { Sensor } from '@/types/temperature';
import { AlertTriangle, X } from 'lucide-react';
import StatusLED from './StatusLED';

interface AlertPopupProps {
  sensors: Sensor[];
}

export default function AlertPopup({ sensors }: AlertPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const criticalSensors = sensors.filter(sensor => 
    sensor.status === 'critical' && !dismissedAlerts.has(sensor.id)
  );

  useEffect(() => {
    if (criticalSensors.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [criticalSensors.length]);

  const dismissAlert = (sensorId: string) => {
    setDismissedAlerts(prev => new Set([...prev, sensorId]));
  };

  const dismissAll = () => {
    setDismissedAlerts(new Set(criticalSensors.map(s => s.id)));
    setIsVisible(false);
  };

  if (!isVisible || criticalSensors.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-[1vh] right-0 z-50 w-[18vw] lg:w-[16vw] xl:w-[14vw] animate-slide-in-right">
      <div className="bg-red-900 border-2 border-red-500 rounded-lg shadow-2xl shadow-red-500/20">
        <div className="p-[0.6vh] border-b border-red-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[0.4vw]">
              <AlertTriangle className="w-[1vw] h-[1vw] lg:w-[0.8vw] lg:h-[0.8vw] xl:w-[0.7vw] xl:h-[0.7vw] text-red-400 animate-pulse" />
              <h3 className="font-semibold text-white text-[1.4vw] lg:text-[1.2vw] xl:text-[1vw]">Alertas Críticos</h3>
            </div>
            <button
              onClick={dismissAll}
              className="text-red-400 hover:text-white transition-colors"
            >
              <X className="w-[1vw] h-[1vw] lg:w-[0.8vw] lg:h-[0.8vw] xl:w-[0.7vw] xl:h-[0.7vw]" />
            </button>
          </div>
        </div>
        
        <div className="max-h-[35vh] overflow-y-auto">
          {criticalSensors.map(sensor => (
            <div key={sensor.id} className="p-[0.6vh] border-b border-red-700 last:border-b-0">
              <div className="flex items-center justify-between mb-[0.4vh]">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] truncate">{sensor.name}</p>
                  <p className="text-red-300 text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw] truncate">{sensor.location}</p>
                </div>
                <div className="flex items-center gap-[0.4vw] flex-shrink-0">
                  <StatusLED status={sensor.status} size="sm" />
                  <button
                    onClick={() => dismissAlert(sensor.id)}
                    className="text-red-400 hover:text-white transition-colors"
                  >
                    <X className="w-[0.8vw] h-[0.8vw] lg:w-[0.6vw] lg:h-[0.6vw] xl:w-[0.5vw] xl:h-[0.5vw]" />
                  </button>
                </div>
              </div>
              
              <div className="mb-[0.4vh]">
                <div className="text-white font-bold text-[1.8vw] lg:text-[1.5vw] xl:text-[1.2vw]">
                  {sensor.currentTemperature.toFixed(1)}°C
                </div>
                <div className="text-red-300 text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw]">
                  {sensor.lastUpdate.toLocaleTimeString('pt-BR')}
                </div>
              </div>
              
              <p className="text-red-200 text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw]">
                🚨 CRÍTICO: Risco de descongelamento!
              </p>
            </div>
          ))}
        </div>
        
        {criticalSensors.length > 1 && (
          <div className="p-[0.4vh] bg-red-800 rounded-b-lg">
            <button
              onClick={dismissAll}
              className="w-full text-red-200 hover:text-white transition-colors text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw]"
            >
              Dispensar todos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}