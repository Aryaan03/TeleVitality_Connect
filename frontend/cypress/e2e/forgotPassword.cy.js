// cypress/e2e/forgotPassword.cy.js

describe('Forgot Password UI Smoke Test', () => {
  it('should display the forgot password modal and email input', () => {
    cy.visit('/');

    // Step 1: Open SIGN IN modal
    cy.contains('SIGN IN', { matchCase: false }).click();

    // Step 2: Open Patient Login
    cy.contains('Patient Login', { matchCase: false }).click();

    // Step 3: Open Forgot Password modal
    cy.contains('FORGOT PASSWORD?', { matchCase: false }).click();

    // Step 4: Check if modal title appears
    cy.contains('Forgot Password', { matchCase: false }).should('be.visible');

    // Step 5: Ensure email field and Send button are visible
    cy.get('input[name="email"], input[type="email"]').should('exist');
    cy.contains('Send Verification Code', { matchCase: false }).should('be.visible');
  });
});
