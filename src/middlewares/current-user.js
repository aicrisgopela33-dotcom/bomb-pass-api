const { sequelize } = require('../models');

// Temporary Week 11 stand-in until Week 12 authentication exists.
// Disabled when NODE_ENV === 'production'.
async function currentUser(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    return next();
  }

  const rawHeader = req.get('X-Demo-User');
  if (!rawHeader) {
    req.user = null;
    return next();
  }

  const userId = Number(rawHeader);
  if (!Number.isInteger(userId) || userId <= 0) {
    req.user = null;
    return next();
  }

  try {
    const [rows] = await sequelize.query(
      'SELECT user_id, role FROM users WHERE user_id = :userId LIMIT 1',
      {
        replacements: { userId },
      }
    );

    if (!rows || rows.length === 0) {
      req.user = null;
      return next();
    }

    req.user = {
      user_id: rows[0].user_id,
      role: rows[0].role,
    };
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = currentUser;
