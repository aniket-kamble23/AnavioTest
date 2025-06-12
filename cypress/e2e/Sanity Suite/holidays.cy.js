describe("Holidays Page Tests", () => {
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
    cy.log("Session restored, navigating to Holidays...");
    cy.visit("/settings/holidays");
  });

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("Holidays");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs > .icon").should("be.visible");
      cy.get(".breadcrumb > a").should("be.visible").contains("Holidays");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the holiday card container elements", () => {
    cy.get(".add-holiday-card").within(() => {
      cy.get(".holiday-banner > span")
        .should("be.visible")
        .contains("Add/Remove your holidays");

      cy.get(".add-holiday-button")
        .should("be.visible")
        .within(() => {
          cy.get("app-anavio-icon > .anavio-icon > .mat-icon > svg").should(
            "be.visible"
          );
          cy.contains("Add Holiday");
        });
    });
  });

  it("should display the Holidays container header elements", () => {
    cy.get(".holiday-list-container").within(() => {
      cy.get(".holiday-header-wrapper").within(() => {
        cy.get("h2").should("be.visible").contains("Holidays");
        cy.get(".search-bar")
          .should("be.visible")
          .within(() => {
            cy.get(".search-input")
              .should("be.visible")
              .should("have.attr", "placeholder", "Search by Holiday Name");
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
