describe("Create Group-Activity and activities", () => {
  it("should login with Microsoft redirect", () => {
    const username = Cypress.env("TEST_MS_USERNAME");
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

    const activityLength = 70;
    const questionLength = 600;
    const answerLength = 50;

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

          cy.wrap(row)
            .contains("button", "Questions - Answers")
            .should("not.be.disabled")
            .click();

          // Wait for loading
          cy.contains("p.font-bold", "Question 1", { timeout: 50000 }).should(
            "be.visible"
          );

          cy.contains("button", "Select question").click();

          cy.contains(
            'section[role="dialog"] span.text-t2-semi-bold',
            "Question List"
          )
            .first()
            .should("be.visible")
            .then(($span) => {
              // get the closest section from the span and log it
              const $section = $span.closest('section[role="dialog"]');

              // wrap the section to continue Cypress commands within it
              cy.wrap($section).within(() => {
                cy.get("tbody tr").first().click();

                cy.get("footer").contains("button", "Select").click();
              });
            });

          // Click the "Add Options" button 50 times
          for (let i = 0; i < answerLength - 2; i++) {
            cy.get("button.chakra-button")
              .contains("Add Options")
              .should("not.be.disabled") // ensure button is clickable
              .click();
          }

          // Loop add all answer
          cy.get("div.flex.flex-col.w-full.gap-3")
            .find("i.ic-add-circle-solid")
            .each(($option) => {
              cy.wrap($option).click();
              cy.contains(
                'section[role="dialog"] span.text-t2-semi-bold',
                "Answer List"
              )
                .first()
                .should("be.visible")
                .then(($span) => {
                  // get the closest section from the span and log it
                  const $section = $span.closest('section[role="dialog"]');

                  // wrap the section to continue Cypress commands within it
                  cy.wrap($section).within(() => {
                    cy.get("tbody tr").first().click();

                    cy.get("footer").contains("button", "Select").click();
                  });
                });
            });

          // loop add new question
          for (let i = 0; i < questionLength - 1; i++) {
            cy.get("header.chakra-modal__header")
              .contains("button", "Add Questions")
              .click();

            //wait create question
            cy.wait(3000);

            cy.contains("span.truncate.font-sans", "Date").click();

            cy.get("footer").contains("button", "Select").click();

            //wait create question
            cy.wait(3000);

            cy.contains("p.font-bold", `Question ${i + 2}`) // Find the <p> tag that directly contains "Question 2" (assuming "font-bold" is unique for these titles)
              .closest("div.border.rounded-md.w-full.mb-2.flex.flex-col") // Traverse up to the main question container div. Ensure these classes are consistent for all question blocks.
              .find("input#title") // Find the input field within this specific question container (it has a consistent ID)
              .siblings("button") // Get the sibling button(s) to that input
              .contains("Select question") // Filter the siblings to find the one with the text "Select question"
              .scrollIntoView() // Ensure the button is visible before clicking
              .should("be.visible") // Assert that it is indeed visible
              .click(); // Click the button

            cy.contains(
              'section[role="dialog"] span.text-t2-semi-bold',
              "Question List"
            )
              .first()
              .should("be.visible")
              .then(($span) => {
                // get the closest section from the span and log it
                const $section = $span.closest('section[role="dialog"]');

                // wrap the section to continue Cypress commands within it
                cy.wrap($section).within(() => {
                  cy.get("tbody tr").first().click();

                  cy.get("footer").contains("button", "Select").click();
                });
              });
          }

          cy.get(".chakra-modal__content")
            .get("footer")
            .last()
            .contains("button", "Save")
            .click();

          //wait create question
          cy.wait(3000);
        });
      }
    );
  });
});
