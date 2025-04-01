describe('Doctor Login Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Open login modal through navigation flow
    cy.get('button').contains('Sign In').click();
    // Wait for options modal to appear
    cy.contains('Are you a healthcare provider?').should('be.visible');
    // Select doctor login in options modal
    cy.contains('Login here').click();
  });

  it('should display doctor login form correctly', () => {
    // Check modal content
    cy.contains('Medical Professional Portal').should('be.visible');
    cy.contains('Secure access to clinical tools and patient management').should('be.visible');
    
    // Check form fields
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    
    // Check auxiliary elements
    cy.contains('Forgot Password?').should('be.visible');
    cy.contains('256-bit SSL encrypted connection').should('be.visible');
    cy.contains('Request Access').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Trigger validation
    cy.get('input[name="username"]').focus().blur();
    cy.get('input[name="password"]').focus().blur();
    cy.get('button[type="submit"]').click();

    // Verify errors
    cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2);
    cy.get('.MuiFormHelperText-root.Mui-error').each(($el) => {
      expect($el.text()).to.include('Required');
    });
  });

  it('should show error for invalid credentials', () => {
    cy.intercept('POST', '/api/doclogin', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
      delay: 500
    }).as('loginRequest');

    // Fill form
    cy.get('input[name="username"]').type('invaliduser');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    // Verify error
    cy.wait('@loginRequest');
    cy.contains(/login failed/i).should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.intercept('POST', '/api/doclogin', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
      delay: 500
    }).as('loginRequest');

    // Fill valid credentials
    cy.get('input[name="username"]').type('validuser');
    cy.get('input[name="password"]').type('correctpass');
    cy.get('button[type="submit"]').click();

    // Verify success
    cy.wait('@loginRequest');
    cy.url().should('include', '/doctor/profile');
    cy.window().its('localStorage.token').should('exist');
    cy.window().its('localStorage.role').should('eq', 'doctor');
  });

  it('should show forgot password alert when clicked', () => {
    cy.contains('Forgot Password?').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Forgot Password clicked!');
    });
  });

});