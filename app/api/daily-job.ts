// pages/api/daily-job.js

import { createClient } from "@/utils/supabase/server";

const supabase = await createClient();

export async function GET() {
  const { error } = await supabase.from("tb_app_status").select().limit(1);

  if (error) {
    console.log("Erro ao acessar a API");
  } else {
    console.log("Aplicação de pé");
  }
}
