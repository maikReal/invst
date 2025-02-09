import { NextRequest, NextResponse } from "next/server";

// Store agent responses: workerId -> walletAddress
const pendingResponses = new Map<string, string>();

/**
 * 📌 POST: Webhook receives agent response and stores the wallet address
 */
export async function POST(req: NextRequest) {
  try {
    const { workerId, agentResponse } = await req.json();

    if (!workerId || !agentResponse) {
      return NextResponse.json(
        { success: false, error: "Missing workerId or agentResponse" },
        { status: 400 }
      );
    }

    console.log(
      `🔔 Webhook received response. Worker: ${workerId}, Agent Response: ${agentResponse}`
    );

    // Store response for later retrieval
    pendingResponses.set(workerId, agentResponse);

    return NextResponse.json({
      success: true,
      message: "Wallet address stored",
    });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * 📌 GET: Retrieve wallet address for a given `workerId`
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workerId = searchParams.get("workerId");

  if (!workerId) {
    return NextResponse.json(
      { success: false, error: "workerId is required" },
      { status: 400 }
    );
  }

  if (!pendingResponses.has(workerId)) {
    return NextResponse.json(
      { success: false, error: "Wallet address not available yet" },
      { status: 404 }
    );
  }

  const agentResponse = pendingResponses.get(workerId);

  // Remove the stored wallet to prevent memory leaks
  pendingResponses.delete(workerId);

  console.log(
    `✅ Returning wallet address for worker ${workerId}: ${agentResponse}`
  );

  return NextResponse.json({ success: true, agentResponse });
}
