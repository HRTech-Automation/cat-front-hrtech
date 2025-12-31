'use client';

import { useTemperatureData } from '@/hooks/useTemperatureData';
import SensorList from './SensorList';
import TemperatureChart from './TemperatureChart';
import StatusPieChart from './StatusPieChart';
import OverallChart from './OverallChart';
import ReportGenerator from './ReportGenerator';
import StatusLED from './StatusLED';
import AlertPopup from './AlertPopup';
import { Clock, Download, ArrowLeft, Thermometer } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  
  const { 
    sensors, 
    selectedSensorId, 
    setSelectedSensorId, 
    extendedData, 
    isLoading, 
    getAlertsCount, 
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
  const selectedSensor = sensors.find(s => s.id === selectedSensorId);

  const handleSensorSelect = (sensorId: string) => {
    setSelectedSensorId(sensorId);
    setViewMode('detail');
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedSensorId(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 h-[7vh]">
        <div className="max-w-full mx-auto px-0">
          <div className="flex justify-between items-center h-full px-[0.5vw]">
            <div className="flex items-center gap-[1vw]">
              {viewMode === 'detail' && (
                <button
                  onClick={handleBackToGrid}
                  className="flex items-center gap-[0.3vw] text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-[1.2vw] h-[1.2vw] lg:w-[1vw] lg:h-[1vw] xl:w-[0.8vw] xl:h-[0.8vw]" />
                  <span className="text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw]">Voltar</span>
                </button>
              )}
              <div>
                <h1 className="text-[3vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-white">
                  HRTemperatura
                </h1>
                <p className="text-gray-400 text-[1.5vw] lg:text-[1.1vw] xl:text-[0.9vw]">
                  {viewMode === 'grid' ? 'Monitoramento em tempo real de ambientes controlados' : selectedSensor?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-[0.8vw]">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-[0.3vw] bg-purple-600 text-white px-[0.8vw] py-[0.4vh] rounded-lg hover:bg-purple-700 transition-colors text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw]"
              >
                <Download className="w-[1vw] h-[1vw] lg:w-[0.8vw] lg:h-[0.8vw] xl:w-[0.7vw] xl:h-[0.7vw]" />
                Gerar Relatório
              </button>
              <div className="text-right">
                <div className="text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] text-gray-400">Última atualização</div>
                <div className="text-[1.4vw] lg:text-[1.1vw] xl:text-[0.9vw] font-medium text-white">
                  {new Date().toLocaleTimeString('pt-BR')}
                </div>
              </div>
              <div className="flex items-center gap-[0.3vw]">
                <Clock className="w-[1.2vw] h-[1.2vw] lg:w-[1vw] lg:h-[1vw] xl:w-[0.8vw] xl:h-[0.8vw] text-gray-400" />
                <StatusLED status={critical > 0 ? 'critical' : warnings > 0 ? 'warning' : 'normal'} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-0 py-[0.2vh] h-[93vh] flex flex-col">
        {viewMode === 'grid' ? (
          /* Grid View - Cards dos Sensores + Sidebar + Gráfico */
          <>
            <div className="flex gap-[0.8vw] p-[0.8vw] flex-1">
              {/* Sidebar com informações da empresa */}
              <div className="w-[20vw] flex flex-col">
                {/* Card da Empresa - Altura Total */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-[1vh] flex-1 flex flex-col">
                  <div className="flex-shrink-0">
                    <h3 className="text-[1.6vw] lg:text-[1.3vw] xl:text-[1.1vw] font-bold text-white mb-[0.5vh]">
                      HRTemperatura
                    </h3>
                    <p className="text-gray-400 text-[1.1vw] lg:text-[0.9vw] xl:text-[0.7vw] mb-[2vh]">
                      Sistema de Monitoramento de Câmaras Frias
                    </p>
                  </div>
                  
                  <div className="space-y-[1vh] flex-shrink-0 mb-[2vh]">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw]">Sensores Ativos:</span>
                      <span className="text-white font-medium text-[1.1vw] lg:text-[0.9vw] xl:text-[0.8vw]">{sensors.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw]">Alertas Críticos:</span>
                      <span className="text-red-400 font-bold text-[1.1vw] lg:text-[0.9vw] xl:text-[0.8vw]">{critical}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw]">Alertas de Atenção:</span>
                      <span className="text-yellow-400 font-bold text-[1.1vw] lg:text-[0.9vw] xl:text-[0.8vw]">{warnings}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw]">Sensores Normais:</span>
                      <span className="text-green-400 font-bold text-[1.1vw] lg:text-[0.9vw] xl:text-[0.8vw]">{sensors.length - critical - warnings}</span>
                    </div>
                  </div>

                  {/* Informações da Empresa */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-[1.5vh]">
                      <div>
                        <h4 className="text-gray-400 text-[0.9vw] lg:text-[0.7vw] xl:text-[0.6vw] mb-[0.3vh]">Endereço</h4>
                        <p className="text-white text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw] leading-relaxed">
                          Rua das Indústrias, 1234<br/>
                          Distrito Industrial<br/>
                          São Paulo - SP, 01234-567
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-400 text-[0.9vw] lg:text-[0.7vw] xl:text-[0.6vw] mb-[0.3vh]">Contato</h4>
                        <p className="text-white text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw]">
                          (11) 3456-7890<br/>
                          contato@hrtemperatura.com.br
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-400 text-[0.9vw] lg:text-[0.7vw] xl:text-[0.6vw] mb-[0.3vh]">CNPJ</h4>
                        <p className="text-white text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw]">
                          12.345.678/0001-90
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-400 text-[0.9vw] lg:text-[0.7vw] xl:text-[0.6vw] mb-[0.3vh]">Responsável Técnico</h4>
                        <p className="text-white text-[1vw] lg:text-[0.8vw] xl:text-[0.7vw]">
                          Eng. João Silva<br/>
                          CREA-SP 123456789
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações adicionais na parte inferior */}
                  <div className="flex-shrink-0 pt-[1vh] border-t border-gray-700">
                    <div className="text-center text-gray-500 text-[0.8vw] lg:text-[0.6vw] xl:text-[0.5vw]">
                      Última verificação: {new Date().toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid de Sensores */}
              <div className="flex-1">
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-[0.3vw] gap-y-[0.1vh] h-full">
                  {sensors.map(sensor => (
                    <div
                      key={sensor.id}
                      onClick={() => handleSensorSelect(sensor.id)}
                      className={`bg-gray-900 border rounded-lg p-[0.8vh] cursor-pointer transition-all duration-200 hover:scale-105 aspect-square flex flex-col justify-between ${
                        sensor.status === 'critical'
                          ? 'border-red-500 bg-red-900/20 animate-pulse'
                          : sensor.status === 'warning'
                          ? 'border-yellow-500 bg-yellow-900/20 animate-pulse'
                          : 'border-gray-700 hover:border-purple-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Thermometer className="w-[1.5vw] h-[1.5vw] lg:w-[1.2vw] lg:h-[1.2vw] xl:w-[1vw] xl:h-[1vw] text-purple-400" />
                        <StatusLED status={sensor.status} size="sm" />
                      </div>
                      
                      <div className="text-center flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-white text-[1.4vw] lg:text-[1.1vw] xl:text-[0.9vw] mb-[0.3vh] truncate">
                          {sensor.name}
                        </h3>
                        <p className="text-gray-400 text-[1vw] lg:text-[0.8vw] xl:text-[0.6vw] mb-[0.5vh] truncate">
                          {sensor.location}
                        </p>
                        <div className="text-[2.2vw] lg:text-[1.8vw] xl:text-[1.4vw] font-bold text-white mb-[0.3vh]">
                          {sensor.currentTemperature.toFixed(1)}°C
                        </div>
                        <div className={`text-[1vw] lg:text-[0.8vw] xl:text-[0.6vw] font-medium ${
                          sensor.status === 'normal' ? 'text-green-400' :
                          sensor.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {sensor.status === 'normal' ? 'Normal' :
                           sensor.status === 'warning' ? 'Atenção' : 'Crítico'}
                        </div>
                      </div>
                      
                      <div className="text-center text-gray-500 text-[0.8vw] lg:text-[0.6vw] xl:text-[0.5vw]">
                        {sensor.lastUpdate.toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gráfico Geral - Largura Total */}
            <div className="bg-gray-900 border-t border-gray-700 p-[0.8vw] h-[35vh] flex-shrink-0">
              <h3 className="text-[1.4vw] lg:text-[1.2vw] xl:text-[1vw] font-semibold text-white mb-[0.5vh]">
                Monitoramento Geral - Todos os Sensores
              </h3>
              <div className="h-[calc(100%-2vh)]">
                <OverallChart sensors={sensors} />
              </div>
            </div>
          </>
        ) : (
          /* Detail View - Gráficos do Sensor Selecionado */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-[0.4vw] h-full px-0">
            {/* Sensor List - Sidebar */}
            <div className="lg:col-span-1 h-full">
              <SensorList 
                sensors={sensors}
                selectedSensorId={selectedSensorId}
                onSensorSelect={handleSensorSelect}
              />
            </div>

            {/* Charts Area */}
            <div className="lg:col-span-4 h-full flex flex-col gap-[0.2vh]">
              {selectedSensor && (
                <>
                  {/* Selected Sensor Info */}
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-[0.4vh] flex-shrink-0 h-[7vh]">
                    <div className="flex items-center justify-between h-full">
                      <div>
                        <h2 className="text-[2.2vw] lg:text-[1.8vw] xl:text-[1.4vw] font-semibold text-white">{selectedSensor.name}</h2>
                        <p className="text-gray-400 text-[1.4vw] lg:text-[1.1vw] xl:text-[0.9vw]">{selectedSensor.location}</p>
                      </div>
                      <div className="flex items-center gap-[0.8vw]">
                        <div className="text-right">
                          <div className="text-[3vw] lg:text-[2.4vw] xl:text-[2vw] font-bold text-white">
                            {selectedSensor.currentTemperature.toFixed(1)}°C
                          </div>
                          <div className="text-[1.2vw] lg:text-[1vw] xl:text-[0.8vw] text-gray-400">Temperatura Atual</div>
                        </div>
                        <StatusLED status={selectedSensor.status} size="lg" />
                      </div>
                    </div>
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-[0.3vw] flex-1 min-h-0 max-h-[60vh]">
                    {/* Real-time Chart */}
                    <div className="h-full max-h-[28vh]">
                      <TemperatureChart
                        data={selectedSensorId ? getAverageDataPoints(selectedSensorId, 'week', 30) : []}
                        title="Tempo Real - Últimas 100 Medições (30 pontos)"
                      />
                    </div>

                    {/* Status Pie Chart */}
                    <div className="h-full max-h-[28vh]">
                      <StatusPieChart
                        data={selectedSensorId ? getStatusStats(selectedSensorId, 'month') : { normal: { count: 0, percentage: 0 }, warning: { count: 0, percentage: 0 }, critical: { count: 0, percentage: 0 }, total: 0 }}
                        title="Status do Último Mês"
                      />
                    </div>

                    {/* Weekly Chart */}
                    <div className="h-full max-h-[28vh]">
                      <TemperatureChart
                        data={selectedSensorId ? getAverageDataPoints(selectedSensorId, 'week', 30) : []}
                        title="Última Semana"
                      />
                    </div>

                    {/* Monthly Chart */}
                    <div className="h-full max-h-[28vh]">
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
        )}
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