describe("Guest Users Page Tests", () => {
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
    cy.log("Session restored, navigating to Guest Users...");
    cy.visit("/settings/users/guest-users");
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
        'app-breadcrumbs .last-breadcrumb-item a[href="/settings/users/guest-users"]'
      )
        .should("be.visible")
        .contains("Guest User");
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

      // Verify Guest Users button
      cy.get('[href="/settings/users/guest-users"] .nav-btn').as(
        "guestUsersBtn"
      );
      cy.get("@guestUsersBtn").should("be.visible");
      cy.get("@guestUsersBtn")
        .find(".mdc-button__label")
        .should("contain", "Guest Users");

      // Check that Guest Users button is the active one
      cy.get("@guestUsersBtn").should("have.class", "active-route");

      // Verify Add Guest button and its icon
      cy.get(".add-button")
        .should("contain", "Add Guest")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
        });
    });
  });

  it("should display the Guest Users container header elements", () => {
    cy.get(".mat-mdc-card").within(() => {
      cy.get(".guest-users-header-wrapper")
        .should("be.visible")
        .within(() => {
          cy.get("h2").should("contain.text", "Guest Users");

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

  it("should display the Guest Users table and column headers", () => {
    // Verify Guest Users table
    cy.get('[data-test-id="guest-user-table"]').should("be.visible");

    // Verify Guest Users column headers
    cy.get("tr[mat-header-row] th")
      .should("have.length", 9)
      .then(($headers) => {
        const expectedHeaders = [
          "USER",
          "EMAIL",
          "PHONE NUMBER",
          "ARRIVAL DATE",
          "DEPARTURE DATE",
          "HOST",
          "CREATED",
          "STATUS",
          "", // The last column header should be blank
        ];
        $headers.each((index, header) => {
          expect(header.textContent.trim()).to.equal(expectedHeaders[index]);
        });
      });
  });

  it("should verify at least one Guest Users row exists", () => {
    cy.get("tr.mat-mdc-row")
      .should("be.visible")
      .and("have.length.greaterThan", 0);
  });

  it("should display the Guest Users table row elements", () => {
    // For the first row, verify all required column fields are populated
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-fullName").should("not.be.empty");
        cy.get(".mat-column-email").should("not.be.empty");
        cy.get(".mat-column-phoneNumber").should("not.be.empty");
        cy.get(".mat-column-startDate").should("not.be.empty");
        cy.get(".mat-column-endDate").should("not.be.empty");
        cy.get(".mat-column-visitingUserFullName").should("not.be.empty");
        cy.get(".mat-column-createdAt").should("not.be.empty");
        cy.get(".mat-column-status").should("not.be.empty");
        cy.get(".mat-column-deleteGuestUser").should("not.be.empty");
      });

    // For the first row, verify the user's full name and either profile image or fallback icon display
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-fullName").within(() => {
          cy.get("div.profile-image").should(($el) => {
            // Look for the image first
            const img = $el.find("img");
            if (img.length) {
              // If an image exists, assert it's visible
              expect(Cypress.dom.isVisible(img[0])).to.be.true;
            } else {
              // Otherwise, check for user's initials
              expect($el.text().trim()).to.have.length(2);
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

    // For the first row, verify the user has a phone number present
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-phoneNumber")
          .invoke("text")
          .then((text) => {
            const phoneNumber = text.trim();
            // Regex: starts with + followed by 6-15 digits
            const phoneRegex = /^\+\d{6,15}$/;
            expect(phoneNumber).to.match(
              phoneRegex,
              `Phone number should match international format: ${phoneNumber}`
            );
          });
      });

    // For the first row, verify the user's arrival date format
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-startDate")
          .invoke("text")
          .then((text) => {
            const dateTime = text.trim();
            // Regex pattern for M/D/YYYY, HH:MM:SS AM/PM ZZZ
            const dateTimeRegex =
              /^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM) [A-Z]{2,4}$/;
            expect(dateTime).to.match(
              dateTimeRegex,
              `Start Date should match expected date-time format: ${dateTime}`
            );
          });
      });

    // For the first row, verify the user's departure date format
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-endDate")
          .invoke("text")
          .then((text) => {
            const dateTime = text.trim();
            // Regex pattern for M/D/YYYY, HH:MM:SS AM/PM ZZZ
            const dateTimeRegex =
              /^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM) [A-Z]{2,4}$/;
            expect(dateTime).to.match(
              dateTimeRegex,
              `Start Date should match expected date-time format: ${dateTime}`
            );
          });
      });

    // For the first row, verify the host's full name and either profile image or fallback icon display
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-visitingUserFullName").within(() => {
          cy.get("div.profile-image").then(($image) => {
            // Look for the image first
            const $img = $image.find("img");
            if ($img.length) {
              // If an image exists, assert it's visible
              cy.wrap($img).should("be.visible");
            } else {
              // Otherwise, check for user's initials
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

    // For the first row, verify the user's created date format
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-createdAt")
          .invoke("text")
          .then((text) => {
            const dateTime = text.trim();
            // Regex pattern for M/D/YYYY, HH:MM:SS AM/PM ZZZ
            const dateTimeRegex =
              /^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM) [A-Z]{2,4}$/;
            expect(dateTime).to.match(
              dateTimeRegex,
              `Start Date should match expected date-time format: ${dateTime}`
            );
          });
      });

    // For the first row, verify the status is displayed correctly
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-status")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.be.oneOf(["Active", "Expired"]);
          });
      });

    // For the first row, verify the 3-dot menu button is displayed with the correct icon
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-deleteGuestUser")
          .find("button.delete-button")
          .should("exist")
          .within(() => {
            cy.get("mat-icon")
              .should("have.attr", "data-mat-icon-name", "delete-icon")
              .within(() => {
                cy.get("svg").should("exist");
              });
          });
      });
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
