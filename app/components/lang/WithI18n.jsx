import TranslationWrapper from "@/contexts/TranslationWrapper";
import { loadNamespaces } from "@/utils/lang/loader";
import { ROUTING_CONFIG } from "@/configs/routing-config";

const SUPPORTED = new Set(ROUTING_CONFIG?.supportedLangs ?? ["en", "es"]);
const DEFAULT_LANG = "en";

/**
 * WithI18n(namespaces, PageComponent)
 * Usage: export default WithI18n(['common', 'landing-l5'], HomeView)
 */
export function WithI18n(namespaces, PageComponent) {
  return async function WrappedPage({ params }) {
    const resolvedParams = await params;
    const langParam = resolvedParams?.lang ?? DEFAULT_LANG;
    const lang = SUPPORTED.has(langParam) ? langParam : DEFAULT_LANG;

    let dicts;
    try {
      dicts = await loadNamespaces(lang, namespaces);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") throw err;
      // graceful fallback in prod
      dicts = await loadNamespaces(DEFAULT_LANG, namespaces);
    }

    return (
      <TranslationWrapper lang={lang} dicts={dicts}>
        <PageComponent lang={lang} />
      </TranslationWrapper>
    );
  };
}
