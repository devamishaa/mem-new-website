import LangSyncWrapper from "@/global/LangSyncWrapper";
import SSRLangWrapper from "@/contexts/SSRLangWrapper";
import NavbarContainer from "@/app/components/navbar/NavbarContainer";
import { WithLayoutI18n } from "@/app/components/lang/WithLayoutI18n";

async function LangLayoutInner({ children, params }) {
  const { lang } = await params;

  return (
    <SSRLangWrapper lang={lang}>
      <LangSyncWrapper lang={lang}>
        <NavbarContainer />
        {children}
      </LangSyncWrapper>
    </SSRLangWrapper>
  );
}

export default WithLayoutI18n(["navbar", "home"], LangLayoutInner);
