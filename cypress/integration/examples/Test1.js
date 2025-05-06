
//Cypress - Spec File
describe('Login Functionality',()=>{
it('Valid Credentials',()=>{
cy.visit('https://ui.anavio.ai/auth/sign-in')
cy.wait(5000)
cy.get('#mat-input-0').type("hbadwane@vicon-security.com")
cy.wait(2000)
cy.get('#mat-input-1').type("Anavio@123")
cy.wait(2000)
cy.get('.mdc-button__label').click()
cy.wait(2000)
cy.get('.anavio-header-title').should('have.text', 'Dashboard');
//cy.wait(2000)
//cy.get('.text-anavio-red').click() // Logout button
//cy.get('.anavio-user-account-icon > .mat-mdc-menu-trigger > .mat-mdc-button-touch-target').click()
})
it('should display error with wrong password', () => {
    cy.visit('https://ui.anavio.ai/auth/sign-in')
    cy.wait(2000)
    cy.get('#mat-input-0').type("hbadwane@vicon-security.com")
    cy.wait(2000)
    cy.get('#mat-input-1').type("wrongpassword")
    cy.wait(2000)
    cy.get('.mdc-button__label').click()
    cy.wait(2000)
  
    cy.contains('Incorrect password').should('be.visible'); // Adjust based on actual error message
  });
  it('should display error with wrong username', () => {
    cy.visit('https://ui.anavio.ai/auth/sign-in')
    cy.wait(2000)
    cy.get('#mat-input-0').type("hbadwanew@vicon-security.com")
    cy.wait(2000)
    cy.get('#mat-input-1').type("Anavio@123")
    cy.wait(2000)
    cy.get('.mdc-button__label').click()
    cy.wait(2000)
  
    cy.contains('User not found').should('be.visible'); // Adjust based on actual error message
  });
  
})
// node-modules/.bin/cypress open
