import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SessionProvider } from '../../context/SessionContext';
import HomePage from '../HomePage';

const HomePageWrapper = () => (
  <MemoryRouter>
    <SessionProvider>
      <HomePage />
    </SessionProvider>
  </MemoryRouter>
);

describe('HomePage', () => {
  it('should render all three decks', () => {
    render(<HomePageWrapper />);
    
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Animals')).toBeInTheDocument();
    expect(screen.getByText('Verbs')).toBeInTheDocument();
  });

  it('should show Hindi Flashcards title', () => {
    render(<HomePageWrapper />);
    
    expect(screen.getByText('Hindi Flashcards')).toBeInTheDocument();
  });

  it('should show Statistics button', () => {
    render(<HomePageWrapper />);
    
    expect(screen.getByText(/Statistics/i)).toBeInTheDocument();
  });

  it('should show Study Mode and Quiz Mode buttons for each deck', () => {
    render(<HomePageWrapper />);
    
    const studyButtons = screen.getAllByText(/Study Mode/i);
    const quizButtons = screen.getAllByText(/Quiz Mode/i);
    
    expect(studyButtons).toHaveLength(3);
    expect(quizButtons).toHaveLength(3);
  });
});

