/// <reference types="cypress" />

describe('items', () => {
  beforeEach(() => {
    cy.fixture('users').then((json) => {
      localStorage.setItem('todo', JSON.stringify(json));
    });

    cy.visit('/1643683611810/items');
  });

  it('처음에 기본 값으로 항목 세 개를 보여준다', () => {
    cy.get('.items li').should('have.length', 3);
    cy.get('.items li .item__title')
      .first()
      .should('have.text', '첫 번째 항목');
    cy.get('.items li .item__title').eq(1).should('have.text', '두 번째 항목');
    cy.get('.items li .item__title').last().should('have.text', '세 번째 항목');
  });

  it('새로운 항목을 추가한다: 엔터 키 입력', () => {
    const title = '    네 번째 항목';
    cy.get('.new-item .new-item__input').type(`${title}{enter}`);
    cy.get('.items li .item__title')
      .should('have.length', 4)
      .last()
      .should('have.text', title.trim());
  });

  it('새로운 항목을 추가한다: 추가 버튼 클릭', () => {
    const title = '    네 번째 항목';
    cy.get('.new-item .new-item__input').type(`${title}`);
    cy.get('.new-item button').click();
    cy.get('.items li .item__title')
      .should('have.length', 4)
      .last()
      .should('have.text', title.trim());
  });

  it('빈 문자열이면 항목을 추가하지 않는다', () => {
    const title = '    ';
    cy.get('.new-item .new-item__input').type(`${title}{enter}`);
    cy.get('.items li .item__title').should('have.length', 3);
  });

  it('항목 제목 수정을 시작한다: 수정 버튼 클릭', () => {
    cy.get('.items li .item__edit-btn').first().click();
    cy.get('.items li .item__input-edit')
      .first()
      .should('have.value', '첫 번째 항목');
    cy.get('.items li').first().should('have.class', 'editing');
  });

  it('항목 제목 수정을 시작한다: 제목 더블 클릭', () => {
    cy.get('.items li .item__title').first().dblclick();
    cy.get('.items li .item__input-edit')
      .first()
      .should('have.value', '첫 번째 항목');
    cy.get('.items li').first().should('have.class', 'editing');
  });

  it('항목 제목을 수정한다: 엔터 키 입력', () => {
    const title = '      새로운 항목';
    cy.get('.items li .item__edit-btn').last().click();
    cy.get('.items li .item__input-edit')
      .last()
      .clear()
      .type(`${title}{enter}`);
    cy.get('.items li .item__title').last().should('have.text', title.trim());
  });

  it('항목 제목을 수정한다: 완료 버튼 클릭', () => {
    const title = '      새로운 항목';
    cy.get('.items li .item__title').last().dblclick();
    cy.get('.items li .item__input-edit').last().clear().type(`${title}`);
    cy.get('.items li .item__edit-btn').last().click();
    cy.get('.items li .item__title').last().should('have.text', title.trim());
  });

  it('항목 제목을 수정을 취소한다: ESC키 입력', () => {
    const title = '      새로운 항목';
    cy.get('.items li .item__edit-btn').last().click();
    cy.get('.items li .item__input-edit').last().clear().type(`${title}`);
    cy.get('.items li .item__input-edit').last().type('{esc}');
    cy.get('.items li .item__title').last().should('have.text', '세 번째 항목');
    cy.get('.items li').last().should('not.have.class', 'editing');
  });

  it('항목 제목을 수정을 취소한다: 빈 문자열 입력', () => {
    const title = '      ';
    cy.get('.items li .item__edit-btn').last().click();
    cy.get('.items li .item__input-edit')
      .last()
      .clear()
      .type(`${title}{enter}`);
    cy.get('.items li .item__title').last().should('have.text', '세 번째 항목');
    cy.get('.items li').last().should('not.have.class', 'editing');
  });

  it('항목을 삭제한다', () => {
    cy.get('.items li .item__delete-btn').first().click();
    cy.get('.items li').should('have.length', 2);
    cy.get('.items li .item__title').last().should('have.text', '세 번째 항목');
  });

  it('완료 상태를 토글한다', () => {
    cy.get('.items li .item__checkbox').first().click();
    cy.get('.items li').first().should('not.have.class', 'completed');
    cy.get('.items li .item__checkbox').last().click();
    cy.get('.items li').last().should('have.class', 'completed');
  });

  it('홈 링크를 클릭하고, 기본 항목을 출력한다', () => {
    cy.get('.home-link').click();
    cy.get('.users li').should('have.length', 2);
    cy.get('.users li a').first().should('have.text', '유저1');
    cy.get('.users li a').last().should('have.text', '유저2');
  });

  it('작업 중인 항목만 출력한다', () => {
    cy.visit('/1643683611810/items#active');

    cy.get('.items li').should('have.length', 2);
    cy.get('.items li .item__title')
      .first()
      .should('have.text', '두 번째 항목');
    cy.get('.items li .item__title').last().should('have.text', '세 번째 항목');
  });

  it('완료한 항목만 출력한다', () => {
    cy.visit('/1643683611810/items#completed');

    cy.get('.items li').should('have.length', 1);
    cy.get('.items li .item__title')
      .first()
      .should('have.text', '첫 번째 항목');
  });
});
