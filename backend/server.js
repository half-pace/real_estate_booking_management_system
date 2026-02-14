import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Property from './models/Property.js';
import Booking from './models/Booking.js';

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//mongodb connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lux-estate')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB Error: ', err.message, '- Database features disabled'));

//auth middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

//auth routes

//register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password, role: role || 'user' });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: { id: user._id, name, email, role: user.role }
        });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: { id: user._id, name: user.name, email, role: user.role }
        });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//property routes

//get all properties
app.get('/api/properties', async (req, res) => {
    try {
        const { type, minPrice, maxPrice, city, status } = req.query;
        const filter = {};

        if (type) filter.type = type;
        if (city) filter['location.city'] = new RegExp(city, 'i');
        if (status) filter.status = status;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const properties = await Property.find(filter).populate('agent', 'name email');
        res.json(properties);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get single property
app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('agent', 'name email');
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json(property);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//creatre property(protected)
app.post('/api/properties', authMiddleware, async (req, res) => {
    try {
        const property = new Property({ ...req.body, agent: req.userId });
        await property.save();
        res.status(201).json(property);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//delete porperty(protected)
app.delete('/api/properties/:id', authMiddleware, async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if(!property) return res.status(404).json({ message: 'Property not found' });
        res.json({ message: 'Property deleted' });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//booking routes
//get user bookings(protected)
app.get('/api/bookings', authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId })
            .populate('property')
            .sort('-createdAt');
        res.json(bookings);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//create booking(protected)
app.post('/api/bookings', authMiddleware, async (req, res) => {
    try {
        const booking = new Booking({ ...req.body, user: req.userId });
        await booking.save();

        await Property.findByIdAndUpdate(req.body.property, { status: 'booked' });

        const populatedBooking = await Booking.findById(booking._id).populate('property');
        res.status(201).json(populatedBooking);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//cancel booking(protected)
app.delete('/api/bookings/:id', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        await Property.findByIdAndUpdate(booking.property, { status: 'available' });

        res.json({ message: 'Booking cancelled' });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});