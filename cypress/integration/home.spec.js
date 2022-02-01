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
    cy.get('.users li .link').first().should('have.text', '유저1');
    cy.get('.users li .link').last().should('have.text', '유저2');
  });

  it('새로운 유저를 추가한다: 엔터 입력', () => {
    var username = '    하이';
    cy.get('.new-user-box .input').type(`${username}{enter}`);
    cy.get('.users li .link').should('have.length', 3).last().should('have.text', username.trim());
  });

  it('새로운 유저를 추가한다: 추가 버튼 클릭', () => {
    var username = '    하이';
    cy.get('.new-user-box .input').type(`${username}`);
    cy.get('.new-user-box .button').click();
    cy.get('.users li .link').should('have.length', 3).last().should('have.text', username.trim());
  });

  it('빈 문자열이면 유저를 추가하지 않는다', () => {
    var username = '    ';
    cy.get('.new-user-box .input').type(`${username}{enter}`);
    cy.get('.users li .link').should('have.length', 2);
  });

  it('유저 이름을 수정한다', () => {
    var username = '     하이요';

    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(username.trim());
    });

    cy.get('.users li .edit-btn').last().click();
    cy.get('.users li .link').last().should('have.text', username.trim());
  });

  it('빈 문자열이면 유저 이름을 수정하지 않는다', () => {
    var username = '     ';

    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(username.trim());
    });

    cy.get('.users li .edit-btn').last().click();
    cy.get('.users li .link').last().should('have.text', '유저2');
  });

  it('유저를 삭제한다', () => {
    cy.get('.users li .delete-btn').first().click();
    cy.get('.users li .link').should('have.length', 1).first().should('have.text', '유저2');
  });

  it('유저 링크를 클릭하고, 기본 항목을 출력한다', () => {
    cy.get('.users li .link').first().click();
    cy.get('.items li').should('have.length', 2);
    cy.get('.items li .title').first().should('have.text', '첫 번째 항목');
    cy.get('.items li .title').last().should('have.text', '두 번째 항목');
  });
});
