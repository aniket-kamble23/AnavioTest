Cypress.Commands.add("login", (email, password) => {
  cy.visit("/auth/sign-in");
  cy.get('[formcontrolname="loginEmail"]').type(email);
  cy.get('[formcontrolname="loginPassword"]').type(password);
  cy.get(".mdc-button__label").click();
  cy.url().should("include", "/dashboard");
});
