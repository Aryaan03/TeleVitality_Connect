describe('Registration Page Tests', () => {
    it('Visits the Registration Page', () => {
      // Visit the Registration page
      cy.visit('/register');
  
      // Verify that the page contains the title "Patient Registration"
      cy.contains('Patient Registration').should('be.visible');
    });

    it('Checks that the Registration Form is Rendered', () => {
      // Visit the Registration page
      cy.visit('/register');
  
      // Verify that form fields are visible
      cy.get('input[name="firstName"]').should('be.visible'); // First Name field
      cy.get('input[name="lastName"]').should('be.visible'); // Last Name field
      cy.get('input[name="email"]').should('be.visible'); // Email field
      cy.get('input[name="password"]').should('be.visible'); // Password field
      cy.get('input[name="dateOfBirth"]').should('be.visible'); // Date of Birth field
      cy.get('select[name="gender"]').should('be.visible'); // Gender dropdown
  
      // Verify that the "Register" button is visible
      cy.get('button[type="submit"]').contains('Register').should('be.visible');
    });

    it('Validates Required Fields', () => {
      // Visit the Registration page
      cy.visit('/register');
  
      // Click the Register button without filling the form
      cy.get('button[type="submit"]').contains('Register').click();
  
      // Check for validation messages
      cy.contains('Required').should('be.visible');
    });

    it('Registers a New Patient Successfully', () => {
      // Visit the Registration page
      cy.visit('/register');
  
      // Fill out the registration form
      cy.get('input[name="firstName"]').type('John');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="email"]').type('johndoe@example.com');
      cy.get('input[name="password"]').type('Password123!');
      cy.get('input[name="dateOfBirth"]').type('1990-01-01');
      cy.get('select[name="gender"]').select('Male');
  
      // Click the Register button
      cy.get('button[type="submit"]').contains('Register').click();
  
      // Check for success message
      cy.contains('Registration successful').should('be.visible');
    });

    it('Handles Registration Errors', () => {
      // Visit the Registration page
      cy.visit('/register');
  
      // Enter an existing email
      cy.get('input[name="firstName"]').type('John');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="email"]').type('existinguser@example.com');
      cy.get('input[name="password"]').type('Password123!');
      cy.get('input[name="dateOfBirth"]').type('1990-01-01');
      cy.get('select[name="gender"]').select('Male');
  
      // Click the Register button
      cy.get('button[type="submit"]').contains('Register').click();
  
      // Verify that an error message appears
      cy.contains('Email already exists').should('be.visible');
    });
});
