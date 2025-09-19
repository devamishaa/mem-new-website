import { WithI18n } from "@/components/lang/WithI18n";
import HomeView from "@/views/home/HomeView";
import { createMetadataGenerator } from "@/utils/meta/metadata-generator";

export const revalidate = 3600; // 1 hour - allows pricing updates
export const generateMetadata = createMetadataGenerator("home", "/home");

export default WithI18n(["home"], HomeView);
