import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RightWrongButtons from '../RightWrongButtons';

describe('RightWrongButtons', () => {
  it('should render both buttons', () => {
    const onRight = vi.fn();
    const onWrong = vi.fn();
    render(<RightWrongButtons onRight={onRight} onWrong={onWrong} />);
    
    expect(screen.getByText(/wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/right/i)).toBeInTheDocument();
  });

  it('should call onRight when Right button is clicked', () => {
    const onRight = vi.fn();
    const onWrong = vi.fn();
    render(<RightWrongButtons onRight={onRight} onWrong={onWrong} />);
    
    const rightButton = screen.getByLabelText(/mark as correct/i);
    fireEvent.click(rightButton);
    
    expect(onRight).toHaveBeenCalledTimes(1);
    expect(onWrong).not.toHaveBeenCalled();
  });

  it('should call onWrong when Wrong button is clicked', () => {
    const onRight = vi.fn();
    const onWrong = vi.fn();
    render(<RightWrongButtons onRight={onRight} onWrong={onWrong} />);
    
    const wrongButton = screen.getByLabelText(/mark as wrong/i);
    fireEvent.click(wrongButton);
    
    expect(onWrong).toHaveBeenCalledTimes(1);
    expect(onRight).not.toHaveBeenCalled();
  });

  it('should have aria-labels for accessibility', () => {
    const onRight = vi.fn();
    const onWrong = vi.fn();
    render(<RightWrongButtons onRight={onRight} onWrong={onWrong} />);
    
    expect(screen.getByLabelText(/mark as correct/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mark as wrong/i)).toBeInTheDocument();
  });
});

