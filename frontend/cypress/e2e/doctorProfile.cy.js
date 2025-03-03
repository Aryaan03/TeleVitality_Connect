describe('Simple Test', () => {
    it('Visits /doctor/profile', () => {
      cy.visit('/doctor/profile');
      cy.contains('Contact').should('be.visible'); 
    });
  });
  