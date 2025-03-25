describe("Dashboard Page Tests", () => {
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
    cy.log("Session restored, navigating to dashboard...");
    cy.visit("/dashboard");
  });

  it("should display all required UI elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".anavio-header-title").should("be.visible").contains("Dashboard");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });

    // Verify Status Cards
    cy.get(".grid").within(() => {
      // Verify the number of status cards
      cy.get("app-dashboard-status-card-component").should("have.length", 3);

      // Verify Status Cards Titles
      const titles = ["Camera Status", "Door Status", "User Activity"];
      cy.get("app-dashboard-status-card-component").each(($card, index) => {
        cy.wrap($card).invoke("attr", "title").should("eq", titles[index]);
      });

      // Verify Icons in Status Cards
      cy.get("app-camera-icon svg").should("be.visible");
      cy.get("app-door-icon svg").should("be.visible");
      cy.get("app-user-icon svg").should("be.visible");

      // Verify Charts in Status Cards
      cy.get("#chart-cameras").should("be.visible");
      cy.get("#chart-doors").should("be.visible");
      cy.get("#chart-user-activity").should("be.visible");

      // Verify Status Cards Content
    });

    // Verify Door Activity Container
    cy.get("app-dashboard-door-activity").within(() => {
      // Verify Header
      cy.get("mat-expansion-panel-header")
        .should("exist") 
        // Verify the two buttons and their labels
        .within(() => {
          cy.get("button").should("have.length", 2);
          cy.get("button").eq(0).contains("Door Activity");
          cy.get("button").eq(1).contains("Door Control");
        });
      // Verify mat-expansion-indicator contains an svg and the svg is visible
      cy.get("mat-expansion-panel-header .mat-expansion-indicator svg").should(
        "be.visible"
      );
    });
  });
});
