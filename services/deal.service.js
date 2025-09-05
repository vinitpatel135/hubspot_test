const Deal = require("../models/deal.model");

class DealService {
    async getDealByHubspotId(hubspotId) {
        return await Deal.findOne({ hubspotId });
    }

    async createSampleDeal() {
        return await Deal.create({
            hubspotId: "12345", // example HubSpot deal ID
            amount: 8888,
            status: "partially_refunded",
            installments: [
                {
                    scheduledDate: new Date(),
                    amount: 4444,
                    status: "cancelled",
                    totalPaidAmount: 0,
                    payments: [
                        {
                            status: "paid",
                            amount: 4444,
                            date: new Date(),
                            refunds: [
                                { status: "refunded", amount: 4444, date: new Date() }
                            ]
                        }
                    ]
                }
            ]
        });
    }
}

module.exports = new DealService();
