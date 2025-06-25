describe("Reports > Access Logs Page Tests", () => {
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
    cy.log("Session restored, navigating to Reports > Access Logs...");
    cy.visit("/settings/reports/access-logs");
  });

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title")
        .should("be.visible")
        .contains("Access Logs");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/settings/reports"]')
        .should("be.visible")
        .contains("Reports");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get(
        'app-breadcrumbs .last-breadcrumb-item a[href="/settings/reports/access-logs"]'
      )
        .should("be.visible")
        .contains("Access Logs");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the header elements for each content container", () => {
    cy.get(".main-content")
      .should("exist")
      .within(() => {
        // Verify header for All Logs container
        cy.get("mat-card")
          .eq(0)
          .should("exist")
          .within(() => {
            cy.get("h2")
              .should("be.visible")
              .should("contain.text", "All Logs");
          });

        // Verify header for Charts container
        cy.get("mat-card")
          .eq(1)
          .should("exist")
          .within(() => {
            cy.get("h2").eq(0).should("exist").should("contain.text", "Charts");
          });

        // Verify header for Access Logs Per Type container
        cy.get("mat-card")
          .eq(5)
          .should("exist")
          .within(() => {
            cy.get("h2")
              .should("exist")
              .should("contain.text", "Access Logs Per Type");
          });
      });
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
