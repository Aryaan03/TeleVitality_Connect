describe('Doctor Login Page', () => {
    beforeEach(() => {
      cy.visit('/doctor-login'); // Adjust based on your routing
    });
  
    it('should open the login modal', () => {
      cy.get('[data-testid="doctor-login-modal"]').should('be.visible');
    });
  
    it('should show validation errors for empty fields', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('Required').should('exist'); // Checks for required field errors
    });
  
    it('should show error on incorrect login', () => {
      cy.get('input[name="username"]').type('wronguser');
      cy.get('input[name="password"]').type('wrongpass');
      
      cy.intercept('POST', '**/doclogin', {
        statusCode: 401,
        body: { message: 'Invalid credentials' },
      }).as('failedLogin');
  
      cy.get('button[type="submit"]').click();
      cy.wait('@failedLogin');
  
      cy.contains('Login failed. Please try again.').should('exist');
    });
  
    it('should login successfully and redirect', () => {
      cy.get('input[name="username"]').type('testdoctor');
      cy.get('input[name="password"]').type('TestPass123');
  
      cy.intercept('POST', '**/doclogin', {
        statusCode: 200,
        body: { token: 'mock-token' },
      }).as('successfulLogin');
  
      cy.get('button[type="submit"]').click();
      cy.wait('@successfulLogin');
  
      cy.window().its('localStorage.token').should('eq', 'mock-token');
      cy.url().should('include', '/doctor/profile'); // Ensure redirection
    });
  
    it('should trigger forgot password alert', () => {
      cy.contains('Forgot Password?').click();
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Forgot Password clicked!');
      });
    });
  });
  