import { Router } from "express";
import { urlController } from "../controlllers/url.controller";
import authenticateJWT from "../middleware/authenticatUser";
import rateLimit from "express-rate-limit";

const createUrlRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  keyGenerator: (req) => req.body.userId,
  message: "Too many URLs created, please try again after an hour.",
  standardHeaders: true,
  legacyHeaders: false,
});


const urlRouter = Router();


urlRouter.post('/shorten',createUrlRateLimiter,authenticateJWT,urlController.createShortURL.bind(urlController));
urlRouter.get("/shorten/:alias", urlController.redirectToLongUrl.bind(urlController));
urlRouter.get("/analytics/topic/:topic",authenticateJWT, urlController.getAnalyticsByTopic.bind(urlController));
urlRouter.get("/analytics/overall", authenticateJWT,urlController.getOverallAnalytics.bind(urlController));
urlRouter.get("/analytics/:alias",authenticateJWT, urlController.getAnalytics.bind(urlController));



export default urlRouter;
