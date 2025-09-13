import TranslationWrapper from "@/contexts/TranslationWrapper";
import { loadNamespaces } from "@/utils/lang/loader";
import { ROUTING_CONFIG } from "@/configs/routing-config";

const SUPPORTED = new Set(ROUTING_CONFIG?.supportedLangs ?? ["en", "es"]);
const DEFAULT_LANG = "en";

/**
 * WithLayoutI18n - Similar to WithI18n but for layout components
 * Loads translation namespaces for layout-level components like navbar
 */
export function WithLayoutI18n(namespaces, LayoutComponent) {
  return async function WrappedLayout(props) {
    const { params } = props;
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
        <LayoutComponent {...props} />
      </TranslationWrapper>
    );
  };
}
