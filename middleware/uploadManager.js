const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ID,
  secretAccessKey: process.env.S3_KEY,
  region: "eu-central-1",
  bucket: "node-museums",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "node-museums",
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

const setDataFileField = (dataFileField) => (req, res, next) => {
  req.body[dataFileField] =
    (req.file && req.file.location) || req.body[dataFileField];

  next();
};

module.exports = { upload, setDataFileField };
