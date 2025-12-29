'use client';

import { useTemperatureData } from '@/hooks/useTemperatureData';
import SensorList from './SensorList';
import TemperatureChart from './TemperatureChart';
import StatusPieChart from './StatusPieChart';
import ReportGenerator from './ReportGenerator';
import StatusLED from './StatusLED';
import AlertPopup from './AlertPopup';
import { AlertTriangle, Thermometer, Activity, Clock, Download } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const { 
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
  } = useTemperatureData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dados dos sensores...</p>
        </div>
      </div>
    );
  }

  const { warnings, critical } = getAlertsCount();
  const averageTemp = getAverageTemperature();
  const selectedSensor = sensors.find(s => s.id === selectedSensorId);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 h-[8vh]">
        <div className="max-w-full mx-auto px-[2vw]">
          <div className="flex justify-between items-center h-full">
            <div>
              <h1 className="text-[2.5vw] lg:text-[1.8vw] xl:text-[1.5vw] font-bold text-white">
                HRTemperatura
              </h1>
              <p className="text-gray-400 text-[1.2vw] lg:text-[0.9vw] xl:text-[0.7vw]">
                Monitoramento em tempo real de ambientes controlados
              </p>
            </div>
            <div className="flex items-center gap-[1vw]">
              <div className="text-right">
                <div className="text-[1vw] lg:text-[0.8vw] xl:text-[0.6vw] text-gray-400">Última atualização</div>
                <div className="text-[1.2vw] lg:text-[0.9vw] xl:text-[0.7vw] font-medium text-white">
                  {new Date().toLocaleTimeString('pt-BR')}
                </div>
              </div>
              <div className="flex items-center gap-[0.5vw]">
                <Clock className="w-[1.5vw] h-[1.5vw] lg:w-[1.2vw] lg:h-[1.2vw] xl:w-[1vw] xl:h-[1vw] text-gray-400" />
                <StatusLED status={critical > 0 ? 'critical' : warnings > 0 ? 'warning' : 'normal'} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-[2vw] py-[1vh] h-[92vh]">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-[1vw] h-full">
          {/* Sensor List - Sidebar */}
          <div className="lg:col-span-1 h-full">
            <SensorList 
              sensors={sensors}
              selectedSensorId={selectedSensorId}
              onSensorSelect={setSelectedSensorId}
            />
          </div>

          {/* Charts Area */}
          <div className="lg:col-span-4 h-full flex flex-col gap-[1vh]">
            {selectedSensor && (
              <>
                {/* Selected Sensor Info */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-[1vh] flex-shrink-0 h-[12vh]">
                  <div className="flex items-center justify-between h-full">
                    <div>
                      <h2 className="text-[1.8vw] lg:text-[1.4vw] xl:text-[1.2vw] font-semibold text-white">{selectedSensor.name}</h2>
                      <p className="text-gray-400 text-[1.2vw] lg:text-[0.9vw] xl:text-[0.7vw]">{selectedSensor.location}</p>
                    </div>
                    <div className="flex items-center gap-[1vw]">
                      <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex items-center gap-[0.5vw] bg-purple-600 text-white px-[1vw] py-[0.5vh] rounded-lg hover:bg-purple-700 transition-colors text-[1vw] lg:text-[0.8vw] xl:text-[0.6vw]"
                      >
                        <Download className="w-[1.2vw] h-[1.2vw] lg:w-[1vw] lg:h-[1vw] xl:w-[0.8vw] xl:h-[0.8vw]" />
                        Gerar Relatório
                      </button>
                      <div className="text-right">
                        <div className="text-[2.5vw] lg:text-[2vw] xl:text-[1.5vw] font-bold text-white">
                          {selectedSensor.currentTemperature.toFixed(1)}°C
                        </div>
                        <div className="text-[1vw] lg:text-[0.8vw] xl:text-[0.6vw] text-gray-400">Temperatura Atual</div>
                      </div>
                      <StatusLED status={selectedSensor.status} size="lg" />
                    </div>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-[1vw] flex-1 min-h-0">
                  {/* Real-time Chart */}
                  <div className="h-full">
                    <TemperatureChart
                      data={selectedSensorId ? getAverageDataPoints(selectedSensorId, 'week', 30) : []}
                      title="Tempo Real - Últimas 100 Medições (30 pontos)"
                    />
                  </div>

                  {/* Status Pie Chart */}
                  <div className="h-full">
                    <StatusPieChart
                      data={selectedSensorId ? getStatusStats(selectedSensorId, 'month') : { normal: { count: 0, percentage: 0 }, warning: { count: 0, percentage: 0 }, critical: { count: 0, percentage: 0 }, total: 0 }}
                      title="Status do Último Mês"
                    />
                  </div>

                  {/* Weekly Chart */}
                  <div className="h-full">
                    <TemperatureChart
                      data={selectedSensorId ? getAverageDataPoints(selectedSensorId, 'week', 30) : []}
                      title="Última Semana"
                    />
                  </div>

                  {/* Monthly Chart */}
                  <div className="h-full">
                    <TemperatureChart
                      data={selectedSensorId ? getAverageDataPoints(selectedSensorId, 'month', 30) : []}
                      title="Último Mês"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Alert Popup */}
      <AlertPopup sensors={sensors} />

      {/* Report Modal */}
      {isReportModalOpen && (
        <ReportGenerator 
          sensors={sensors} 
          extendedData={extendedData}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
}