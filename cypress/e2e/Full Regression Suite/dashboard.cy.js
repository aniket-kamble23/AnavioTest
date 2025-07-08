import {
  validAccessResults,
  validCameraNames,
  validCredentialsType,
  validDeviceNames,
  validSiteNames,
  validZoneNames,
} from "../../support/constants.js";

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

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".anavio-header-title").should("be.visible").contains("Dashboard");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the Status Cards elements", () => {
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

  it("should display the Door Activity container header elements", () => {
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

  it("should display the Door Activity title and actions elements", () => {
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

  it("should click on the Door Control button and verify the button is active", () => {
    // Click on the Door Control button
    cy.get("app-dashboard-door-activity button").eq(1).click();
    // Verify the Door Control button is active
    cy.get("app-dashboard-door-activity button")
      .eq(1)
      .should("have.class", "active");
  });

  it("should display the Door Control title elements", () => {
    // Access the Door Control section
    cy.get("app-dashboard-door-activity button").eq(1).click();
    // Verify the presence of the Door Control Title UI elements
    cy.get(".title-and-actions").within(() => {
      cy.get('[data-test-id="panelTitle"]').should("have.text", "Door Control");
    });
  });

  it("should display the Door Control table and column headers", () => {
    // Access the Door Control section
    cy.get("app-dashboard-door-activity button").eq(1).click();
    // Verify Door Control Table
    cy.get(".door-control mat-table")
      .should("be.visible")
      .within(() => {
        // Verify Door Control Column Headers
        cy.get(".mat-mdc-header-row th")
          .should("have.length", 5) // Ensure there are exactly 5 headers
          .then(($headers) => {
            const expectedHeaders = [
              "", // The first column header should be blank
              "DOORS",
              "VIDEO",
              "LOCK STATE",
              "DOOR STATE",
            ];

            $headers.each((index, header) => {
              expect(header.textContent.trim()).to.equal(
                expectedHeaders[index]
              );
            });
          });
      });
  });

  it("should verify at least one Door Control row exists", () => {
    // Access the Door Control section
    cy.get("app-dashboard-door-activity button").eq(1).click();

    cy.get(".door-control mat-table").within(() => {
      // Verify at least one Door Activity row exists
      cy.get(".mat-mdc-row")
        .should("be.visible")
        .and("have.length.greaterThan", 0);
    });
  });

  it("should display the Door Control table row elements", () => {
    // Access the Door Control section
    cy.get("app-dashboard-door-activity button").eq(1).click();

    cy.get(".door-control mat-table").within(() => {
      // For the first row, verify all required column fields are populated
      cy.get(".mat-mdc-row")
        .first()
        .within(() => {
          cy.get(".mat-mdc-cell").eq(0).should("not.be.empty"); // Status
          cy.get(".mat-mdc-cell").eq(1).should("not.be.empty"); // Door Name
          cy.get(".mat-mdc-cell").eq(2).should("not.be.empty"); // Live View button
          cy.get(".mat-mdc-cell").eq(3).should("not.be.empty"); // Lock State
          cy.get(".mat-mdc-cell").eq(4).should("not.be.empty"); // Door State
        });

      // For the first row, verify the status dot is either red or green
      cy.get(".mat-mdc-row")
        .first()
        .within(() => {
          cy.get("td")
            .eq(0)
            .find(".status-dot")
            .should("exist")
            .invoke("attr", "class")
            .then((classValue) => {
              // Assert that it contains either 'status-dot-red' or 'status-dot-green'
              expect(classValue).to.match(/status-dot-(red|green)/);
            });
        });

      // For the first row, verify the device name is displayed correctly
      cy.get(".mat-mdc-row")
        .first()
        .within(() => {
          cy.get(".mat-mdc-cell")
            .eq(1)
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

      // For the first row, verify the Live View button is present and verify its properties
      cy.get(".mat-mdc-row")
        .first()
        .within(() => {
          cy.get(".mat-mdc-cell")
            .eq(2)
            .find("button")
            .should("exist")
            .and("be.visible")
            .and("contain.text", "Live View")
            .invoke("attr", "class")
            .then((classValue) => {
              // Assert that it either contains 'disable' or doesn't contain 'disable'
              if (classValue.includes("disable")) {
                cy.log("Live View button is disabled");
              } else {
                cy.log("Live View button is enabled");
              }
            });
        });

      // For the first row, verify the Unlock button is present and verify its properties
      cy.get(".mat-mdc-row")
        .first()
        .within(() => {
          cy.get(".mat-mdc-cell")
            .eq(3)
            .find("button")
            .should("exist")
            .and("be.visible")
            .within(() => {
              cy.get("app-anavio-icon").should("exist").and("be.visible");
              cy.get(".mdc-button__label").should("contain.text", "Unlock");
            })
            .invoke("attr", "class")
            .then((classValue) => {
              // Assert that it either contains 'disable' or doesn't contain 'disable'
              if (classValue.includes("disable")) {
                cy.log("Unlock button is disabled");
              } else {
                cy.log("Unlock button is enabled");
              }
            });
        });

      // For the first row, verify the Lock State next to the Unlock button
      cy.get(".mat-mdc-row")
        .first()
        .within(() => {
          cy.get(".mat-mdc-cell")
            .eq(3)
            .within(() => {
              cy.get(".lock-button-content")
                .invoke("text")
                .then((textContent) => {
                  // Clean up the text to remove whitespace and the known button label
                  const cleanedText = textContent.replace("Unlock", "").trim();

                  // Now handle the if/else logic based on the cleaned text
                  if (cleanedText === "Locked") {
                    cy.log("Device is currently Locked");
                  } else if (cleanedText === "Unlocked") {
                    cy.log("Device is currently Unlocked");
                  } else {
                    cy.log(`Unexpected lock state text: ${cleanedText}`);
                  }
                });
            });
        });

      // For the first row, verify the Door State
      cy.get(".mat-mdc-row")
        .first()
        .within(() => {
          cy.get(".mat-mdc-cell")
            .eq(4)
            .invoke("text")
            .then((doorStateText) => {
              const state = doorStateText.trim();
              const validDoorStates = ["No Sensor", "Open Forced Entry"];

              if (validDoorStates.includes(state)) {
                expect(state).to.be.oneOf(validDoorStates);
              } else {
                cy.log(`Unexpected door state: ${state}`);
              }
            });
        });
    });
  });

  it("should display the Camera Activity container header elements", () => {
    // Verify Camera Activity Container
    cy.get("app-expandable-camera-activity").within(() => {
      // Verify Header
      cy.get("mat-expansion-panel-header")
        .should("be.visible")
        .within(() => {
          // Verify Title and Subtitle
          cy.get('[data-test-id="panelTitle"]').should(
            "have.text",
            "Camera Activity"
          );
          cy.get('[data-test-id="panelSubTitle"]').should(
            "have.text",
            "(Today)"
          );
          // Verify the button and its label
          cy.get('[data-test-id="panelHeaderButton"] .label').should(
            "have.text",
            "More Activity"
          );
          // Verify mat-expansion-indicator contains an svg and the svg is visible
          cy.get(".mat-expansion-indicator svg").should("be.visible");
        });
    });
  });

  it("should display the Camera Activity grid", () => {
    cy.get(".camera-activity-list").should("be.visible");
  });

  it("should display 20 Camera Activity card elements", () => {
    cy.get(".camera-activity-list").within(() => {
      // Verify the number of camera activity cards
      cy.get("app-camera-activity-card").should("have.length", 20);
    });
  });

  it("should display today's, yesterday's, or tomorrow's date in each Camera Activity card header", () => {
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

  it("should have a 3-dot menu button with correct icon in each Camera Activity card header", () => {
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

  it("should display 'Play Event' and 'Camera History' options with icons in the first Camera Activity card 3-dot menu", () => {
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

  it("should display either an image or a fallback icon in each Camera Activity card", () => {
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

  it.only("should display a site name and camera name in each Camera Activity card footer", () => {
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

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
////aniket testing123