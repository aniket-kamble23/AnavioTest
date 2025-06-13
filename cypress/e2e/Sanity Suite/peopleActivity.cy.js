import { validCameraNames, validSiteNames } from "../../support/constants.js";

describe("People > Activity Page Tests", () => {
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
    cy.log("Session restored, navigating to People > Activity...");
    cy.visit("/people/activity");
  });

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("Activity");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/people"]')
        .should("be.visible")
        .contains("People");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get('app-breadcrumbs .last-breadcrumb-item a[href="/people/activity"]')
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
      // Verify Activity button
      cy.get('[href="/people/activity"] .nav-btn').as("activityBtn");
      cy.get("@activityBtn").should("be.visible");
      cy.get("@activityBtn")
        .find(".mdc-button__label")
        .should("contain", "Activity");

      // Verify Unknown People button
      cy.get('[href="/people/unknown-people"] .nav-btn').as("unknownPeopleBtn");
      cy.get("@unknownPeopleBtn").should("be.visible");
      cy.get("@unknownPeopleBtn")
        .find(".mdc-button__label")
        .should("contain", "Unknown People");

      // Verify Known People button
      cy.get('[href="/people/known-people"] .nav-btn').as("knownPeopleBtn");
      cy.get("@knownPeopleBtn").should("be.visible");
      cy.get("@knownPeopleBtn")
        .find(".mdc-button__label")
        .should("contain", "Known People");

      // Verify People of Interest button
      cy.get('[href="/people/people-of-interest"] .nav-btn').as(
        "peopleOfInterestBtn"
      );
      cy.get("@peopleOfInterestBtn").should("be.visible");
      cy.get("@peopleOfInterestBtn")
        .find(".mdc-button__label")
        .should("contain", "People of Interest");

      // Check that Activity button is the active one
      cy.get("@activityBtn").should("have.class", "active-route");

      // Verify Search by Photo button and its icon
      cy.get(".cancel-btn")
        .should("contain", "Search by Photo")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
        });

      // Verify Add Person of Interest button and its icon
      cy.get(".add-poi-btn")
        .should("contain", "Add Person of Interest")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
        });
    });
  });

  it("should display the People Activity container header elements", () => {
    cy.get(".mat-mdc-card").within(() => {
      cy.get(".header")
        .should("be.visible")
        .within(() => {
          // First div: should contain "Activity"
          cy.get("div").eq(0).should("contain.text", "Activity");

          // Second div: should contain the filter button and icon
          cy.get("div")
            .eq(1)
            .within(() => {
              // Verify the Filter button is visible
              cy.get("button.filter-button").should("be.visible");

              // Verify the button label text is 'Filter'
              cy.get(".label").should("contain.text", "Filter");

              // Verify the filter icon exists
              cy.get("mat-icon").should("have.attr", "svgicon", "filter");
            });
        });
    });
  });

  it("should display the Camera Activity grid", () => {
    cy.get(".people-activity-list").should("be.visible");
  });

  it("should display 25 People Activity card elements", () => {
    cy.get(".people-activity-list").within(() => {
      // Verify the number of people activity cards
      cy.get("app-people-activity-card").should("have.length", 25);
    });
  });

  it("should display a date, time, and time zone in each People Activity card header", () => {
    // Regular expression to match date, time, and timezone in string
    const dateTimeRegex =
      /^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM) .+$/;

    cy.get(".people-activity-list").within(() => {
      cy.get("app-people-activity-card").each(($card) => {
        cy.wrap($card)
          .find(".camera-activity-date-time")
          .invoke("text")
          .then((text) => {
            // Trim any whitespace and assert it matches the regex pattern
            expect(text.trim()).to.match(dateTimeRegex);
          });
      });
    });
  });

  it("should display a person icon and 3-dot menu button with the correct icon in each People Activity card header", () => {
    cy.get(".people-activity-list").within(() => {
      cy.get("app-people-activity-card").each(($card) => {
        cy.wrap($card)
          .find("div.actions")
          .within(() => {
            cy.get("button.person-icon")
              .should("exist")
              .within(() => {
                cy.get("mat-icon > svg").should("exist");
              });
            cy.get("button.menu-button")
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
  });

  it("should display options with icons in the first People Activity card 3-dot menu", () => {
    // Open the menu of the first card
    cy.get(".people-activity-list").within(() => {
      cy.get("app-people-activity-card")
        .first()
        .within(() => {
          cy.get("button.menu-button").click();
        });
    });

    // Wait for the panel to appear in the DOM
    cy.get(".mat-mdc-menu-panel")
      .should("be.visible")
      .within(() => {
        const menuItems = [
          { name: "Download Image", index: 0 },
          { name: "Not This Person", index: 1 },
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

  it("should display a pill button containing a person's name in each People Activity card", () => {
    cy.get(".people-activity-list").within(() => {
      cy.get("app-people-activity-card").each(($card) => {
        cy.wrap($card)
          .find("button.pill")
          .should("exist")
          .invoke("text")
          .then((text) => {
            expect(text.trim().length).to.be.greaterThan(0);
          });
      });
    });
  });

  it("should display either an image or a fallback icon in each People Activity card", () => {
    cy.get(".people-activity-list").within(() => {
      cy.get("app-people-activity-card").each(($card) => {
        cy.wrap($card).within(() => {
          cy.get("div.image-container > button").then(($button) => {
            // Look for the image first
            const $img = $button.find('img[alt="Activity Image"]');
            if ($img.length > 0) {
              cy.wrap($img).should("exist");
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

  it("should display a site name and camera name in each People Activity card footer", () => {
    cy.get(".people-activity-list").within(() => {
      cy.get("app-people-activity-card").each(($card) => {
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

  it("should display the See More button at the bottom of the People Activity container", () => {
    cy.get(".load-more-section")
      .scrollIntoView()
      .should("exist")
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
