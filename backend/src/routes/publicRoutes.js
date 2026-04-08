const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/event', publicController.getEvent);
router.get('/stats', publicController.getStats);
router.get('/sponsors', publicController.getSponsors);
router.get('/team', publicController.getTeam);
router.get('/timeline', publicController.getTimeline);
router.get('/gallery', publicController.getGallery);
router.get('/media', publicController.getMedia);
router.get('/terminal', publicController.getTerminal);
router.post('/inquiries', publicController.createInquiry);
router.get('/test-email', publicController.testEmail);

module.exports = router;
