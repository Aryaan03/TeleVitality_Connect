describe('Protected Page Redirect', () => {
    it('redirects to login when not authenticated', () => {
      cy.visit('/profile');
      cy.url().should('include', '/login');
    });
  });
  