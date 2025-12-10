https://sidflashcards04.netlify.app/

# Hindi Flashcards App

A modern, interactive web application for learning Hindi vocabulary using flashcards. Built with React, TypeScript, Vite, and Tailwind CSS.


## Features

- 📚 **Study Mode**: Flip cards to learn Hindi words with smooth 3D animations
- 🎯 **Quiz Mode**: Test your knowledge with multiple choice or fill-in-the-blank questions
- 📊 **Statistics**: Track your progress with detailed statistics per deck and overall
- 🔄 **Redo Mode**: Review cards you got wrong in your current session
- 💾 **Persistent Stats**: Your progress is saved in browser localStorage
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- 📱 **Responsive**: Works beautifully on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Flashcards
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page components
├── context/          # React context providers
├── utils/            # Utility functions
├── data/             # Static data (decks)
├── types/            # TypeScript type definitions
└── test/             # Test setup files
```

## Decks

The app comes with three pre-loaded decks:

- **Food** (10 cards) - Learn Hindi food vocabulary
- **Animals** (10 cards) - Learn Hindi animal names
- **Verbs** (10 cards) - Learn Hindi verbs

## Usage

1. **Study Mode**: Click on a deck's "Study Mode" button, then click cards to flip them. Mark cards as Right or Wrong to track your progress.

2. **Quiz Mode**: Click on a deck's "Quiz Mode" button, choose Multiple Choice or Fill-in-the-Blank, and answer questions.

3. **Statistics**: View your progress by clicking the "Statistics" button on the home page.

4. **Redo Wrong Cards**: After studying, click "Redo Wrong Cards" to review only the cards you got wrong.

## Testing

Run the test suite:

```bash
npm run test
```

The test suite includes:
- Unit tests for utility functions (normalize, MCQ generation, shuffle)
- Component tests for FlipableCard and RightWrongButtons
- Integration tests for study flow

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Or connect your Git repository in Netlify dashboard

### Deploy to GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy": "npm run build && gh-pages -d dist"`
3. Run `npm run deploy`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

