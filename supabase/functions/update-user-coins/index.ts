import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get request body
    const { userId, newAmount, adminId } = await req.json();

    // Validate inputs
    if (!userId || typeof newAmount !== 'number' || !adminId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify the admin status of the requester
    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from("profiles")
      .select("is_admin")
      .eq("id", adminId)
      .single();

    if (adminError || !adminProfile?.is_admin) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - Admin privileges required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update the user's coins
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ coins: newAmount })
      .eq("id", userId)
      .select();

    if (error) {
      throw error;
    }

    // Log the transaction
    await supabaseAdmin.from("coin_transactions").insert({
      user_id: userId,
      admin_id: adminId,
      amount: newAmount,
      operation_type: "admin_update",
      notes: `Admin updated coins to ${newAmount}`
    });

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});