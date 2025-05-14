describe("People > Activity Page Tests", () => {
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
    cy.log("Session restored, navigating to People > Activity...");
    cy.visit("/people/activity");
  });

  it("should display all required Header UI elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("Activity");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/people"]')
        .should("be.visible")
        .contains("People");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get('app-breadcrumbs .last-breadcrumb-item a[href="/people/activity"]')
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
      // Verify Activity button
      cy.get('[href="/people/activity"] .nav-btn').as("activityBtn");
      cy.get("@activityBtn").should("be.visible");
      cy.get("@activityBtn")
        .find(".mdc-button__label")
        .should("contain", "Activity");

      // Verify Unknown People button
      cy.get('[href="/people/unknown-people"] .nav-btn').as("unknownPeopleBtn");
      cy.get("@unknownPeopleBtn").should("be.visible");
      cy.get("@unknownPeopleBtn")
        .find(".mdc-button__label")
        .should("contain", "Unknown People");

      // Verify Known People button
      cy.get('[href="/people/known-people"] .nav-btn').as("knownPeopleBtn");
      cy.get("@knownPeopleBtn").should("be.visible");
      cy.get("@knownPeopleBtn")
        .find(".mdc-button__label")
        .should("contain", "Known People");

      // Verify People of Interest button
      cy.get('[href="/people/people-of-interest"] .nav-btn').as(
        "peopleOfInterestBtn"
      );
      cy.get("@peopleOfInterestBtn").should("be.visible");
      cy.get("@peopleOfInterestBtn")
        .find(".mdc-button__label")
        .should("contain", "People of Interest");

      // Check that Activity button is the active one
      cy.get("@activityBtn").should("have.class", "active-route");

      // Verify Search by Photo button and its icon
      cy.get(".cancel-btn")
        .should("contain", "Search by Photo")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
        });

      // Verify Add Person of Interest button and its icon
      cy.get(".add-poi-btn")
        .should("contain", "Add Person of Interest")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
        });
    });
  });

  it("should display all required Activity container elements", () => {
    cy.get(".mat-mdc-card").within(() => {
      cy.get(".header")
        .should("be.visible")
        .within(() => {
          // First div: should contain "Activity"
          cy.get("div").eq(0).should("contain.text", "Activity");

          // Second div: should contain the filter button and icon
          cy.get("div")
            .eq(1)
            .within(() => {
              // Verify the Filter button is visible
              cy.get("button.filter-button").should("be.visible");

              // Verify the button label text is 'Filter'
              cy.get(".label").should("contain.text", "Filter");

              // Verify the filter icon exists
              cy.get("mat-icon").should("have.attr", "svgicon", "filter");
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
