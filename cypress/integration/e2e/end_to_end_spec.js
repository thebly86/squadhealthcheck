describe('End to end User journey', function()
{
    var newProjectName = 'Cypress E2E Test';
    var newTeamName = "Team 1";
    var startDate = "01/01/2001";
    var endDate = "07/01/2001";

    beforeEach(function() {
        cy.visit('');
        // Initialise Fixture object
        cy.fixture('elements.json').as('element');
    })

    it('UJ01 - Create a new Project, create a new team, sprint and fill out the health check', function() {
        // Check you're on the homepage
        cy.get(this.element.appHeaderElements.headerText)
        .contains('Squad Health Check');
        cy.get(this.element.appHeaderElements.headerTitle)
        .contains('Dashboard');

        // Create a project
        cy.get(this.element.appHeaderElements.newProjectButton)
        .click();

        cy.get(this.element.modalElements.modalProjectNameField)
        .type(newProjectName);

        cy.get(this.element.modalElements.modalSaveButton)
        .click();

        // Go to newly created team
        cy.get(this.element.projectList)
        .children()
        .contains('.data-list-view__icon', 'CE')
        .click();

        cy.get(this.element.appHeaderElements.headerTitle)
        .contains(newProjectName);

        // Add a team to the project
        cy.get(this.element.appHeaderElements.projectNavigation)
        .children()
        .contains('span', 'TEAMS')
        .click();

        cy.get(this.element.teamPage.teamInputField)
        .type(newTeamName)
        .get(this.element.teamPage.addTeamButton)
        .click();

        // Setup a sprint
        cy.get(this.element.appHeaderElements.projectNavigation)
        .children()
        .contains('span', 'SPRINTS')
        .click();

        cy.get(this.element.sprintPage.sprintNumberField)
        .type(1);

        // cy.get(this.element.sprintPage.sprintStartDate)
        // .type(startDate);

        // cy.get(this.element.sprintPage.sprintEndDate)
        // .type(endDate);

        cy.get(this.element.projectListElement.buttons)
        .click();
        
        // Fill out health check
        cy.get(this.element.appHeaderElements.projectNavigation)
        .children()
        .contains('span', 'TEAM HEALTH')
        .click();
    })

    after(function() {
        // Deletes new project
        cy.visit('');
        cy.get(this.element.projectList)
        .contains('.data-list-view__icon', 'CE')
        .parent()
        .as('project');

        cy.get('@project')
        .find(this.element.projectListElement.buttons)
        .contains('span', 'Delete')
        .click();

        // Confirm delete in modal
        cy.get(this.element.modalElements.modalDeleteButton)
        .click();
    })
})