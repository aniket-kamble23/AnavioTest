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
  
    it("should do something :)", () => {
      cy.get(".anavio-header")
        .should("exist");
    });  
  
    it("should log out when the Log out option is clicked", () => {
      cy.logout();
      cy.url().should("include", "/auth/sign-in");
    });
  });
  