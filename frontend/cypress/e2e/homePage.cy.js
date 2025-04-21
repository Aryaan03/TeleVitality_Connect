describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the hero section with the heading and description', () => {
    cy.contains('Telemedicine that puts patients first').should('exist');
    cy.contains('Streamline your practice with our secure, intuitive telehealth platform designed for doctors and patients.').should('exist');
  });

  it('should have working CTA buttons', () => {
    cy.contains(/start free trial/i).should('exist');
    cy.contains(/watch demo/i).should('exist');
  });

  it('should display the navigation bar', () => {
    cy.contains(/home/i).should('exist');
    cy.contains(/features/i).should('exist');
    cy.contains(/how it works/i).should('exist');
    cy.contains(/pricing/i).should('exist');
    cy.contains(/testimonials/i).should('exist');
    cy.contains(/contact/i).should('exist');
  });
});
