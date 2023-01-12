const allowedOriginsList: string[] = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://https://the-yawning-portal.netlify.app/",
];

const corsOptions = {
  origin: allowedOriginsList,
};

export default corsOptions;
