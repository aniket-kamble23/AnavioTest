import {
  validAccessResults,
  validDeviceNames,
  validZoneNames,
  validSiteNames,
  validCredentialsType,
} from "../../support/constants.js";

describe("Devices > Door Activity Page Tests", () => {
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
    cy.log("Session restored, navigating to Devices > Door Activity...");
    cy.visit("/devices/doors/door-activity");
  });

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title")
        .should("be.visible")
        .contains("Door Activity");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/devices"]')
        .should("be.visible")
        .contains("Devices");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/devices/doors"]')
        .should("be.visible")
        .contains("Doors");
      cy.get("app-breadcrumbs mat-icon.icon").eq(2).should("be.visible");
      cy.get(
        'app-breadcrumbs .last-breadcrumb-item a[href="/devices/doors/door-activity"]'
      )
        .should("be.visible")
        .contains("Activity");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the navigation bar elements", () => {
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

      // Check that Doors button is the active one
      cy.get("@doorsBtn").should("have.class", "active-route");

      // Verify Add Device button and its icon
      cy.get(".add-device-btn")
        .should("contain", "Add Device")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
        });
    });
  });

  it("should display the Door Activity container header elements", () => {
    cy.get(".mat-mdc-card").within(() => {
      // Navigation buttons
      cy.get(".navigation-buttons").within(() => {
        cy.get('[href="/devices/doors/door-activity"] .nav-btn')
          .as("doorActivityBtn")
          .should("be.visible")
          .find(".mdc-button__label")
          .should("contain", "Door Activity");

        cy.get('[href="/devices/doors/all-doors"] .nav-btn')
          .as("allDoorsBtn")
          .should("be.visible")
          .find(".mdc-button__label")
          .should("contain", "All Doors");

        cy.get("@doorActivityBtn").should("have.class", "active-route");
      });

      // Header section
      cy.get(".door-activity-header")
        .should("be.visible")
        .within(() => {
          cy.get(".title").should("contain.text", "Door Activity");

          cy.get(".search-bar")
            .should("be.visible")
            .within(() => {
              cy.get(".search-input")
                .should("be.visible")
                .and("have.attr", "placeholder", "Search...");
              cy.get("mat-icon")
                .should("exist")
                .find("svg")
                .should("be.visible");
            });

          cy.get("app-date-range-picker")
            .should("be.visible")
            .within(() => {
              cy.get(".button-label").should("contain.text", "Date & Time");
              cy.get("mat-icon")
                .should("exist")
                .find("svg")
                .should("be.visible");
            });

          cy.get("app-filter-button")
            .should("be.visible")
            .within(() => {
              cy.get(".label").should("contain.text", "Filter");
              cy.get("mat-icon")
                .should("exist")
                .find("svg")
                .should("be.visible");
            });
        });
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

  it("should display the Door Activity table row elements", () => {
    // For the first row, verify all required column fields are populated
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-fullName").should("not.be.empty");
        cy.get(".mat-column-time").should("not.be.empty");
        cy.get(".mat-column-deviceName").should("not.be.empty");
        cy.get(".mat-column-zoneName").should("not.be.empty");
        cy.get(".mat-column-siteName").should("not.be.empty");
        cy.get(".mat-column-hasVideo button").should("exist");

        // Check accessResult first and capture its value
        cy.get(".mat-column-accessResult")
          .invoke("text")
          .then((accessResult) => {
            const trimmedAccessResult = accessResult.trim();
            expect(trimmedAccessResult).to.not.be.empty;

            // Check workFlow based on accessResult value
            cy.get(".mat-column-workFlow")
              .invoke("text")
              .then((workflowText) => {
                const trimmedWorkflowText = workflowText.trim();

                cy.wrap(trimmedAccessResult).should((result) => {
                  if (result === "Doorbell") {
                    expect(trimmedWorkflowText).to.be.empty;
                  } else {
                    expect(trimmedWorkflowText).to.not.be.empty;
                  }
                });
              });
          });
      });

    // For the first row, verify the user's full name and either profile image or fallback icon display
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-fullName").within(() => {
          cy.get(".imageClass").then(($image) => {
            // Look for the image first
            const $img = $image.find("img");
            if ($img.length) {
              // If an image exists, assert it's visible
              cy.wrap($img).should("be.visible");
            } else {
              // Otherwise, check for mat-icon svg
              cy.get("mat-icon svg").should("exist").and("be.visible");
            }
          });

          // Validate that the full name text is present and not empty
          cy.get("span.full-name-style")
            .should("exist")
            .invoke("text")
            .then((text) => {
              expect(text.trim().length).to.be.greaterThan(0);
            });
        });
      });

    // For the first row, verify the access result is displayed correctly
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-accessResult")
          .invoke("text")
          .then((text) => {
            const trimmedText = text.trim();

            // Check that the text is in the validAccessResults array
            expect(validAccessResults).to.include(trimmedText);
          });
      });

    // For the first row, verify the date part of the timestamp
    // Get today's date in MM/DD/YY format
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });

    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-time")
          .invoke("text")
          .then((timestamp) => {
            const extractedDate = timestamp.trim().split(",")[0]; // Extract the date part before the comma
            expect(extractedDate).to.equal(formattedDate); // Compare extracted date with today's date
          });
      });

    // For the first row, verify the device name is displayed correctly
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-deviceName")
          .should("exist")
          .invoke("text")
          .then((doorName) => {
            expect(doorName.trim().length).to.be.greaterThan(0);
            if (validDeviceNames.includes(doorName.trim())) {
              expect(validDeviceNames).to.include(doorName.trim());
            } else {
              cy.log(`Encountered new door device name: ${doorName.trim()}`);
            }
          });
      });

    // For the first row, verify the zone name is displayed correctly
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-zoneName")
          .invoke("text")
          .then((text) => {
            expect(validZoneNames).to.include(text.trim());
          });
      });

    // For the first row, verify the site name is displayed correctly
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-siteName")
          .invoke("text")
          .then((text) => {
            expect(validSiteNames).to.include(text.trim());
          });
      });

    // For the first row, verify the credentials type is displayed correctly
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-accessResult")
          .invoke("text")
          .then((accessResult) => {
            const trimmedAccessResult = accessResult.trim();

            cy.get(".mat-column-workFlow")
              .invoke("text")
              .then((workflowText) => {
                const trimmedWorkflowText = workflowText.trim();

                if (trimmedAccessResult === "Doorbell") {
                  // If access result is "Doorbell", workflow should be empty
                  expect(trimmedWorkflowText).to.be.empty;
                } else {
                  // Otherwise, workflow should be one of the valid credential types
                  expect(validCredentialsType).to.include(trimmedWorkflowText);
                }
              });
          });
      });

    // For the first row, verify the presence of the hasVideo icon
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-hasVideo")
          .scrollIntoView()
          .find("svg")
          .should("be.visible");
      });
  });

  it("should display the Door Activity table pagination", () => {
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
          .and("contain.text", "30");
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
          .and("not.to.have.class", "mat-mdc-button-disabled")
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
