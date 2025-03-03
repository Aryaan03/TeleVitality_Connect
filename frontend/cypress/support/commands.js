// This file is used for custom Cypress commands.
// You can define reusable commands here and import them into your tests.

// Example: Custom login command
Cypress.Commands.add('login', (username, password) => {
  cy.contains('Login').click();
  cy.contains('Login as Patient').click();
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});