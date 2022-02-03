/**
 * @constructor
 */
export default function HomeTemplate() {}

/**
 * 해당 유저 항목으로 이동하는 링크
 *
 * @param {number} userId 유저 id는 링크에 포함된다.
 * @param {string} username 유저 이름을 화면에 출력한다.
 * @returns
 */
HomeTemplate.prototype.user = function (userId, username) {
  return `
    <li data-id="${userId}" class="user">
      <a href="/${userId}/items" class="user__link" aria-label="${username} 사용자의 항목">${username}</a>
      <div class="user__btn-container">
        <button class="user__edit-btn" aria-label="${username} 사용자의 이름 수정">수정</button>
        <button class="user__delete-btn" aria-label="${username} 사용자 삭제">삭제</button>
      </div>
    </li>
  `;
};
