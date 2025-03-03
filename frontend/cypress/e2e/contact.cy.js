describe('Contact Page Tests', () => {
    it('Visits the Contact Page', () => {
      // Visit the Contact page
      cy.visit('/contact');
  
      // Verify that the page contains the title "Contact TeleVitality Connect"
      cy.contains('Contact TeleVitality Connect').should('be.visible');
    });
  
    it('Checks that the Contact Form is Rendered', () => {
      // Visit the Contact page
      cy.visit('/contact');
  
      // Verify that form fields are visible
      cy.get('input[name="name"]').should('be.visible'); // Full Name field
      cy.get('input[name="email"]').should('be.visible'); // Email field
      cy.get('input[name="subject"]').should('be.visible'); // Subject field
      cy.get('textarea[name="message"]').should('be.visible'); // Message field
  
      // Verify that the "Send Message" button is visible
      cy.get('button[type="submit"]').contains('Send Message').should('be.visible');
    });
  
    it('Checks Contact Information Section', () => {
      // Visit the Contact page
      cy.visit('/contact');
  
      // Verify that contact details are visible
      cy.contains('For Medical Emergencies').should('be.visible');
      cy.contains('+1 (352) 123-4567').should('be.visible'); // Phone number
      cy.contains('support@televitality.com').should('be.visible'); // Email address
      cy.contains('123 Reitz Union').should('be.visible'); // Address
    });
  });
  