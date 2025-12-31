'use client';

import { useState } from 'react';
import { Sensor, TemperatureReading } from '@/types/temperature';
import { Download, FileText, X, Calendar, CheckSquare, Square } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportGeneratorProps {
  sensors: Sensor[];
  extendedData: Record<string, TemperatureReading[]>;
  isOpen: boolean;
  onClose: () => void;
}

type ReportPeriod = '1month' | '3months' | '6months';

interface ReportOptions {
  period: ReportPeriod;
  includeCharts: boolean;
  includeTable: boolean;
  includeStats: boolean;
  selectedSensors: string[];
}

export default function ReportGenerator({ sensors, extendedData, isOpen, onClose }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    period: '1month',
    includeCharts: true,
    includeTable: true,
    includeStats: true,
    selectedSensors: sensors.map(s => s.id)
  });

  const periodLabels = {
    '1month': 'Último Mês',
    '3months': 'Últimos 3 Meses',
    '6months': 'Últimos 6 Meses'
  };

  const getFilteredData = (period: ReportPeriod) => {
    const now = new Date();
    const months = period === '1month' ? 1 : period === '3months' ? 3 : 6;
    const cutoff = new Date(now.getTime() - months * 30 * 24 * 60 * 60 * 1000);
    
    const filteredData: Record<string, TemperatureReading[]> = {};
    reportOptions.selectedSensors.forEach(sensorId => {
      if (extendedData[sensorId]) {
        filteredData[sensorId] = extendedData[sensorId].filter(
          reading => reading.timestamp >= cutoff
        );
      }
    });
    
    return filteredData;
  };

  const generateAverageData = (data: TemperatureReading[], pointsPerMonth: number = 120) => {
    if (data.length === 0) return [];
    
    const chunkSize = Math.ceil(data.length / pointsPerMonth);
    const averagedData = [];
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const avgTemp = chunk.reduce((sum, reading) => sum + reading.temperature, 0) / chunk.length;
      const timestamp = chunk[Math.floor(chunk.length / 2)].timestamp;
      
      averagedData.push({
        timestamp,
        temperature: Number(avgTemp.toFixed(1))
      });
    }
    
    return averagedData;
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF();
      const filteredData = getFilteredData(reportOptions.period);
      const selectedSensorData = sensors.filter(s => reportOptions.selectedSensors.includes(s.id));
      
      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(139, 92, 246); // Purple
      pdf.text('Relatório de Temperatura - Câmaras Frias', 20, 30);
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Período: ${periodLabels[reportOptions.period]}`, 20, 45);
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 55);
      
      let yPosition = 70;
      
      // Statistics
      if (reportOptions.includeStats) {
        pdf.setFontSize(16);
        pdf.setTextColor(139, 92, 246);
        pdf.text('Resumo Estatístico', 20, yPosition);
        yPosition += 15;
        
        const statsData = selectedSensorData.map(sensor => {
          const sensorData = filteredData[sensor.id] || [];
          const avgTemp = sensorData.length > 0 
            ? sensorData.reduce((sum, r) => sum + r.temperature, 0) / sensorData.length 
            : 0;
          const minTemp = sensorData.length > 0 
            ? Math.min(...sensorData.map(r => r.temperature)) 
            : 0;
          const maxTemp = sensorData.length > 0 
            ? Math.max(...sensorData.map(r => r.temperature)) 
            : 0;
          
          return [
            sensor.name,
            `${avgTemp.toFixed(1)}°C`,
            `${minTemp.toFixed(1)}°C`,
            `${maxTemp.toFixed(1)}°C`,
            sensorData.length.toString()
          ];
        });
        
        pdf.autoTable({
          startY: yPosition,
          head: [['Sensor', 'Temp. Média', 'Temp. Mín.', 'Temp. Máx.', 'Leituras']],
          body: statsData,
          theme: 'grid',
          headStyles: { fillColor: [139, 92, 246] },
          margin: { left: 20, right: 20 }
        });
        
        yPosition = (pdf as any).lastAutoTable.finalY + 20;
      }
      
      // Table with all readings
      if (reportOptions.includeTable) {
        // Check if we need a new page
        if (yPosition > 200) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(16);
        pdf.setTextColor(139, 92, 246);
        pdf.text('Tabela de Medições', 20, yPosition);
        yPosition += 15;
        
        // Get all unique timestamps
        const allTimestamps = new Set<string>();
        Object.values(filteredData).forEach(sensorData => {
          sensorData.forEach(reading => {
            allTimestamps.add(reading.timestamp.toISOString());
          });
        });
        
        const sortedTimestamps = Array.from(allTimestamps).sort();
        
        // Create table data (limit to first 100 rows for PDF size)
        const tableData = sortedTimestamps.slice(0, 100).map(timestamp => {
          const row = [new Date(timestamp).toLocaleString('pt-BR')];
          
          selectedSensorData.forEach(sensor => {
            const sensorData = filteredData[sensor.id] || [];
            const reading = sensorData.find(r => r.timestamp.toISOString() === timestamp);
            row.push(reading ? `${reading.temperature.toFixed(1)}°C` : '-');
          });
          
          return row;
        });
        
        const headers = ['Timestamp', ...selectedSensorData.map(s => s.name)];
        
        pdf.autoTable({
          startY: yPosition,
          head: [headers],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [139, 92, 246] },
          margin: { left: 20, right: 20 },
          styles: { fontSize: 8 }
        });
      }
      
      // Save PDF
      const fileName = `relatorio-temperatura-${reportOptions.period}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
      onClose();
    }
  };

  const toggleSensor = (sensorId: string) => {
    setReportOptions(prev => ({
      ...prev,
      selectedSensors: prev.selectedSensors.includes(sensorId)
        ? prev.selectedSensors.filter(id => id !== sensorId)
        : [...prev.selectedSensors, sensorId]
    }));
  };

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Configurar Relatório</h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Period Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  Período do Relatório
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(periodLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setReportOptions(prev => ({ ...prev, period: value as ReportPeriod }))}
                      className={`p-3 rounded-lg border text-sm ${
                        reportOptions.period === value
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Content Options */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  Conteúdo do Relatório
                </label>
                <div className="space-y-3">
                  {[
                    { key: 'includeStats', label: 'Estatísticas Resumidas' },
                    { key: 'includeTable', label: 'Tabela de Medições' },
                    { key: 'includeCharts', label: 'Gráficos (em desenvolvimento)' }
                  ].map(option => (
                    <button
                      key={option.key}
                      onClick={() => setReportOptions(prev => ({
                        ...prev,
                        [option.key]: !prev[option.key as keyof ReportOptions]
                      }))}
                      className="flex items-center gap-3 w-full p-3 rounded-lg bg-slate-50 border border-slate-300 hover:bg-slate-100 text-left"
                    >
                      {reportOptions[option.key as keyof ReportOptions] ? (
                        <CheckSquare className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                      <span className="text-slate-900">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sensor Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  Sensores Incluídos
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {sensors.map(sensor => (
                    <button
                      key={sensor.id}
                      onClick={() => toggleSensor(sensor.id)}
                      className="flex items-center gap-3 w-full p-3 rounded-lg bg-slate-50 border border-slate-300 hover:bg-slate-100 text-left"
                    >
                      {reportOptions.selectedSensors.includes(sensor.id) ? (
                        <CheckSquare className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                      <div>
                        <div className="text-slate-900 font-medium">{sensor.name}</div>
                        <div className="text-slate-600 text-sm">{sensor.location}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={generatePDF}
                disabled={isGenerating || reportOptions.selectedSensors.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Gerar PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}