import pool from '../mariadb.js';

const showMostChoiced = async (req, res) => {
  const surveyId = req.params.id;
  let { mbti } = req.query;
  mbti = mbti === 'true';

  let surveyTitle, totalVoteCount, mostChoiced;
  let mostChoicedNames = [];

  [surveyTitle] = await pool.execute(`SELECT title FROM surveys WHERE id = ?`, [
    surveyId,
  ]);

  [totalVoteCount] = await pool.execute(
    `SELECT count(*) FROM responses WHERE survey_id = ?`,
    [surveyId],
  );

  [mostChoiced] = await pool.execute(
    `SELECT option_id, COUNT(*) as count FROM answer_choices
       WHERE response_id IN (SELECT id FROM responses WHERE survey_id = ?)
       GROUP BY option_id HAVING count = (
       SELECT MAX(count) FROM ( SELECT COUNT(*) as count FROM answer_choices
       WHERE response_id IN (SELECT id FROM responses WHERE survey_id = ?)
       GROUP BY option_id ) as max_counts );`,
    [surveyId, surveyId],
  );

  for (let answer of mostChoiced) {
    let [result] = await pool.execute(
      'SELECT option_text FROM question_options WHERE id = ?',
      [answer.option_id],
    );
    mostChoicedNames.push(result[0].option_text);
  }

  let result = {
    title: surveyTitle[0].title,
    totalVoteCount: totalVoteCount[0]['count(*)'],
    mostChoiced: mostChoicedNames,
    voteCount: mostChoiced[0].count,
  };

  if (mbti) {
    let mbtiResults = [];
    for (let answer of mostChoiced) {
      const [optionTextResult] = await pool.execute(
        `SELECT option_text FROM question_options WHERE id = ?`,
        [answer.option_id],
      );
      const optionText = optionTextResult[0].option_text;

      const [mbtiData] = await pool.execute(
        `SELECT u.mbti, COUNT(*) as count FROM answer_choices ac
         JOIN responses r ON ac.response_id = r.id
         JOIN users u ON r.user_id = u.id
         WHERE ac.option_id = ?
         GROUP BY u.mbti
         ORDER BY count DESC`,
        [answer.option_id],
      );

      mbtiResults.push({
        option_text: optionText,
        mbtiStatistics: mbtiData.map((data) => ({
          mbti: data.mbti,
          count: data.count,
        })),
      });
    }
    result['mbtiResults'] = mbtiResults;
  }
  res.json(result);
};

const showResult = async (req, res) => {
  const surveyId = req.params.id;
  let sql = `SELECT option_id, COUNT(*) AS count FROM answer_choices
             WHERE question_id = ? GROUP BY option_id; `;
  const [optionsCount] = await pool.execute(sql, [surveyId]);

  const result = [];
  for (let option of optionsCount) {
    const [text] = await pool.execute(
      `SELECT option_text FROM question_options WHERE id = ?`,
      [option.option_id],
    );
    result.push({ [text[0].option_text]: option.count });
  }

  result.sort((a, b) => {
    const val1 = Object.values(a)[0];
    const val2 = Object.values(b)[0];
    return val2 - val1;
  });
  res.json(result);
};

export default { showMostChoiced, showResult };
