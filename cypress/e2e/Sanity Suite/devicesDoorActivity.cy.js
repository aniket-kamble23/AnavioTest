describe("Devices > Door Activity Page Tests", () => {
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
    cy.log("Session restored, navigating to Devices > Door Activity...");
    cy.visit("/devices/doors/door-activity");
  });

  it("should display all required Header UI elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title")
        .should("be.visible")
        .contains("Door Activity");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/devices"]')
        .should("be.visible")
        .contains("Devices");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/devices/doors"]')
        .should("be.visible")
        .contains("Doors");
      cy.get("app-breadcrumbs mat-icon.icon").eq(2).should("be.visible");
      cy.get(
        'app-breadcrumbs .last-breadcrumb-item a[href="/devices/doors/door-activity"]'
      )
        .should("be.visible")
        .contains("Activity");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display all required navigation bar elements", () => {
    cy.get(".navigation-bar").within(() => {
      // Verify Cameras button
      cy.get('[href="/devices/cameras"] .nav-btn').as("camerasBtn");
      cy.get("@camerasBtn").should("be.visible");
      cy.get("@camerasBtn")
        .find(".mdc-button__label")
        .should("contain", "Cameras");

      // Verify Doors button
      cy.get('[href="/devices/doors"] .nav-btn').as("doorsBtn");
      cy.get("@doorsBtn").should("be.visible");
      cy.get("@doorsBtn").find(".mdc-button__label").should("contain", "Doors");

      // Verify Hubs button
      cy.get('[href="/devices/hubs"] .nav-btn').as("hubsBtn");
      cy.get("@hubsBtn").should("be.visible");
      cy.get("@hubsBtn").find(".mdc-button__label").should("contain", "Hubs");

      // Check that Doors button is the active one
      cy.get("@doorsBtn").should("have.class", "active-route");

      // Verify Add Device button and its icon
      cy.get(".add-device-btn")
        .should("contain", "Add Device")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
        });
    });
  });

  it("should display all required Door Activity container elements", () => {
    cy.get(".mat-mdc-card").within(() => {
      // Navigation buttons
      cy.get(".navigation-buttons").within(() => {
        cy.get('[href="/devices/doors/door-activity"] .nav-btn')
          .as("doorActivityBtn")
          .should("be.visible")
          .find(".mdc-button__label")
          .should("contain", "Door Activity");

        cy.get('[href="/devices/doors/all-doors"] .nav-btn')
          .as("allDoorsBtn")
          .should("be.visible")
          .find(".mdc-button__label")
          .should("contain", "All Doors");

        cy.get("@doorActivityBtn").should("have.class", "active-route");
      });

      // Header section
      cy.get(".door-activity-header")
        .should("be.visible")
        .within(() => {
          cy.get(".title").should("contain.text", "Door Activity");

          cy.get(".search-bar")
            .should("be.visible")
            .within(() => {
              cy.get(".search-input")
                .should("be.visible")
                .and("have.attr", "placeholder", "Search...");
              cy.get(".mat-icon")
                .should("be.visible")
                .find("svg")
                .should("be.visible");
            });

          cy.get("app-date-range-picker")
            .should("be.visible")
            .within(() => {
              cy.get(".button-label").should("contain.text", "Date & Time");
              cy.get(".mat-icon")
                .should("be.visible")
                .find("svg")
                .should("be.visible");
            });

          cy.get("app-filter-button")
            .should("be.visible")
            .within(() => {
              cy.get(".label").should("contain.text", "Filter");
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
