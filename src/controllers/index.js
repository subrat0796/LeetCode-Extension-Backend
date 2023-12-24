import AuthRoute from "./auth/routes.js";
export default function routes(app) {
  // Auth routes
  app.use("/api/v1/auth", AuthRoute);
  // // UserRoutes
  // app.use("/api/v1");
  // // Scraping Routes
  // app.use("/api/v1");

  app.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err);
  });
}
