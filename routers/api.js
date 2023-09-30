const { Router } = require('express');
const { fetchSteps, fetchHints } = require('../libs/chatgpt');

const router = Router();
router.post('/fetchSteps/', async (req, res) => {
    let result = await fetchSteps(req.body.task);
    if (result) {
        res.send({ success: true, steps: result });
        return;
    }
    res.send({ success: false });
});
router.post('/fetchHints/', async (req, res) => {
    let result = await fetchHints(req.body.task);
    if (result) {
        res.send({ success: true, hints: result });
        return;
    }
    res.send({ success: false });
});

module.exports = {
    apiRouter: router
};
