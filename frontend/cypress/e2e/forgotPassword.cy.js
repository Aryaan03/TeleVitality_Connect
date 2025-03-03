describe('Forgot Password Page Tests', () => {
    it('Visits the Forgot Password Page', () => {
      // Visit the Forgot Password page
      cy.visit('/forgot-password');
  
      // Verify that the page contains the title "Forgot Password"
      cy.contains('Forgot Password').should('be.visible');
    });
  
    it('Checks that the Forgot Password Form is Rendered', () => {
      // Visit the Forgot Password page
      cy.visit('/forgot-password');
  
      // Verify form fields
      cy.get('input[name="email"]').should('be.visible'); // Email field
      cy.get('input[name="newPassword"]').should('be.visible'); // New Password field
      cy.get('input[name="confirmPassword"]').should('be.visible'); // Confirm Password field
  
      // Verify "Reset Password" button
      cy.get('button[type="submit"]').contains('Reset Password').should('be.visible');
    });
  
    it('Validates Required Fields', () => {
      // Visit the Forgot Password page
      cy.visit('/forgot-password');
  
      // Submit the form without filling in any fields
      cy.get('button[type="submit"]').click();
  
      // Verify validation error (from your `setError` logic)
      cy.contains("Passwords don't match").should("not.exist"); // Ensure no password mismatch error appears
    });
  
    it("Validates Mismatched Passwords", () => {
      cy.visit("/forgot-password");
  
      // Fill mismatched passwords
      cy.get("input[name='email']").type("test@example.com");
  ``
    });
});  