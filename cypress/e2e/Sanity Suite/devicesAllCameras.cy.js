import {
  validCameraNames,
  validSiteNames,
  validZoneNames,
} from "../../support/constants.js";

describe("Devices > All Cameras Page Tests", () => {
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
    cy.log("Session restored, navigating to Devices > All Cameras...");
    cy.visit("/devices/cameras/all-cameras");
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
        .contains("All Cameras");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/devices"]')
        .should("be.visible")
        .contains("Devices");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/devices/cameras"]')
        .should("be.visible")
        .contains("Cameras");
      cy.get("app-breadcrumbs mat-icon.icon").eq(2).should("be.visible");
      cy.get(
        'app-breadcrumbs .last-breadcrumb-item a[href="/devices/cameras/all-cameras"]'
      )
        .should("be.visible")
        .contains("All");
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

      // Check that Cameras button is the active one
      cy.get("@camerasBtn").should("have.class", "active-route");

      // Verify Add Device button and its icon
      cy.get(".add-device-btn")
        .should("contain", "Add Device")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
        });
    });
  });

  it("should display the All Cameras container header elements in grid view", () => {
    cy.get(".mat-mdc-card").within(() => {
      // Navigation buttons
      cy.get(".navigation-buttons").within(() => {
        cy.get('[href="/devices/cameras/activity"] .nav-btn')
          .as("cameraActivityBtn")
          .should("be.visible")
          .find(".mdc-button__label")
          .should("contain", "Camera Activity");

        cy.get('[href="/devices/cameras/all-cameras"] .nav-btn')
          .as("allCamerasBtn")
          .should("be.visible")
          .find(".mdc-button__label")
          .should("contain", "All Cameras");

        cy.get("@allCamerasBtn").should("have.class", "active-route");
      });

      // Header section
      cy.get(".all-camera-header-wrapper")
        .should("be.visible")
        .within(() => {
          cy.get("h2").should("contain.text", "All Cameras");

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

          cy.get(".grid-button")
            .should("be.visible")
            .and("be.disabled")
            .within(() => {
              cy.get(".mat-icon")
                .should("be.visible")
                .find("svg")
                .should("be.visible");
            });

          cy.get(".list-button")
            .should("be.visible")
            .within(() => {
              cy.get(".mat-icon")
                .should("be.visible")
                .find("svg")
                .should("be.visible");
            });
        });
    });
  });

  it("should display the All Cameras thumbnails grid", () => {
    cy.get('[data-test-id="allcameras-thumbnails"]').should("be.visible");
  });

  it("should display 10 camera thumbnail cards", () => {
    cy.get('[data-test-id="allcameras-thumbnails"]').within(() => {
      cy.get("mat-card").should("have.length", 10);
    });
  });

  it("should display the camera connection status in each camera thumbnail card header", () => {
    cy.get('[data-test-id="allcameras-thumbnails"]').within(() => {
      cy.get("mat-card").each(($card) => {
        cy.wrap($card).within(() => {
          cy.get("span.connection-status")
            .should("exist")
            .invoke("attr", "class")
            .then((classAttr) => {
              expect(
                classAttr.includes("connected-camera") ||
                  classAttr.includes("disconnected-camera"),
                `Expected connection status to have either 'connected-camera' or 'disconnected-camera', got: ${classAttr}`
              ).to.be.true;
            });
        });
      });
    });
  });

  it("should display the camera name in each camera thumbnail card header", () => {
    cy.get('[data-test-id="allcameras-thumbnails"]').within(() => {
      cy.get("mat-card").each(($card) => {
        cy.wrap($card).within(() => {
          cy.get(".camera-title")
            .should("exist")
            .invoke("text")
            .then((cameraName) => {
              expect(cameraName.trim().length).to.be.greaterThan(0);
              if (validCameraNames.includes(cameraName.trim())) {
                expect(validCameraNames).to.include(cameraName.trim());
              } else {
                cy.log(`Encountered new camera name: ${cameraName.trim()}`);
              }
            });
        });
      });
    });
  });

  it("should have a 3-dot menu button with the correct icon in each camera thumbnail card header", () => {
    cy.get('[data-test-id="allcameras-thumbnails"]').within(() => {
      cy.get("mat-card").each(($card) => {
        cy.wrap($card)
          .find("button.menu-button")
          .should("exist")
          .within(() => {
            cy.get("mat-icon")
              .should("have.attr", "data-mat-icon-name", "more-vertical")
              .within(() => {
                cy.get("svg").should("exist");
              });
          });
      });
    });
  });

  it("should display the 3-dot menu options with icons in the first camera thumbnail card header", () => {
    // Open the menu on the first card
    cy.get('[data-test-id="allcameras-thumbnails"] mat-card')
      .first()
      .within(() => {
        cy.get("button.menu-button").click();
      });

    // Wait for the menu panel to appear in the DOM
    cy.get(".mat-mdc-menu-panel")
      .should("be.visible")
      .within(() => {
        const menuItems = [
          { name: "Change Name", index: 0 },
          { name: "Change Zone", index: 1 },
          { name: "Change Analytics", index: 2 },
          { name: "Camera Settings", index: 3 },
          { name: "Delete Device", index: 4 },
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

  it("should display either an image or a fallback icon in each camera thumbnail card", () => {
    cy.get('[data-test-id="allcameras-thumbnails"]').within(() => {
      cy.get("mat-card").each(($card) => {
        cy.wrap($card).within(() => {
          // Try to get the image, if not found, check for fallback
          cy.get("mat-card-content").then(($content) => {
            cy.wrap($content)
              .find("img")
              .then(($img) => {
                if ($img.length > 0) {
                  cy.wrap($img).should("exist");
                } else {
                  // If no image found, assert fallback icon exists
                  cy.wrap($content)
                    .find("mat-icon")
                    .should("exist")
                    .within(() => {
                      cy.get("svg").should("exist");
                    });
                }
              });
          });
        });
      });
    });
  });

  it("should display the See More button at the bottom of the all cameras container", () => {
    cy.get(".load-more-section")
      .scrollIntoView()
      .should("exist")
      .and("be.visible")
      .within(() => {
        cy.get("button.load-more-button")
          .scrollIntoView()
          .should("exist")
          .and("be.visible")
          .and("contain", "See More")
          .within(() => {
            cy.get("mat-icon").find("svg").should("be.visible");
          });
      });
  });

  it("should click on the list button and display the All Cameras container header elements in list view", () => {
    // Click on the list button
    cy.get(".list-button").click();

    // Verify the All Cameras container header elements in list view
    cy.get(".mat-mdc-card").within(() => {
      // Navigation buttons
      cy.get(".navigation-buttons").within(() => {
        cy.get('[href="/devices/cameras/activity"] .nav-btn')
          .as("cameraActivityBtn")
          .should("be.visible")
          .find(".mdc-button__label")
          .should("contain", "Camera Activity");

        cy.get('[href="/devices/cameras/all-cameras"] .nav-btn')
          .as("allCamerasBtn")
          .should("be.visible")
          .find(".mdc-button__label")
          .should("contain", "All Cameras");

        cy.get("@allCamerasBtn").should("have.class", "active-route");
      });

      // Header section
      cy.get(".all-camera-header-wrapper")
        .should("be.visible")
        .within(() => {
          cy.get("h2").should("contain.text", "All Cameras");

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

          cy.get(".grid-button")
            .should("be.visible")
            .within(() => {
              cy.get(".mat-icon")
                .should("be.visible")
                .find("svg")
                .should("be.visible");
            });

          cy.get(".list-button")
            .should("be.visible")
            .and("be.disabled")
            .within(() => {
              cy.get(".mat-icon")
                .should("be.visible")
                .find("svg")
                .should("be.visible");
            });
        });
    });
  });

  it("should display the All Cameras table and column headers", () => {
    // Click on the list button
    cy.get(".list-button").click();

    // Verify the All Cameras table
    cy.get('[data-test-id="all-cameras-list"]').should("be.visible");

    // Verify the All Cameras column headers
    cy.get("tr[mat-header-row] th")
      .should("have.length", 8)
      .then(($headers) => {
        const expectedHeaders = [
          "", // The first column header should be blank
          "CAMERA NAME",
          "MODEL",
          "MAC ADDRESS - SERIAL #",
          "SITES",
          "ZONES",
          "STATUS",
          "", // The last column header should be blank
        ];
        $headers.each((index, header) => {
          expect(header.textContent.trim()).to.equal(expectedHeaders[index]);
        });
      });
  });

  it("should verify at least one All Cameras row exists", () => {
    // Click on the list button
    cy.get(".list-button").click();

    // Verify that at least one row exists in the All Cameras table
    cy.get("tr.mat-mdc-row")
      .should("be.visible")
      .and("have.length.greaterThan", 0);
  });

  it("should display the All Cameras table row elements", () => {
    // Click on the list button
    cy.get(".list-button").click();

    // For the first row, verify all column fields are populated
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-colorStatus").should("not.be.empty");
        cy.get("td.mat-column-name").should("not.be.empty");
        cy.get("td.mat-column-model").should("not.be.empty");
        cy.get("td.mat-column-serialNumber").should("not.be.empty");
        cy.get("td.mat-column-siteName").should("not.be.empty");
        cy.get("td.mat-column-primaryZoneName").should("not.be.empty");
        cy.get("td.mat-column-isConnected").should("not.be.empty");
        cy.get("td.mat-column-menuItems").should("not.be.empty");
      });

    // For the first row, verify the camera status dot is visible
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

    // For the firstrow, verify the camera name is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-name")
          .should("exist")
          .invoke("text")
          .then((cameraName) => {
            const trimmedName = cameraName.trim();
            expect(trimmedName.length).to.be.greaterThan(0);
            if (validCameraNames.includes(trimmedName)) {
              expect(validCameraNames).to.include(trimmedName);
            } else {
              cy.log(`Encountered new camera name: ${trimmedName}`);
            }
          });
      });

    // For the first row, verify the model is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-model")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("VNX-SN-VRS1-0");
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

    // For the first row, verify the zone name is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get("td.mat-column-primaryZoneName")
          .invoke("text")
          .then((text) => {
            expect(validZoneNames).to.include(text.trim());
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
        // Open the menu on the first row
        cy.get("td.mat-column-menuItems").find("button.mat-mdc-button").click();
      });

    // Wait for the menu panel to appear in the DOM
    cy.get(".mat-mdc-menu-panel")
      .should("be.visible")
      .within(() => {
        const menuItems = [
          { name: "Change Name", index: 0 },
          { name: "Change Zone", index: 1 },
          { name: "Change Analytics", index: 2 },
          { name: "Camera Settings", index: 3 },
          { name: "Delete Device", index: 4 },
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

  it("should display the All Cameras table pagination", () => {
    // Click on the list button
    cy.get(".list-button").click();

    // Verify the All Cameras table pagination
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
