const { default: axios } = require('axios');
const express = require('express');
const dealModel = require('../models/deal.model');

const router = express.Router();

router.post('/hubspot/webhook', async (req, res) => {
    // Handle HubSpot webhook events here
    const events = req.body;

    for (const event of events) {
        if (event.subscriptionType.startsWith('deal.propertyChange')) {
            const dealId = event.objectId;

            const { data } = await axios.get(
                `https://api.hubapi.com/crm/v3/objects.deals/${dealId}`,
                {
                    headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` },
                    params: { properties: 'dealname,amount,dealstage,closedate.hubspot_owner_id' }
                }
            )

            await dealModel.findOneAndUpdate(
                { hubspotId: dealId },
                {
                    hubspotId: dealId,
                    amount: Number(data.properties.amount || 0),
                    status: "pending",
                    installments: [],
                },
                { upsert: true, new: true }
            )

        }
    }
    res.sendStatus(200)
});

module.exports = router;