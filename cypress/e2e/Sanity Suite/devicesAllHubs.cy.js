import { validHubNames, validSiteNames } from "../../support/constants.js";

describe("Devices > All Hubs Page Tests", () => {
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
    cy.log("Session restored, navigating to Devices > All Hubs...");
    cy.visit("/devices/hubs/all-hubs");
  });

  it("should display all required Header UI elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("All Hubs");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/devices"]')
        .should("be.visible")
        .contains("Devices");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/devices/hubs"]')
        .should("be.visible")
        .contains("Hubs");
      cy.get("app-breadcrumbs mat-icon.icon").eq(2).should("be.visible");
      cy.get(
        'app-breadcrumbs .last-breadcrumb-item a[href="/devices/hubs/all-hubs"]'
      )
        .should("be.visible")
        .contains("All Hubs");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display all required navigation bar elements", () => {
    cy.get(".navigation-bar").within(() => {
      // Verify Cameras button
      cy.get('[href="/devices/cameras"] .nav-btn').as("camerasBtn");
      cy.get("@camerasBtn").should("be.visible");
      cy.get("@camerasBtn")
        .find(".mdc-button__label")
        .should("contain", "Cameras");

      // Verify Doors button
      cy.get('[href="/devices/doors"] .nav-btn').as("doorsBtn");
      cy.get("@doorsBtn").should("be.visible");
      cy.get("@doorsBtn").find(".mdc-button__label").should("contain", "Doors");

      // Verify Hubs button
      cy.get('[href="/devices/hubs"] .nav-btn').as("hubsBtn");
      cy.get("@hubsBtn").should("be.visible");
      cy.get("@hubsBtn").find(".mdc-button__label").should("contain", "Hubs");

      // Check that Hubs button is the active one
      cy.get("@hubsBtn").should("have.class", "active-route");

      // Verify Add Device button and its icon
      cy.get(".add-device-btn")
        .should("contain", "Add Device")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
        });
    });
  });

  it("should display all required All Hubs container elements", () => {
    cy.get(".mat-mdc-card").within(() => {
      // Header section
      cy.get(".all-hub-header-wrapper")
        .should("be.visible")
        .within(() => {
          cy.get("h2").should("contain.text", "All Hubs");

          cy.get(".search-bar")
            .should("be.visible")
            .within(() => {
              cy.get(".search-input")
                .should("be.visible")
                .and("have.attr", "placeholder", "Search...");
              cy.get(".mat-icon")
                .should("be.visible")
                .find("svg")
                .should("be.visible");
            });

          cy.get("app-filter-button")
            .should("be.visible")
            .within(() => {
              cy.get(".label").should("contain.text", "Filter");
              cy.get(".mat-icon")
                .should("be.visible")
                .find("svg")
                .should("be.visible");
            });
        });
    });
  });

  it("should display All Hubs Table and Column Headers", () => {
    // Verify All Hubs Table
    cy.get('[data-test-id="all-hubs-list"]').should("be.visible");

    // Verify All Hubs column headers
    cy.get("tr[mat-header-row] th")
      .should("have.length", 8)
      .then(($headers) => {
        const expectedHeaders = [
          "", // The first column header should be blank
          "HUB NAME",
          "FIXTURE TYPE",
          "MODEL",
          "MAC ADDRESS - SERIAL #",
          "SITES",
          "STATUS",
          "", // The last column header should be blank
        ];
        $headers.each((index, header) => {
          expect(header.textContent.trim()).to.equal(expectedHeaders[index]);
        });
      });
  });

  it("should verify at least one All Hubs row exists", () => {
    cy.get("tr.mat-mdc-row")
      .should("be.visible")
      .and("have.length.greaterThan", 0);
  });

  it("should display All Hubs table row elements", () => {
    // For the first row, verify all column fields are populated
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-colorStatus").should("not.be.empty");
        cy.get("td.mat-column-name").should("not.be.empty");
        cy.get("td.mat-column-fixtureType").should("not.be.empty");
        cy.get("td.mat-column-model").should("not.be.empty");
        cy.get("td.mat-column-serialNumber").should("not.be.empty");
        cy.get("td.mat-column-siteName").should("not.be.empty");
        cy.get("td.mat-column-isConnected").should("not.be.empty");
        cy.get("td.mat-column-menuItems").should("not.be.empty");
      });

    // For the first row, verify the hub status dot is visible
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-colorStatus").within(() => {
          cy.get(".status-dot")
            .should("exist")
            .invoke("attr", "class")
            .then((classAttr) => {
              expect(
                classAttr.includes("status-dot-green") ||
                  classAttr.includes("status-dot-red"),
                `Status dot should be green or red, got: ${classAttr}`
              ).to.be.true;
            });
        });
      });

    // For the first row, verify the hub name is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-name")
          .invoke("text")
          .then((text) => {
            expect(validHubNames).to.include(text.trim());
          });
      });

    // For the first row, verify the fixture type is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-fixtureType")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("Single");
          });
      });

    // For the first row, verify the model is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-model")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("VNX-EL-NH4C-0");
          });
      });

    // For the first row, verify the MAC address is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-serialNumber")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.match(/^[0-9A-Fa-f]{12}-[A-Z0-9]+$/);
          });
      });

    // For the first row, verify the site name is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-siteName")
          .invoke("text")
          .then((text) => {
            expect(validSiteNames).to.include(text.trim());
          });
      });

    // For the first row, verify the status is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-isConnected")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("Active");
          });
      });

    // For the first row, verify the 3-dot menu button is displayed with the correct icon
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-menuItems")
          .find("button.mat-mdc-button")
          .should("exist")
          .within(() => {
            cy.get("mat-icon")
              .should("have.attr", "data-mat-icon-name", "more-vertical")
              .within(() => {
                cy.get("svg").should("exist");
              });
          });
      });

    // For the first row, verify the 3-dot menu options with icons
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        // Open the menu on the first card
        cy.get("td.mat-column-menuItems").find("button.mat-mdc-button").click();
      });

    // Wait for the menu panel to appear in the DOM
    cy.get(".mat-mdc-menu-panel")
      .should("be.visible")
      .within(() => {
        const menuItems = [
          { name: "Change Name", index: 0 },
          { name: "Resync Device", index: 1 },
          { name: "Hub Settings", index: 2 },
          { name: "Delete Device", index: 3 },
        ];

        // Loop through the menu items for both checks
        menuItems.forEach(({ name, index }) => {
          cy.get("button.mat-mdc-menu-item")
            .eq(index)
            .should("be.visible")
            .should("contain.text", name)
            .within(() => {
              cy.get("mat-icon").find("svg").should("be.visible");
            });
        });
      });

    // Close the menu
    cy.get("body").click(0, 0);
  });

  it("should display Door Activity table pagination", () => {
    cy.get(".mat-mdc-paginator-container")
      .should("be.visible")
      .within(() => {
        // Verify the Results per page dropdown text
        cy.get(".mat-mdc-paginator-page-size-label")
          .should("be.visible")
          .and("contain.text", "Results");
        // Verify the results per page dropdown value
        cy.get(".mat-mdc-select-min-line")
          .should("be.visible")
          .and("contain.text", "10");
        // Verify the results per page dropdown arrow icon
        cy.get(".mat-mdc-select-arrow")
          .should("exist")
          .within(() => {
            cy.get("svg").should("be.visible");
          });
        // Verify the previous page button
        cy.get(".mat-mdc-paginator-navigation-previous")
          .should("exist")
          .and("to.have.class", "mat-mdc-button-disabled")
          .within(() => {
            cy.get("svg").should("be.visible");
          });
        // Verify at least one page button is present
        cy.get("button.custom-paginator-page")
          .should("exist")
          .and("have.length.greaterThan", 0);
        // Verify the first page button
        cy.get("button.custom-paginator-page")
          .first()
          .should("be.visible")
          .and("have.class", "custom-paginator-page-disabled")
          .and("contain.text", "1");
        // Verify the next page button
        cy.get(".mat-mdc-paginator-navigation-next")
          .should("exist")
          .within(() => {
            cy.get("svg").should("be.visible");
          });
      });
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
