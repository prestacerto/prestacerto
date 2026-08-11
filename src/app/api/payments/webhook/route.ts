import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.json();
  const { data, type } = body;

  if (type === "payment") {
    const paymentId = data.id;
    const status = data.status;
    const externalReference = data.external_reference;

    const [userId, timestamp] = externalReference.split("-");

    if (status === "approved") {
      const { data: transaction } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("mercado_pago_id", paymentId)
        .single();

      if (transaction) {
        const { item_type, amount } = transaction;

        if (item_type === "connects") {
          const connectsMap: Record<string, number> = {
            "49": 10,
            "199": 50,
            "599": 200,
          };

          const connects = connectsMap[amount.toString()] || 0;

          await supabase.from("connect_transactions").insert({
            user_id: userId,
            connects_purchased: connects,
            price: amount,
            payment_method: "mercado_pago",
            status: "completed",
          });
        }

        // Update transaction status
        await supabase
          .from("payment_transactions")
          .update({ status: "completed" })
          .eq("id", transaction.id);
      }
    } else if (status === "rejected") {
      await supabase
        .from("payment_transactions")
        .update({ status: "failed" })
        .eq("mercado_pago_id", paymentId);
    }
  }

  return NextResponse.json({ success: true });
}
