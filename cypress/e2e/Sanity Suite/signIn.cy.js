describe("Sign In Page Tests", () => {
  beforeEach(() => {
    cy.visit("/auth/sign-in");
  });

  it("should load the sign-in page successfully", () => {
    cy.url().should("include", "/auth/sign-in");
  });

  it("should display all required UI elements", () => {
    cy.get(".header-text").contains("Sign In");
    cy.get(".login-form > :nth-child(1)").contains("Email");
    cy.get('[formcontrolname="loginEmail"]').should("be.visible");
    cy.get(".login-form > :nth-child(3)").contains("Password");
    cy.get('[formcontrolname="loginPassword"]').should("be.visible");
    cy.get(".mat-mdc-button-touch-target").should("be.visible");
    cy.get(".mdc-button__label").contains("Sign In");
    cy.get(".login-footer").within(() => {
      cy.contains("Forgot Password?");
      cy.contains("Need an account?");
      cy.contains("Sign Up");
    });
  });

  it("should not allow login with invalid credentials", () => {
    cy.fixture("credentials").then((credentials) => {
      cy.get('[formcontrolname="loginEmail"]').type(
        credentials.invalidUser.email
      );
      cy.get('[formcontrolname="loginPassword"]').type(
        credentials.invalidUser.password
      );
      cy.get(".mdc-button__label").click();
      cy.get(".snack-message > span").should(
        "contain",
        "User not found. This can occur if the user is deleted in between the time when the link was issued and the page was called"
      );
    });
  });

  it("should allow login with valid credentials", () => {
    cy.fixture("credentials").then((credentials) => {
      cy.get('[formcontrolname="loginEmail"]').type(
        credentials.validUser.email
      );
      cy.get('[formcontrolname="loginPassword"]').type(
        credentials.validUser.password
      );
      cy.get(".mdc-button__label").click();
      cy.url().should("not.include", "/auth/signin");
      cy.url().should("include", "/dashboard");
      cy.get(
        ".anavio-user-account-icon > .mat-mdc-menu-trigger > .mat-icon"
      ).click();
      cy.get(".mat-mdc-menu-content > :nth-child(7)").click();
      cy.get(".mat-mdc-dialog-actions").within(() => {
        cy.contains("Logout").click();
      });
      cy.url().should("include", "/auth/sign-in");
    });
  });
});
