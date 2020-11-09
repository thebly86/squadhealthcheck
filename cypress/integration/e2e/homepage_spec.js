describe('Home page tests', function()
{
    const newProjectName = 'Toms Team';

    beforeEach(function() {
        cy.visit('');
        // Initialise Fixture objects
        cy.fixture('elements.json').as('element');
    })

    it('Test to ensure the homepage displays the App Logo', function()
    {
        cy.get(this.element.appHeaderElements.appLogo)
            .should('be.visible');
    })

    it('Test to ensure the homepage displays the App Title', function()
    {
        cy.get(this.element.appHeaderElements.headerText)
            .contains('Squad Health Check');
    })

    it('Test to ensure the homepage displays the Dashboard title', function()
    {
        cy.get(this.element.appHeaderElements.headerTitle)
            .contains('Dashboard')
            .should('be.visible');
    })

    it('Test to ensure the homepage displays the New Project Button', function()
    {
        cy.get(this.element.appHeaderElements.newProjectButton)
            .contains('New Project')
            .should('be.visible');
    })
    
    it('Test to ensure that the user can Create a new project', function()
    {
        cy.get(this.element.appHeaderElements.newProjectButton)
            .click();

        cy.get(this.element.modalElements.modalProjectNameField)
            .type(newProjectName);

        cy.get(this.element.modalElements.modalSaveButton)
            .click();

        cy.get(this.element.homePage.projectList)
            .contains(this.element.homePage.projectListElement.projectIcon, 'TT');
    })

    it('Test to ensure that the user can Delete a project', function()
    {
        cy.get(this.element.homePage.projectList)
            .contains(this.element.homePage.projectListElement.projectIcon, 'TT')
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
