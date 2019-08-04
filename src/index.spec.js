import React from 'react';
import { App } from './index';
import { render, fireEvent, cleanup, configure } from '@testing-library/react';

import MOCK_DATA from './mockData'

configure({
  testIdAttribute: 'testid'
});

function renderComponent(sdk) {
  return render(<App sdk={sdk} />);
}

const sdk = {
  field: {
    getValue: jest.fn(),
    onValueChanged: jest.fn(),
    setValue: jest.fn(),
    removeValue: jest.fn()
  },
  window: {
    startAutoResizer: jest.fn()
  }
};

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(cleanup);

  it('should read a value from field.getValue() and subscribe for external changes', () => {
    sdk.field.getValue.mockImplementation(() => MOCK_DATA);
    const { categories } = JSON.parse(MOCK_DATA)

    const { getByTestId } = renderComponent(sdk);

    const tests = categories.map((data, i) => getByTestId(`space-${i}`))

    expect(sdk.field.getValue).toHaveBeenCalled();


    // expect(sdk.field.onValueChanged).toHaveBeenCalled();

    tests.map((test, i) => {
        console.log(test.prop('category'))
        expect(test.props('category')).toEqual(categories[i]);
    })


  });

  it('should call starstartAutoResizer', () => {
    renderComponent(sdk);
    expect(sdk.window.startAutoResizer).toHaveBeenCalled();
  });

  // it('should call setValue on every change in input and removeValue when input gets empty', () => {
  //   const { getByTestId } = renderComponent(sdk);
  //
  //   fireEvent.change(getByTestId('my-field'), {
  //     target: { value: 'new-value' }
  //   });
  //
  //   expect(sdk.field.setValue).toHaveBeenCalledWith('new-value');
  //
  //   fireEvent.change(getByTestId('my-field'), {
  //     target: { value: '' }
  //   });
  //
  //   expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
  //   expect(sdk.field.removeValue).toHaveBeenCalledTimes(1);
  // });
});
