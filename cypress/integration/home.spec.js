/// <reference types="cypress" />

describe('home', () => {
  beforeEach(() => {
    cy.fixture('users').then((json) => {
      localStorage.setItem('todo', JSON.stringify(json));
    });

    cy.visit('/');
  });

  it('처음에 기본 값으로 유저 두 명을 보여준다', () => {
    cy.get('.users li').should('have.length', 2);
    cy.get('.users li a').first().should('have.text', '유저1');
    cy.get('.users li a').last().should('have.text', '유저2');
  });

  it('새로운 유저를 추가한다: 엔터 입력', () => {
    const username = '    하이';
    cy.get('.new-user input').type(`${username}{enter}`);
    cy.get('.users li a')
      .should('have.length', 3)
      .last()
      .should('have.text', username.trim());
  });

  it('새로운 유저를 추가한다: 추가 버튼 클릭', () => {
    const username = '    하이';
    cy.get('.new-user input').type(`${username}`);
    cy.get('.new-user button').click();
    cy.get('.users li a')
      .should('have.length', 3)
      .last()
      .should('have.text', username.trim());
  });

  it('빈 문자열이면 유저를 추가하지 않는다', () => {
    const username = '    ';
    cy.get('.new-user input').type(`${username}{enter}`);
    cy.get('.users li a').should('have.length', 2);
  });

  it('유저 이름을 수정한다', () => {
    const username = '     하이요';

    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(username.trim());
    });

    cy.get('.users li .user__edit-btn').last().click();
    cy.get('.users li a').last().should('have.text', username.trim());
  });

  it('빈 문자열이면 유저 이름을 수정하지 않는다', () => {
    const username = '     ';

    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(username.trim());
    });

    cy.get('.users li .user__edit-btn').last().click();
    cy.get('.users li a').last().should('have.text', '유저2');
  });

  it('유저를 삭제한다', () => {
    cy.get('.users li .user__delete-btn').first().click();
    cy.get('.users li a')
      .should('have.length', 1)
      .first()
      .should('have.text', '유저2');
  });

  it('유저 링크를 클릭하고, 기본 항목을 출력한다', () => {
    cy.get('.users li a').first().click();
    cy.get('.items li').should('have.length', 3);
    cy.get('.items li .item__title')
      .first()
      .should('have.text', '첫 번째 항목');
    cy.get('.items li .item__title').eq(1).should('have.text', '두 번째 항목');
    cy.get('.items li .item__title').last().should('have.text', '세 번째 항목');
  });
});
