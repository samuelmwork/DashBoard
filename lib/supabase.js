import { createClient } from '@supabase/supabase-js'

console.log("Supabase Client initializing with URL: sjhedzkncosqpdhuqvzb");
export const supabase = createClient(
  "https://sjhedzkncosqpdhuqvzb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqaGVkemtuY29zcXBkaHVxdnpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4Njc1ODgsImV4cCI6MjA4OTQ0MzU4OH0.3uXq3Iq4GnTMIwOVAv3UQyCGRhlh3t-x9FcUc1FtAuM"
)
