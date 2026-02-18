import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';

describe('StaggerContainer', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <StaggerContainer>
          <div data-testid="child">Test content</div>
        </StaggerContainer>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <StaggerContainer className="custom-class">
          <div>Content</div>
        </StaggerContainer>
      );

      const wrapper = screen.getByText('Content').parentElement;
      expect(wrapper?.className).toContain('custom-class');
    });

    it('renders multiple children', () => {
      render(
        <StaggerContainer>
          <StaggerItem>
            <span>First</span>
          </StaggerItem>
          <StaggerItem>
            <span>Second</span>
          </StaggerItem>
          <StaggerItem>
            <span>Third</span>
          </StaggerItem>
        </StaggerContainer>
      );

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });

  describe('StaggerDelay Prop', () => {
    it('accepts staggerDelay prop', () => {
      render(
        <StaggerContainer staggerDelay={0.2}>
          <div>Staggered content</div>
        </StaggerContainer>
      );

      expect(screen.getByText('Staggered content')).toBeInTheDocument();
    });

    it('accepts different stagger delays', () => {
      render(
        <StaggerContainer staggerDelay={0.5}>
          <div>Slow stagger</div>
        </StaggerContainer>
      );

      expect(screen.getByText('Slow stagger')).toBeInTheDocument();
    });
  });

  describe('Once Prop', () => {
    it('accepts once=true', () => {
      render(
        <StaggerContainer once={true}>
          <div>Animate once</div>
        </StaggerContainer>
      );

      expect(screen.getByText('Animate once')).toBeInTheDocument();
    });

    it('accepts once=false', () => {
      render(
        <StaggerContainer once={false}>
          <div>Animate repeatedly</div>
        </StaggerContainer>
      );

      expect(screen.getByText('Animate repeatedly')).toBeInTheDocument();
    });
  });

  describe('Amount Prop', () => {
    it('accepts amount prop', () => {
      render(
        <StaggerContainer amount={0.3}>
          <div>Custom amount</div>
        </StaggerContainer>
      );

      expect(screen.getByText('Custom amount')).toBeInTheDocument();
    });
  });

  describe('Combined Props', () => {
    it('accepts all props together', () => {
      render(
        <StaggerContainer
          staggerDelay={0.15}
          className="test-class"
          once={true}
          amount={0.2}
        >
          <div>Combined props</div>
        </StaggerContainer>
      );

      expect(screen.getByText('Combined props')).toBeInTheDocument();
      const wrapper = screen.getByText('Combined props').parentElement;
      expect(wrapper?.className).toContain('test-class');
    });
  });
});

describe('StaggerItem', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <StaggerItem>
          <div data-testid="item">Item content</div>
        </StaggerItem>
      );

      expect(screen.getByTestId('item')).toBeInTheDocument();
      expect(screen.getByText('Item content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <StaggerItem className="item-class">
          <div>Content</div>
        </StaggerItem>
      );

      const wrapper = screen.getByText('Content').parentElement;
      expect(wrapper?.className).toContain('item-class');
    });

    it('renders multiple children', () => {
      render(
        <StaggerItem>
          <span>First</span>
          <span>Second</span>
        </StaggerItem>
      );

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  describe('Integration with StaggerContainer', () => {
    it('works correctly inside StaggerContainer', () => {
      render(
        <StaggerContainer staggerDelay={0.1}>
          <StaggerItem>
            <div>Item 1</div>
          </StaggerItem>
          <StaggerItem>
            <div>Item 2</div>
          </StaggerItem>
          <StaggerItem>
            <div>Item 3</div>
          </StaggerItem>
        </StaggerContainer>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('preserves className on items in container', () => {
      render(
        <StaggerContainer className="container-class">
          <StaggerItem className="item-class">
            <div>Item</div>
          </StaggerItem>
        </StaggerContainer>
      );

      const item = screen.getByText('Item').parentElement;
      expect(item?.className).toContain('item-class');
    });
  });

  describe('Structure', () => {
    it('wraps content in a div', () => {
      render(
        <StaggerItem>
          <span data-testid="content">Test</span>
        </StaggerItem>
      );

      const content = screen.getByTestId('content');
      expect(content.parentElement?.tagName).toBe('DIV');
    });
  });
});
