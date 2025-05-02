describe("Guest Schedule Page Tests", () => {
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
      cy.log("Session restored, navigating to Guest Schedule...");
      cy.visit("/settings/schedules/guest-schedule");
    });
  
    it("should do something :)", () => {
      cy.get(".anavio-header")
        .should("exist");
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