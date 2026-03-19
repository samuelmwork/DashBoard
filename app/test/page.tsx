"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DebugPage() {
  const [report, setReport] = useState<any[]>([]);

  useEffect(() => {
    async function test() {
      const logs: any[] = [];
      logs.push("Starting test...");

      try {
        logs.push("Fetching from 'projects'...");
        const { data, error } = await supabase.from('projects').select('*');
        if (error) {
          logs.push({ status: "Error", error });
        } else {
          logs.push({ status: "Success", count: data?.length, data });
        }
      } catch (e: any) {
        logs.push({ status: "Crash", message: e.message });
      }

      setReport(logs);
    }
    test();
  }, []);

  return (
    <div className="p-10 font-mono text-sm bg-black text-green-500 overflow-auto h-screen">
      <h1>Supabase Connection Debug</h1>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  );
}
