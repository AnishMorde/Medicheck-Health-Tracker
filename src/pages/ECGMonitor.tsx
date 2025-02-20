import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../lib/supabase";

export default function ECGMonitor() {
  const [data, setData] = useState<any[]>([]);
  const [latestValue, setLatestValue] = useState(0);

  // Function to fetch latest ECG data
  const fetchData = async () => {
    const { data: initialData, error } = await supabase
      .from("ecg_data")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching ECG data:", error);
      return;
    }

    if (initialData) {
      setData(initialData.reverse());
      setLatestValue(initialData[initialData.length - 1]?.value || 0);
    }
  };

  // Fetch data every second
  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 1000); // Fetch every second
    return () => clearInterval(interval);
  }, []);

  // Real-time Subscription
  useEffect(() => {
    const channel = supabase
      .channel("realtime:ecg_data")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ecg_data" },
        (payload) => {
          console.log("New ECG Data:", payload.new);
          setData((currentData) => {
            const newData = [...currentData.slice(-99), payload.new];
            setLatestValue(payload.new.value);
            return newData;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatus = (value: number) => {
    if (value < 60 || value > 100) return "critical";
    if (value < 65 || value > 95) return "warning";
    return "normal";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        ECG Monitor
      </h2>

      {/* Heart Rate Display */}
      <div className="mb-6">
        <div
          className={`p-4 rounded-lg shadow-lg text-white ${
            getStatus(latestValue) === "critical"
              ? "bg-red-600"
              : getStatus(latestValue) === "warning"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        >
          <h3 className="text-lg font-semibold">Heart Rate</h3>
          <p className="text-4xl font-bold">{latestValue} BPM</p>
          <p className="text-sm uppercase">{getStatus(latestValue)}</p>
        </div>
      </div>

      {/* ECG Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Real-time ECG
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <YAxis domain={[40, 120]} />
              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleString()}
                formatter={(value: number) => [`${value.toFixed(1)} BPM`, "Heart Rate"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
