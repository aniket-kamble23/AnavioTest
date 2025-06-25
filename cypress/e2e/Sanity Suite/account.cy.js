describe("Account Page Tests", () => {
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
    cy.log("Session restored, navigating to Account...");
    cy.visit("/settings/account");
  });

  it("should display the header elements", () => {
    // Verify Header
    cy.get(".anavio-header").within(() => {
      cy.get(".back-button")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get(".anavio-header-title").should("be.visible").contains("Account");
      cy.get(".breadcrumb-home-icon")
        .should("be.visible")
        .find("mat-icon > svg")
        .should("be.visible");
      cy.get("app-breadcrumbs > .icon").should("be.visible");
      cy.get(".breadcrumb > a").should("be.visible").contains("Account");
      cy.get(".anavio-header-actions")
        .should("be.visible")
        .find(".mat-mdc-menu-trigger > .mat-icon > svg")
        .should("be.visible");
    });
  });

  it("should display the Account Information container header elements", () => {
    cy.get("app-account-information").within(() => {
      cy.get(".card-header")
        .should("be.visible")
        .and("contain.text", "Account Information");
    });
  });

  it("should display the Account Information container elements", () => {
    cy.get("app-account-information").within(() => {
      // Input fields and labels
      cy.get('[data-testid="account-name-label"]')
        .should("exist")
        .and("contain.text", "Account Name");
      cy.get('[data-testid="account-name-input"]')
        .should("exist")
        .and("have.attr", "placeholder", "Enter Your Account Name");
      cy.get('[data-testid="recipient-1-email-label"]')
        .should("exist")
        .and("contain.text", "Email (Recipient 1)");
      cy.get('[data-testid="recipient-1-email-input"]')
        .should("exist")
        .and("have.attr", "placeholder", "Enter Your Email Address");
      cy.get('[data-testid="recipient-2-email-label"]')
        .should("exist")
        .and("contain.text", "Email (Recipient 2)");
      cy.get('[data-testid="recipient-2-email-input"]')
        .should("exist")
        .and("have.attr", "placeholder", "Enter Your Email Address");
      cy.get('[data-testid="recipient-1-phone-label"]')
        .should("exist")
        .and("contain.text", "Phone Number (Recipient 1)");
      cy.get('[data-testid="recipient-1-phone-input"]').should("exist");
      cy.get('[data-testid="recipient-2-phone-label"]')
        .should("exist")
        .and("contain.text", "Phone Number (Recipient 2)");
      cy.get('[data-testid="recipient-2-phone-input"]').should("exist");

      // Toggle switches and labels
      cy.get('[data-testid="enable-email-notifications-label"]')
        .should("exist")
        .and("contain.text", "Enable email notifications");
      cy.get('[formcontrolname="enableEmailNotifications"]').should("exist");
      cy.get('[data-testid="enable-sms-notifications-label"]')
        .should("exist")
        .and("contain.text", "Enable SMS notifications");
      cy.get('[formcontrolname="enableSMSNotifications"]').should("exist");
      cy.get('[data-testid="allow-multi-protocol-cards-label"]')
        .should("exist")
        .and("contain.text", "Allow Multi Protocol Cards");
      cy.get('[formcontrolname="allowMultiProtocolCards"]').should("exist");
      cy.get("div.row")
        .eq(5)
        .within(() => {
          cy.get("div.column")
            .eq(0)
            .within(() => {
              cy.get("div.label")
                .should("exist")
                .and("contain.text", "Enable Lockdown Plan");
              cy.get('[formcontrolname="lockdownPlanEnabled"]').should("exist");
            });
          cy.get("div.column")
            .eq(1)
            .within(() => {
              cy.get("div.label")
                .should("exist")
                .and("contain.text", "Lockdown Plan Duration (Minutes)");
              cy.get('[formcontrolname="lockdownPlanDuration"]')
                .should("exist")
                .and("have.attr", "placeholder", "00");
              cy.get("button.arrow-up")
                .should("exist")
                .within(() => {
                  cy.get("mat-icon")
                    .should(
                      "have.attr",
                      "data-mat-icon-name",
                      "keyboard-arrow-up"
                    )
                    .within(() => {
                      cy.get("svg").should("exist");
                    });
                });
              cy.get("button.arrow-down")
                .should("exist")
                .within(() => {
                  cy.get("mat-icon")
                    .should(
                      "have.attr",
                      "data-mat-icon-name",
                      "keyboard-arrow-down"
                    )
                    .within(() => {
                      cy.get("svg").should("exist");
                    });
                });
            });
        });

      // Update button
      cy.get('[data-testid="continue-button"]')
        .should("exist")
        .and("contain.text", "Update");
    });
  });

  it("should display the Analytics Settings container header elements", () => {
    cy.get("app-analytics-settings").within(() => {
      cy.get(".card-header")
        .should("be.visible")
        .and("contain.text", "Analytics Settings");
    });
  });

  it("should display the Analytics Settings container elements", () => {
    cy.get("app-analytics-settings").within(() => {
      // Checkboxes and labels
      cy.get(".checkbox-section")
        .should("exist")
        .within(() => {
          cy.get("div.anavio-event-checkobox")
            .eq(0)
            .within(() => {
              cy.get('[formcontrolname="personDetection"]').should("exist");
              cy.get("label")
                .should("exist")
                .and("contain.text", "Person Detection");
            });
          cy.get("div.anavio-event-checkobox")
            .eq(1)
            .within(() => {
              cy.get('[formcontrolname="animalDetection"]').should("exist");
              cy.get("label")
                .should("exist")
                .and("contain.text", "Animal Detection");
            });
          cy.get("div.anavio-event-checkobox")
            .eq(2)
            .within(() => {
              cy.get('[formcontrolname="vehicleDetection"]').should("exist");
              cy.get("label")
                .should("exist")
                .and("contain.text", "Vehicle Detection");
            });
          cy.get("div.anavio-event-checkobox")
            .eq(3)
            .within(() => {
              cy.get('[formcontrolname="faceDetection"]').should("exist");
              cy.get("label")
                .should("exist")
                .and("contain.text", "Face Detection/Recognition");
            });
        });

      // Update button
      cy.get('[data-testid="update-button"]')
        .should("exist")
        .and("contain.text", "Update");
    });
  });

  it("should display the Company Address container header elements", () => {
    cy.get("app-address-sections").within(() => {
      cy.get('[title="Company Address"]').within(() => {
        cy.get(".card-header")
          .should("be.visible")
          .and("contain.text", "Company Address");
      });
    });
  });

  it("should display the Company Address container elements", () => {
    cy.get("app-address-sections").within(() => {
      cy.get('[title="Company Address"]').within(() => {
        cy.get('[data-testid="address-form"]').within(() => {
          // Input fields and labels
          cy.get('[data-testid="address-line-1-label"]')
            .should("exist")
            .and("contain.text", "Address Line 1");
          cy.get('[formcontrolname="addressLine1"]')
            .should("exist")
            .and("have.attr", "placeholder", "Enter Your Address");
          cy.get('[data-testid="address-line-2-label"]')
            .should("exist")
            .and("contain.text", "Address Line 2 (optional)");
          cy.get('[formcontrolname="addressLine2"]')
            .should("exist")
            .and("have.attr", "placeholder", "Apartment, suite, etc.");
          cy.get('[data-testid="city-label"]')
            .should("exist")
            .and("contain.text", "City");
          cy.get('[formcontrolname="city"]')
            .should("exist")
            .and("have.attr", "placeholder", "Enter Your City");
          cy.get('[data-testid="state-label"]')
            .should("exist")
            .and("contain.text", "State");
          cy.get('[formcontrolname="state"]')
            .should("exist")
            .and("have.attr", "placeholder", "Select Your State")
            .within(() => {
              cy.get("div.mat-mdc-select-arrow")
                .should("exist")
                .within(() => {
                  cy.get("svg").should("exist");
                });
            });
          cy.get('[data-testid="country-label"]')
            .should("exist")
            .and("contain.text", "Country");
          cy.get('[formcontrolname="country"]')
            .should("exist")
            .and("have.attr", "placeholder", "Select Your Country")
            .within(() => {
              cy.get("div.mat-mdc-select-arrow")
                .should("exist")
                .within(() => {
                  cy.get("svg").should("exist");
                });
            });
          cy.get('[data-testid="postal-code-label"]')
            .should("exist")
            .and("contain.text", "Postal Code");
          cy.get('[formcontrolname="postalCode"]')
            .should("exist")
            .and("have.attr", "placeholder", "Enter Your Postal Code");

          // Update button
          cy.get('[data-testid="continue-button"]')
            .should("exist")
            .and("contain.text", "Update");
        });
      });
    });
  });

  it("should display the Shipping Address container header elements", () => {
    cy.get("app-address-sections").within(() => {
      cy.get('[title="Shipping Address"]').within(() => {
        cy.get(".card-header")
          .should("be.visible")
          .and("contain.text", "Shipping Address");
      });
    });
  });

  it("should display the Shipping Address container elements", () => {
    cy.get("app-address-sections").within(() => {
      cy.get('[title="Shipping Address"]').within(() => {
        // Checkbox container
        cy.get("div.checkbox-container").within(() => {
          cy.get("input.mdc-checkbox__native-control").should("exist");
          cy.get("label")
            .should("exist")
            .and("contain.text", "Use Company Address as Shipping Address");
        });

        // Input fields and labels
        cy.get('[data-testid="address-form"]').within(() => {
          cy.get('[data-testid="address-line-1-label"]')
            .should("exist")
            .and("contain.text", "Address Line 1");
          cy.get('[formcontrolname="addressLine1"]')
            .should("exist")
            .and("have.attr", "placeholder", "Enter Your Address");
          cy.get('[data-testid="address-line-2-label"]')
            .should("exist")
            .and("contain.text", "Address Line 2 (optional)");
          cy.get('[formcontrolname="addressLine2"]')
            .should("exist")
            .and("have.attr", "placeholder", "Apartment, suite, etc.");
          cy.get('[data-testid="city-label"]')
            .should("exist")
            .and("contain.text", "City");
          cy.get('[formcontrolname="city"]')
            .should("exist")
            .and("have.attr", "placeholder", "Enter Your City");
          cy.get('[data-testid="state-label"]')
            .should("exist")
            .and("contain.text", "State");
          cy.get('[formcontrolname="state"]')
            .should("exist")
            .and("have.attr", "placeholder", "Select Your State")
            .within(() => {
              cy.get("div.mat-mdc-select-arrow")
                .should("exist")
                .within(() => {
                  cy.get("svg").should("exist");
                });
            });
          cy.get('[data-testid="country-label"]')
            .should("exist")
            .and("contain.text", "Country");
          cy.get('[formcontrolname="country"]')
            .should("exist")
            .and("have.attr", "placeholder", "Select Your Country")
            .within(() => {
              cy.get("div.mat-mdc-select-arrow")
                .should("exist")
                .within(() => {
                  cy.get("svg").should("exist");
                });
            });
          cy.get('[data-testid="postal-code-label"]')
            .should("exist")
            .and("contain.text", "Postal Code");
          cy.get('[formcontrolname="postalCode"]')
            .should("exist")
            .and("have.attr", "placeholder", "Enter Your Postal Code");

          // Update button
          cy.get('[data-testid="continue-button"]')
            .should("exist")
            .and("contain.text", "Update");
        });
      });
    });
  });

  it("should log out when the Log out option is clicked", () => {
    cy.logout();
    cy.url().should("include", "/auth/sign-in");
  });
});
