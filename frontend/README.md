# FinanceFlow - Frontend

React-based frontend for FinanceFlow, a personal finance management application.

## Tech Stack

- **React 19** - Core framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Vitest** - Testing framework
- **React Testing Library** - Component testing utilities

## Project Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── TransactionList.jsx
│   ├── TransactionForm.jsx
│   ├── DeleteConfirmation.jsx
│   ├── Toast.jsx
│   ├── Dashboard.jsx
│   └── ...
├── pages/              # Page components
│   ├── Transactions.jsx (Full CRUD)
│   ├── Budgets.jsx (View only)
│   ├── Dashboard.jsx
│   └── ...
├── hooks/             # Custom React hooks
│   └── useTransactions.js
├── context/           # Context API state
│   └── AuthContext.jsx
├── utils/             # Utility functions
│   ├── api.js
│   └── logger.js
├── __tests__/         # Test files
│   ├── DeleteConfirmation.test.jsx
│   ├── Toast.test.jsx
│   ├── TransactionForm.test.jsx
│   └── setup.js
└── App.jsx            # Root component
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

## Testing

### Setup

Tests in this project use **Vitest** with **React Testing Library**.

All tests are located in `src/__tests__/` directory.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

Current test suite includes **19 comprehensive tests** across 3 key components:

#### DeleteConfirmation Component (6 tests)
- Modal rendering with transaction details
- Cancel button interaction
- Delete button confirmation
- Modal visibility toggle
- Loading state (disabled button)
- Close button interaction

**Coverage**: User interactions, confirmation flow, accessibility

#### Toast Component (6 tests)
- Success message rendering
- Error message rendering
- Info message rendering
- Close button callback
- Accessibility attributes (aria-live, aria-label)
- Long message handling

**Coverage**: Type variants, dismissal, accessibility compliance

#### TransactionForm Component (7 tests)
- Add mode rendering
- Edit mode with pre-filled data
- Modal hide when closed
- Close button callback
- Validation error messages
- Submit button disabled state during submission
- All form fields present with labels

**Coverage**: Form states, validation, submission, user interactions

### Testing Best Practices Implemented

1. **Descriptive Test Names** - Each test clearly describes what is being tested
2. **Single Responsibility** - One assertion per test where possible
3. **Accessibility Testing** - Tests verify ARIA labels and roles
4. **Mock Functions** - Uses `vi.fn()` for callbacks
5. **User Interactions** - Uses `userEvent` for realistic testing
6. **Setup Files** - Centralized test configuration
7. **Happy DOM** - Lightweight DOM implementation for fast tests

### Running Specific Tests

```bash
# Run only DeleteConfirmation tests
npm test DeleteConfirmation

# Run tests in watch mode
npm test -- --watch

# Run with verbose output
npm test -- --reporter=verbose
```

## Features Implemented

### ✅ Full CRUD for Transactions
- **Create**: Add new transactions via modal form
- **Read**: Display transactions in list with filtering
- **Update**: Edit existing transactions
- **Delete**: Delete with confirmation dialog (tested)

### ✅ Filtering & Sorting
- Filter by month and year
- Filter by category
- Filter by type (income/expense)
- Clear all filters

### ✅ User Feedback
- Success/error/info toast notifications
- Loading states
- Error messages

### ⚠️ Partial Implementation (Phase 2)
- **Budget**: View only (no edit/delete)
- **Credit Cards**: Placeholder UI
- **Emergency Fund**: Calculator only
- **Settings**: Placeholder UI

## API Configuration

Frontend connects to backend API at `http://localhost:5000/api`

Configure in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

See [backend README](../backend/README.md) for backend setup.

## Known Limitations

1. **Pagination**: Large transaction lists not paginated (handled by filtering for bootcamp scope)
2. **Charts**: Dashboard charts use placeholder data (Phase 2 feature)
3. **Offline Support**: No offline caching (Phase 2 feature)
4. **Dark Mode**: Not implemented (Phase 2 feature)

## Troubleshooting

### Tests fail with "Cannot find module"
```bash
npm install
npm run test -- --clearCache
```

### VITE_API_URL not found
Ensure `.env` file exists in frontend directory with proper API URL.

### Tailwind styles not applying
```bash
npm install --save-dev tailwindcss
npm run dev
```

## Next Steps

- [ ] Implement budget CRUD (Phase 2)
- [ ] Add comprehensive integration tests
- [ ] Implement offline support
- [ ] Add data visualization charts
- [ ] Dark mode support

---

**Last Updated**: February 15, 2026
**Test Coverage**: 19 tests across 3 components
**Status**: Production-ready for transaction management ✅
