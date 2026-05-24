import { NextResponse } from "next/server";

export async function POST(request:Request) {
    const data = await request.json();
    console.log("Data Suhu Diterima: ", data);
    return NextResponse.json({status: "ok", receive: data});
}