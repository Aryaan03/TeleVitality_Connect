describe('Patient Login Tests', () => {
    beforeEach(() => {
      cy.visit('/'); // Visit the homepage
      cy.contains('Login').click(); // Open the login modal
      cy.contains('Login as Patient').click(); // Select patient login
    });
  
    it('should display patient login form correctly', () => {
      // Check if the modal is visible
      cy.get('h4').should('contain', 'Patient Login'); // Check the title
      cy.get('input[name="username"]').should('exist'); // Check username field
      cy.get('input[name="password"]').should('exist'); // Check password field
      cy.contains('Forgot Password?').should('be.visible'); // Check forgot password link
    });
  
    it('should show validation errors for empty fields', () => {
      // Interact with both fields to trigger validation
      cy.get('input[name="username"]').click().blur(); // Focus and blur to trigger validation
      cy.get('input[name="password"]').click().blur(); // Focus and blur to trigger validation
  
      // Submit the form
      cy.get('form').submit();
  
      // Check for two validation errors
      cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2);
      cy.get('.MuiFormHelperText-root.Mui-error').each(($el) => {
        expect($el.text()).to.include('Required');
      });
    });
  
    it('should show error for invalid credentials', () => {
      // Mock API response for invalid credentials
      cy.intercept('POST', '/api/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' },
      }).as('loginRequest');
  
      // Fill in invalid credentials
      cy.get('input[name="username"]').type('invaliduser');
      cy.get('input[name="password"]').type('wrongpass');
      cy.get('button[type="submit"]').click();
  
      // Wait for the API call and check error message
      cy.wait('@loginRequest');
      cy.contains('Login failed').should('be.visible');
    });
  
    it('should successfully login with valid credentials', () => {
      // Mock API response for successful login
      cy.intercept('POST', '/api/login', {
        statusCode: 200,
        body: { token: 'fake-jwt-token' },
      }).as('loginRequest');
  
      // Fill in valid credentials
      cy.get('input[name="username"]').type('validuser');
      cy.get('input[name="password"]').type('correctpass');
      cy.get('button[type="submit"]').click();
  
      // Wait for the API call and check redirection
      cy.wait('@loginRequest');
      cy.url().should('include', '/profile'); // Check if redirected to profile page
      cy.window().its('localStorage.token').should('exist'); // Check if token is stored
      cy.window().its('localStorage.role').should('eq', 'patient'); // Check if role is stored
      cy.get('h4').should('not.contain', 'Patient Login'); // Check if modal is closed
    });
  
    it('should close modal when clicking outside', () => {
      cy.get('body').click(10, 10); // Click outside the modal
      cy.get('h4').should('not.contain', 'Patient Login'); // Check if modal is closed
    });
  });