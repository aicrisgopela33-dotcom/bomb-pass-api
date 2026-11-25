const { sequelize, DataTypes } = require('../models');
const QuestionSet = require('../models/question-set')(sequelize, DataTypes);

function findAllByOwner(ownerUserId) {
  return QuestionSet.findAll({
    where: { owner_user_id: ownerUserId },
    order: [['question_set_id', 'ASC']],
  });
}

function findAll() {
  return QuestionSet.findAll({
    order: [['question_set_id', 'ASC']],
  });
}

function findById(questionSetId) {
  return QuestionSet.findByPk(questionSetId);
}

function create(data) {
  return QuestionSet.create(data);
}

function update(questionSet, changes) {
  return questionSet.update(changes);
}

function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = {
  QuestionSet,
  findAllByOwner,
  findAll,
  findById,
  create,
  update,
  remove,
};
