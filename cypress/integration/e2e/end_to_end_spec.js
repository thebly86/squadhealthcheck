describe('End to end User journey', function()
{
    var newProjectName = 'Cypress E2E Test';
    var newTeamName = "Team 1";
    var healthCount = 0;

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
        cy.get(this.element.homePage.projectList)
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

        cy.get(this.element.homePage.projectListElement.buttons)
        .click();
        
        // Fill out health check
        cy.get(this.element.appHeaderElements.projectNavigation)
        .children()
        .contains('span', 'TEAM HEALTH')
        .click();

        cy.get(this.element.healthPage.healthRadioButton)
        .each(($el) => {
            if(healthCount === 0) {
                cy.wrap($el).click();
                healthCount++;
            }
            else if(healthCount === 1) {
                cy.wrap($el).click();
                cy.wrap($el).click();
                healthCount++;
            }
            else {
                cy.wrap($el).click();
                cy.wrap($el).click();
                cy.wrap($el).click();
                healthCount = 0;
            }
        });

        // Save the changes
        cy.get(this.element.healthPage.healthSaveButton)
        .click();

        //Reset the counter 
        var healthColour = 0;

        // Check each radio button is assigned the correct value
        cy.get(this.element.healthPage.healthRadioButton)
        .each(($el) => {
            if(healthColour === 0) {
                cy.wrap($el).should('have.css', 'background-color', 'rgb(255, 51, 0)');
                healthColour++;
            }
            else if(healthColour === 1) {
                cy.wrap($el).should('have.css', 'background-color', 'rgb(255, 204, 51)');
                healthColour++;
            }
            else {
                cy.wrap($el).should('have.css', 'background-color', 'rgb(0, 204, 102)');
                healthColour = 0;
            }
        });
    })

    after(function() {
        // Deletes new project
        cy.visit('');
        cy.get(this.element.homePage.projectList)
        .contains('.data-list-view__icon', 'CE')
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