"use client";

import dynamic from "next/dynamic";
const EditorClient = dynamic(() => import("./EditorClient"), { ssr: false });

// Re-export default agar import kamu tetap: `import NewsEditor from "@/components/news/Editor"`
export default EditorClient;
