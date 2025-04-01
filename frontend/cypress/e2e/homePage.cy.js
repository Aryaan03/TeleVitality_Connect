describe('TeleVitality Homepage', () => {
  beforeEach(() => {
    cy.visit('/'); // Assuming your homepage is at the root
  });

  it('should load the homepage successfully', () => {
    cy.title().should('include', 'TeleVitality'); // Adjust based on your actual page title
  });

  it('should display the hero section with main heading', () => {
    cy.get('h1').should('contain', 'Telemedicine that puts patients first');
  });

  it('should have a working "Start Free Trial" button', () => {
    cy.contains('Start Free Trial').click();
    // Assuming the button triggers some action - adjust assertion accordingly
    // For example, if it opens a modal:
    // cy.get('[role="dialog"]').should('be.visible');
    // Or if it navigates:
    // cy.url().should('include', '/signup');
  });

  it('should display the features section', () => {
    cy.contains('Why Choose Us?').scrollIntoView();
    cy.contains('Revolutionizing Healthcare Delivery');
    cy.get('[data-testid="feature-card"]').should('have.length.at.least', 3); // Add data-testid to your feature cards
  });

  it('should show the pricing plans', () => {
    cy.contains('Simple Pricing').scrollIntoView();
    cy.contains('Affordable Plans for Everyone');
    cy.get('[data-testid="pricing-card"]').should('have.length', 3); // Add data-testid to your pricing cards
    cy.contains('Basic').should('be.visible');
    cy.contains('Premium').should('be.visible');
    cy.contains('Family').should('be.visible');
  });

  it('should display testimonials', () => {
    cy.contains('Success Stories').scrollIntoView();
    cy.get('[data-testid="testimonial-card"]').should('have.length.at.least', 1); // Add data-testid to testimonial cards
  });

  });;