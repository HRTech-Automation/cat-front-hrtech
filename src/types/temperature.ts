export interface TemperatureReading {
  id: string;
  sensorId: string;
  temperature: number;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

export interface Sensor {
  id: string;
  name: string;
  location: string;
  currentTemperature: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdate: Date;
}

export interface TemperatureAlert {
  id: string;
  sensorId: string;
  message: string;
  severity: 'warning' | 'critical';
  timestamp: Date;
}