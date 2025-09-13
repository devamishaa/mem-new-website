import { WithI18n } from "@/app/components/lang/WithI18n";
import HomeView from "@/app/components/hero/home";
import { createMetadataGenerator } from "@/utils/meta/metadata-generator";

export const revalidate = 3600; // 1 hour - allows pricing updates
export const generateMetadata = createMetadataGenerator("home", "/home");

export default WithI18n(["home"], HomeView);
