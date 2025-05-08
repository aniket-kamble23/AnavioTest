describe("Directory Page Tests", () => {
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
    cy.log("Session restored, navigating to Directory...");
    cy.visit("/settings/directory");
  });

  it("should display all required Directory container elements", () => {
    cy.get(".directory-list-container").within(() => {
      cy.get(".directory-header-wrapper").within(() => {
        cy.get("h2").should("be.visible").contains("Directory");
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

  // it("should log out when the Log out option is clicked", () => {
  //   cy.logout();
  //   cy.url().should("include", "/auth/sign-in");
  // });
});

// // Custom Command for Logout
// Cypress.Commands.add("logout", () => {
//   cy.get(
//     ".anavio-user-account-icon > .mat-mdc-menu-trigger > .mat-icon"
//   ).click();
//   cy.get(".mat-mdc-menu-content > :nth-child(7)").click();
//   cy.get(".mat-mdc-dialog-actions").within(() => {
//     cy.contains("Logout").click();
//   });
// });
