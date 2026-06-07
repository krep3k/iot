"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<string | null>(null);
  const [ssid, setSsid] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await fetch("/api/temperature");
        const data = await response.json();
        
        if (data.status === "ok") {
          setTemperature(data.temperature);
          setTimestamp(data.timestamp);
          setDeviceStatus(data.deviceStatus);
          setSsid(data.ssid);
          setIsOffline(data.isOffline);
        } else {
          setIsOffline(true);
        }
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
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
      <main className="flex flex-col items-center gap-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Monitoring Suhu Air
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sensor: DS18B20 via ESP8266
          </p>
          {ssid && !isOffline && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Alat terhubung ke WiFi: <span className="font-bold underline">{ssid}</span>
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-2xl p-12 min-w-80 text-center">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-300">Memuat Data...</p>
          ) : isOffline ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mb-1"></div>
              <p className="text-red-500 dark:text-red-400 font-semibold text-lg">
                Alat Terputus / Memulai Ulang...
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs">
                Tidak ada data masuk dari ESP8266. Kemungkinan alat sedang mati, baru di-upload firmware, atau sedang mencoba menyambung ke WiFi.
              </p>
            </div>
          ) : (
            <>
              {deviceStatus === "booting" && (
                <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs px-3 py-2 rounded-lg mb-4 font-medium border border-amber-200 dark:border-amber-900 animate-bounce">
                  🔄 Alat baru saja dinyalakan / di-reset!
                </div>
              )}
              <div className="mb-4">
                <p className="text-6xl font-bold text-blue-600 dark:text-cyan-400">
                  {temperature !== null ? temperature.toFixed(2) : "0.00"}
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
        </div>
      </main>
    </div>
  );
}