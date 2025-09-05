const { default: axios } = require('axios');
const express = require('express');
const dealModel = require('../models/deal.model');

const router = express.Router();

router.post('/hubspot/webhook', async (req, res) => {
    console.log("Received HubSpot webhook:", req.body);
    const events = req.body;

    for (const event of events) {
        const dealId = event.objectId;

        // Only process deal creation and relevant property changes
        if (
            event.subscriptionType === 'deal.creation' ||
            event.subscriptionType.startsWith('deal.propertyChange')
        ) {
            let dealData;
            try {
                const fetchDeal = async () => {
                    const { data } = await axios.get(
                        `https://api.hubapi.com/crm/v3/objects/deals/${dealId}`,
                        {
                            headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` },
                            params: {
                                properties: 'dealname,amount,dealstage,closedate,hubspot_owner_id'
                            }
                        }
                    );
                    return data;
                };

                try {
                    dealData = await fetchDeal();
                } catch (err) {
                    if (err.response && err.response.status === 404) {
                        console.log(`Deal ${dealId} not found yet, retrying in 1s...`);
                        await new Promise(r => setTimeout(r, 1000));
                        dealData = await fetchDeal();
                    } else {
                        throw err;
                    }
                }

                // Map HubSpot deal → your DB schema
                const hubspotDeal = dealData.properties;

                await dealModel.findOneAndUpdate(
                    { hubspotId: dealId },
                    {
                        hubspotId: dealId,
                        amount: Number(hubspotDeal.amount || 0),
                        status: "pending",   // you can map dealstage → your status if needed
                        installments: [],    // generate installments if needed
                    },
                    { upsert: true, new: true }
                );

                console.log(`Deal ${dealId} processed successfully.`);
            } catch (err) {
                console.error(`Error processing deal ${dealId}:`, err.message);
            }
        }
    }

    res.sendStatus(200);
});

module.exports = router;
