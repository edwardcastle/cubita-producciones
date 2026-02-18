import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FadeIn from '@/components/ui/FadeIn';

describe('FadeIn', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <FadeIn>
          <div data-testid="child">Test content</div>
        </FadeIn>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <FadeIn className="custom-class">
          <div>Content</div>
        </FadeIn>
      );

      const wrapper = screen.getByText('Content').parentElement;
      expect(wrapper?.className).toContain('custom-class');
    });

    it('renders multiple children', () => {
      render(
        <FadeIn>
          <span>First</span>
          <span>Second</span>
          <span>Third</span>
        </FadeIn>
      );

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });

  describe('Direction Prop', () => {
    it('accepts direction="up"', () => {
      render(
        <FadeIn direction="up">
          <div>Up animation</div>
        </FadeIn>
      );

      expect(screen.getByText('Up animation')).toBeInTheDocument();
    });

    it('accepts direction="down"', () => {
      render(
        <FadeIn direction="down">
          <div>Down animation</div>
        </FadeIn>
      );

      expect(screen.getByText('Down animation')).toBeInTheDocument();
    });

    it('accepts direction="left"', () => {
      render(
        <FadeIn direction="left">
          <div>Left animation</div>
        </FadeIn>
      );

      expect(screen.getByText('Left animation')).toBeInTheDocument();
    });

    it('accepts direction="right"', () => {
      render(
        <FadeIn direction="right">
          <div>Right animation</div>
        </FadeIn>
      );

      expect(screen.getByText('Right animation')).toBeInTheDocument();
    });

    it('accepts direction="none"', () => {
      render(
        <FadeIn direction="none">
          <div>No direction</div>
        </FadeIn>
      );

      expect(screen.getByText('No direction')).toBeInTheDocument();
    });

    it('defaults to direction="up" when not specified', () => {
      render(
        <FadeIn>
          <div>Default direction</div>
        </FadeIn>
      );

      expect(screen.getByText('Default direction')).toBeInTheDocument();
    });
  });

  describe('Delay Prop', () => {
    it('accepts delay prop', () => {
      render(
        <FadeIn delay={0.5}>
          <div>Delayed content</div>
        </FadeIn>
      );

      expect(screen.getByText('Delayed content')).toBeInTheDocument();
    });

    it('accepts delay of 0', () => {
      render(
        <FadeIn delay={0}>
          <div>No delay</div>
        </FadeIn>
      );

      expect(screen.getByText('No delay')).toBeInTheDocument();
    });
  });

  describe('Duration Prop', () => {
    it('accepts duration prop', () => {
      render(
        <FadeIn duration={1}>
          <div>Long duration</div>
        </FadeIn>
      );

      expect(screen.getByText('Long duration')).toBeInTheDocument();
    });

    it('accepts short duration', () => {
      render(
        <FadeIn duration={0.2}>
          <div>Short duration</div>
        </FadeIn>
      );

      expect(screen.getByText('Short duration')).toBeInTheDocument();
    });
  });

  describe('Once Prop', () => {
    it('accepts once=true', () => {
      render(
        <FadeIn once={true}>
          <div>Animate once</div>
        </FadeIn>
      );

      expect(screen.getByText('Animate once')).toBeInTheDocument();
    });

    it('accepts once=false', () => {
      render(
        <FadeIn once={false}>
          <div>Animate repeatedly</div>
        </FadeIn>
      );

      expect(screen.getByText('Animate repeatedly')).toBeInTheDocument();
    });
  });

  describe('Amount Prop', () => {
    it('accepts amount prop', () => {
      render(
        <FadeIn amount={0.5}>
          <div>Custom amount</div>
        </FadeIn>
      );

      expect(screen.getByText('Custom amount')).toBeInTheDocument();
    });
  });

  describe('Combined Props', () => {
    it('accepts all props together', () => {
      render(
        <FadeIn
          direction="left"
          delay={0.3}
          duration={0.8}
          className="test-class"
          once={true}
          amount={0.3}
        >
          <div>Combined props</div>
        </FadeIn>
      );

      expect(screen.getByText('Combined props')).toBeInTheDocument();
      const wrapper = screen.getByText('Combined props').parentElement;
      expect(wrapper?.className).toContain('test-class');
    });
  });

  describe('Structure', () => {
    it('wraps content in a div', () => {
      render(
        <FadeIn>
          <span data-testid="content">Test</span>
        </FadeIn>
      );

      const content = screen.getByTestId('content');
      expect(content.parentElement?.tagName).toBe('DIV');
    });
  });
});
