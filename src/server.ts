import app from "./app";

const port = process.env.PORT || 5000;

const main = () => {
  app.set("trust proxy", 1);
  app.listen(port, () => console.log(`server is running on port ${port}`));
};

main();
