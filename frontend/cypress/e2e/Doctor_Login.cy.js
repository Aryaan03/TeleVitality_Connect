describe('Doctor Login Tests', () => {
    beforeEach(() => {
      // Visit the homepage before each test
      cy.visit('/');
      // Open the login modal
      cy.contains('Login').click();
      // Select doctor login
      cy.contains('Login as Doctor').click();
    });
  
    it('should display doctor login form correctly', () => {
      // Check if the modal is visible
      cy.get('h4').should('contain', 'Doctor Login');
      // Check username field
      cy.get('input[name="username"]').should('exist');
      // Check password field
      cy.get('input[name="password"]').should('exist');
      // Check forgot password link
      cy.contains('Forgot Password?').should('be.visible');
    });
  
    it('should show validation errors for empty fields', () => {
      // Interact with both fields to trigger validation
      cy.get('input[name="username"]').click().blur();
      cy.get('input[name="password"]').click().blur();
  
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
      cy.intercept('POST', '/api/doclogin', {
        statusCode: 401,
        body: { message: 'Invalid username or password' },
      }).as('loginRequest');
  
      // Fill in invalid credentials
      cy.get('input[name="username"]').type('invaliduser');
      cy.get('input[name="password"]').type('wrongpass');
      cy.get('button[type="submit"]').click();
  
      // Wait for the API call and check error message
      cy.wait('@loginRequest', { timeout: 10000 });
      cy.contains('Login failed').should('be.visible');
    });
  
    it('should successfully login with valid credentials', () => {
      // Mock API response for successful login
      cy.intercept('POST', '/api/doclogin', {
        statusCode: 200,
        body: { token: 'fake-jwt-token' },
      }).as('loginRequest');
  
      // Fill in valid credentials
      cy.get('input[name="username"]').type('validuser');
      cy.get('input[name="password"]').type('correctpass');
      cy.get('button[type="submit"]').click();
  
      // Wait for the API call and check redirection
      cy.wait('@loginRequest', { timeout: 10000 });
      cy.url().should('include', '/doctor/profile');
      cy.window().its('localStorage.token').should('exist');
      cy.window().its('localStorage.role').should('eq', 'doctor');
      cy.get('h4').should('not.exist');
    });
  
    it('should show forgot password alert when clicked', () => {
      cy.contains('Forgot Password?').click();
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Forgot Password clicked!');
      });
    });
  });
  