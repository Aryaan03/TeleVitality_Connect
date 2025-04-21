// src/pages/ProfilePage.test.jsx

import React from 'react';
import { render } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import { MemoryRouter } from 'react-router-dom';

describe('ProfilePage Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
  });
});
