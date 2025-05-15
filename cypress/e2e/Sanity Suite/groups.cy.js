describe("Groups Page Tests", () => {
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
    cy.log("Session restored, navigating to Groups...");
    cy.visit("/settings/groups");
  });

  it("should display all required Header UI elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("Groups");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs > .icon").should("be.visible");
      cy.get(".breadcrumb > a").should("be.visible").contains("Groups");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display all required Group Card container elements", () => {
    cy.get(".group-card").within(() => {
      cy.get(".group-banner > span")
        .should("be.visible")
        .contains("Easily set access levels for users by groups");

      cy.get(".add-group-button")
        .should("be.visible")
        .within(() => {
          cy.get("app-anavio-icon > .anavio-icon > .mat-icon > svg").should(
            "be.visible"
          );
          cy.contains("Add Group");
        });
    });
  });

  it("should display all required All Groups container elements", () => {
    cy.get(".group-list-container").within(() => {
      cy.get(".group-header-wrapper").within(() => {
        cy.get("h2").should("be.visible").contains("All Groups");
        cy.get(".search-bar")
          .should("be.visible")
          .within(() => {
            cy.get(".search-input")
              .should("be.visible")
              .should("have.attr", "placeholder", "Search...");
            cy.get(".mat-icon")
              .should("be.visible")
              .find("svg")
              .should("be.visible");
          });
      });
    });
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
