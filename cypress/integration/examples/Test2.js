describe('Dashboard Page',()=>{
    it('Unlock the Door from Door Control or Click Live',()=>{
    cy.visit('https://ui.anavio.ai/dashboard')
    cy.wait(5000)
    //cy.get('.profile-menu-backdrop').click()
    cy.get('.navigation-buttons > :nth-child(2) > .mdc-button__label').click()
    cy.get('.title-and-actions > .title-section > .font-anavio-bold').should('have.text', 'Door Control')
    cy.get('.cdk-column-name').should('have.text','DOORS')
    cy.get('.cdk-column-video').should('have.text','VIDEO')
    cy.get('.cdk-column-lockState').should('have.text','LOCK STATE')
    cy.get('.cdk-column-doorState').should('have.text','DOOR STATE')
    cy.wait(10000)
    //cy.get(':nth-child(7) > .cdk-column-lockState > .lock-button-content > .unlock-button > .mdc-button__label > .button-content').click()
    cy.get(':nth-child(7) > .cdk-column-video > .live-btn > .mdc-button__label').click()
    })

    it('Door Control',()=>{ 
        // cy.get(':nth-child(7) > .cdk-column-lockState > .lock-button-content > .unlock-button > .mdc-button__label > .button-content').click()
    })
})