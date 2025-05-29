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
    cy.get(".mat-mdc-menu-content")
      .should("be.visible")
      .within(() => {
        // Profile Settings
        cy.get(".mat-mdc-menu-item")
          .eq(0)
          .should("be.visible")
          .within(() => {
            cy.get(".mat-icon").should("be.visible");
            cy.contains("Profile Settings");
          });

        // Legal
        cy.get(".mat-accordion")
          .eq(0)
          .should("be.visible")
          .within(() => {
            cy.get(
              ".mat-content > .mat-expansion-panel-header-title > .mat-icon > svg"
            ).should("be.visible");
            cy.contains("Legal").click();
          });
        cy.get(".anavio-legal-list")
          .should("be.visible")
          .within(() => {
            cy.get(".legal-item")
              .eq(0)
              .should("be.visible")
              .within(() => {
                cy.contains("Main Services Agreement");
              });
            cy.get(".legal-item")
              .eq(1)
              .should("be.visible")
              .within(() => {
                cy.contains("Biometric Privacy Consent");
              });
          });

        // Help
        cy.get(".mat-mdc-menu-item")
          .eq(1)
          .should("be.visible")
          .within(() => {
            cy.get(".mat-icon > svg").should("be.visible");
            cy.contains("Help");
          });

        // Switch Account
        cy.get(".mat-accordion")
          .eq(1)
          .should("be.visible")
          .within(() => {
            cy.get(
              ".mat-content > .mat-expansion-panel-header-title > .mat-icon > svg"
            ).should("be.visible");
            cy.contains("Switch Account").click();
          });
        cy.get(".anavio-account-list")
          .should("be.visible")
          .within(() => {
            cy.get(".account-item")
              .eq(0)
              .should("be.visible")
              .within(() => {
                cy.get(".mat-icon > svg").should("be.visible");
                cy.get(".account-profile-img")
                  .should("be.visible")
                  .and("contain.text", "C");
                cy.contains("Clovis");
                cy.contains("10000015");
              });
          });

        // Log out
        cy.get(".mat-mdc-menu-item")
          .eq(2)
          .should("be.visible")
          .within(() => {
            cy.get(".mat-icon > svg").should("be.visible");
            cy.contains("Log out");
          });
      });
    // Click outside to close the menu
    cy.get("body").click(0, 0);
  });

  it("when expanded, it should navigate to the appropriate pages when each user account menu item is clicked", () => {
    cy.get(
      ".anavio-user-account-icon > .mat-mdc-menu-trigger > .mat-icon"
    ).click();

    // Profile Settings
    cy.get(".mat-mdc-menu-item").eq(0).click();

    cy.url().should("include", "/settings/profile");

    cy.get(
      ".anavio-user-account-icon > .mat-mdc-menu-trigger > .mat-icon"
    ).click();

    // Legal
    cy.get(".mat-accordion").eq(0).click();

    // Stub window.open
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });

    cy.get(".anavio-legal-list").within(() => {
      // Main Services Agreement
      cy.get(".legal-item").eq(0).click();
      cy.get("@windowOpen").should(
        "be.calledWith",
        "https://anavio.ai/main-services-agreement"
      );

      // Biometric Privacy Consent
      cy.get(".legal-item").eq(1).click();
      cy.get("@windowOpen").should(
        "be.calledWith",
        "https://anavio.ai/biometric-privacy-consent"
      );
    });

    // Help
    cy.get(".mat-mdc-menu-item").eq(1).click();
    cy.get("@windowOpen").should(
      "be.calledWith",
      "https://help.anavio.ai/hc/en-us"
    );

    // Click outside to close the menu
    cy.get("body").click(0, 0);
  });

  it("when expanded, it should collapse when the sidebar toggler is clicked", () => {
    cy.get(".sidebar-toggler").click();
    cy.get(".sidebar")
      .should("be.visible")
      .should(($sidebar) => {
        expect($sidebar).to.have.css("width", "80px");
      });
  });

  it("when expanded, it should collapse when the Anavio logo icon is clicked", () => {
    cy.get("button > .anavio-icon").click();
    cy.get(".sidebar")
      .should("be.visible")
      .should(($sidebar) => {
        expect($sidebar).to.have.css("width", "80px");
      });
  });

  it("when collapsed, it should display all required UI elements", () => {
    // Collapse the sidebar
    cy.get(".sidebar-toggler").click();

    // Sidebar container
    cy.get(".sidebar").should("be.visible");

    // Sidebar Logo
    cy.get(".sidebar-logo")
      .should("be.visible")
      .within(() => {
        cy.get(".only-logo")
          .should("be.visible")
          .within(() => {
            cy.get(".anavio-icon").should("be.visible");
          });
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
      });

    // Sidebar Toggler
    cy.get(".sidebar-toggler")
      .should("be.visible")
      .within(() => {
        cy.get(".w-auto > .mat-icon").should("be.visible");
      });

    // Sidebar Navigation Links
    const menuItems = [
      { path: "/dashboard" },
      { path: "/devices" },
      { path: "/people" },
      { path: "/video-wall" },
    ];

    menuItems.forEach(({ path, label }) => {
      const selector = `[href="${path}"]`;

      // Check if the menu item is visible
      cy.get(selector).should("be.visible");

      // Check if the associated icon is visible
      cy.get(`${selector} > app-anavio-icon .anavio-icon .mat-icon svg`).should(
        "be.visible"
      );
    });

    // User Info
    cy.get(".w-11").should("be.visible");
  });

  it("when collapsed, it should navigate to the appropriate pages when each router link is clicked", () => {
    // Collapse the sidebar
    cy.get(".sidebar-toggler").click();

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

  it("when collapsed, it should open the user account menu and verify each option exists", () => {
    // Collapse the sidebar
    cy.get(".sidebar-toggler").click();

    cy.get(".mat-mdc-menu-trigger > .profile-image").click();

    // User Account Menu
    cy.get(".mat-mdc-menu-content")
      .should("be.visible")
      .within(() => {
        // Profile Settings
        cy.get(".mat-mdc-menu-item")
          .eq(0)
          .should("be.visible")
          .within(() => {
            cy.get(".mat-icon").should("be.visible");
            cy.contains("Profile Settings");
          });

        // Legal
        cy.get(".mat-accordion")
          .eq(0)
          .should("be.visible")
          .within(() => {
            cy.get(
              ".mat-content > .mat-expansion-panel-header-title > .mat-icon > svg"
            ).should("be.visible");
            cy.contains("Legal").click();
          });
        cy.get(".anavio-legal-list")
          .should("be.visible")
          .within(() => {
            cy.get(".legal-item")
              .eq(0)
              .should("be.visible")
              .within(() => {
                cy.contains("Main Services Agreement");
              });
            cy.get(".legal-item")
              .eq(1)
              .should("be.visible")
              .within(() => {
                cy.contains("Biometric Privacy Consent");
              });
          });

        // Help
        cy.get(".mat-mdc-menu-item")
          .eq(1)
          .should("be.visible")
          .within(() => {
            cy.get(".mat-icon > svg").should("be.visible");
            cy.contains("Help");
          });

        // Switch Account
        cy.get(".mat-accordion")
          .eq(1)
          .should("be.visible")
          .within(() => {
            cy.get(
              ".mat-content > .mat-expansion-panel-header-title > .mat-icon > svg"
            ).should("be.visible");
            cy.contains("Switch Account").click();
          });
        cy.get(".anavio-account-list")
          .should("be.visible")
          .within(() => {
            cy.get(".account-item")
              .eq(0)
              .should("be.visible")
              .within(() => {
                cy.get(".mat-icon > svg").should("be.visible");
                cy.get(".account-profile-img")
                  .should("be.visible")
                  .and("contain.text", "C");
                cy.contains("Clovis");
                cy.contains("10000015");
              });
          });

        // Log out
        cy.get(".mat-mdc-menu-item")
          .eq(2)
          .should("be.visible")
          .within(() => {
            cy.get(".mat-icon > svg").should("be.visible");
            cy.contains("Log out");
          });
      });

    // Click outside to close the menu
    cy.get("body").click(0, 0);
  });

  it("when collapsed, it should navigate to the appropriate pages when each user account menu item is clicked", () => {
    // Collapse the sidebar
    cy.get(".sidebar-toggler").click();

    cy.get(".mat-mdc-menu-trigger > .profile-image").click();

    // Profile Settings
    cy.get(".mat-mdc-menu-item").eq(0).click();

    cy.url().should("include", "/settings/profile");

    cy.get(".mat-mdc-menu-trigger > .profile-image").click();

    // Legal
    cy.get(".mat-accordion").eq(0).click();

    // Stub window.open
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });

    cy.get(".anavio-legal-list").within(() => {
      // Main Services Agreement
      cy.get(".legal-item").eq(0).click();
      cy.get("@windowOpen").should(
        "be.calledWith",
        "https://anavio.ai/main-services-agreement"
      );

      // Biometric Privacy Consent
      cy.get(".legal-item").eq(1).click();
      cy.get("@windowOpen").should(
        "be.calledWith",
        "https://anavio.ai/biometric-privacy-consent"
      );
    });

    // Help
    cy.get(".mat-mdc-menu-item").eq(1).click();
    cy.get("@windowOpen").should(
      "be.calledWith",
      "https://help.anavio.ai/hc/en-us"
    );

    // Click outside to close the menu
    cy.get("body").click(0, 0);
  });

  it("when collapsed, it should expand when the sidebar toggler is clicked", () => {
    // Collapse the sidebar
    cy.get(".sidebar-toggler").click();

    cy.get(".sidebar-toggler").click();
    cy.get(".sidebar")
      .should("be.visible")
      .should(($sidebar) => {
        expect($sidebar).to.have.css("width", "288px");
      });
  });

  it("when collapsed, it should expand when the Anavio logo icon is clicked", () => {
    // Collapse the sidebar
    cy.get("button > .anavio-icon").click();

    cy.get("button > .anavio-icon").click();
    cy.get(".sidebar")
      .should("be.visible")
      .should(($sidebar) => {
        expect($sidebar).to.have.css("width", "288px");
      });
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
