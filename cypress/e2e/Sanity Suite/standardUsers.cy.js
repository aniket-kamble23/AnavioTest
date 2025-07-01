import { validUserRoles } from "../../support/constants.js";

describe("Standard Users Page Tests", () => {
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
    cy.log("Session restored, navigating to Standard Users...");
    cy.visit("/settings/users/standard-users");
  });

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("Users");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs mat-icon.icon").eq(0).should("be.visible");
      cy.get('app-breadcrumbs .breadcrumb a[href="/settings/users"]')
        .should("be.visible")
        .contains("Users");
      cy.get("app-breadcrumbs mat-icon.icon").eq(1).should("be.visible");
      cy.get(
        'app-breadcrumbs .last-breadcrumb-item a[href="/settings/users/standard-users"]'
      )
        .should("be.visible")
        .contains("Standard Users");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the navigation bar elements", () => {
    cy.get(".navigation-bar").within(() => {
      // Verify Standard Users button
      cy.get('[href="/settings/users/standard-users"] .nav-btn').as(
        "standardUsersBtn"
      );
      cy.get("@standardUsersBtn").should("be.visible");
      cy.get("@standardUsersBtn")
        .find(".mdc-button__label")
        .should("contain", "Standard Users");

      // Check that Standard Users button is the active one
      cy.get("@standardUsersBtn").should("have.class", "active-route");

      // Verify Guest Users button
      cy.get('[href="/settings/users/guest-users"] .nav-btn').as(
        "guestUsersBtn"
      );
      cy.get("@guestUsersBtn").should("be.visible");
      cy.get("@guestUsersBtn")
        .find(".mdc-button__label")
        .should("contain", "Guest Users");

      // Verify Add Guest button and its icon
      cy.get("button.add-button")
        .should("contain", "Add User")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
        });
    });
  });

  it("should display the Standard Users container header elements", () => {
    cy.get(".mat-mdc-card").within(() => {
      cy.get(".users-header-wrapper")
        .should("be.visible")
        .within(() => {
          cy.get("h2").should("contain.text", "Standard Users");

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

  it("should display the Standard Users table and column headers", () => {
    // Verify Standard Users table
    cy.get('[data-test-id="users-list"]').should("be.visible");

    // Verify Standard Users column headers
    cy.get("tr[mat-header-row] th")
      .should("have.length", 6)
      .then(($headers) => {
        const expectedHeaders = [
          "USER",
          "EMAIL",
          "ROLE",
          "CREATED",
          "STATUS",
          "", // The last column header should be blank
        ];
        $headers.each((index, header) => {
          expect(header.textContent.trim()).to.equal(expectedHeaders[index]);
        });
      });
  });

  it("should verify at least one Standard Users row exists", () => {
    cy.get("tr.mat-mdc-row")
      .should("be.visible")
      .and("have.length.greaterThan", 0);
  });

  it("should display the Standard Users table row elements", () => {
    // For the first row, verify all required column fields are populated
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-user").should("not.be.empty");
        cy.get(".mat-column-email").should("not.be.empty");
        cy.get(".mat-column-role").then(($cell) => {
          const cellText = $cell.text().trim();
          cy.log(`Cell value: "${cellText || "empty"}"`);
        });
        cy.get(".mat-column-created").should("not.be.empty");
        cy.get(".mat-column-status").should("not.be.empty");
        cy.get(".mat-column-menuItems").should("not.be.empty");
      });

    // For the first row, verify the user's full name and either profile image or fallback icon display
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-user").within(() => {
          cy.get("div.profile-image").then(($image) => {
            // Look for the image first
            const $img = $image.find("img");
            if ($img.length) {
              // If an image exists, assert it's visible
              cy.wrap($img).should("be.visible");
            } else {
              // Otherwise, check for mat-icon svg
              cy.get("div.profile-image")
                .invoke("text")
                .then((text) => {
                  expect(text.trim().length).to.be.equal(2);
                });
            }
          });

          // Validate that the full name text is present and not empty
          cy.get("div.nameSpace")
            .should("exist")
            .invoke("text")
            .then((text) => {
              expect(text.trim().length).to.be.greaterThan(0);
            });
        });
      });

    // For the first row, verify the user has a valid email format
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-email")
          .invoke("text")
          .then((email) => {
            const trimmedEmail = email.trim();

            // Simple and reasonable email regex pattern
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            expect(trimmedEmail).to.match(emailRegex);
          });
      });

    // For the first row, verify the user's portal access role
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-role")
          .invoke("text")
          .then((text) => {
            const trimmedText = text.trim();

            //Check that the text is in the validUserRoles array
            expect(validUserRoles).to.include(trimmedText);
          });
      });

    // For the first row, verify the user's created date format
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-created")
          .invoke("text")
          .then((dateText) => {
            const trimmedDate = dateText.trim();

            // Regex for MM/DD/YYYY format
            const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

            expect(trimmedDate).to.match(dateRegex);
          });
      });

    // For the first row, verify the status is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-status")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("Active");
          });
      });

    // For the first row, verify the 3-dot menu button is displayed with the correct icon
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-menuItems")
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
        cy.get(".mat-column-menuItems").find("button.mat-mdc-button").click();
      });

    // Wait for the menu panel to appear in the DOM
    cy.get(".mat-mdc-menu-panel")
      .should("be.visible")
      .within(() => {
        const menuItems = [
          { name: "Suspend", index: 0 },
          { name: "Access Log", index: 1 },
          { name: "Delete User", index: 2 },
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

  it("should display the All Doors table pagination", () => {
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
