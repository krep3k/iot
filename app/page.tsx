"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await fetch("/api/temperature");
        const data = await response.json();
        setTemperature(data.temperature);
        setTimestamp(data.timestamp);
      } catch (error) {
        console.error("Gagal fetch Suhu: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemperature();
    const interval = setInterval(fetchTemperature, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (isoString: string | null) => {
    if(!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
      <main className="flex flex-col items-center gap-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Monitoring Suhu Air
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sensor: DS18B20 via ESP8266
          </p>
        </div>
        <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-2xl p-12 min-w-80 text-center">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-300">Memuat Data...</p>
          ) : temperature === null ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-500 dark:text-gray-300">Belum ada data</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Tunggu ESP8266 mengirim data suhu pertama kali...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-6xl font-bold text-blue-600 dark:text-cyan-400">
                  {temperature.toFixed(2)}
                </p>
                <p className="text-2xl text-gray-600 dark:text-gray-300 mt-2">
                  °C
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Update terakhir: 
                </p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {formatTime(timestamp)}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="text-center max-w-md">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Data diperbaharui setiap 5 detik
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Pastikan ESP sudah terhubung WiFi dan mengirim data ke:
            <br />
            <code className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-blue-600 dark:text-cyan-400">
              /api/temperature
            </code>
          </p>
        </div>
      </main>
    </div>
  )
}