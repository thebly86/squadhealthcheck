describe('Manage projects page tests', function()
{
    const newProjectName = 'Manage Project';

    beforeEach(function() {
        cy.visit('');
        // Initialise Fixture objects
        cy.fixture('elements.json').as('element');
    })

    it('Test to ensure that when viewing a project the required elements are displayed', function()
    {
        // Create a new project
        cy.get(this.element.appHeaderElements.newProjectButton)
        .click();

        cy.get(this.element.modalElements.modalProjectNameField)
            .type(newProjectName);

        cy.get(this.element.modalElements.modalSaveButton)
            .click();

        cy.get(this.element.homePage.projectList)
            .contains(this.element.homePage.projectListElement.projectIcon, 'MP')
            .click();

        // Check required elements are on the page
        cy.get(this.element.appHeaderElements.projectTitle)
            .contains(newProjectName)
    })

    after(function() {
        // Deletes new project
        cy.visit('');
        cy.get(this.element.homePage.projectList)
            .contains(this.element.homePage.projectListElement.projectIcon, 'MP')
            .parent()
            .as('project');
        
        cy.get('@project')
            .find(this.element.homePage.projectListElement.buttons)
            .contains('span', 'Delete')
            .click();
        
        // Confirm delete in modal
        cy.get(this.element.modalElements.modalDeleteButton)
            .click();
    })
})