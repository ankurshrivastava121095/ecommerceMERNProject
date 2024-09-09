const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Token = require('../models/Token'); 
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
});

class UserController {

    static register = async (req, res) => {
        try {
            const { name, email, mobileNumber, alternateNumber, password, pincode, city, state, country, role } = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });

            if (existingUser) {
                return res.status(401).json({ 'status': 'failed', 'message': existingUser.email === email ? 'Email Already Registered' : 'Mobile Number Already Registered' });
            } 

            const newUser = new User({
                name,
                email,
                mobileNumber,
                alternateNumber,
                password: hashPassword,
                pincode,
                city,
                state,
                country,
                role: role || "User"
            });

            await newUser.save();

            const accountSid = '';   // accountsid
            const authToken = '';    // auth token
            const client = require('twilio')(accountSid, authToken);

            client.messages
            .create({
                body: 'Thank you for registering at Studio Sasvat! We’re excited to have you on board and can’t wait for you to explore our unique collection of art and decor. Happy shopping!',
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+91${mobileNumber}`
            })
            .then(message => console.log(message.sid))

            res.status(201).json({ 'status': 'success', 'message': 'Registration Successful' });

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ 'status': 'failed', 'message': 'All Fields are required' });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ 'status': 'failed', 'message': 'User not Found' });
            }

            const isPasswordMatched = await bcrypt.compare(password, user.password);

            if (!isPasswordMatched) {
                return res.status(401).json({ 'status': 'failed', 'message': 'Invalid Email or Password' });
            }

            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                alternateNumber: user.alternateNumber,
                pincode: user.pincode,
                city: user.city,
                state: user.state,
                country: user.country,
                role: user.role,
            }, process.env.JWT_SECRET_KEY, { expiresIn: '30 days' });

            res.status(200).json({ 'status': 'success', 'message': 'Login Successfully', token });

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchUserById = async (req, res) => {
        try {
            const user = await User.findById(req.user_id);

            if (user) {
                res.status(200).json({
                    success: true,
                    data: user
                });
            } else {
                res.status(404).json({ 'status': 'failed', 'message': 'User not found' });
            }

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static fetchAllUsers = async (req, res) => {
        try {
            const searchedRole = req.headers["searched-status"] || '';
            const searchedRecord = req.headers["searched-record"] || '';
            const pageNumber = Number(req.headers["page-number"]) || 1;
        
            const recordsPerPage = 12;
            const skip = recordsPerPage * (pageNumber - 1);
        
            let query = {};
            if (searchedRole) query.role = searchedRole;
            if (searchedRecord) {
                query.$or = [
                    { name: { $regex: searchedRecord, $options: 'i' } },
                    { mobileNumber: { $regex: searchedRecord, $options: 'i' } },
                    { email: { $regex: searchedRecord, $options: 'i' } }
                ];
            }

            const totalRecords = await User.countDocuments(query);
            const users = await User.find(query).sort({ _id: -1 }).skip(skip).limit(recordsPerPage);

            res.status(200).json({
                success: true,
                data: users,
                totalRecords
            });

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static changeUserStatus = async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            if (user) {
                user.role = user.role === 'Admin' ? 'User' : 'Admin';
                await user.save();
                
                res.status(200).json({ status: 'success', message: 'User Status Updated Successfully' });
            } else {
                res.status(404).json({ status: 'failed', message: 'User not found' });
            }

        } catch (err) {
            res.status(500).json({ status: 'failed', message: `Error: ${err.message}` });
        }
    }

    static updateUser = async (req, res) => {
        try {
            const { name, pincode, city, state, country } = req.body;
            
            const user = await User.findByIdAndUpdate(req.user_id, { name, pincode, city, state, country }, { new: true });

            if (user) {
                res.status(200).json({ 'status': 'success', 'message': 'Your Details Updated Successfully' });
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static forgotPassword = async (req, res) => {
        try {
            const { mobileNumber } = req.body;

            const user = await User.findOne({ mobileNumber });

            if (!user) {
                return res.status(404).json({ 'status': 'failed', 'message': 'User not found' });
            }

            const otp = Math.floor(100000 + Math.random() * 900000);

            await Token.deleteMany({ mobileNumber });
            await new Token({ mobileNumber, otp }).save();

            const accountSid = '';   // accountsid
            const authToken = '';    // auth token
            const client = require('twilio')(accountSid, authToken);

            client.messages
            .create({
                body: `Your OTP for password reset is ${otp}. Do not share it with anyone.`,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+91${mobileNumber}`
            })
            .then(message => console.log(message.sid))

            res.status(200).json({ 'status': 'success', 'message': 'OTP sent to your WhatsApp number', 'userId': user._id });

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static verifyOtp = async (req, res) => {
        try {
            const { mobileNumber, otp } = req.body;

            const tokenRecord = await Token.findOne({ mobileNumber, otp });

            if (!tokenRecord) {
                return res.status(401).json({ 'status': 'failed', 'message': 'Invalid OTP' });
            }

            res.status(200).json({ 'status': 'success', 'message': 'OTP verified' });

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

    static resetPassword = async (req, res) => {
        try {
            const { userId, newPassword, confirmPassword } = req.body;

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ 'status': 'failed', 'message': 'Passwords do not match' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPassword, salt);

            const user = await User.findByIdAndUpdate(userId, { password: hashPassword }, { new: true });

            if (user) {
                res.status(200).json({ 'status': 'success', 'message': 'Password reset successful' });
            } else {
                res.status(500).json({ 'status': 'failed', 'message': 'Internal Server Error' });
            }

        } catch (err) {
            res.status(500).json({ 'status': 'failed', 'message': `Error: ${err.message}` });
        }
    }

}

module.exports = UserController;