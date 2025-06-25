describe("Integrations > API Keys Page Tests", () => {
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
    cy.log("Session restored, navigating to Integrations > API Keys...");
    cy.visit("/settings/integrations/api-keys");
  });

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("API Keys");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/settings/integrations"]')
        .should("be.visible")
        .contains("Integrations");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get(
        'app-breadcrumbs .last-breadcrumb-item a[href="/settings/integrations/api-keys"]'
      )
        .should("be.visible")
        .contains("API Keys");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the navigation bar elements", () => {
    cy.get(".navigation-bar").within(() => {
      // Verify API Keys button
      cy.get('[href="/settings/integrations/api-keys"] .nav-btn').as(
        "api-keysBtn"
      );
      cy.get("@api-keysBtn").should("be.visible");
      cy.get("@api-keysBtn")
        .find(".mdc-button__label")
        .should("contain", "API Keys");

      // Verify Webhooks button
      cy.get('[href="/settings/integrations/webhooks"] .nav-btn').as(
        "webhooksBtn"
      );
      cy.get("@webhooksBtn").should("be.visible");
      cy.get("@webhooksBtn")
        .find(".mdc-button__label")
        .should("contain", "Webhooks");

      // Check that API Keys button is the active one
      cy.get("@api-keysBtn").should("have.class", "active-route");
    });
  });

  it("should display the API Keys container header elements", () => {
    cy.get("app-main-card").within(() => {
      cy.get("app-main-card-header").within(() => {
        cy.get("h1").should("be.visible").contains("API Keys");
      });
    });
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
