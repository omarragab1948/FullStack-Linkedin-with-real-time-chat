/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
    ],
  },
  env: {
    MONGO_URL:
      "mongodb+srv://omar83980:Jerusalem1948@cluster0.s54umlc.mongodb.net/LinkedIn?retryWrites=true&w=majority",
    JWT_SECRET_KEY: "sdhg;hdsfv90023570-2fjh34t2464463-=8=-8-=02r24hyr2h",
    API_KEY: "AIzaSyCfmPcJJSsvvmNpEeZGXe8Q3AD7yEfKRq4",
    AUTH_DOMAIN: "fullstack-linkedin.firebaseapp.com",
    PROJECT_ID: "fullstack-linkedin",
    STORAGE_BUCKET: "fullstack-linkedin.appspot.com",
    MESSAGING_SENDER_ID: "776643931072",
    APP_ID: "1:776643931072:web:4f828abdc192e7e7bd7625",
    MEASUREMENT_ID: "G-SVVX3XH728",
  },
};

module.exports = nextConfig;
