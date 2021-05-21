/* eslint-disable camelcase */
const {
  getHistory, getAllHistories, updateHistory, createHistory,
} = require('../services/historyService');

exports.id = async (req, res, next, id) => {
  try {
    const history = await getHistory(id);
    req.history = history;
    next();
  } catch (error) {
    next(error);
  }
};

exports.all = async (req, res, next) => {
  const { page = 0, pageSize = 10 } = req.query;
  try {
    const { data, meta } = await getAllHistories(page, pageSize);
    res.json({
      data,
      success: true,
      statusCode: '200',
      meta,
    });
  } catch (error) {
    next(error);
  }
};

exports.read = async (req, res, next) => {
  const { history = {} } = req;
  if (history) {
    res.json({
      data: history,
      success: true,
      statusCode: '200',
    });
  }
};

exports.delete = async (req, res, next) => {
  const { history = {} } = req;
  try {
    const deleted = history.destroy();
    res.json({
      data: deleted,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const { history = {}, userId } = req;
  const { ...historyData } = req.body;
  try {
    const historyUpdated = await updateHistory(history, historyData, userId);
    res.json({
      data: historyUpdated,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  // Save History to Database
  const { userId } = req;
  const { ...historyData } = req.body;
  try {
    await createHistory(historyData, userId);
    res.send({ message: 'History was registered successfully!' });
  } catch (error) {
    next({
      statusCode: '404',
      message: error.message,
    });
  }
};
