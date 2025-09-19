
import LangSyncWrapper from '@/components/global/LangSyncWrapper';
import SSRLangWrapper from '@/contexts/SSRLangWrapper';
import NavbarContainer from '@/views/navigation/NavbarContainer';
import { WithLayoutI18n } from '@/components/lang/WithLayoutI18n';
import { NavbarThemeProvider } from '@/contexts/NavbarThemeContext';

async function LangLayoutInner({ children, params }) {
  const { lang } = await params;
  
  return (
    <SSRLangWrapper lang={lang}>
      <LangSyncWrapper lang={lang}>
        <NavbarThemeProvider>
          <NavbarContainer />
          {children}
        </NavbarThemeProvider>
      </LangSyncWrapper>
    </SSRLangWrapper>
  );
}

export default WithLayoutI18n(['navbar'], LangLayoutInner);