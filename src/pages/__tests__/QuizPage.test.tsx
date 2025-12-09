import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '../../context/SessionContext';
import QuizPage from '../QuizPage';
import * as storageModule from '../../utils/storage';

vi.spyOn(storageModule, 'updateStatsForAnswer').mockImplementation(() => {});

const QuizPageWrapper = ({ deckId = 'food' }: { deckId?: string }) => (
  <MemoryRouter initialEntries={[`/quiz/${deckId}`]}>
    <SessionProvider>
      <Routes>
        <Route path="/quiz/:deckId" element={<QuizPage />} />
      </Routes>
    </SessionProvider>
  </MemoryRouter>
);

describe('QuizPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should show mode selection screen initially', () => {
    render(<QuizPageWrapper />);
    
    expect(screen.getByText(/Choose your quiz mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Multiple Choice/i)).toBeInTheDocument();
    expect(screen.getByText(/Fill in the Blank/i)).toBeInTheDocument();
  });

  it('should start multiple choice quiz when selected', async () => {
    render(<QuizPageWrapper />);
    
    const mcqButton = screen.getByText(/Multiple Choice/i);
    fireEvent.click(mcqButton);

    await waitFor(() => {
      expect(screen.getByText(/Hindi word/i)).toBeInTheDocument();
    });
  });

  it('should start fill-in-blank quiz when selected', async () => {
    render(<QuizPageWrapper />);
    
    const fillInButton = screen.getByText(/Fill in the Blank/i);
    fireEvent.click(fillInButton);

    await waitFor(() => {
      expect(screen.getByText(/Hindi word/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Type the English translation/i)).toBeInTheDocument();
    });
  });
});

