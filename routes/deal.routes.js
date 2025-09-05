const express = require("express");
const DealController = require("../controllers/deal.controller");

const router = express.Router();

// HubSpot will POST here for the card
router.post("/hubspot/get-deal-card", DealController.getCardData);

// For testing: create a sample deal
router.post("/seed", DealController.seedSample);

module.exports = router;
