/// <reference types="cypress" />

describe('items', () => {
  beforeEach(() => {
    cy.fixture('users').then((json) => {
      localStorage.setItem('todo', JSON.stringify(json));
    });

    cy.visit('/1643683611810/items');
  });

  it('처음에 기본 값으로 항목 두 개를 보여준다', () => {
    cy.get('.items li').should('have.length', 2);
    cy.get('.items li .title').first().should('have.text', '첫 번째 항목');
    cy.get('.items li .title').last().should('have.text', '두 번째 항목');
  });

  it('새로운 항목을 추가한다: 엔터 키 입력', () => {
    var title = '    세 번째 항목';
    cy.get('.new-item-box .input').type(`${title}{enter}`);
    cy.get('.items li .title').should('have.length', 3).last().should('have.text', title.trim());
  });

  it('새로운 항목을 추가한다: 추가 버튼 클릭', () => {
    var title = '    세 번째 항목';
    cy.get('.new-item-box .input').type(`${title}`);
    cy.get('.new-item-box .button').click();
    cy.get('.items li .title').should('have.length', 3).last().should('have.text', title.trim());
  });

  it('빈 문자열이면 항목을 추가하지 않는다', () => {
    var title = '    ';
    cy.get('.new-item-box .input').type(`${title}{enter}`);
    cy.get('.items li .title').should('have.length', 2);
  });

  it('항목 제목 수정을 시작한다: 수정 버튼 클릭', () => {
    cy.get('.items li .edit-btn').first().click();
    cy.get('.items li .input-edit').first().should('have.value', '첫 번째 항목');
    cy.get('.items li').first().should('have.class', 'editing');
  });

  it('항목 제목 수정을 시작한다: 제목 더블 클릭', () => {
    cy.get('.items li .title').first().dblclick();
    cy.get('.items li .input-edit').first().should('have.value', '첫 번째 항목');
    cy.get('.items li').first().should('have.class', 'editing');
  });

  it('항목 제목을 수정한다: 엔터 키 입력', () => {
    var title = '      새로운 항목';
    cy.get('.items li .edit-btn').last().click();
    cy.get('.items li .input-edit').last().clear().type(`${title}{enter}`);
    cy.get('.items li .title').last().should('have.text', title.trim());
  });

  it('항목 제목을 수정한다: 완료 버튼 클릭', () => {
    var title = '      새로운 항목';
    cy.get('.items li .title').last().dblclick();
    cy.get('.items li .input-edit').last().clear().type(`${title}`);
    cy.get('.items li .edit-btn').last().click();
    cy.get('.items li .title').last().should('have.text', title.trim());
  });

  it('항목 제목을 수정을 취소한다: ESC키 입력', () => {
    var title = '      새로운 항목';
    cy.get('.items li .edit-btn').last().click();
    cy.get('.items li .input-edit').last().clear().type(`${title}`);
    cy.get('.items li .input-edit').last().type('{esc}');
    cy.get('.items li .title').last().should('have.text', '두 번째 항목');
    cy.get('.items li').last().should('not.have.class', 'editing');
  });

  it('항목 제목을 수정을 취소한다: 빈 문자열 입력', () => {
    var title = '      ';
    cy.get('.items li .edit-btn').last().click();
    cy.get('.items li .input-edit').last().clear().type(`${title}{enter}`);
    cy.get('.items li .title').last().should('have.text', '두 번째 항목');
    cy.get('.items li').last().should('not.have.class', 'editing');
  });

  it('항목을 삭제한다', () => {
    cy.get('.items li .delete-btn').first().click();
    cy.get('.items li').should('have.length', 1);
    cy.get('.items li .title').first().should('have.text', '두 번째 항목');
  });

  it('홈 링크를 클릭하고, 기본 항목을 출력한다', () => {
    cy.get('.home-link').click();
    cy.get('.users li').should('have.length', 2);
    cy.get('.users li .link').first().should('have.text', '유저1');
    cy.get('.users li .link').last().should('have.text', '유저2');
  });
});
