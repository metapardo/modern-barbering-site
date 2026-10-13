import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventRequestsRouter from "./event-requests";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventRequestsRouter);

export default router;
