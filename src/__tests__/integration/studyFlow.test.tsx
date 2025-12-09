import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from '../../context/SessionContext';
import StudyPage from '../../pages/StudyPage';
import * as storageModule from '../../utils/storage';

// Mock the storage module
vi.spyOn(storageModule, 'updateStatsForAnswer').mockImplementation(() => {});

const StudyPageWrapper = ({ deckId = 'food' }: { deckId?: string }) => (
  <MemoryRouter initialEntries={[`/study/${deckId}`]}>
    <SessionProvider>
      <Routes>
        <Route path="/study/:deckId" element={<StudyPage />} />
      </Routes>
    </SessionProvider>
  </MemoryRouter>
);

describe('Study Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render study page and show card', async () => {
    render(<StudyPageWrapper />);
    
    // Wait for card to load - check for Hindi text or card count
    await waitFor(() => {
      const hindiText = screen.queryByText(/सेब|रोटी|पनीर|अंडा/i);
      const cardCount = screen.queryByText(/Card \d+ of \d+/i);
      expect(hindiText || cardCount).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should flip card when clicked', async () => {
    render(<StudyPageWrapper />);
    
    await waitFor(() => {
      const card = screen.queryByRole('button', { name: /Hindi:/i });
      expect(card).toBeInTheDocument();
    }, { timeout: 5000 });

    const card = screen.getByRole('button', { name: /Hindi:/i });
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/English/i)).toBeInTheDocument();
    });
  });

  it('should update stats when marking wrong', async () => {
    render(<StudyPageWrapper />);
    
    await waitFor(() => {
      const card = screen.queryByRole('button', { name: /Hindi:/i });
      expect(card).toBeInTheDocument();
    }, { timeout: 5000 });

    // Flip card
    const card = screen.getByRole('button', { name: /Hindi:/i });
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByLabelText(/mark as wrong/i)).toBeInTheDocument();
    });

    // Click Wrong button
    const wrongButton = screen.getByLabelText(/mark as wrong/i);
    fireEvent.click(wrongButton);

    // Verify stats were updated
    expect(storageModule.updateStatsForAnswer).toHaveBeenCalledWith('food', false);
  });

  it('should update stats when marking right', async () => {
    render(<StudyPageWrapper />);
    
    await waitFor(() => {
      const card = screen.queryByRole('button', { name: /Hindi:/i });
      expect(card).toBeInTheDocument();
    }, { timeout: 5000 });

    // Flip card
    const card = screen.getByRole('button', { name: /Hindi:/i });
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByLabelText(/mark as correct/i)).toBeInTheDocument();
    });

    // Click Right button
    const rightButton = screen.getByLabelText(/mark as correct/i);
    fireEvent.click(rightButton);

    // Verify stats were updated
    expect(storageModule.updateStatsForAnswer).toHaveBeenCalledWith('food', true);
  });
});

