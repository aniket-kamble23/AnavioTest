describe("Account Page Tests", () => {
  before(() => {
    Cypress.session.clearAllSavedSessions();
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });

  beforeEach(() => {
    cy.session("user-session", () => {
      cy.fixture("credentials").then((credentials) => {
        cy.login(credentials.validUser.email, credentials.validUser.password);
      });
    });
    cy.log("Session restored, navigating to Account...");
    cy.visit("/settings/account");
  });

  it("should display all required Header UI elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("Account");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs > .icon").should("be.visible");
      cy.get(".breadcrumb > a").should("be.visible").contains("Account");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display all required Account Information container elements", () => {
    cy.get(
      "app-account-information > app-titled-form-card > .titled-form-card"
    ).within(() => {
      cy.get(".card-header > .title-wrapper > .title")
        .should("be.visible")
        .contains("Account Information");
    });
  });

  it("should display all required Analytics Settings container elements", () => {
    cy.get(
      "app-analytics-settings > app-titled-form-card > .titled-form-card"
    ).within(() => {
      cy.get(".card-header > .title-wrapper > .title")
        .should("be.visible")
        .contains("Analytics Settings");
    });
  });

  it("should display all required Company Address container elements", () => {
    cy.get('[title="Company Address"] > .titled-form-card').within(() => {
      cy.get(".card-header > .title-wrapper > .title")
        .should("be.visible")
        .contains("Company Address");
    });
  });

  it("should display all required Shipping Address container elements", () => {
    cy.get('[title="Shipping Address"] > .titled-form-card').within(() => {
      cy.get(".card-header > .title-wrapper > .title")
        .should("be.visible")
        .contains("Shipping Address");
    });
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});

// Custom Command for Logout
Cypress.Commands.add("logout", () => {
  cy.get(
    ".anavio-user-account-icon > .mat-mdc-menu-trigger > .mat-icon"
  ).click();
  cy.get(".mat-mdc-menu-content > :nth-child(7)").click();
  cy.get(".mat-mdc-dialog-actions").within(() => {
    cy.contains("Logout").click();
  });
});
