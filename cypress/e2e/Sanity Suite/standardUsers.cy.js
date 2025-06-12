describe("Standard Users Page Tests", () => {
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
    cy.log("Session restored, navigating to Standard Users...");
    cy.visit("/settings/users/standard-users");
  });

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("Users");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/settings/users"]')
        .should("be.visible")
        .contains("Users");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get(
        'app-breadcrumbs .last-breadcrumb-item a[href="/settings/users/standard-users"]'
      )
        .should("be.visible")
        .contains("Standard Users");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the navigation bar elements", () => {
    cy.get(".navigation-bar").within(() => {
      // Verify Standard Users button
      cy.get('[href="/settings/users/standard-users"] .nav-btn').as(
        "standardUsersBtn"
      );
      cy.get("@standardUsersBtn").should("be.visible");
      cy.get("@standardUsersBtn")
        .find(".mdc-button__label")
        .should("contain", "Standard Users");

      // Check that Standard Users button is the active one
      cy.get("@standardUsersBtn").should("have.class", "active-route");

      // Verify Guest Users button
      cy.get('[href="/settings/users/guest-users"] .nav-btn').as(
        "guestUsersBtn"
      );
      cy.get("@guestUsersBtn").should("be.visible");
      cy.get("@guestUsersBtn")
        .find(".mdc-button__label")
        .should("contain", "Guest Users");

      // Verify Add Guest button and its icon
      cy.get(".add-button")
        .should("contain", "Add User")
        .within(() => {
          cy.get("app-anavio-icon .anavio-icon .mat-icon svg").should(
            "be.visible"
          );
        });
    });
  });

  it("should display the Standard Users container header elements", () => {
    cy.get(".mat-mdc-card").within(() => {
      cy.get(".users-header-wrapper").should("be.visible");
      cy.get("h2").contains("Standard Users");
    });
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
