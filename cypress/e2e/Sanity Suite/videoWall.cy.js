describe("Video Wall Page Tests", () => {
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
    cy.log("Session restored, navigating to Video Wall...");
    cy.visit("/video-wall");
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
        .contains("Video Wall");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs > .icon").should("be.visible");
      cy.get(".breadcrumb > a").should("be.visible").contains("Video Wall");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the Manage Device card container elements", () => {
    cy.get(".manage-device-card").within(() => {
      cy.get(".manage-streams > span")
        .should("be.visible")
        .contains("Monitor and Manage Your Camera Feeds");

      cy.get(".dailog-button")
        .should("be.visible")
        .within(() => {
          cy.get("app-anavio-icon > .anavio-icon > .mat-icon > svg").should(
            "be.visible"
          );
          cy.contains("Manage Devices");
        });

      cy.get(".full-screen-button")
        .should("be.visible")
        .within(() => {
          cy.get("app-anavio-icon > .anavio-icon > .mat-icon > svg").should(
            "be.visible"
          );
        });
    });
  });

  it("should display the Video Wall container elements", () => {
    cy.get(".wall-main-card").should("be.visible");
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
