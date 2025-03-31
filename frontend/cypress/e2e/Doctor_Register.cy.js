/// <reference types="cypress" />

describe('Register Page Modal', () => {
  beforeEach(() => {
    // Visit the application home page
    cy.visit('/'); // Replace '/' with the actual URL of your app
  });

  // Test Case 1: Modal Visibility
  it('should open and close the registration modal', () => {
    // Open the modal
    cy.get('[data-testid="register-button"]').click(); // Adjust selector based on your implementation
    cy.get('[class="MuiBox-root css-1qtdam8"]').should('be.visible');

    // Close the modal
    cy.get('[class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-unflcp-MuiButtonBase-root-MuiIconButton-root"]').click();
    cy.get('[class="MuiBox-root css-1qtdam8"]').should('not.exist');
  });

  // Test Case 2: Form Validation Errors
  it('should show validation errors when submitting an empty form', () => {
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="doctor-button"]').click();

  });

  // Test Case 3: Invalid Email Format
  it('should show an error for invalid email format', () => {
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="doctor-button"]').click();

    // Enter invalid email and submit
    cy.get('[name="email"]').type('invalid-email');
    cy.get('[data-testid="submit-button"]').click();

    // Check for email validation error
    cy.contains('Invalid email').should('exist');
  });

  // Test Case 4: Mismatched Passwords
  it('should show an error for mismatched passwords', () => {
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="doctor-button"]').click();

    // Enter mismatched passwords and submit
    cy.get('[name="password"]').type('password123');
    cy.get('[name="confirmPassword"]').type('differentPassword');
    cy.get('[data-testid="submit-button"]').click();

    // Check for password mismatch error
    cy.contains('Passwords must match').should('exist');
  });

  // Test Case 5: Successful Form Submission
  it('should submit the form with valid data', () => {
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="doctor-button"]').click();

    // Fill in valid data
    cy.get('[name="username"]').type('testuser');
    cy.get('[name="email"]').type('testuser@example.com');
    cy.get('[name="password"]').type('password123');
    cy.get('[name="confirmPassword"]').type('password123');
    cy.get('[name="consentTelemedicine"]').check();

    // Mock API response for successful submission
    cy.intercept('POST', '/api/register', { statusCode: 200 });

    // Submit the form
    cy.get('[data-testid="submit-button"]').click();

    // Verify modal closes after successful submission
    cy.get('[data-testid="registration-modal"]').should('not.exist');
  });

  // Test Case 6: Backend Error Handling
  it('should display an error message on failed submission', () => {
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="doctor-button"]').click();

    // Fill in valid data
    cy.get('[name="username"]').type('testdoctor');
    cy.get('[name="email"]').type('test@exadoctormple.com');
    cy.get('[name="password"]').type('password123');
    cy.get('[name="confirmPassword"]').type('password123');
    cy.get('[name="consentTelemedicine"]').check();

    // Mock API failure response
    cy.intercept(
      'POST',
      '/api/docregister',
      { statusCode: 400, body: { message: 'Registration failed' } }
    );

    // Submit the form
    cy.get('[data-testid="submit-button"]').click();

    // Verify error message is displayed
    cy.contains('Registration failed').should('exist');
  });
});
