const mockState = vi.fn().mockReturnValue({ submitting: false, invalid: false });

vi.mock('react-final-form', () => ({
  Form: ({ onSubmit = () => {}, render = (_: unknown) => {} }) =>
    html` <div>${render({ handleSubmit: onSubmit, ...mockState() })}</div> `,
}));

import { html } from 'htm/preact';

import { AuthFormContainer } from '@src/components/AuthFormContainer';
import { render, screen, cleanup, fireEvent } from '@test/src/testUtils';

describe('AuthFormContainer', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render given title', async () => {
    render(html`<${AuthFormContainer} title="Test title" />`);

    expect(screen.getByText('Test title')).toBeInTheDocument();
  });

  it('should submit on submit button click', async () => {
    const onSubmit = vi.fn();

    render(html`<${AuthFormContainer} title="Test title" onSubmit=${onSubmit} />`);

    const submit = screen.getByRole('button', { name: 'Submit' });

    fireEvent.click(submit);

    expect(onSubmit).toHaveBeenCalled();
  });

  describe('form is in submitting state', () => {
    describe('form is in invalid state', () => {
      it('should render loading spinner', () => {
        mockState.mockReturnValueOnce({ submitting: true, invalid: true });

        render(html`<${AuthFormContainer} title="Test title" />`);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });

      it('should render disabled submit button', () => {
        mockState.mockReturnValueOnce({ submitting: true, invalid: true });

        render(html`<${AuthFormContainer} title="Test title" />`);

        expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
      });
    });

    describe('form is not in invalid state', () => {
      it('should render loading spinner', () => {
        mockState.mockReturnValueOnce({ submitting: true, invalid: false });

        render(html`<${AuthFormContainer} title="Test title" />`);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });

      it('should render disabled submit button', () => {
        mockState.mockReturnValueOnce({ submitting: true, invalid: false });

        render(html`<${AuthFormContainer} title="Test title" />`);

        expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
      });
    });
  });

  describe('form is not in submitting state', () => {
    describe('form is in invalid state', () => {
      it('should not render loading spinner', () => {
        mockState.mockReturnValueOnce({ submitting: false, invalid: true });

        render(html`<${AuthFormContainer} title="Test title" />`);

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      it('should render disabled submit button', () => {
        mockState.mockReturnValueOnce({ submitting: false, invalid: true });

        render(html`<${AuthFormContainer} title="Test title" />`);

        expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
      });
    });

    describe('form is not in invalid state', () => {
      it('should not render loading spinner', () => {
        render(html`<${AuthFormContainer} title="Test title" />`);

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      it('should render enabled submit button', () => {
        render(html`<${AuthFormContainer} title="Test title" />`);

        expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
      });
    });
  });
});
