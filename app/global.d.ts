import { Database as _SupabaseDB } from "@/lib/supabase-db";

declare global {
  type SupabaseDB = _SupabaseDB;
}
