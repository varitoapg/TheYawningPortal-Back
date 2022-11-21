const allowedOriginsList: string[] = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://alvaro-parada-final-project-202209.netlify.app",
];

const corsOptions = {
  origin: allowedOriginsList,
};

export default corsOptions;
