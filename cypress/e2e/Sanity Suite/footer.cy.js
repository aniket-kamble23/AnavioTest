describe("Footer Container Test", () => {
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
    cy.log("Session restored, navigating to Dashboard...");
    cy.visit("/dashboard");
  });

  it("should display both parts of the logo in the footer, including SVGs", () => {
    cy.get("app-footer .icon-wrapper-a").should("be.visible");
    cy.get("app-footer .icon-wrapper-a svg").should("be.visible");
    cy.get("app-footer .icon-wrapper-b").should("be.visible");
    cy.get("app-footer .icon-wrapper-b svg").should("be.visible");
  });

  it("should display the correct copyright text", () => {
    cy.get("app-footer .copyrights")
      .should("be.visible")
      .and("have.text", "© 2024 Anavio. All rights reserved.");
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
