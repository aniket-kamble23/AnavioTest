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

  it("should display all required Header UI elements", () => {
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

  it("should display all required All Cameras container elements", () => {
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

          [".grid-button", ".list-button"].forEach((btnClass) => {
            cy.get(btnClass)
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
  });

  it("should display 10 required camera thumbnail cards", () => {
    cy.get('[data-test-id="allcameras-thumbnails"]')
      .should("be.visible")
      .within(() => {
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

  it("should display the camera's name in each camera thumbnail card header", () => {
    cy.get('[data-test-id="allcameras-thumbnails"]').within(() => {
      cy.get("mat-card").each(($card) => {
        cy.wrap($card).within(() => {
          cy.get(".camera-title")
            .should("exist")
            .invoke("text")
            .then((text) => {
              expect(text.trim().length).to.be.greaterThan(0);
            });
        });
      });
    });
  });

  it("should have a 3-dot menu button with correct icon in each camera thumbnail card header", () => {
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
              cy.get(".icon-container > mat-icon > svg").should("be.visible");
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

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
