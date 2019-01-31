describe("Manage projects page tests", function() {
  var existingProjectName = "Lloyd's Register",
    existingProjectUrl = "lloydsRegister";

  beforeEach(function() {
    cy.visit("/#/project/" + existingProjectUrl + "/health");
  });

  it("Test to ensure that when viewing a project the required elements are displayed", function() {
    cy.get(".project-title")
      .contains(existingProjectName)
      .should("be.visible");
  });
});
