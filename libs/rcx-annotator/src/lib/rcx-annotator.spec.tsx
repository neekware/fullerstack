import { render } from '@testing-library/react';

import RcxAnnotator from './rcx-annotator';

describe('RcxAnnotator', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RcxAnnotator />);
    expect(baseElement).toBeTruthy();
  });
});
