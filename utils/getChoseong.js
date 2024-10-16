/**
 * 문자열에서 한글 초성을 추출하는 함수.
 * 영어 문자는 그대로 반환합니다.
 *
 * @param {string} str - 입력 문자열.
 * @returns {string} - 초성이 추출된 문자열.
 *
 * @example
 * // 한글 초성 추출
 * const result1 = getChoseong('한강');
 * console.log(result1); // 'ㅎㄱ'
 *
 * @example
 * // 영어 문자열 그대로 반환
 * const result2 = getChoseong('username');
 * console.log(result2); // 'username'
 */
export default function getChoseng(str) {
  // 타입 검사
  if (typeof str !== 'string') {
    throw new TypeError('getChosung: str은 문자열이어야 합니다.');
  }

  const CHOSUNG_START = 0x1100;
  const CHOSUNG_END = 0x1112;
  const HANGUL_START = 0xac00;
  const HANGUL_END = 0xd7a3;
  const CHOSUNG_OFFSET = 0x1100;
  const HANGUL_BASE = 0xac00;
  const HANGUL_CYCLE = 588;

  let result = '';

  for (let char of str) {
    const code = char.charCodeAt(0);

    if (code >= HANGUL_START && code <= HANGUL_END) {
      const chosungIndex = Math.floor((code - HANGUL_BASE) / HANGUL_CYCLE);
      const chosungChar = String.fromCharCode(CHOSUNG_START + chosungIndex);
      result += chosungChar;
    } else if (code >= CHOSUNG_START && code <= CHOSUNG_END) {
      result += char;
    } else {
      result += char;
    }
  }

  return result;
}
