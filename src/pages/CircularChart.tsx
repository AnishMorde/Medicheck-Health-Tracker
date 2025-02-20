import React, { useEffect, useState, useCallback } from 'react';
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

  // Memoized fetch function with proper error handling
  const fetchData = useCallback(async () => {
    console.log('Fetching latest sensor data...');
    try {
      const [
        { data: ecgData, error: ecgError },
        { data: spo2Data, error: spo2Error },
        { data: tempData, error: tempError }
      ] = await Promise.all([
        supabase.from('ecg_data').select('value').order('timestamp', { ascending: false }).limit(1),
        supabase.from('spo2_data').select('value').order('timestamp', { ascending: false }).limit(1),
        supabase.from('temperature_data').select('value').order('timestamp', { ascending: false }).limit(1)
      ]);

      if (ecgError || spo2Error || tempError) {
        throw new Error(`Supabase errors: ${ecgError?.message} ${spo2Error?.message} ${tempError?.message}`);
      }

      const processData = (): SensorData => {
        const ecgValue = ecgData?.[0]?.value || 0;
        const spo2Value = spo2Data?.[0]?.value || 0;
        const temperatureValue = tempData?.[0]?.value || 0;

        let recommendation = '';
        let alert = '';

        // ECG logic
        if (ecgValue < 60) {
          alert += 'ECG indicates bradycardia. ';
          recommendation += 'Consult a healthcare provider. ';
        } else if (ecgValue > 100) {
          alert += 'ECG indicates tachycardia. ';
          recommendation += 'Monitor your heart rate. ';
        }

        // SpO2 logic
        if (spo2Value < 90) {
          alert += 'Low SpO2 detected. ';
          recommendation += 'Seek urgent medical care. ';
        } else if (spo2Value < 95) {
          recommendation += 'Consider consulting a healthcare provider. ';
        }

        // Temperature logic
        if (temperatureValue > 100.4) {
          alert += 'High fever detected. ';
          recommendation += 'Monitor temperature and consult a doctor. ';
        } else if (temperatureValue < 95) {
          alert += 'Low body temperature detected. ';
          recommendation += 'Seek medical advice. ';
        }

        return {
          ecg: ecgValue,
          spo2: spo2Value,
          temperature: temperatureValue,
          recommendation: recommendation || 'Follow general health guidelines.',
          alert: alert || 'No critical alerts.',
        };
      };

      setSensorData(processData());
    } catch (error) {
      console.error('Data fetch error:', error);
    }
  }, []);

  // Real-time updates setup
  useEffect(() => {
    // Initial fetch
    fetchData();

    // Setup real-time listeners
    const tables = ['ecg_data', 'spo2_data', 'temperature_data'];
    const channel = supabase.channel('realtime-sensors')
      .on('postgres_changes', { event: 'INSERT', schema: 'public' }, (payload) => {
        console.log('Realtime update:', payload.table);
        fetchData(); // Refresh data on any insert
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]); // Add fetchData to dependency array

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