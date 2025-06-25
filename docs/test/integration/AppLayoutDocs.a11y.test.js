import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { createRenderer } from '@mui/internal-test-utils';



// ✅ Mock useRouter
import * as nextRouter from 'next/router';
nextRouter.useRouter = () => ({
  asPath: '/test-page',
  pathname: '/test-page',
  route: '/test-page',
  query: {},
  push: () => { },
});

// ✅ Imports
import AppLayoutDocs from 'docs/src/modules/components/AppLayoutDocs';
import PageContext from 'docs/src/modules/components/PageContext';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

describe('<AppLayoutDocs /> accessibility', () => {
  const { render } = createRenderer();

  it('should contain BackToTop inside a landmark element', () => {
    expect(() => {
      render(
        <CssVarsProvider>
          <PageContext.Provider
            value={{
              activePage: {},
              productIdentifier: { logo: '', logoSvg: '', wordmarkSvg: '' },
            }}
          >
            <AppLayoutDocs
              description="Test description"
              title="Test title"
              location="/test-page"
              toc={[]}
              disableToc={false}
              disableAd={true}
              disableLayout={false}
            >
              <div>Test content</div>
            </AppLayoutDocs>
          </PageContext.Provider>
        </CssVarsProvider>
      );
    }).not.toErrorDev();

    const backToTop = screen.getByRole('button', { name: /top/i });
    expect(backToTop).to.exist;

    const main = screen.getByRole('main');
    expect(main).to.contain(backToTop);
  });
});