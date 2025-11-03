const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/mlm_system';
console.log('Attempting to connect to MongoDB at:', mongoURI);

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};
mongoose.connect(mongoURI, mongoOptions)
    .then(() => {
        console.log('✅ Successfully connected to MongoDB');
        console.log('📊 Database Name: mlm_system');
        console.log('🔌 MongoDB Server: localhost:27017');
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        console.error('🔍 Error Details:', {
            name: err.name,
            message: err.message,
            code: err.code
        });
        console.log('⚠️ Please ensure that:');
        console.log('1. MongoDB server is installed and running');
        console.log('2. MongoDB is running on port 27017');
        console.log('3. No firewall is blocking the connection');
        process.exit(1); // Exit the application on connection failure
    });

const User = require('./models/User');

const generateMemberCode = async () => {
    const count = await User.countDocuments();
    return `M${String(count + 1).padStart(6, '0')}`;
};

const findAvailablePosition = async (sponsorCode, position) => {
    let currentSponsor = await User.findOne({ memberCode: sponsorCode });
    
    while (currentSponsor) {
        if (position === 'left') {
            if (!currentSponsor.leftMember) {
                return currentSponsor.memberCode;
            }
            currentSponsor = await User.findOne({ memberCode: currentSponsor.leftMember });
        } else {
            if (!currentSponsor.rightMember) {
                return currentSponsor.memberCode;
            }
            currentSponsor = await User.findOne({ memberCode: currentSponsor.rightMember });
        }
    }
    return null;
};

const updateMemberCounts = async (sponsorCode, position) => {
    let current = await User.findOne({ memberCode: sponsorCode });
    
    while (current) {
        if (position === 'left') {
            current.leftCount += 1;
        } else {
            current.rightCount += 1;
        }
        await current.save();
        
        if (!current.sponsorCode) break;
        current = await User.findOne({ memberCode: current.sponsorCode });
    }
};


app.get('/', (req, res) => {
    res.send('MLM System Backend is running');
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, mobile, password, sponsorCode, position } = req.body;

        const userCount = await User.countDocuments();
        
        if (userCount === 0) {
            // This is the first user (root user)
            const memberCode = await generateMemberCode();
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const rootUser = new User({
                name,
                email,
                mobile,
                password: hashedPassword,
                memberCode,
                sponsorCode: "ROOT",
                leftCount: 0,
                rightCount: 0
            });
            
            await rootUser.save();
            
            return res.status(201).json({
                message: 'Root user registration successful',
                memberCode,
                isRoot: true
            });
        }

        // For non-root users
        const sponsor = await User.findOne({ memberCode: sponsorCode });
        if (!sponsor) {
            return res.status(400).json({ error: 'Invalid Sponsor Code' });
        }

        const finalSponsor = await findAvailablePosition(sponsorCode, position);
        if (!finalSponsor) {
            return res.status(400).json({ error: 'No available position found' });
        }

        const memberCode = await generateMemberCode();

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            memberCode,
            sponsorCode: finalSponsor
        });

        const sponsorToUpdate = await User.findOne({ memberCode: finalSponsor });
        if (position === 'left') {
            sponsorToUpdate.leftMember = memberCode;
        } else {
            sponsorToUpdate.rightMember = memberCode;
        }
        await sponsorToUpdate.save();

        await updateMemberCounts(finalSponsor, position);

        await user.save();

        res.status(201).json({
            message: 'Registration successful',
            memberCode
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, memberCode: user.memberCode },
            'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                memberCode: user.memberCode,
                leftCount: user.leftCount,
                rightCount: user.rightCount
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ memberCode: req.user.memberCode });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            memberCode: user.memberCode,
            sponsorCode: user.sponsorCode,
            leftCount: user.leftCount,
            rightCount: user.rightCount
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

app.get('/api/downline', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ memberCode: req.user.memberCode });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const leftMembers = [];
        const rightMembers = [];

        const getDownline = async (memberCode, position) => {
            if (!memberCode) return;
            
            const member = await User.findOne({ memberCode });
            if (!member) return;

            const memberInfo = {
                name: member.name,
                memberCode: member.memberCode,
                leftCount: member.leftCount,
                rightCount: member.rightCount
            };

            if (position === 'left') {
                leftMembers.push(memberInfo);
            } else {
                rightMembers.push(memberInfo);
            }

            await getDownline(member.leftMember, position);
            await getDownline(member.rightMember, position);
        };

        await getDownline(user.leftMember, 'left');
        await getDownline(user.rightMember, 'right');

        res.json({
            leftMembers,
            rightMembers
        });
    } catch (error) {
        console.error('Downline fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch downline' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});