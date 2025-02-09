// app/api/webhook/route.ts
import { NextResponse } from "next/server";

let walletAddress: string | null = null;

export async function POST(req: Request) {
  try {
    const { workerId, address } = await req.json();

    if (!workerId || !address) {
      return NextResponse.json(
        { success: false, error: "Missing workerId or address" },
        { status: 400 }
      );
    }

    console.log(
      `🔔 Webhook received a response from an agent. Input: ${address}; Worker: ${workerId}`
    );

    walletAddress = address;

    return NextResponse.json({ success: true, walletAddress: address });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Webhook GET to fetch the stored wallet address
export async function GET() {
  if (!walletAddress) {
    return NextResponse.json(
      { success: false, error: "Wallet address not available" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, walletAddress });
}
