import { validCameraNames, validSiteNames } from "../../support/constants";

describe("Devices > Camera Activity Page Tests", () => {
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
    cy.log("Session restored, navigating to Devices > Camera Activity...");
    cy.visit("/devices/cameras/activity");
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
        .contains("Camera Activity");
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
        'app-breadcrumbs .last-breadcrumb-item a[href="/devices/cameras/activity"]'
      )
        .should("be.visible")
        .contains("Activity");
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

  it("should display all required Cameras Activity container elements", () => {
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

        cy.get("@cameraActivityBtn").should("have.class", "active-route");
      });

      // Header section
      cy.get(".camera-activity-header")
        .should("be.visible")
        .within(() => {
          cy.get(".title").should("contain.text", "Camera Activity");

          cy.get(".mat-mdc-text-field-wrapper")
            .should("be.visible")
            .within(() => {
              cy.get("input")
                .should("be.visible")
                .and("have.attr", "placeholder", "Show me blue cars last week");
              cy.get(".mat-icon")
                .should("be.visible")
                .find("svg")
                .should("be.visible");
            });

          cy.get("app-date-range-picker")
            .should("be.visible")
            .within(() => {
              cy.get(".button-label").should("contain.text", "Date & Time");
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

  it("should display 20 required Camera Activity Cards UI elements", () => {
    // Verify Camera Activity List
    cy.get(".camera-activity-list").within(() => {
      // Verify the number of camera activity cards
      cy.get("app-camera-activity-card").should("have.length", 20);
    });
  });

  it("should display today's, yesterday's, or tomorrow's date in each Camera Activity Card header", () => {
    const today = new Date();

    const formatDate = (date) => {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const todayFormatted = formatDate(today);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayFormatted = formatDate(yesterday);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowFormatted = formatDate(tomorrow);

    const validDates = [todayFormatted, yesterdayFormatted, tomorrowFormatted];

    cy.get(".camera-activity-list").within(() => {
      cy.get("app-camera-activity-card").each(($card) => {
        cy.wrap($card)
          .find(".camera-activity-date-time")
          .invoke("text")
          .then((text) => {
            expect(validDates.some((date) => text.includes(date))).to.be.true;
          });
      });
    });
  });

  it("should have a 3-dot menu button with correct icon in each Camera Activity Card header", () => {
    cy.get(".camera-activity-list").within(() => {
      cy.get("app-camera-activity-card").each(($card) => {
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

  it("should display options with icons in the first Camera Activity Card 3-dot menu", () => {
    // Open the menu on the first card
    cy.get(".camera-activity-list")
      .find("app-camera-activity-card")
      .first()
      .within(() => {
        cy.get("button.menu-button").click();
      });

    // Wait for the menu panel to appear in the DOM
    cy.get(".mat-mdc-menu-panel")
      .should("be.visible")
      .within(() => {
        const menuItems = [
          { name: "Play Event", index: 0 },
          { name: "Camera History", index: 1 },
          { name: "Download Event", index: 2 },
          { name: "Share Event", index: 3 },
        ];

        // Loop through the menu items for both checks
        menuItems.forEach(({ name, index }) => {
          cy.get("button.mat-mdc-menu-item")
            .eq(index)
            .should("be.visible")
            .should("contain.text", name)
            .within(() => {
              cy.get(".icon-container > mat-icon").should("be.visible");
            });
        });
      });

    // Close the menu
    cy.get("body").click(0, 0);
  });

  it("should display either an image or a fallback icon in each Camera Activity Card", () => {
    cy.get(".camera-activity-list").within(() => {
      cy.get("app-camera-activity-card").each(($card) => {
        cy.wrap($card).within(() => {
          cy.get("button.camera-activity-button").then(($button) => {
            // Look for the image first
            const $img = $button.find("img.camera-activity-image");
            if ($img.length > 0) {
              cy.wrap($img).should("be.exist");
            } else {
              // If no image, look for the fallback icon
              cy.wrap($button)
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

  it("should display a site name and camera name in each Camera Activity Card footer", () => {
    cy.get(".camera-activity-list").within(() => {
      cy.get("app-camera-activity-card").each(($card) => {
        cy.wrap($card).within(() => {
          // Validate Site Name
          cy.get(".site-name")
            .should("exist")
            .invoke("text")
            .then((siteName) => {
              expect(siteName.trim().length).to.be.greaterThan(0);
              if (validSiteNames.includes(siteName.trim())) {
                expect(validSiteNames).to.include(siteName.trim());
              } else {
                cy.log(`Encountered new Site Name: ${siteName.trim()}`);
              }
            });

          // Validate Camera Name
          cy.get(".camera-name")
            .should("exist")
            .invoke("text")
            .then((cameraName) => {
              expect(cameraName.trim().length).to.be.greaterThan(0);
              if (validCameraNames.includes(cameraName.trim())) {
                expect(validCameraNames).to.include(cameraName.trim());
              } else {
                cy.log(`Encountered new Camera Name: ${cameraName.trim()}`);
              }
            });
        });
      });
    });
  });

  it("should display the See More button at the bottom of the Camera Activity container", () => {
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
