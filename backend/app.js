const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  next();
});

mongoose.connect('mongodb+srv://adibala1306:AdiHari9$@cluster0.ouneyo6.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
  
const imageSchema = new mongoose.Schema({
  name: String,
  url: String
});

const logoSchema = new mongoose.Schema({
  url: String
})

const Image = mongoose.model('Image', imageSchema);
const Logo = mongoose.model('Logo', logoSchema);

let imageCount = 1;

// Multer configuration
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'image' + imageCount + path.extname(file.originalname));
      imageCount++;
  }
});

const upload = multer({ storage: storage });

// Endpoint for uploading images
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
      const { originalname } = req.file;
      const imageUrl = `http://localhost:9000/uploads/${req.file.filename}`;

      const newImage = new Image({
          name: originalname,
          url: imageUrl
      });
      await newImage.save();
      res.send('Image uploaded successfully.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading image.');
  }
});

app.use('/uploads', express.static('uploads'));

app.get('/carousel-images', async (req, res) => {
  let pic = await Image.find({});

  const urls = pic.map(item => item.url);

  res.status(200).json({
    img : urls
  })
});

const logoStore = multer.diskStorage({
  destination: './logos',
  filename: (req, file, cb) => {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'logo' + Date.now() + path.extname(file.originalname));
  }
});

const logoUpload = multer({ storage: logoStore });

app.post('/logo-upload', upload.single('image'), async (req, res) => {
  try {
      const { originalname } = req.file;
      const imageUrl = `http://localhost:9000/uploads/${req.file.filename}`;

      const newLogo = new Logo({
          name: originalname,
          url: imageUrl
      });
      await newLogo.save();
      res.send('Image uploaded successfully.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading image.');
  }
});

app.get('/logo-images', async (req,res) => {
  let logoPic = await Logo.find({});

  let urls = logoPic.map(i => i.url);

  res.status(200).json({
    urls
  })
});

app.use('/logos', express.static('logos'));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const startupSchema = new mongoose.Schema({
  name: String,
  type: String
});

app.use(express.json());
app.use(cors());

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ message: 'User already exists' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
          email,
          password: hashedPassword
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '3h' });
      res.json({ token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Validate password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '3h' });

  res.json({ 
    message : 'success',
    token 
  });
});

// Assuming you have required modules and setup database connection

app.post('/addstartups', async (req, res) => {
  try {
    const startupData = req.body; 
    const result = await Startup.insertMany(startupData);

    res.status(201).json({
      message: `${result.length} startups added successfully`
    });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).send('Error adding data');
  }
});

app.get('/getdpiit', async (req,res) => {
  try{
    let dpiit = await Startup.find({"type" : "DPIIT"});

    res.status(200).json({
      dpiit
    })
  }catch(error){
    res.status(500).json({
      message: "Fetch unsuccessful"
    })
  }
});

app.get('/getnondpiit', async (req,res) => {
  try {
    let nondpiit = await Startup.find({ "type" : "Non DPIIT"});

    res.status(200).json({
      nondpiit
    })
  }catch(error) {
    res.status(500).json({
      message : "Fetch unsuccessful"
    })
  }
});


// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
}

// Example protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

const User = mongoose.model('User', userSchema);
const Startup = mongoose.model('Startup',startupSchema);

app.listen(9000, () => {
    console.log('Server is running on port 9000');
});
