import { NextResponse } from "next/server";

/**
 * Retired legacy endpoint. It previously returned a fake Mercado Pago
 * preference and must never be used for a real payment.
 */
const unavailable = () => NextResponse.json({ error: "Not found" }, { status: 404 });

export const GET = unavailable;
export const POST = unavailable;
