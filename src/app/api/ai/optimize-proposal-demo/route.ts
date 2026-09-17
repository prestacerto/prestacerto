import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({error:"A demonstração foi encerrada. Use a reescrita de propostas com sua conta."},{status:410});
}
