describe('Patient Login Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Open login modal through navigation flow
    cy.get('button').contains('Sign In').click({ force: true });
    // Wait for options modal to appear
    cy.contains('Are you a healthcare provider?', { timeout: 10000 }).should('be.visible');
    // Select patient login in options modal
    cy.contains('Patient Login').click({ force: true });
  });

  it('should display patient login form correctly', () => {
    // Check modal content - increased timeout
    cy.contains('Welcome Back', { timeout: 10000 }).should('be.visible');
    cy.contains('Access your personalized health portal').should('be.visible');
    
    // Check form fields with more specific selectors
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    
    // Check auxiliary elements with more resilient selectors
    cy.contains('button', 'Forgot Password?').should('be.visible');
    cy.contains('button', 'Sign Up Now').should('be.visible');
    cy.contains('256-bit SSL encrypted connection').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Wait for form to be visible first
    cy.get('form', { timeout: 10000 }).should('be.visible');
    
    // Trigger validation with more reliable sequence
    cy.get('input[name="username"]').click().type('{backspace}');
    cy.get('input[name="password"]').click().type('{backspace}');
    cy.get('button[type="submit"]').click();

    // Verify errors with more specific selectors
    cy.get('.MuiFormHelperText-root.Mui-error', { timeout: 5000 })
      .should('have.length', 2)
      .each(($el) => {
        expect($el.text()).to.include('Required');
      });
  });

  it('should show error for invalid credentials', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
      delay: 1000
    }).as('loginRequest');

    // Fill form with more reliable typing
    cy.get('input[name="username"]').clear().type('invaliduser');
    cy.get('input[name="password"]').clear().type('wrongpass');
    cy.get('button[type="submit"]').click();

    // Verify error with more flexible matching
    cy.wait('@loginRequest', { timeout: 10000 });
    cy.contains(/invalid credentials|login failed/i, { timeout: 5000 }).should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
      delay: 1000
    }).as('loginRequest');

    // Fill valid credentials with more reliable selectors
    cy.get('input[name="username"]').clear().type('validuser');
    cy.get('input[name="password"]').clear().type('correctpass');
    cy.get('button[type="submit"]').should('be.enabled').click();

    // Verify success with more assertions
    cy.wait('@loginRequest', { timeout: 10000 });
    cy.url({ timeout: 10000 }).should('include', '/profile');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist;
      expect(win.localStorage.getItem('role')).to.equal('patient');
    });
    cy.contains('Welcome Back').should('not.exist');
  });

  it('should navigate to forgot password page', () => {
    // More reliable navigation test
    cy.contains('button', 'Forgot Password?').click();
    cy.url({ timeout: 10000 }).should('include', '/reset-password');
  });

  it('should navigate to sign up page', () => {
    // More reliable navigation test
    cy.contains('button', 'Sign Up Now').click();
    cy.url({ timeout: 10000 }).should('include', '/register');
  });

  it('should close modal when clicking close button', () => {
    // More reliable close button selector
    cy.get('[data-testid="CloseIcon"]').first().click({ force: true });
    cy.contains('Welcome Back', { timeout: 5000 }).should('not.exist');
  });
});