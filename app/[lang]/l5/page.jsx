import { WithI18n } from "@/app/components/lang/WithI18n";
import Landing5View from "@/components/landing/Landing5view";
import { createMetadataGenerator } from "@/utils/meta/metadata-generator";

export const revalidate = 3600; // 1 hour - allows pricing updates
export const generateMetadata = createMetadataGenerator("landing-l5", "/l5");

export default WithI18n(["landing-l5"], Landing5View);
