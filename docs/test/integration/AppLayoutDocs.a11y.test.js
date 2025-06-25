import * as React from 'react';
import { expect } from 'chai';
import { screen, createRenderer } from '@mui/internal-test-utils';

import AppLayoutDocs from 'docs/src/modules/components/AppLayoutDocs';

describe('<AppLayoutDocs /> accessibility', () => {
  const { render } = createRenderer();

  it('should contain BackToTop inside a landmark element', () => {
    render(<AppLayoutDocs location={{ pathname: '/' }} />);

    // 获取 aria-label 为 Scroll to top 的按钮或区域
    const backToTop = screen.getByLabelText('Scroll to top');
    expect(backToTop).to.exist;

    // 检查它是否在 <main> landmark 中
    const main = screen.getByRole('main');
    expect(main).to.contain(backToTop);
  });
});
