import React from "react";
import { createMetadataGenerator } from "@/utils/meta/metadata-generator";

// Generate metadata for this page using the home key
export const generateMetadata = createMetadataGenerator("home");

export default function LangHomePage() {
  return <div>HomePage</div>;
}
