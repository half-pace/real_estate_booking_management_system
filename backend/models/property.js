import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['apartment', 'house', 'villa', 'condo', 'townhouse', 'studio'], required: true },
    price: { type: Number, required: true },
    location: {
        address: String,
        city: String,
        state: String,
        zipCode: String
    },
    features: {
        bedrooms: Number,
        bathrooms: Number,
        area: Number,
        parking: Number,
        furnished: Boolean
    },
    amenities: [String],
    images: [String],
    status: { type: String, enum: ['available', 'booked', 'sold'], default: 'available' },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Property', propertySchema);