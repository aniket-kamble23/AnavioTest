describe("Dashboard Page Tests", () => {
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

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".anavio-header-title").should("be.visible").contains("Dashboard");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the Status Cards elements", () => {
    // Verify Status Cards
    cy.get(".grid").within(() => {
      // Verify the number of status cards
      cy.get("app-dashboard-status-card-component").should("have.length", 3);

      // Verify Status Cards Titles
      const titles = ["Camera Status", "Door Status", "User Activity"];
      cy.get("app-dashboard-status-card-component").each(($card, index) => {
        cy.wrap($card).invoke("attr", "title").should("eq", titles[index]);
      });

      // Verify Icons in Status Cards
      cy.get("app-camera-icon svg").should("be.visible");
      cy.get("app-door-icon svg").should("be.visible");
      cy.get("app-user-icon svg").should("be.visible");

      // Verify Charts in Status Cards
      cy.get("#chart-cameras").should("be.visible");
      cy.get("#chart-doors").should("be.visible");
      cy.get("#chart-user-activity").should("be.visible");

      // Verify Status Cards Content
    });
  });

  it("should display the Door Activity container header elements", () => {
    // Verify Door Activity Container
    cy.get("app-dashboard-door-activity").within(() => {
      // Verify Header
      cy.get("mat-expansion-panel-header")
        .should("be.visible")
        // Verify the two buttons and their labels
        .within(() => {
          cy.get("button").should("have.length", 2);
          // Select the first button, assert its label and that it is active
          cy.get("button")
            .eq(0)
            .should("contain.text", "Door Activity")
            .and("have.class", "active");
          // Select the second button, check its label
          cy.get("button").eq(1).should("contain.text", "Door Control");
        });
      // Verify mat-expansion-indicator contains an svg and the svg is visible
      cy.get("mat-expansion-panel-header .mat-expansion-indicator svg").should(
        "be.visible"
      );
    });
  });

  it("should display the Door Activity title and action elements", () => {
    // Verify Door Activity Title and Actions
    cy.get(".title-and-actions").within(() => {
      // Verify Title and Subtitle
      cy.get('[data-test-id="panelTitle"]').should(
        "have.text",
        "Door Activity"
      );
      cy.get('[data-test-id="panelSubTitle"]').should("have.text", "(Today)");
      // Verify the two buttons and their labels
      cy.get(".filter-button .label").should("have.text", "Filter");
      cy.get(".filter-button mat-icon svg").should("be.visible");
      cy.get('[data-test-id="panelHeaderButton"] .label').should(
        "have.text",
        "More Activity"
      );
    });
  });

  it("should display the Door Activity table and column headers", () => {
    // Verify Door Activity Table
    cy.get('[data-test-id="mat-door-activityList"]').should("be.visible");

    // Verify Door Activity Column Headers
    cy.get('[data-test-id="mat-door-activityList-header"] th')
      .should("have.length", 8) // Ensure there are exactly 8 headers
      .then(($headers) => {
        const expectedHeaders = [
          "USER",
          "RESULTS",
          "DATE & TIME",
          "DOORS",
          "ZONE",
          "SITES",
          "CREDENTIALS",
          "", // The last column header should be blank
        ];

        $headers.each((index, header) => {
          expect(header.textContent.trim()).to.equal(expectedHeaders[index]);
        });
      });
  });

  it("should verify at least one Door Activity row exists", () => {
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .should("be.visible")
      .and("have.length.greaterThan", 0);
  });

  it("should click on the Door Control button and verify the button is active", () => {
    // Click on the Door Control button
    cy.get("app-dashboard-door-activity button").eq(1).click();
    // Verify the Door Control button is active
    cy.get("app-dashboard-door-activity button")
      .eq(1)
      .should("have.class", "active");
  });

  it("should display the Door Control title elements", () => {
    // Access the Door Control section
    cy.get("app-dashboard-door-activity button").eq(1).click();
    // Verify the presence of the Door Control Title UI elements
    cy.get(".title-and-actions").within(() => {
      cy.get('[data-test-id="panelTitle"]').should("have.text", "Door Control");
    });
  });

  it("should display the Door Control table and column headers", () => {
    // Access the Door Control section
    cy.get("app-dashboard-door-activity button").eq(1).click();
    // Verify Door Control Table
    cy.get(".door-control mat-table")
      .should("be.visible")
      .within(() => {
        // Verify Door Control Column Headers
        cy.get(".mat-mdc-header-row th")
          .should("have.length", 5) // Ensure there are exactly 5 headers
          .then(($headers) => {
            const expectedHeaders = [
              "", // The first column header should be blank
              "DOORS",
              "VIDEO",
              "LOCK STATE",
              "DOOR STATE",
            ];

            $headers.each((index, header) => {
              expect(header.textContent.trim()).to.equal(
                expectedHeaders[index]
              );
            });
          });
      });
  });

  it("should verify at least one Door Control row exists", () => {
    // Access the Door Control section
    cy.get("app-dashboard-door-activity button").eq(1).click();

    cy.get(".door-control mat-table").within(() => {
      // Verify at least one Door Activity row exists
      cy.get(".mat-mdc-row")
        .should("be.visible")
        .and("have.length.greaterThan", 0);
    });
  });

  it("should display the Camera Activity container header elements", () => {
    // Verify Camera Activity Container
    cy.get("app-expandable-camera-activity").within(() => {
      // Verify Header
      cy.get("mat-expansion-panel-header")
        .should("be.visible")
        .within(() => {
          // Verify Title and Subtitle
          cy.get('[data-test-id="panelTitle"]').should(
            "have.text",
            "Camera Activity"
          );
          cy.get('[data-test-id="panelSubTitle"]').should(
            "have.text",
            "(Today)"
          );
          // Verify the button and its label
          cy.get('[data-test-id="panelHeaderButton"] .label').should(
            "have.text",
            "More Activity"
          );
          // Verify mat-expansion-indicator contains an svg and the svg is visible
          cy.get(".mat-expansion-indicator svg").should("be.visible");
        });
    });
  });

  it("should display the Camera Activity grid", () => {
    cy.get(".camera-activity-list").should("be.visible");
  });

  it("should display 20 Camera Activity card elements", () => {
    cy.get(".camera-activity-list").within(() => {
      // Verify the number of camera activity cards
      cy.get("app-camera-activity-card").should("have.length", 20);
    });
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
