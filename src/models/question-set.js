module.exports = (sequelize, DataTypes) => {
  const QuestionSet = sequelize.define(
    'QuestionSet',
    {
      question_set_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      owner_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      grade_level: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
    },
    {
      tableName: 'question_sets',
      timestamps: false,
    }
  );

  return QuestionSet;
};
