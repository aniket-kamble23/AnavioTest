describe("Dashboard Page Tests", () => {
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
    cy.log("Session restored, navigating to Dashboard...");
    cy.visit("/dashboard");
  });

  it("should display all required Header UI elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".anavio-header-title").should("be.visible").contains("Dashboard");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display all required Status Cards UI elements", () => {
    // Verify Status Cards
    cy.get(".grid").within(() => {
      // Verify the number of status cards
      cy.get("app-dashboard-status-card-component").should("have.length", 3);

      // Verify Status Cards Titles
      const titles = ["Camera Status", "Door Status", "User Activity"];
      cy.get("app-dashboard-status-card-component").each(($card, index) => {
        cy.wrap($card).invoke("attr", "title").should("eq", titles[index]);
      });

      // Verify Icons in Status Cards
      cy.get("app-camera-icon svg").should("be.visible");
      cy.get("app-door-icon svg").should("be.visible");
      cy.get("app-user-icon svg").should("be.visible");

      // Verify Charts in Status Cards
      cy.get("#chart-cameras").should("be.visible");
      cy.get("#chart-doors").should("be.visible");
      cy.get("#chart-user-activity").should("be.visible");

      // Verify Status Cards Content
    });
  });

  it("should display all required Door Activity Header UI elements", () => {
    // Verify Door Activity Container
    cy.get("app-dashboard-door-activity").within(() => {
      // Verify Header
      cy.get("mat-expansion-panel-header")
        .should("be.visible")
        // Verify the two buttons and their labels
        .within(() => {
          cy.get("button").should("have.length", 2);
          // Select the first button, assert its label and that it is active
          cy.get("button")
            .eq(0)
            .should("contain.text", "Door Activity")
            .and("have.class", "active");
          // Select the second button, check its label
          cy.get("button").eq(1).should("contain.text", "Door Control");
        });
      // Verify mat-expansion-indicator contains an svg and the svg is visible
      cy.get("mat-expansion-panel-header .mat-expansion-indicator svg").should(
        "be.visible"
      );
    });
  });

  it("should display all required Door Activity Title and Actions UI elements", () => {
    // Verify Door Activity Title and Actions
    cy.get(".title-and-actions").within(() => {
      // Verify Title and Subtitle
      cy.get('[data-test-id="panelTitle"]').should(
        "have.text",
        "Door Activity"
      );
      cy.get('[data-test-id="panelSubTitle"]').should("have.text", "(Today)");
      // Verify the two buttons and their labels
      cy.get(".filter-button .label").should("have.text", "Filter");
      cy.get(".filter-button mat-icon svg").should("be.visible");
      cy.get('[data-test-id="panelHeaderButton"] .label').should(
        "have.text",
        "More Activity"
      );
    });
  });

  it("should display all required Door Activity Table and Column Headers UI elements", () => {
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

  it("should display all required Door Activity Table Rows UI elements", () => {
    // Verify at least one Door Activity row exists
    cy.get('[data-test-id="mat-door-activityList-data"]').and("be.visible");

    // For the first row, verify all required columns are populated
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-fullName").should("not.be.empty");
        cy.get(".mat-column-accessResult").should("not.be.empty");
        cy.get(".mat-column-time").should("not.be.empty");
        cy.get(".mat-column-deviceName").should("not.be.empty");
        cy.get(".mat-column-zoneName").should("not.be.empty");
        cy.get(".mat-column-siteName").should("not.be.empty");
        // cy.get('.mat-column-workFlow').should('not.be.empty');
        cy.get(".mat-column-hasVideo button").should("exist");
      });

    // For the first row, verify the access result is displayed correctly
    const validAccessResults = [
      "Granted",
      "Denied",
      "Denied - Not scheduled",
      "Denied - Spoof Attack",
      "Denied - Suspended",
      "Doorbell",
    ];

    // Grab the first row only
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

    // Grab the first row only
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
    const validDeviceNames = ["Door 0031", "Pune Door 057"];

    // Grab the first row only
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-deviceName")
          .invoke("text")
          .then((text) => {
            const trimmedText = text.trim();

            // Check that the text is in the validDeviceNames array
            expect(validDeviceNames).to.include(trimmedText);
          });
      });

    // For the first row, verify the zone name is displayed correctly
    const validZoneNames = ["Clovis Offices", "MH, India"];

    // Grab the first row only
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-zoneName")
          .invoke("text")
          .then((text) => {
            const trimmedText = text.trim();

            // Check that the text is in the validZoneNames array
            expect(validZoneNames).to.include(trimmedText);
          });
      });

    // For the first row, verify the site name is displayed correctly
    const validSiteNames = ["Clovis Site", "Pune Site"];

    // Grab the first row only
    cy.get('[data-test-id="mat-door-activityList-data"]')
      .first()
      .within(() => {
        cy.get(".mat-column-siteName")
          .invoke("text")
          .then((text) => {
            const trimmedText = text.trim();

            // Check that the text is in the validSiteNames array
            expect(validSiteNames).to.include(trimmedText);
          });
      });

    // For the first row, verify the credentials type is displayed correctly
    const validCredentialsType = [
      "Face",
      "Card",
      "Mobile",
      "Cloud Key",
      "Web",
      "External Card",
    ];

    // Grab the first row only
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
  });

  it("should click on the Door Control button and verify the button is active", () => {
    // Click on the Door Control button
    cy.get("app-dashboard-door-activity button").eq(1).click();
    // Verify the Door Control button is active
    cy.get("app-dashboard-door-activity button")
      .eq(1)
      .should("have.class", "active");
  });

  it("should display all required Camera Activity Header UI elements", () => {
    // Verify Camera Activity Container
    cy.get("app-expandable-camera-activity").within(() => {
      // Verify Camera Activty Title and Actions
      cy.get(".header-items").within(() => {
        // Verify Title and Subtitle
        cy.get('[data-test-id="panelTitle"]').should(
          "have.text",
          "Camera Activity"
        );
        cy.get('[data-test-id="panelSubTitle"]').should("have.text", "(Today)");
        // Verify the button and its label
        cy.get('[data-test-id="panelHeaderButton"] .label').should(
          "have.text",
          "More Activity"
        );
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

  it("should display today's date in each Camera Activity Card header", () => {
    const today = new Date();
    const formattedDate = `${
      today.getMonth() + 1
    }/${today.getDate()}/${today.getFullYear()}`;

    cy.get(".camera-activity-list").within(() => {
      cy.get("app-camera-activity-card").each(($card) => {
        cy.wrap($card)
          .find(".camera-activity-date-time")
          .invoke("text")
          .should("contain", formattedDate);
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
            cy.get("mat-icon").should(
              "have.attr",
              "data-mat-icon-name",
              "more-vertical"
            );
          });
      });
    });
  });

  it("should display 'Play Event' and 'Camera History' options with icons in the first Camera Activity Card menu", () => {
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
        ];

        // Loop through the menu items for both checks
        menuItems.forEach(({ name, index }) => {
          cy.get("button.mat-mdc-menu-item")
            .eq(index) // Dynamically targets Play Event (index 0) and Camera History (index 1)
            .should("be.visible")
            .contains(name);

          // Ensure the icon exists for each item
          cy.get(
            `:nth-child(${
              index + 1
            }) > .mat-mdc-menu-item-text > .icon-container > mat-icon`
          ).should("be.visible");
        });
      });

    // Close the menu
    cy.get("body").click(0, 0);
  });

  it("should display an image in each Camera Activity Card", () => {
    cy.get(".camera-activity-list").within(() => {
      cy.get("app-camera-activity-card").each(($card) => {
        cy.wrap($card).within(() => {
          cy.get("img.camera-activity-image").should("exist");
        });
      });
    });
  });

  it("should display a site name and camera name in each Camera Activity Card footer", () => {
    const validSiteNames = ["Clovis Site", "Pune Site"];
    const validCameraNames = [
      "Camera 0009-Hub 2898",
      "Camera 0010-Hub 2859",
      "Camera 0011-Hub 2806",
    ];

    cy.get(".camera-activity-list").within(() => {
      cy.get("app-camera-activity-card").each(($card) => {
        cy.wrap($card).within(() => {
          // Validate Site Name
          cy.get(".site-name")
            .should("exist")
            .invoke("text")
            .then((siteName) => {
              expect(siteName.trim().length).to.be.greaterThan(0);
              // Optional: check if it's one of the known names (or allow others)
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

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});

// Custom Command for Logout
Cypress.Commands.add("logout", () => {
  cy.get(
    ".anavio-user-account-icon > .mat-mdc-menu-trigger > .mat-icon"
  ).click();
  cy.get(".mat-mdc-menu-content > :nth-child(7)").click();
  cy.get(".mat-mdc-dialog-actions").within(() => {
    cy.contains("Logout").click();
  });
});
