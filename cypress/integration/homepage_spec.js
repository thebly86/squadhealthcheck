describe("Home page tests", function() {
  var existingProjectName = "Lloyd's Register",
    existingProjectUrl = "lloydsRegister",
    newProjectName = "Toms Team",
    newProjectUrl = "";

  beforeEach(function() {
    cy.visit("");
  });

  it("Test to ensure the homepage has the correct elements", function() {
    cy.get(".app-logo").should("be.visible");

    cy.get("header > h1").contains("Squad Health Check");

    cy.get("thead tr")
      .children()
      .contains("th", "PROEJCT")
      .should("be.visible");

    cy.get("tbody")
      .children()
      .should("have.length", 2);

    cy.get("button").contains("ADD PROJECT");

    cy.get("button").should("be.visible");
  });

  it("Test to ensure that the can create a new project", function() {
    cy.get("button").click();

    cy.get(".modal__body input").type(newProjectName);

    cy.get(".modal__buttons > .btn-primary").click();

    cy.url().should("include", "/project/" + newProjectUrl);

    cy.get(".tabs")
      .children()
      .should("have.length", 2);

    cy.get(".tabs")
      .children()
      .contains("a", newProjectName.toUpperCase());
  });

  it("Test to ensure that the user can click on an existing project", function() {
    cy.get("tbody")
      .children()
      .contains("span", existingProjectName)
      .click();

    cy.url().should("include", "/project/" + existingProjectUrl);

    cy.get(".tabs")
      .children()
      .should("have.length", 2);

    cy.get(".tabs")
      .children()
      .contains("a", existingProjectName.toUpperCase());
  });
});
