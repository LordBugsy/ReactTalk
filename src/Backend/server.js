import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the .env file
const envPath = path.resolve(__dirname, '.env');

// Load environment variables from .env file
dotenv.config({ path: envPath });

const app = express(); // Setup the express server

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas

const ReacterSchema = new mongoose.Schema({ 
    username: String,
    password: String,
    profileColour: Number,
    talksJoined: [String],
    talksCreated: [String]
});

const MessageSchema = new mongoose.Schema({
    userID: { // the user who sent the message
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reacter'
    },
    talkID: { // the talk where the message was sent
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Talk'
    },
    message: String,
});

const TalkSchema = new mongoose.Schema({
    userID: { // the user who created the talk
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reacter'
    },
    talkName: String,
    talkDescription: String,
    usersList: [{ // List of users in the talk
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reacter' // Reference to Reacter model
    }],
});

// Models
const Reacter = mongoose.model('Reacter', ReacterSchema);
const Message = mongoose.model('Message', MessageSchema);
const Talk = mongoose.model('Talk', TalkSchema);

// Routes
const setRandomColour = () => {
    return Math.ceil(Math.random() * 7);
};

// Create a new user (Reacter)
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new Reacter({
            username: req.body.username,
            password: req.body.password,
            profileColour: username === "LordBugsy" ? 0 : setRandomColour(), // LordBugsy gets the first profile colour
            talksJoined: [],
            talksCreated: []
        });
        await newUser.save();

        res.json({ 
            message: 'User created successfully', 
            _id: newUser._id, 
            username: newUser.username,
            profileColour: newUser.profileColour,
        }); // you can access it by using backendResponse.data._id and backendResponse.data.username
    }

    catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// Login a user (Reacter)
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Reacter.findOne({ username, password }); // find a user with the given username and password, it would've been better to use a hash function to store the password
        if (user) {
            res.json({ 
                message: 'Login successful',
                _id: user._id,
                username: user.username,
                profileColour: user.profileColour,
            });
        } 
        
        else {
            res.json({ message: 'Invalid credentials' });
        }
    }

    catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// Create a new message
app.post('/api/message', async (req, res) => {
    try {
        const { userID, talkID, message } = req.body;
        const newMessage = new Message({
            userID,
            talkID,
            message
        });
        await newMessage.save();
        res.json({ message: 'Message sent successfully' });
    }

    catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// Create a new talk
app.post('/api/talk', async (req, res) => {
    try {
        const { userID, talkName, talkDescription } = req.body;

        if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: 'Invalid or missing userID' });
        }

        // create the new talk document
        const newTalk = new Talk({
            userID,
            talkName,
            talkDescription,
            usersList: [userID], // the user who created the talk is automatically added to the list of users
        });

        // Save the talk first to generate its _id
        const savedTalk = await newTalk.save();

        const user = await Reacter.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.talksCreated.push(savedTalk._id);
        user.talksJoined.push(savedTalk._id);

        await user.save();

        res.status(201).json({ message: 'Talk created successfully', talk: savedTalk });
    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Join a talk
app.post('/api/jointalk/:id', async (req, res) => {
    try {
        const { userID } = req.body;
        const talk = await Talk.findById(req.params.id);
        if (!talk) {
            return res.status(404).json({ message: 'Talk not found' });
        }

        if (talk.usersList.includes(userID)) {
            return res.status(400).json({ message: 'User already in the talk' });
        }

        talk.usersList.push(userID);
        await talk.save();

        const user = await Reacter.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.talksJoined.push(talk._id);
        await user.save();

        res.json({ message: 'User joined talk successfully' });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Leave a talk
app.post('/api/leavetalk/:id', async (req, res) => { 
    try {
        const { userID } = req.body;
        const talk = await Talk.findById(req.params.id);
        if (!talk) {
            return res.status(404).json({ message: 'Talk not found' });
        }

        if (!talk.usersList.includes(userID)) {
            return res.status(400).json({ message: 'User not in the talk' });
        }

        talk.usersList = talk.usersList.filter(user => user.toString() !== userID);
        await talk.save();

        const user = await Reacter.findById(userID);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.talksJoined = user.talksJoined.filter(talkID => talkID.toString() !== req.params.id);
        await user.save();

        res.json({ message: 'User left talk successfully' });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Find all users (Reacters). It will be used to check if a username is already taken
app.get('/api/users/:username', async (req, res) => {
    try {
        const users = await Reacter.find({ username: { $regex: req.params.username, $options: 'i' } }); // find all users with the given username (case-insensitive)

        if (users.length === 0) {
            res.json({ messageState: false });
        }

        else {
            res.json({
                userList: users,
                messageState: true, // easier to check than to use String
            });
            console.log('This username is already taken.');
        }
    }

    catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// Load all talks
app.get('/api/talks', async (req, res) => {
    try {
        // Find all talks and populate the userID field with the corresponding Reacter document
        const talks = await Talk.find({}).populate('userID', 'username profileColour').limit(10); 

        const talksList = talks.map(talk => ({
            _id: talk._id,
            talkName: talk.talkName,
            talkDescription: talk.talkDescription,
            usersList: talk.usersList,
            userID: talk.userID,
        }));
        res.json({ talksList });
    } 
    
    catch (error) {
        console.log('Error fetching talks:', error);
        res.status(500).json({ message: error.message });
    }
});

// Load all messages in a talk
app.get('/api/talks/:id', async (req, res) => {
    try {
        const talk = await Talk.findById(req.params.id).populate('userID', 'username profileColour');
        if (!talk) {
            return res.status(404).json({ message: 'Talk not found' });
        }

        const messages = await Message.find({ talkID: req.params.id }).populate('userID', 'username profileColour');

        res.json({ talk, messages });
    } 
    
    catch (error) {
        console.log('Error fetching talk or messages:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Delete a talk
app.delete('/api/deletetalk/:id', async (req, res) => {
    try {
        const talk = await Talk.findById(req.params.id);
        if (!talk) {
            return res.status(404).json({ message: 'Talk not found' });
        }

        // first, we remove the talks from the users' talksJoined array
        const users = await Reacter.find({ _id: { $in: talk.usersList } });
        for (const user of users) {
            user.talksJoined = user.talksJoined.filter(talkID => talkID.toString() !== req.params.id);
            await user.save(); // Wait for each save to complete
        }

        // then we remove the talk from the creator's talksCreated array
        const creator = await Reacter.findById(talk.userID);
        if (creator) {
            creator.talksCreated = creator.talksCreated.filter(talkID => talkID.toString() !== req.params.id);
            await creator.save();
        }

        // then we remove all messages in the talk
        await Message.deleteMany({ talkID: req.params.id });

        // and finally, we delete the talk itself
        await Talk.findByIdAndDelete(req.params.id);

        res.json({ message: 'Talk deleted successfully' });
    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Load the talks joined by a user
app.get('/api/talksjoined/:id', async (req, res) => {
    try {
        const user = await Reacter.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const talks = await Talk.find({ _id: { $in: user.talksJoined } }).populate('userID', 'username profileColour').limit(10);
        res.json({ talks });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Load the talks created by a user
app.get('/api/talkscreated/:id', async (req, res) => {
    try {
        const user = await Reacter.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const talks = await Talk.find({ _id: { $in: user.talksCreated } }).populate('userID', 'username profileColour').limit(5);
        res.json({ talks });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Search for a talk
app.get('/api/searchtalks/:search', async (req, res) => {
    try {
        const talks = await Talk.find({ talkName: { $regex: req.params.search, $options: 'i' } }).populate('userID', 'username profileColour').limit(10);
        res.json({ talks });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// DANGER ZONE: These routes will delete EVERY SINGLE Reacter, Message and Talk! USE WITH CAUTION!
// Delete all users
app.get('/api/deleteusers', async (req, res) => {
    try {
        await Reacter.deleteMany({});
        res.json({ message: 'Users deleted successfully' });
        console.log('Reacters deleted successfully');
    }

    catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// Delete all messages
app.get('/api/deletemessages', async (req, res) => {
    try {
        await Message.deleteMany({});
        res.json({ message: 'Messages deleted successfully' });
        console.log('Messages deleted successfully');
    }

    catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// Delete all talks
app.get('/api/deletetalks', async (req, res) => {
    try {
        await Talk.deleteMany({});
        res.json({ message: 'Talks deleted successfully' });
        console.log('Talks deleted successfully');
    }

    catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle any requests that don't match the API routes. There's a possibility this doesn't work because I've always been using the correct API Routes lol 😅
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5172; // localhost:5172. We're using this port because 5173 is used by the React app (using it for the API would cause a conflict)

app.listen(PORT, () => console.log(`Server is running on port ${PORT} 🚀`));