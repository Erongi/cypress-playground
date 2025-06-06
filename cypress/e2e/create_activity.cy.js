describe("Create Group-Activity and activities", () => {
  it("should login with Microsoft redirect", () => {
    const username = Cypress.env("TEST_MS_USERNAME");
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

    const activityLength = 70;
    // const questionLengthPerActivity = 9;
    // const answerLength = 50;

    cy.visit("/en/login");

    // Enter email and submit (adjust selector if needed)
    cy.get('input[name="email"]').type(`${username}{enter}`);

    // Wait for something visible on the page after login (replace with your app's element)

    cy.contains("p", "Back Office System", { timeout: 500000 }).should(
      "be.visible"
    );

    cy.visit("/en/group-activity/v2/create/");

    // Wait for input to be ready
    cy.wait(3000);

    cy.get('input[name="name"]').type(`TEST BY Cypress ${timestamp}`);

    // Select product 'rice'
    cy.get("#product_id").click();
    cy.get("button")
      .contains(/^rice$/i)
      .click();

    // Wait for input to be ready
    cy.wait(1000);

    cy.get("#sub_product_id").click();
    cy.get("button")
      .contains(/^industiral-seed$/i)
      .click();

    // Wait for input to be ready
    cy.wait(1000);

    // Select activity type
    cy.get("#activity_type_id").click();
    cy.get("button")
      .contains(/^Activity for contract farming$/i)
      .click();

    // Click add activity button
    cy.contains("button", "Add Activity").click();

    cy.get("tbody tr").each(($row, index) => {
      if (index < activityLength) {
        cy.wrap($row).find("p.flex.cursor-pointer").first().click();
      }
    });

    // Wait for the Select button to be enabled, then click it
    cy.contains("button", "Select").should("not.be.disabled").click();

    // Then wait for the table rows
    cy.get('tbody[data-rfd-droppable-id="droppable"] tr[tabindex]', {
      timeout: 10000,
    }).should("have.length.greaterThan", 0);

    // loop set activity setting
    cy.get(`tbody[data-rfd-droppable-id="droppable"] tr[tabindex]`).then(
      ($rows) => {
        Cypress.$($rows).each((index, row) => {
          cy.wrap(row)
            .contains("button", "Setting Activity")
            .should("not.be.disabled")
            .click();

          cy.get(".chakra-modal__content") // Select the modal container
            .find('input[type="text"][inputmode="decimal"]') // Find all text inputs inside the modal
            .each(($input) => {
              const isDisabled = $input.prop("disabled");
              const isReadOnly = $input.prop("readOnly");

              if (!isDisabled && !isReadOnly) {
                cy.wrap($input).clear().type("1");
              }
            });

          // Type anything to trigger dropdown
          cy.get("input#user_type_input").click();

          // Wait for dropdown options to appear and click the first one
          cy.get(".option").first().click();

          cy.get("footer.chakra-modal__footer")
            .contains("button", "Save")
            .should("be.visible")
            .and("not.be.disabled")
            .click();

          // Wait for create a activity
          cy.wait(3000);
        });
      }
    );
  });
});
