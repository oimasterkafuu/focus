const { Router } = require('express');
const { fetchSteps } = require('../libs/chatgpt');

const router = Router();
router.post('/fetchSteps/', async (req, res) => {
    let result = await fetchSteps(req.body.task);
    if (result) res.send({ success: true, steps: result });
    res.send({ success: false });
});

module.exports = {
    apiRouter: router
};
