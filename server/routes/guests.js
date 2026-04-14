const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

router.get('/event/:event_id', guestController.getGuestsByEvent);
router.post('/', guestController.addGuest);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;
