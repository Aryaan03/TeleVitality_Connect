describe('Navigation Bar', () => {
    it('shows navigation items on home page', () => {
      cy.visit('/');
      cy.contains('Home').should('exist');
      cy.contains('Features').should('exist');
      cy.contains('Pricing').should('exist');
    });
  });
  