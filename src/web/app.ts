import express from "express";

export function app(): express.Application {
  const app = express();

  app.all("*", (request, response) => {
    response.status(404).send("not found");
  });

  return app;
}
