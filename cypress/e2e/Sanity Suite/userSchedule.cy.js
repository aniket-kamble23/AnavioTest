describe("User Schedule Page Tests", () => {
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
    cy.log("Session restored, navigating to User Schedule...");
    cy.visit("/settings/schedules/user-schedule");
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
        .contains("User Schedule");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/settings/schedules"]')
        .should("be.visible")
        .contains("Schedules");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get(
        'app-breadcrumbs .last-breadcrumb-item a[href="/settings/schedules/user-schedule"]'
      )
        .should("be.visible")
        .contains("User Schedule");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display all required navigation bar elements", () => {
    cy.get(".navigation-bar").within(() => {
      // Verify User Schedule button
      cy.get('[href="/settings/schedules/user-schedule"] .nav-btn').as(
        "userScheduleBtn"
      );
      cy.get("@userScheduleBtn").should("be.visible");
      cy.get("@userScheduleBtn")
        .find(".mdc-button__label")
        .should("contain", "User Schedule");

      // Verify Guest Schedule button
      cy.get('[href="/settings/schedules/guest-schedule"] .nav-btn').as(
        "guestScheduleBtn"
      );
      cy.get("@guestScheduleBtn").should("be.visible");
      cy.get("@guestScheduleBtn")
        .find(".mdc-button__label")
        .should("contain", "Guest Schedule");

      // Check that User Schedule button is the active one
      cy.get("@userScheduleBtn").should("have.class", "active-route");

      // Verify Add Schedule button and its icon
      cy.get(".add-button")
        .should("contain", "Add Schedule")
        .within(() => {
          cy.get("app-anavio-icon .anavio-icon .mat-icon svg").should(
            "be.visible"
          );
        });
    });
  });

  it("should display all required User Schedule container elements", () => {
    cy.get(".mat-mdc-card").within(() => {
      cy.get(".schedule-header-wrapper").should("be.visible");
      cy.get("h2").contains("User Schedule");
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
