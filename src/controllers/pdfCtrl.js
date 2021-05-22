/* eslint-disable camelcase */
const { getHistory } = require('../services/historyService');
const { createHistoryPDF } = require('../services/pdfService');

async function createPDF(model, dataId, cllbk) {
  if (model === 'history') {
    const history = await getHistory(dataId);
    return createHistoryPDF(history, cllbk);
  }
  const history = await getHistory(dataId);
  return createHistoryPDF(history, cllbk);
}

exports.create = async (req, res, next) => {
  const { dataId, model } = req.body;
  try {
    await createPDF(model, dataId, (fileName, binary) => {
      res.contentType('application/pdf');
      res.send({
        binary,
        fileName,
      });
    });
  } catch (error) {
    next({
      statusCode: '404',
      message: error.message,
    });
  }
};
