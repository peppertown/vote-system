import pool from '../mariadb.js';

const showResult = async (req, res) => {
  const surveyId = req.params.id;

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

  return res.json(result);
};

export default showResult;
