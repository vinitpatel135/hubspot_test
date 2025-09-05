const dealService = require("../services/deal.service");

class DealController {
    async getCardData(req, res) {
        try {
            const { objectId } = req.body; // HubSpot passes dealId
            const deal = await dealService.getDealByHubspotId(objectId);

            if (!deal) {
                return res.json({
                    results: [
                        {
                            objectId,
                            title: "Installments & Payments",
                            sections: [{ type: "heading", text: "No deal found in system." }]
                        }
                    ]
                });
            }

            const response = {
                results: [
                    {
                        objectId,
                        title: `Installments for Deal #${objectId}`,
                        link: "https://your-frontend.com/deals/" + deal._id,
                        sections: [
                            {
                                type: "heading",
                                text: `Total Amount: ${deal.amount} | Status: ${deal.status}`
                            },
                            {
                                type: "list",
                                items: deal.installments.map((inst, i) => ({
                                    label: `Installment ${i + 1}: ${inst.amount}`,
                                    value: `Status: ${inst.status} | Paid: ${inst.totalPaidAmount}`
                                }))
                            }
                        ]
                    }
                ]
            };

            res.json(response);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async seedSample(req, res) {
        const deal = await dealService.createSampleDeal();
        res.json(deal);
    }
}

module.exports = new DealController();
