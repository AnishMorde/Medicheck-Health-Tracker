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

  const fetchData = useCallback(async () => {
    console.log('Fetching latest sensor data...');
    try {
      const [
        { data: ecgData, error: ecgError },
        { data: spo2Data, error: spo2Error },
        { data: tempData, error: tempError }
      ] = await Promise.all([
        supabase.from('bpm_value').select('value').order('timestamp', { ascending: false }).limit(1),
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

  useEffect(() => {
    fetchData();

    const channel = supabase.channel('realtime-sensors')
      .on('postgres_changes', { event: 'INSERT', schema: 'public' }, () => {
        console.log('Realtime update received');
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return (
    <div className="p-4 md:p-6 max-w-full md:max-w-4xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4 md:mb-6">
        Real-time Health Monitor
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {sensorData &&
          [
            { 
              label: 'BPM', 
              value: sensorData.ecg, 
              max: 120, 
              condition: sensorData.ecg < 60 || sensorData.ecg > 100,
              unit: 'bpm'
            },
            { 
              label: 'SpO2', 
              value: sensorData.spo2, 
              max: 100, 
              condition: sensorData.spo2 < 95,
              unit: '%'
            },
            { 
              label: 'Temperature', 
              value: sensorData.temperature, 
              max: 42, 
              condition: sensorData.temperature < 36 || sensorData.temperature > 37.5,
              unit: '°C'
            },
          ].map(({ label, value, max, condition, unit }) => (
            <div 
              key={label}
              className="flex flex-col items-center bg-white p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
                {label}
              </h3>
              <div className="w-20 h-20 md:w-32 md:h-32">
                <CircularProgressbar
                  value={value}
                  maxValue={max}
                  text={`${value}${unit}`}
                  styles={{
                    root: { maxWidth: '100%' },
                    path: { 
                      stroke: condition ? '#ef4444' : '#10b981',
                      strokeLinecap: 'round',
                      transition: 'stroke-dashoffset 0.5s ease 0s' 
                    },
                    trail: {
                      stroke: '#e5e7eb',
                      strokeLinecap: 'round',
                    },
                    text: { 
                      fill: '#1f2937',
                      fontSize: window.innerWidth < 768 ? '14px' : '16px',
                      fontWeight: 600,
                    }
                  }}
                />
              </div>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                {condition ? 'Abnormal' : 'Normal'}
              </p>
            </div>
          ))}
      </div>

      <div className="mt-4 md:mt-6 space-y-3">
        <div className="p-3 md:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm md:text-base text-yellow-800">
            <span className="font-semibold">Recommendation:</span> {sensorData?.recommendation}
          </p>
        </div>
        
        <div className="p-3 md:p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm md:text-base text-red-800">
            <span className="font-semibold">Alert:</span> {sensorData?.alert}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CircularCharts;