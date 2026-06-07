import { NextResponse } from "next/server";

interface TempData {
    temperature: number;
    timestamp: string;
    status: string;
    ssid: string;
}

let latestTemperature: TempData | null = null;

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log("Data Suhu Diterima: ", data);
        
        latestTemperature = {
            temperature: data.temperature,
            timestamp: new Date().toISOString(),
            status: data.status || "running", // 'booting' atau 'running'
            ssid: data.ssid || "Tidak Diketahui"
        };
        return NextResponse.json({ status: "ok", receive: data });
    } catch (error) {
        return NextResponse.json({ status: "error", message: "Gagal memproses JSON" }, { status: 400 });
    }
}

export async function GET() {
    if (!latestTemperature) {
        return NextResponse.json(
            { status: "no data", temperature: null, timestamp: null, isOffline: true, ssid: null, deviceStatus: null },
            { status: 200 }
        );
    }

    // Hitung selisih waktu sekarang dengan data terakhir
    const lastUpdate = new Date(latestTemperature.timestamp).getTime();
    const now = new Date().getTime();
    
    // Jika lebih dari 25 detik tidak ada kiriman data baru, anggap alat sedang mati/restart
    const isOffline = (now - lastUpdate) > 25000; 

    return NextResponse.json({
        status: "ok",
        temperature: latestTemperature.temperature,
        timestamp: latestTemperature.timestamp,
        deviceStatus: latestTemperature.status,
        ssid: latestTemperature.ssid,
        isOffline: isOffline
    });
}