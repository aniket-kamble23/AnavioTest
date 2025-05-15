Cypress.Commands.add("login", (email, password) => {
  cy.visit("/auth/sign-in");
  cy.get('[formcontrolname="loginEmail"]').type(email);
  cy.get('[formcontrolname="loginPassword"]').type(password);
  cy.get(".mdc-button__label").click();
  cy.url().should("include", "/dashboard");
});

Cypress.Commands.add("logout", () => {
  cy.get(
    ".anavio-user-account-icon > .mat-mdc-menu-trigger > .mat-icon"
  ).click();
  cy.get(".mat-mdc-menu-content").within(() => {
    cy.contains(".mat-mdc-menu-item", "Log out").click();
  });
  cy.get(".mat-mdc-dialog-actions").within(() => {
    cy.contains("Logout").click();
  });
});
