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

type TimeRange = "live" | "5min" | "day" | "week" | "month" | "year" | "all";

export default function ECGMonitor() {
  const [data, setData] = useState<any[]>([]);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [latestValue, setLatestValue] = useState(0);
  const [timeRange, setTimeRange] = useState<TimeRange>("live");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to fetch latest 100 readings for live feed
  const fetchLiveData = async () => {
    const { data: latestData, error } = await supabase
      .from("ecg_data")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching live ECG data:", error);
      return;
    }

    if (latestData && latestData.length > 0) {
      // Reverse to get chronological order
      const chronologicalData = latestData.reverse();
      setLiveData(chronologicalData);
      setLatestValue(chronologicalData[chronologicalData.length - 1]?.value || 0);
    }
  };

  // Function to fetch historical data based on time range
  const fetchHistoricalData = async () => {
    if (timeRange === "live") return; // Don't fetch if we're in live mode
    
    setIsLoading(true);
    
    // Calculate the start time based on selected range
    const now = new Date();
    let startTime;
    
    switch(timeRange) {
      case "5min":
        startTime = new Date(now.getTime() - 5 * 60 * 1000);
        break;
      case "day":
        startTime = new Date(now);
        startTime.setHours(0, 0, 0, 0);
        break;
      case "week":
        startTime = new Date(now);
        startTime.setDate(now.getDate() - 7);
        break;
      case "month":
        startTime = new Date(now);
        startTime.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startTime = new Date(now);
        startTime.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        startTime = new Date(0); // Beginning of time for all data
        break;
      default:
        startTime = new Date(now.getTime() - 5 * 60 * 1000);
    }

    // Convert to ISO string for Supabase query
    const startTimeStr = startTime.toISOString();

    // Fetch data based on time range
    const { data: timeRangeData, error } = await supabase
      .from("ecg_data")
      .select("*")
      .gte("timestamp", startTimeStr)
      .order("timestamp", { ascending: true })
      .limit(1000); // Limit for historical views

    if (error) {
      console.error("Error fetching ECG data:", error);
      setIsLoading(false);
      return;
    }

    if (timeRangeData) {
      setData(timeRangeData);
    }
    
    setIsLoading(false);
  };

  // Initial fetch and set up live feed interval
  useEffect(() => {
    // Initial fetch for live data
    fetchLiveData();
    
    // Set up interval for live data (every 10ms as in original code)
    const liveInterval = setInterval(fetchLiveData, 10);
    
    return () => clearInterval(liveInterval);
  }, []);

  // Fetch historical data when time range changes
  useEffect(() => {
    fetchHistoricalData();
  }, [timeRange]);

  // Real-time Subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel("realtime:ecg_data")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ecg_data" },
        (payload) => {
          console.log("New ECG Data:", payload.new);
          
          // Update live data
          setLiveData((currentData) => {
            // Keep only the last 99 items and add the new one
            const newData = [...currentData.slice(-99), payload.new];
            setLatestValue(payload.new.value);
            return newData;
          });
          
          // Update historical data if we're viewing a time range that includes this new point
          if (timeRange !== "live") {
            const payloadTime = new Date(payload.new.timestamp).getTime();
            const now = new Date().getTime();
            
            // Add to historical data if within range
            if (timeRange === "5min" && payloadTime > now - 5 * 60 * 1000 ||
                timeRange === "day" && payloadTime > new Date().setHours(0, 0, 0, 0) ||
                timeRange === "week" && payloadTime > now - 7 * 24 * 60 * 60 * 1000 ||
                timeRange === "month" && payloadTime > now - 30 * 24 * 60 * 60 * 1000 ||
                timeRange === "year" && payloadTime > now - 365 * 24 * 60 * 60 * 1000 ||
                timeRange === "all") {
              setData(currentData => [...currentData, payload.new]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [timeRange]);

  const getStatus = (value: number) => {
    if (value < 60 || value > 100) return "critical";
    if (value < 65 || value > 95) return "warning";
    return "normal";
  };

  // Function to format X-axis ticks based on the selected time range
  const formatXAxisTick = (timestamp: string) => {
    const date = new Date(timestamp);
    
    switch(timeRange) {
      case "live":
      case "5min":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      case "day":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case "week":
        return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit' })}`;
      case "month":
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
      case "year":
        return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString();
    }
  };

  // Sample rate for different time ranges to avoid overcrowding the chart
  const getSampleRate = () => {
    switch(timeRange) {
      case "live": return 1;      // Show every point
      case "5min": return 1;      // Show every point
      case "day": return 4;       // Show every 4th point
      case "week": return 24;     // Show every 24th point
      case "month": return 48;    // Show every 48th point
      case "year": return 100;    // Show every 100th point
      default: return 1;
    }
  };

  // Filter data based on sample rate
  const sampledData = timeRange === "live" 
    ? liveData 
    : data.filter((_, index) => index % getSampleRate() === 0);

  // Determine which data to display based on current view
  const displayData = timeRange === "live" ? liveData : sampledData;

  // Get current time range label for download filename
  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case "live": return "LiveFeed";
      case "5min": return "Last5Minutes";
      case "day": return "Today";
      case "week": return "LastWeek";
      case "month": return "LastMonth";
      case "year": return "LastYear";
      case "all": return "AllTime";
      default: return "ECGData";
    }
  };

  // Function to download data
  const downloadData = async (format: 'csv' | 'json' | 'pdf') => {
    setIsDownloading(true);
    
    try {
      // Determine which data to download - use unsampledData for downloads
      const dataToDownload = timeRange === "live" ? liveData : data;
      
      // Format the data
      if (format === 'csv') {
        // Create CSV content
        const headers = "Timestamp,Heart Rate (BPM),Status\n";
        const csvContent = dataToDownload.map(row => {
          const timestamp = new Date(row.timestamp).toLocaleString();
          const status = getStatus(row.value);
          return `"${timestamp}",${row.value},${status}`;
        }).join("\n");
        
        // Create and download the file
        downloadFile(
          `ECG_Data_${getTimeRangeLabel()}_${new Date().toISOString().split('T')[0]}.csv`,
          headers + csvContent,
          'text/csv'
        );
      } 
      else if (format === 'json') {
        // Format JSON with additional analysis
        const enhancedData = dataToDownload.map(row => ({
          ...row,
          formattedTime: new Date(row.timestamp).toLocaleString(),
          status: getStatus(row.value)
        }));
        
        // Add summary statistics
        const summary = {
          timeRange: timeRange,
          dataPoints: enhancedData.length,
          averageHeartRate: enhancedData.reduce((sum, item) => sum + item.value, 0) / enhancedData.length,
          minHeartRate: Math.min(...enhancedData.map(item => item.value)),
          maxHeartRate: Math.max(...enhancedData.map(item => item.value)),
          startTime: enhancedData[0]?.formattedTime,
          endTime: enhancedData[enhancedData.length - 1]?.formattedTime,
          generatedAt: new Date().toLocaleString(),
          critical: enhancedData.filter(item => getStatus(item.value) === "critical").length,
          warning: enhancedData.filter(item => getStatus(item.value) === "warning").length,
          normal: enhancedData.filter(item => getStatus(item.value) === "normal").length
        };
        
        const exportData = {
          summary,
          data: enhancedData
        };
        
        // Create and download the file
        downloadFile(
          `ECG_Data_${getTimeRangeLabel()}_${new Date().toISOString().split('T')[0]}.json`,
          JSON.stringify(exportData, null, 2),
          'application/json'
        );
      }
      else if (format === 'pdf') {
        // For PDF, we'll use a simple approach that prompts the user to save 
        // what's displayed on screen as PDF using the browser's print functionality
        
        // Create a temporary element with formatted data
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
          <html>
            <head>
              <title>ECG Report for Doctor</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #2563eb; }
                .summary { background: #f8fafc; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f1f5f9; }
                .critical { color: red; }
                .warning { color: orange; }
                .normal { color: green; }
                .header { display: flex; justify-content: space-between; align-items: center; }
                .logo { font-weight: bold; font-size: 24px; color: #2563eb; }
                @media print {
                  button { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="logo">ECG Monitor</div>
                <div>
                  <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                  <p><strong>Patient ID:</strong> [Add patient ID]</p>
                </div>
              </div>
              <h1>ECG Report - ${timeRange === "live" ? "Live Feed" : 
                  timeRange === "5min" ? "Last 5 Minutes" : 
                  timeRange === "day" ? "Today" : 
                  timeRange === "week" ? "Last Week" : 
                  timeRange === "month" ? "Last Month" : 
                  timeRange === "year" ? "Last Year" : "All Time"}</h1>
              
              <div class="summary">
                <h2>Summary</h2>
                <p><strong>Data Points:</strong> ${dataToDownload.length}</p>
                <p><strong>Average Heart Rate:</strong> ${(dataToDownload.reduce((sum, item) => sum + item.value, 0) / dataToDownload.length).toFixed(1)} BPM</p>
                <p><strong>Min Heart Rate:</strong> ${Math.min(...dataToDownload.map(item => item.value))} BPM</p>
                <p><strong>Max Heart Rate:</strong> ${Math.max(...dataToDownload.map(item => item.value))} BPM</p>
                <p><strong>Start Time:</strong> ${new Date(dataToDownload[0]?.timestamp).toLocaleString()}</p>
                <p><strong>End Time:</strong> ${new Date(dataToDownload[dataToDownload.length - 1]?.timestamp).toLocaleString()}</p>
                <p><strong>Critical Readings:</strong> ${dataToDownload.filter(item => getStatus(item.value) === "critical").length}</p>
                <p><strong>Warning Readings:</strong> ${dataToDownload.filter(item => getStatus(item.value) === "warning").length}</p>
                <p><strong>Normal Readings:</strong> ${dataToDownload.filter(item => getStatus(item.value) === "normal").length}</p>
              </div>
              
              <h2>Data Table (Sample of Readings)</h2>
              <table>
                <tr>
                  <th>#</th>
                  <th>Timestamp</th>
                  <th>Heart Rate (BPM)</th>
                  <th>Status</th>
                </tr>
                ${dataToDownload.slice(0, 100).map((row, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${new Date(row.timestamp).toLocaleString()}</td>
                    <td>${row.value}</td>
                    <td class="${getStatus(row.value)}">${getStatus(row.value).toUpperCase()}</td>
                  </tr>
                `).join('')}
              </table>
              
              <p>This report is intended for medical professionals only.</p>
              <p>Please add to patient record ID: [Patient ID]</p>
              <p>Doctor's Notes:</p>
              <div style="border: 1px solid #ddd; padding: 15px; min-height: 150px;"></div>
              
              <script>
                window.onload = function() {
                  window.print();
                }
              </script>
            </body>
          </html>
        `;
        
        // Open a new window and print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(tempDiv.innerHTML);
          printWindow.document.close();
        } else {
          alert("Please allow popups to generate PDF report");
        }
      }
    } catch (error) {
      console.error("Error downloading data:", error);
      alert("Error downloading data. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to create and download a file
  const downloadFile = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        ECG Monitor
      </h2>

      {/* Time Range Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-lg ${timeRange === "live" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}
          onClick={() => setTimeRange("live")}
        >
          Live Feed
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${timeRange === "5min" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}
          onClick={() => setTimeRange("5min")}
        >
          Last 5 Minutes
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${timeRange === "day" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}
          onClick={() => setTimeRange("day")}
        >
          Today
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${timeRange === "week" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}
          onClick={() => setTimeRange("week")}
        >
          Last Week
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${timeRange === "month" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}
          onClick={() => setTimeRange("month")}
        >
          Last Month
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${timeRange === "year" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}
          onClick={() => setTimeRange("year")}
        >
          Last Year
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${timeRange === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}
          onClick={() => setTimeRange("all")}
        >
          All Time
        </button>
      </div>

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
          <p className="text-xs mt-1">Latest reading from real-time feed</p>
        </div>
      </div>

      {/* ECG Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {isLoading && timeRange !== "live" ? "Loading..." : 
              `ECG Data (${
                timeRange === "live" ? "Live Feed - Last 100 Readings" : 
                timeRange === "5min" ? "Last 5 Minutes" : 
                timeRange === "day" ? "Today" : 
                timeRange === "week" ? "Last Week" : 
                timeRange === "month" ? "Last Month" : 
                timeRange === "year" ? "Last Year" : "All Time"
              })`
            }
          </h3>
          
          {/* Download Buttons */}
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <div className="relative inline-block">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
                onClick={() => {
                  const dropdown = document.getElementById('downloadDropdown');
                  if (dropdown) {
                    dropdown.classList.toggle('hidden');
                  }
                }}
                disabled={isDownloading || displayData.length === 0}
              >
                {isDownloading ? 'Processing...' : 'Send to Doctor'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div id="downloadDropdown" className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 dark:bg-gray-700">
                <div className="py-1">
                  <button
                    onClick={() => { 
                      document.getElementById('downloadDropdown')?.classList.add('hidden');
                      downloadData('csv');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                    disabled={isDownloading}
                  >
                    Download as CSV
                  </button>
                  <button
                    onClick={() => {
                      document.getElementById('downloadDropdown')?.classList.add('hidden');
                      downloadData('json');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                    disabled={isDownloading}
                  >
                    Download as JSON
                  </button>
                  <button
                    onClick={() => {
                      document.getElementById('downloadDropdown')?.classList.add('hidden');
                      downloadData('pdf');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                    disabled={isDownloading}
                  >
                    Print Doctor's Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[400px]">
          {isLoading && timeRange !== "live" ? (
            <div className="flex h-full items-center justify-center">
              <p>Loading data...</p>
            </div>
          ) : displayData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p>No data available for the selected time range</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxisTick}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[40, 120]} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                  formatter={(value: number) => [`${value.toFixed(1)} BPM`, "Heart Rate"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={timeRange !== "live" && timeRange !== "5min"} // Only show dots for non-realtime views
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}