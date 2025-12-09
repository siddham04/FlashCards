import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FlipableCard from '../FlipableCard';
import { Card } from '../../types';

const mockCard: Card = {
  id: 'test-1',
  deckId: 'food',
  hindi: 'सेब',
  english: 'apple',
};

describe('FlipableCard', () => {
  it('should render Hindi side initially', () => {
    const onFlip = vi.fn();
    render(<FlipableCard card={mockCard} flipped={false} onFlip={onFlip} />);
    
    expect(screen.getByText('सेब')).toBeInTheDocument();
    expect(screen.getByText('Hindi')).toBeInTheDocument();
    // Both sides are in DOM but one is hidden via CSS transform
    expect(screen.getByText('apple')).toBeInTheDocument();
  });

  it('should render English side when flipped', () => {
    const onFlip = vi.fn();
    render(<FlipableCard card={mockCard} flipped={true} onFlip={onFlip} />);
    
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    // Both sides are in DOM but one is hidden via CSS transform
    expect(screen.getByText('सेब')).toBeInTheDocument();
  });

  it('should call onFlip when clicked', () => {
    const onFlip = vi.fn();
    render(<FlipableCard card={mockCard} flipped={false} onFlip={onFlip} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('should call onFlip when Enter key is pressed', () => {
    const onFlip = vi.fn();
    render(<FlipableCard card={mockCard} flipped={false} onFlip={onFlip} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('should call onFlip when Space key is pressed', () => {
    const onFlip = vi.fn();
    render(<FlipableCard card={mockCard} flipped={false} onFlip={onFlip} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  it('should have correct aria-label when not flipped', () => {
    const onFlip = vi.fn();
    render(<FlipableCard card={mockCard} flipped={false} onFlip={onFlip} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 'Hindi: सेब');
  });

  it('should have correct aria-label when flipped', () => {
    const onFlip = vi.fn();
    render(<FlipableCard card={mockCard} flipped={true} onFlip={onFlip} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 'English: apple');
  });
});

