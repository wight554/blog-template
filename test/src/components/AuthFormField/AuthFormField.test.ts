const mockMeta = vi.fn().mockReturnValue({ touched: false, error: false });

vi.mock('react-final-form', () => ({
  Field: ({ name = '', type = '', children = (_: unknown) => {} }) =>
    html` <div>${children({ input: { name, type }, meta: mockMeta() })}</div> `,
}));

import { html } from 'htm/preact';

import { AuthFormField } from '#src/components/AuthFormField/index.js';
import { render, screen, cleanup } from '#test/src/testUtils/index.js';

describe('AuthFormField', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('field is in error state', () => {
    describe('field is in touched state', () => {
      it('should render text field with given name', async () => {
        render(
          html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`,
        );

        expect(await screen.findByLabelText('Test label')).toHaveAttribute('name', 'test');
      });

      it('should render text field with given type', async () => {
        render(
          html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`,
        );

        expect(await screen.findByLabelText('Test label')).toHaveAttribute('type', 'text');
      });

      it('should render helper text with error', async () => {
        mockMeta.mockReturnValueOnce({ error: 'Test error', touched: true });

        render(
          html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`,
        );

        expect(screen.getByText('Test error')).toBeInTheDocument();
      });

      it('should have aria invalid attribute set to "true"', async () => {
        mockMeta.mockReturnValueOnce({ error: 'Test error', touched: true });

        render(
          html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`,
        );

        expect(await screen.findByLabelText('Test label')).toHaveAttribute('aria-invalid', 'true');
      });
    });

    describe('field is not in touched state', () => {
      it('should render text field with given name', async () => {
        render(
          html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`,
        );

        expect(await screen.findByLabelText('Test label')).toHaveAttribute('name', 'test');
      });

      it('should render text field with given type', async () => {
        render(
          html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`,
        );

        expect(await screen.findByLabelText('Test label')).toHaveAttribute('type', 'text');
      });

      it('should not render helper text with error', async () => {
        mockMeta.mockReturnValueOnce({ error: 'Test error', touched: false });

        render(
          html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`,
        );

        expect(screen.queryByText('Test error')).not.toBeInTheDocument();
      });

      it('should have aria invalid attribute set to "true"', async () => {
        mockMeta.mockReturnValueOnce({ error: 'Test error', touched: true });

        render(
          html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`,
        );

        expect(await screen.findByLabelText('Test label')).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('field is not in error state', () => {
    it('should render text field with given name', async () => {
      render(html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`);

      expect(await screen.findByLabelText('Test label')).toHaveAttribute('name', 'test');
    });

    it('should render text field with given type', async () => {
      render(html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`);

      expect(await screen.findByLabelText('Test label')).toHaveAttribute('type', 'text');
    });

    it('should have aria invalid attribute set to "false"', async () => {
      render(html`<${AuthFormField} name="test" type="text" label="Test label" id="test-input" />`);

      expect(await screen.findByLabelText('Test label')).toHaveAttribute('aria-invalid', 'false');
    });
  });
});
