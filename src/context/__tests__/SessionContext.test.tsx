import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionProvider, useSession } from '../SessionContext';

const TestComponent = () => {
  const { wrongIds, addWrongCard, clearWrongCards } = useSession();
  
  return (
    <div>
      <div data-testid="wrong-count">{wrongIds.size}</div>
      <button onClick={() => addWrongCard('card1')}>Add Wrong</button>
      <button onClick={() => clearWrongCards()}>Clear</button>
    </div>
  );
};

describe('SessionContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide session context', () => {
    render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );
    
    expect(screen.getByTestId('wrong-count')).toHaveTextContent('0');
  });

  it('should add wrong card to session', () => {
    render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );
    
    const addButton = screen.getByText('Add Wrong');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('wrong-count')).toHaveTextContent('1');
  });

  it('should clear wrong cards', () => {
    render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );
    
    const addButton = screen.getByText('Add Wrong');
    const clearButton = screen.getByText('Clear');
    
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    expect(screen.getByTestId('wrong-count')).toHaveTextContent('1'); // Same card ID
    
    fireEvent.click(clearButton);
    expect(screen.getByTestId('wrong-count')).toHaveTextContent('0');
  });
});

