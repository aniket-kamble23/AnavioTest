describe("Sign In Page Tests", () => {
  beforeEach(() => {
    cy.visit("/auth/sign-in");
  });

  it("should load the sign-in page successfully", () => {
    cy.url().should("include", "/auth/sign-in");
  });

  it("should display the UI elements", () => {
    // Background container visible
    cy.get("app-base > .login-bg").should("be.visible");

    // Card container
    cy.get(".mat-mdc-card").within(() => {
      // Header text
      cy.get(".header-text").should("contain.text", "Sign In");

      // Email label and input
      cy.contains(".login-form .label", "Email").should("be.visible");
      cy.get('[formcontrolname="loginEmail"]').should("be.visible");

      // Password label and input
      cy.contains(".login-form .label", "Password").should("be.visible");
      cy.get('[formcontrolname="loginPassword"]').should("be.visible");

      // Sign In button
      cy.get(".mat-mdc-button-touch-target").should("be.visible");
      cy.get(".mdc-button__label").should("contain.text", "Sign In");

      // Footer links
      cy.get(".login-footer").within(() => {
        cy.contains("Forgot Password?").should("be.visible");
        cy.contains("Need an account?").should("be.visible");
        cy.contains("Sign Up").should("be.visible");
      });
    });

    // Footer
    cy.get(".footer")
      .contains("Copyright © Anavio 2025 | Version 1.0.15")
      .should("be.visible");
  });

  it("should display validation errors when fields are empty", () => {
    cy.get('[formcontrolname="loginEmail"]').click().blur();
    cy.get("#mat-mdc-error-0").should("contain", "Required");
    cy.get('[formcontrolname="loginPassword"]').click().blur();
    cy.get("#mat-mdc-error-1").should("contain", "Required");
  });

  it("should display validation errors for invalid email format", () => {
    cy.get('[formcontrolname="loginEmail"]').type("invalid-email").blur();
    cy.get("#mat-mdc-error-2").should(
      "contain",
      "Please enter a valid email address"
    );
  });

  it("should mask password input", () => {
    cy.get('[formcontrolname="loginPassword"]').should(
      "have.attr",
      "type",
      "password"
    );
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

  it("should not allow SQL injection", () => {
    cy.get('[formcontrolname="loginEmail"]').type("' OR '1'='1");
    cy.get('[formcontrolname="loginPassword"]').type("' OR '1'='1");
    cy.get(".mdc-button__label").click();
    cy.get(".snack-message > span").should("contain", "Invalid email");
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
      cy.logout();
      cy.url().should("include", "/auth/sign-in");
    });
  });

  it("should submit the form when pressing Enter", () => {
    cy.fixture("credentials").then((credentials) => {
      cy.get('[formcontrolname="loginEmail"]').type(
        credentials.validUser.email
      );
      cy.get('[formcontrolname="loginPassword"]').type(
        credentials.validUser.password + "{enter}"
      );
      cy.url().should("not.include", "/auth/signin");
      cy.url().should("include", "/dashboard");
      cy.logout();
      cy.url().should("include", "/auth/sign-in");
    });
  });

  it("should navigate to Forgot Password page when clicking on link", () => {
    cy.get(".login-footer").within(() => {
      cy.contains("Forgot Password?").click();
    });
    cy.url().should("include", "/auth/forgot-password");
  });

  it("should navigate to Sign Up page when clicking on link", () => {
    cy.get(".login-footer").within(() => {
      cy.contains("Sign Up").click();
    });
    cy.url().should("include", "/auth/sign-up");
  });
});
