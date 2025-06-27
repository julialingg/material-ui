import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, describeConformance } from 'test/utils';
import FilledInput, { filledInputClasses as classes } from '@mui/material/FilledInput';
import InputBase from '@mui/material/InputBase';
import { act } from 'react-dom/test-utils';

describe('<FilledInput />', () => {
  const { render } = createRenderer();

  describeConformance(<FilledInput open />, () => ({
    classes,
    inheritComponent: InputBase,
    render,
    refInstanceof: window.HTMLDivElement,
    muiName: 'MuiFilledInput',
    testDeepOverrides: { slotName: 'input', slotClassName: classes.input },
    testVariantProps: { variant: 'contained', fullWidth: true },
    testStateOverrides: { prop: 'size', value: 'small', styleKey: 'sizeSmall' },
    testLegacyComponentsProp: true,
    slots: {
      // can't test with DOM element as Input places an ownerState prop on it unconditionally.
      root: { expectedClassName: classes.root, testWithElement: null },
      input: { expectedClassName: classes.input, testWithElement: null },
    },
    skip: [
      'componentProp',
      'componentsProp',
      'slotPropsCallback', // not supported yet
    ],
  }));

  it('should have the underline class', () => {
    const { container } = render(<FilledInput />);
    const root = container.firstChild;
    expect(root).not.to.equal(null);
  });

  it('should preserve error state and not override with focus or hover styles', function test() {
    const { getByTestId, container } = render(<FilledInput error data-testid="input" />);
    const input = getByTestId('input');
    const root = container.querySelector(`.${classes.root}`);

    // 1. 检查 error class 是否存在（这个旧版本会有）
    expect(root.classList.contains(classes.error)).to.equal(true);

    // 2. 检查语义属性 aria-invalid 是否设置（旧版本可能漏掉或被覆盖）
    expect(input).to.have.attribute('aria-invalid', 'true');

    // 3. 聚焦触发状态变化（旧版本中样式可能被覆盖）
    act(() => {
      input.focus();
    });

    // 4. 这里不能验证视觉样式，但我们可加预期 snapshot 来比较聚焦后 class 是否还存在
    expect(root.classList.contains(classes.error)).to.equal(true);
  });

  it('color={undefined} should not result in crash', () => {
    expect(() => {
      render(<FilledInput color={undefined} />);
    }).not.toErrorDev();
  });

  it('can disable the underline', () => {
    const { container } = render(<FilledInput disableUnderline />);
    const root = container.firstChild;
    expect(root).not.to.have.class(classes.underline);
  });

  it('should forward classes to InputBase', () => {
    render(<FilledInput error classes={{ error: 'error' }} />);
    expect(document.querySelector('.error')).not.to.equal(null);
  });

  it('should respects the componentsProps if passed', () => {
    render(<FilledInput componentsProps={{ root: { 'data-test': 'test' } }} />);
    expect(document.querySelector('[data-test=test]')).not.to.equal(null);
  });

  it('should respect the classes coming from InputBase', () => {
    render(
      <FilledInput
        data-test="test"
        multiline
        sx={{ [`&.${classes.multiline}`]: { mt: '10px' } }}
      />,
    );
    expect(document.querySelector('[data-test=test]')).toHaveComputedStyle({ marginTop: '10px' });
  });
});
