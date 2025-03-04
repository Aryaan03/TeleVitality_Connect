<<<<<<< HEAD
describe('Patient Registration Tests', () => {
    beforeEach(() => {
      cy.visit('/');
  
      // If you have a single button on the homepage that says "REGISTER"
      // or "Register" or any variant, use a regex to match it case-insensitively:
      cy.contains(/^register$/i, { timeout: 10000 })
        .should('be.visible')
        .click();
  
      // Next, the modal likely has a button "REGISTER AS PATIENT" in uppercase:
      cy.contains(/^register as patient$/i, { timeout: 10000 })
        .should('be.visible')
        .click();
    });
  
    it('should display patient registration form correctly', () => {
      // Check the heading (case-insensitive check for "Patient Registration"):
      cy.get('h4', { timeout: 10000 }).contains(/patient registration/i);
  
      // Check for existence of all form fields:
      cy.get('input[name="username"]').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('input[name="confirmPassword"]').should('exist');
      cy.get('input[name="consentTelemedicine"]').should('exist');
  
      // Terms & conditions label (case-insensitive partial match):
      cy.contains(/i agree to the terms/i).should('be.visible');
  
      // The "Register" button on the form (case-insensitive match):
      cy.contains(/^register$/i).should('be.visible');
    });
  
    it('should show validation errors for invalid inputs', () => {
      // Enter invalid data
      cy.get('input[name="username"]').type('a'); // too short
      cy.get('input[name="email"]').type('invalid-email'); // not a valid email
      cy.get('input[name="password"]').type('..'); // too short (less than 8 characters)
      cy.get('input[name="confirmPassword"]').type('mismatch'); // does not match password
      cy.get('input[name="consentTelemedicine"]').uncheck({ force: true }); // Uncheck the agreement checkbox
    
      // Submit the form
      cy.get('button[type="submit"]').click();
    
      // Check for each validation message (use partial/case-insensitive matches)
      cy.contains(/password must be at least 8 characters/i).should('be.visible'); // Password length validation
      cy.contains(/passwords must match/i).should('be.visible'); // Confirm password mismatch
      cy.contains(/you must agree to the terms and conditions/i).should('be.visible'); // Checkbox validation
    
      // Check that no error messages are displayed for valid inputs
      cy.contains(/invalid email/i).should('be.visible'); // Email validation error
    });
  
    it('should show error for failed registration', () => {
      // Mock a 400 response
      cy.intercept('POST', '/api/register', {
        statusCode: 400,
        body: { message: 'Registration failed' },
      }).as('registerRequest');
  
      // Fill out valid data
      cy.get('input[name="username"]').type('validuser');
      cy.get('input[name="email"]').type('valid@example.com');
      cy.get('input[name="password"]').type('validpassword');
      cy.get('input[name="confirmPassword"]').type('validpassword');
      cy.get('input[name="consentTelemedicine"]').check({ force: true });
  
      // Submit
      cy.get('button[type="submit"]').click();
  
      // Wait for the mock and check the error message
      cy.wait('@registerRequest');
      cy.contains(/registration failed/i).should('be.visible');
    });
  
    it('should successfully register with valid credentials', () => {
      // Mock a successful 200 response
      cy.intercept('POST', '/api/register', {
        statusCode: 200,
        body: { message: 'Registration successful' },
      }).as('registerRequest');
  
      // Fill out valid data
      cy.get('input[name="username"]').type('validuser');
      cy.get('input[name="email"]').type('valid@example.com');
      cy.get('input[name="password"]').type('validpassword');
      cy.get('input[name="confirmPassword"]').type('validpassword');
      cy.get('input[name="consentTelemedicine"]').check({ force: true });
  
      // Submit
      cy.get('button[type="submit"]').click();
  
      // Wait for the mock and confirm success
      cy.wait('@registerRequest');
  
      // Ensure we navigated away from the registration form
      cy.get('h4').should('not.contain', 'Patient Registration');
  
      // Check for the Login prompt (case-insensitive partial match)
      cy.contains(/login/i).should('be.visible');
    });
  });
=======
describe('Patient Registration Tests', () => {
    beforeEach(() => {
      cy.visit('/');
  
      // If you have a single button on the homepage that says "REGISTER"
      // or "Register" or any variant, use a regex to match it case-insensitively:
      cy.contains(/^register$/i, { timeout: 10000 })
        .should('be.visible')
        .click();
  
      // Next, the modal likely has a button "REGISTER AS PATIENT" in uppercase:
      cy.contains(/^register as patient$/i, { timeout: 10000 })
        .should('be.visible')
        .click();
    });
  
    it('should display patient registration form correctly', () => {
      // Check the heading (case-insensitive check for "Patient Registration"):
      cy.get('h4', { timeout: 10000 }).contains(/patient registration/i);
  
      // Check for existence of all form fields:
      cy.get('input[name="username"]').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('input[name="confirmPassword"]').should('exist');
      cy.get('input[name="consentTelemedicine"]').should('exist');
  
      // Terms & conditions label (case-insensitive partial match):
      cy.contains(/i agree to the terms/i).should('be.visible');
  
      // The "Register" button on the form (case-insensitive match):
      cy.contains(/^register$/i).should('be.visible');
    });
  
    it('should show validation errors for invalid inputs', () => {
      // Enter invalid data
      cy.get('input[name="username"]').type('a'); // too short
      cy.get('input[name="email"]').type('invalid-email'); // not a valid email
      cy.get('input[name="password"]').type('..'); // too short (less than 8 characters)
      cy.get('input[name="confirmPassword"]').type('mismatch'); // does not match password
      cy.get('input[name="consentTelemedicine"]').uncheck({ force: true }); // Uncheck the agreement checkbox
    
      // Submit the form
      cy.get('button[type="submit"]').click();
    
      // Check for each validation message (use partial/case-insensitive matches)
      cy.contains(/password must be at least 8 characters/i).should('be.visible'); // Password length validation
      cy.contains(/passwords must match/i).should('be.visible'); // Confirm password mismatch
      cy.contains(/you must agree to the terms and conditions/i).should('be.visible'); // Checkbox validation
    
      // Check that no error messages are displayed for valid inputs
      cy.contains(/invalid email/i).should('be.visible'); // Email validation error
    });
  
    it('should show error for failed registration', () => {
      // Mock a 400 response
      cy.intercept('POST', '/api/register', {
        statusCode: 400,
        body: { message: 'Registration failed' },
      }).as('registerRequest');
  
      // Fill out valid data
      cy.get('input[name="username"]').type('validuser');
      cy.get('input[name="email"]').type('valid@example.com');
      cy.get('input[name="password"]').type('validpassword');
      cy.get('input[name="confirmPassword"]').type('validpassword');
      cy.get('input[name="consentTelemedicine"]').check({ force: true });
  
      // Submit
      cy.get('button[type="submit"]').click();
  
      // Wait for the mock and check the error message
      cy.wait('@registerRequest');
      cy.contains(/registration failed/i).should('be.visible');
    });
  
    it('should successfully register with valid credentials', () => {
      // Mock a successful 200 response
      cy.intercept('POST', '/api/register', {
        statusCode: 200,
        body: { message: 'Registration successful' },
      }).as('registerRequest');
  
      // Fill out valid data
      cy.get('input[name="username"]').type('validuser');
      cy.get('input[name="email"]').type('valid@example.com');
      cy.get('input[name="password"]').type('validpassword');
      cy.get('input[name="confirmPassword"]').type('validpassword');
      cy.get('input[name="consentTelemedicine"]').check({ force: true });
  
      // Submit
      cy.get('button[type="submit"]').click();
  
      // Wait for the mock and confirm success
      cy.wait('@registerRequest');
  
      // Ensure we navigated away from the registration form
      cy.get('h4').should('not.contain', 'Patient Registration');
  
      // Check for the Login prompt (case-insensitive partial match)
      cy.contains(/login/i).should('be.visible');
    });
  });
>>>>>>> 267d5b9d5588fd1d2ebbbc6ce101083dc53540bd
  