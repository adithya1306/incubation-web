const multer = require('multer');

const storage = multer.diskStorage({
  destination: './carousel',
  filename: (req,file,cb) => {
    return cb(null,`${file.fieldname}_${Date.now()}_${file.originalname}`)
  }
});

const upload = multer({
  storage: storage
})

// API endpoint for uploading images
app.use('/images',express.static('upload/images'))
app.post('/upload',upload.single('carousel'),(req,res) => {
  res.json({
    message: "success",
    image: `http://localhost:${port}/images/${req.file.filename}`
  })
});