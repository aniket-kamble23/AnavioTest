describe("Sidebar Tests", () => {
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

  it("should display expanded by default", () => {
    // Sidebar container
    cy.get(".sidebar")
      .should("be.visible")
      .invoke("css", "width")
      .then((width) => {
        expect(width).to.equal("288px");
      });
  });

  it("when expanded, it should display all required UI elements", () => {
    // Sidebar container
    cy.get(".sidebar").should("be.visible");

    // Sidebar Logo
    cy.get(".sidebar-logo")
      .should("be.visible")
      .within(() => {
        cy.get(".anavio-icon").should("be.visible");
        cy.get(".ml-4").should("be.visible");
      });

    // Sidebar Router Link
    cy.get(".bg-anavio-blue-970")
      .should("be.visible")
      .within(() => {
        cy.get(".sidebar-selected-item")
          .should("be.visible")
          .within(() => {
            cy.get(".fill-anavio-blue-600 > path").should("be.visible");
          });
        cy.contains("Dashboard");
      });

    // Sidebar Toggler
    cy.get(".sidebar-toggler")
      .should("be.visible")
      .within(() => {
        cy.get(".w-auto > .mat-icon").should("be.visible");
      });

    // Sidebar Navigation Links
    const menuItems = [
      { path: "/dashboard", label: "Dashboard" },
      { path: "/devices", label: "Devices" },
      { path: "/people", label: "People" },
      { path: "/video-wall", label: "Video Wall" },
    ];

    menuItems.forEach(({ path, label }) => {
      const selector = `[href="${path}"]`;

      // Check if the menu item is visible and contains the expected label
      cy.get(selector).should("be.visible").and("contain.text", label);

      // Check if the associated icon is visible
      cy.get(`${selector} > app-anavio-icon .anavio-icon .mat-icon svg`).should(
        "be.visible"
      );
    });

    // User Info
    cy.get(".w-11").should("be.visible");
    cy.get(".anavio-user-name")
      .should("be.visible")
      .contains("Hal NineThousand");
    cy.get(".anavio-user-details > .mat-mdc-tooltip-trigger")
      .should("be.visible")
      .contains("Clovis");
    cy.get(
      ".anavio-user-account-icon > .mat-mdc-menu-trigger > .mat-icon"
    ).should("be.visible");
  });

  it("when expanded, it should navigate to the appropriate pages when each router link is clicked", () => {
    // Devices
    cy.get('[href="/devices"]').click();
    cy.url().should("include", "/devices/cameras/all-cameras");

    // People
    cy.get('[href="/people"]').click();
    cy.url().should("include", "/people/activity");

    // Video Wall
    cy.get('[href="/video-wall"]').click();
    cy.url().should("include", "/video-wall");

    // Dashboard
    cy.get('[href="/dashboard"]').click();
    cy.url().should("include", "/dashboard");
  });

  it("when expanded, it should open the user account menu and verify each option exists", () => {
    cy.get(
      ".anavio-user-account-icon > .mat-mdc-menu-trigger > .mat-icon"
    ).click();

    // User Account Menu
    cy.get(".mat-mdc-menu-content").should("be.visible");

    // Profile Settings
    cy.get(".mat-mdc-menu-item.ng-star-inserted")
      .should("be.visible")
      .within(() => {
        cy.get(".mat-icon").should("be.visible");
        cy.contains("Profile Settings");
      });

    // Legal
    cy.get("#mat-expansion-panel-header-0")
      .should("be.visible")
      .within(() => {
        cy.get(
          ".mat-content > .mat-expansion-panel-header-title > .mat-icon > svg"
        ).should("be.visible");
        cy.contains("Legal").click();
      });
    cy.get("#cdk-accordion-child-0 > .mat-expansion-panel-body")
      .should("be.visible")
      .within(() => {
        cy.get(".anavio-legal-list > :nth-child(1)")
          .should("be.visible")
          .within(() => {
            cy.contains("Main Services Agreement");
          });
        cy.get(".anavio-legal-list > :nth-child(2)")
          .should("be.visible")
          .within(() => {
            cy.contains("Biometric Privacy Consent");
          });
      });

    // Help
    cy.get(".mat-mdc-menu-content > :nth-child(3)")
      .should("be.visible")
      .within(() => {
        cy.get(".mat-icon > svg").should("be.visible");
        cy.contains("Help");
      });

    // Switch Account
    cy.get("#mat-expansion-panel-header-1")
      .should("be.visible")
      .within(() => {
        cy.get(
          ".mat-content > .mat-expansion-panel-header-title > .mat-icon > svg"
        ).should("be.visible");
        cy.contains("Switch Account").click();
      });
    cy.get("#cdk-accordion-child-1 > .mat-expansion-panel-body")
      .should("be.visible")
      .within(() => {
        cy.get(".anavio-account-list > .mat-mdc-tooltip-trigger")
          .should("be.visible")
          .within(() => {
            cy.contains("Clovis");
            cy.contains("10000015");
          });
      });

    // Log out
    cy.get(".mat-mdc-menu-content > :nth-child(7)")
      .should("be.visible")
      .within(() => {
        cy.get(".mat-icon > svg").should("be.visible");
        cy.contains("Log out");
      });

    // Click outside to close the menu
    cy.get("body").click(0, 0);
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
