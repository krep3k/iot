import { NextResponse } from "next/server";
let latestTemperature: {temperature: number, timestamp: string} | null = null;

export async function POST(request:Request) {
    const data = await request.json();
    console.log("Data Suhu Diterima: ", data);
    latestTemperature = {
        temperature: data.temperature,
        timestamp: new Date().toISOString(),
    }
    return NextResponse.json({status: "ok", receive: data});
}

export async function GET() {
    if(!latestTemperature) {
        return NextResponse.json(
            {status: "no data", temperature: null, timestamp: null},
            {status: 200}
        );
    }
    return NextResponse.json({
        status: "ok",
        temperature: latestTemperature.temperature,
        timestamp: latestTemperature.timestamp,
    });
}