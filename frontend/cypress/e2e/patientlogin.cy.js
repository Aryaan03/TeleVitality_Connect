describe('Login Page Tests', () => {
  
    beforeEach(() => {
      // Open the login modal before each test
      cy.visit('/'); // Adjust URL if login is on a different route
      cy.get('button').contains('Login').click(); // Assuming a login button opens the modal
    });
  
    it('Displays the Login Modal Correctly', () => {
      // Check if modal title is visible
      cy.contains('Patient Login').should('be.visible');
  
      // Check if form fields are visible
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
  
      // Check if the login button is visible
      cy.get('button[type="submit"]').contains('Login').should('be.visible');
    });
  
    it('Shows Validation Errors for Empty Fields', () => {
      // Click the login button without filling the form
      cy.get('button[type="submit"]').contains('Login').click();
  
      // Check validation messages
      cy.contains('Required').should('be.visible');
    });
  
    it('Allows User to Enter Credentials', () => {
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('password123');
  
      // Verify input values
      cy.get('input[name="username"]').should('have.value', 'testuser');
      cy.get('input[name="password"]').should('have.value', 'password123');
    });
  
    it('Shows Error Message on Failed Login', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' },
      }).as('failedLogin');
  
      cy.get('input[name="username"]').type('wronguser');
      cy.get('input[name="password"]').type('wrongpass');
      cy.get('button[type="submit"]').contains('Login').click();
  
      // Wait for the request and check for error message
      cy.wait('@failedLogin');
      cy.contains('Login failed. Please try again.').should('be.visible');
    });
  
    it('Redirects to Profile on Successful Login', () => {
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: { token: 'fake-jwt-token' },
      }).as('successfulLogin');
  
      cy.get('input[name="username"]').type('correctuser');
      cy.get('input[name="password"]').type('correctpass');
      cy.get('button[type="submit"]').contains('Login').click();
  
      cy.wait('@successfulLogin');
  
      // Check if redirected to profile page
      cy.url().should('include', '/profile');
    });
  
  });
  