// This file is used for custom Cypress commands.
// You can define reusable commands here and import them into your tests.

// Example: Custom login command
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  });
  