const APPLICATION_PREFIX = 'azetzv1';
const SCORE_KEY = `${APPLICATION_PREFIX}_game_score`;

/** @type Data */
let data = null;

export default class Data {
  static getInstance() {
    if (!data) {
      data = new Data();
    }
    return data;
  }

  /**
   * @param score {number}
   */
  saveScore(score) {
    localStorage.setItem(SCORE_KEY, score + '');
  }

  getScore() {
    const score = localStorage.getItem(SCORE_KEY);
    return score ? +score : 0;
  }
}
