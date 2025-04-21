describe('Patient Register Modal', () => {
    it('opens register modal from homepage', () => {
      cy.visit('/');
      cy.get('[data-testid="register-button"]').click();
      cy.contains('Patient Register').should('exist');
    });
  });
  