import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  getBreakpoint,
  isMobileWidth,
  getResponsivePadding,
  ResponsiveContainer,
} from '../components/ResponsiveContainer';

describe('ResponsiveContainer helper functions', () => {
  /**
   * Verifies that getBreakpoint correctly categorizes screen widths into mobile, tablet, and desktop breakpoints.
   */
  it('correctly returns breakpoint for various viewport widths', () => {
    expect(getBreakpoint(375)).toBe('mobile');
    expect(getBreakpoint(767)).toBe('mobile');
    expect(getBreakpoint(768)).toBe('tablet');
    expect(getBreakpoint(1023)).toBe('tablet');
    expect(getBreakpoint(1024)).toBe('desktop');
    expect(getBreakpoint(1440)).toBe('desktop');
  });

  /**
   * Verifies that isMobileWidth returns true for mobile viewports (< 768px) and false otherwise.
   */
  it('identifies mobile viewports accurately', () => {
    expect(isMobileWidth(360)).toBe(true);
    expect(isMobileWidth(767)).toBe(true);
    expect(isMobileWidth(768)).toBe(false);
    expect(isMobileWidth(1280)).toBe(false);
  });

  /**
   * Verifies that getResponsivePadding returns appropriate CSS padding strings per breakpoint.
   */
  it('returns appropriate padding strings for different breakpoints', () => {
    expect(getResponsivePadding(400)).toBe('12px 16px');
    expect(getResponsivePadding(800)).toBe('20px 24px');
    expect(getResponsivePadding(1200)).toBe('24px 32px');
  });
});

describe('ResponsiveContainer Component', () => {
  /**
   * Verifies that ResponsiveContainer renders child elements and applies mobile breakpoint attributes when in mobile viewport.
   */
  it('renders children with mobile layout attributes when customWidth is mobile', () => {
    render(
      <ResponsiveContainer customWidth={375}>
        <p>Mobile Content</p>
      </ResponsiveContainer>
    );

    const content = screen.getByText('Mobile Content');
    expect(content).toBeDefined();

    const container = content.parentElement;
    expect(container?.getAttribute('data-breakpoint')).toBe('mobile');
    expect(container?.getAttribute('data-is-mobile')).toBe('true');
  });

  /**
   * Verifies that ResponsiveContainer renders children with desktop breakpoint attributes when in desktop viewport.
   */
  it('renders children with desktop layout attributes when customWidth is desktop', () => {
    render(
      <ResponsiveContainer customWidth={1200} maxWidth="900px">
        <p>Desktop Content</p>
      </ResponsiveContainer>
    );

    const content = screen.getByText('Desktop Content');
    expect(content).toBeDefined();

    const container = content.parentElement;
    expect(container?.getAttribute('data-breakpoint')).toBe('desktop');
    expect(container?.getAttribute('data-is-mobile')).toBe('false');
    expect(container?.style.maxWidth).toBe('900px');
  });
});
