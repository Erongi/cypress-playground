describe("Edit Setting Activity", () => {
  it("should login with Microsoft redirect", () => {
    const username = Cypress.env("TEST_MS_USERNAME");
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

    cy.visit("/en/login");

    // Enter email and submit (adjust selector if needed)
    cy.get('input[name="email"]').type(`${username}{enter}`);

    // Wait for something visible on the page after login (replace with your app's element)

    cy.contains("p", "Back Office System", { timeout: 20000 }).should(
      "be.visible"
    );

    cy.visit("/en/group-activity/v2/edit/?id=3535");

    cy.wait(10000);

    cy.get('tbody[data-rfd-droppable-id="droppable"] tr[tabindex]').then(
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

          cy.wait(3000);
        });
      }
    );
  });
});
