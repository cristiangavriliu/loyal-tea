import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({

  //todo put in .env file to not expose
  cloud_name:"df8kledt4",
  api_key: "419865533227723",
  api_secret: "D4A1nU79QBPRbsFJtNlCudGGvsE",
});

export default cloudinary;
