/// <reference types="cypress" />

describe('items', () => {
  beforeEach(() => {
    cy.visit('/something-strange-page');
  });

  it('Not Found 메시지를 출력한다.', () => {
    cy.get('.not-found-message').should('have.text', 'Not Found');
  });

  it('홈 링크를 클릭하고, 홈으로 이동한다.', () => {
    cy.get('.home-link').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});
