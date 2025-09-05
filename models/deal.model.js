const mongoose = require("mongoose");

const RefundSchema = new mongoose.Schema({
    status: String,
    amount: Number,
    date: Date
});

const PaymentSchema = new mongoose.Schema({
    status: String,
    amount: Number,
    date: Date,
    refunds: [RefundSchema]
});

const InstallmentSchema = new mongoose.Schema({
    scheduledDate: Date,
    amount: Number,
    status: String,
    totalPaidAmount: Number,
    payments: [PaymentSchema]
});

const DealSchema = new mongoose.Schema(
    {
        hubspotId: { type: String, index: true }, // mapping with HubSpot
        amount: Number,
        status: String,
        installments: [InstallmentSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Deals", DealSchema);
