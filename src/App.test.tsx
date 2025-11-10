import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { test, expect } from 'vitest';
import App from './App';

test('renders learn react link', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const logoElement = screen.getByText(/LEVEL-UP GAMER/i);
  expect(logoElement).toBeInTheDocument();
});