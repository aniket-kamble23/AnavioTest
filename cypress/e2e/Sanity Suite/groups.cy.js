describe("Groups Page Tests", () => {
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
    cy.log("Session restored, navigating to Groups...");
    cy.visit("/settings/groups");
  });

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("Groups");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs > .icon").should("be.visible");
      cy.get(".breadcrumb > a").should("be.visible").contains("Groups");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the group card container elements", () => {
    cy.get(".group-card").within(() => {
      cy.get(".group-banner > span")
        .should("be.visible")
        .contains("Easily set access levels for users by groups");

      cy.get(".add-group-button")
        .should("be.visible")
        .within(() => {
          cy.get("mat-icon svg").should("be.visible");
          cy.contains("Add Group");
        });
    });
  });

  it("should display the All Groups container header elements", () => {
    cy.get(".group-list-container").within(() => {
      cy.get(".group-header-wrapper").within(() => {
        cy.get("h2").should("be.visible").contains("All Groups");
        cy.get(".search-bar")
          .should("be.visible")
          .within(() => {
            cy.get(".search-input")
              .should("be.visible")
              .should("have.attr", "placeholder", "Search...");
            cy.get("mat-icon").should("exist").find("svg").should("be.visible");
          });
      });
    });
  });

  it("should display the All Groups table and column headers", () => {
    // Verify All Groups table
    cy.get("mat-table").should("be.visible");

    // Verify All Groups column headers
    cy.get("tr[mat-header-row] th")
      .should("have.length", 4)
      .then(($headers) => {
        const expectedHeaders = [
          "GROUP NAME",
          "DESCRIPTION",
          "USERS IN THE GROUP",
          "", // The last column header should be blank
        ];
        $headers.each((index, header) => {
          expect(header.textContent.trim()).to.equal(expectedHeaders[index]);
        });
      });
  });

  it("should verify at least one All Groups row exists", () => {
    cy.get("tr.mat-mdc-row")
      .should("be.visible")
      .and("have.length.greaterThan", 0);
  });

  it("should display the All Groups table row elements", () => {
    // For the first row, verify all required column fields are populated
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-name").should("not.be.empty");
        cy.get(".mat-column-description").then(($cell) => {
          const cellText = $cell.text().trim();
          cy.log(`Cell value: "${cellText || "empty"}"`);
        });
        cy.get(".mat-column-userCount").should("not.be.empty");
        cy.get(".mat-column-menuItems").should("not.be.empty");
      });

    // For the first row, verify the group name is present and not empty
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-name")
          .should("exist")
          .invoke("text")
          .then((text) => {
            expect(text.trim().length).to.be.greaterThan(0);
          });
      });

    // For the first row, log the group's description value
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-description").then(($cell) => {
          const cellText = $cell.text().trim();
          cy.log(`Cell value: "${cellText || "empty"}"`);
        });
      });

    // For the first row, verify the users in the group value is zero or greater than 0
    cy.get("tr.mat-mdc-row")
      .first()
      .within(() => {
        cy.get(".mat-column-userCount")
          .invoke("text")
          .then((text) => {
            const totalDevices = Number(text.trim());
            expect(totalDevices).to.be.at.least(0);
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
        const menuItems = [{ name: "Delete Group", index: 0 }];

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
