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

export default function TemperatureMonitor() {
  const [data, setData] = useState<any[]>([]);
  const [latestValue, setLatestValue] = useState(0);

  // Function to fetch latest temperature data
  const fetchData = async () => {
    const { data: initialData, error } = await supabase
      .from("temperature_data")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching temperature data:", error);
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
      .channel("realtime:temperature_data")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "temperature_data" },
        (payload) => {
          console.log("New Temperature Data:", payload.new);
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
    if (value < 35 || value > 38) return "critical";
    if (value < 36.1 || value > 37.2) return "warning";
    return "normal";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Temperature Monitor
      </h2>

      {/* Temperature Display */}
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
          <h3 className="text-lg font-semibold">Body Temperature</h3>
          <p className="text-4xl font-bold">{latestValue} °C</p>
          <p className="text-sm uppercase">{getStatus(latestValue)}</p>
        </div>
      </div>

      {/* Temperature Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Real-time Temperature Data
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <YAxis domain={[34, 39]} />
              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleString()}
                formatter={(value: number) => [`${value.toFixed(1)} °C`, "Temperature"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#dc2626"
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
