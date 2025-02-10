import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { supabase } from '../lib/supabase';

interface SensorData {
  ecg: number;
  spo2: number;
  temperature: number;
  recommendation: string;
  alert: string;
}

const CircularCharts = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  // Function to fetch latest sensor data
  const fetchData = async () => {
    try {
      const { data: ecgData, error: ecgError } = await supabase
        .from('ecg_data')
        .select('value')
        .order('timestamp', { ascending: false })
        .limit(1);

      const { data: spo2Data, error: spo2Error } = await supabase
        .from('spo2_data')
        .select('value')
        .order('timestamp', { ascending: false })
        .limit(1);


      const { data: tempData, error: tempError } = await supabase
        .from('temperature_data')
        .select('value')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (ecgError || spo2Error || tempError) {
        console.error('Supabase error:', ecgError, spo2Error, tempError);
        return;
      }

      const ecgValue = ecgData?.[0]?.value || 0;
      const spo2Value = spo2Data?.[0]?.value || 0;
      const temperatureValue = tempData?.[0]?.value || 0;

      let recommendation = '';
      let alert = '';

      // Setting recommendations and alerts based on values
      if (ecgValue < 60) {
        alert += 'ECG indicates bradycardia. ';
        recommendation += 'Consult a healthcare provider. ';
      } else if (ecgValue > 100) {
        alert += 'ECG indicates tachycardia. ';
        recommendation += 'Monitor your heart rate. ';
      }

      if (spo2Value < 90) {
        alert += 'Low SpO2 detected. ';
        recommendation += 'Seek urgent medical care. ';
      } else if (spo2Value < 95) {
        recommendation += 'Consider consulting a healthcare provider. ';
      }

      if (temperatureValue > 100.4) {
        alert += 'High fever detected. ';
        recommendation += 'Monitor temperature and consult a doctor. ';
      } else if (temperatureValue < 95) {
        alert += 'Low body temperature detected. ';
        recommendation += 'Seek medical advice. ';
      }

      setSensorData({
        ecg: ecgValue,
        spo2: spo2Value,
        temperature: temperatureValue,
        recommendation: recommendation || 'Follow general health guidelines.',
        alert: alert || 'No critical alerts.',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch initial data and set up real-time subscription
  useEffect(() => {
    fetchData(); // Initial fetch

    const channel = supabase
      .channel('realtime:sensor_data')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ecg_data' }, fetchData)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'spo2_data' }, fetchData)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'temperature_data' }, fetchData)
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Real-time Sensor Data</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
        {sensorData &&
          [
            { label: 'ECG', value: sensorData.ecg, max: 120, condition: sensorData.ecg < 60 || sensorData.ecg > 100 },
            { label: 'SpO2', value: sensorData.spo2, max: 100, condition: sensorData.spo2 < 95 },
            { label: 'Temperature', value: sensorData.temperature, max: 42, condition: sensorData.temperature < 36 || sensorData.temperature > 37.5 },
          ].map(({ label, value, max, condition }) => (
            <div key={label} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{label}</h3>
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={value}
                  maxValue={max}
                  text={`${value}${label === 'SpO2' ? '%' : label === 'Temperature' ? '°C' : ''}`}
                  styles={{
                    path: { stroke: condition ? '#f00' : '#0f0', strokeWidth: 8 },
                    text: { fill: '#000', fontSize: '18px' },
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-100 rounded-md text-center">
        <strong>Recommendation:</strong> {sensorData?.recommendation}
      </div>
      
      <div className="mt-4 p-4 bg-red-100 rounded-md text-center">
        <strong>Alert:</strong> {sensorData?.alert}
      </div>
    </div>
  );
};

export default CircularCharts;
