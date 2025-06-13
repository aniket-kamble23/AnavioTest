describe("People > Unknown People Page Tests", () => {
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
    cy.log("Session restored, navigating to People > Unknown People...");
    cy.visit("/people/unknown-people");
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
        .contains("Unknown People");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/people"]')
        .should("be.visible")
        .contains("People");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get(
        'app-breadcrumbs .last-breadcrumb-item a[href="/people/unknown-people"]'
      )
        .should("be.visible")
        .contains("Unknown People");
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

      // Check that Unknown People button is the active one
      cy.get("@unknownPeopleBtn").should("have.class", "active-route");

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

  it("should display the Unknown People container header elements", () => {
    cy.get(".mat-mdc-card").within(() => {
      cy.get(".header")
        .should("be.visible")
        .within(() => {
          // First div: should contain "Unknown People"
          cy.get("div").eq(0).should("contain.text", "Unknown People");
        });
    });
  });

  it("should display the Unknown People grid", () => {
    cy.get(".unknown-people-list").should("be.visible");
  });

  it("should display 25 Unknown People card elements", () => {
    cy.get(".unknown-people-list").within(() => {
      // Verify the number of unknown people cards
      cy.get("app-people-person-card").should("have.length", 25);
    });
  });

  it("should display a person icon and 3-dot menu button with the correct icon in each Unknown People card header", () => {
    cy.get(".unknown-people-list").within(() => {
      cy.get("app-people-person-card").each(($card) => {
        cy.wrap($card)
          .find("div.header")
          .within(() => {
            cy.get('mat-icon[data-mat-icon-name="suspend"]')
              .should("exist")
              .within(() => {
                cy.get("svg").should("exist");
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

  it("should display options with icons in the first Unknown People card 3-dot menu", () => {
    // Open the menu of the first card
    cy.get(".unknown-people-list").within(() => {
      cy.get("app-people-person-card")
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
          { name: "Add Person of Interest", index: 0 },
          { name: "Add to Known People", index: 1 },
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
  });

  it("should display either an image or a fallback icon in each Unknown People card", () => {
    cy.get(".unknown-people-list").within(() => {
      cy.get("app-people-person-card").each(($card) => {
        cy.wrap($card).within(() => {
          cy.get("div.content > button").then(($button) => {
            // Look for the image first
            const $img = $button.find('img[alt="profile picture"]');
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

  it("should display View Activity button in each Unknown People card footer", () => {
    cy.get(".unknown-people-list").within(() => {
      cy.get("app-people-person-card").each(($card) => {
        cy.wrap($card)
          .find("button.view-activity-button")
          .should("exist")
          .and("contain.text", "View Activity");
      });
    });
  });

  it("should display the See More button at the bottom of the People Activity container", () => {
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
