describe('Simple Test', () => {
    it('Visits the homepage', () => {
      cy.visit('/');
      cy.contains('Welcome').should('be.visible'); // Replace "Welcome" with text from your homepage.
    });
  });
  