import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import accountRoute from "./routes/account.route";
import authRoute from "./routes/auth.route";
import hormoneRoute from "./routes/hormone.route";
import trainRoute from "./routes/train.route";
import dietRoute from "./routes/diet.route";
import hormoneProtocolRoute from "./routes/hormoneProtocol.route";
import mealRoute from "./routes/meal.route";
import protocolRoute from "./routes/protocol.route";
import extraCompoundRoute from "./routes/extraCompound.route";
import exerciseRoute from "./routes/exercise.route";
import foodRoute from "./routes/food.route";
import subscriptionRoute from "./routes/subscription.route";
import planRoute from "./routes/plans.route";
import dashboardRoute from "./routes/dashboard.route";
import notificationRoute from "./routes/notification.route";
import qs from "qs";

export const prisma = new PrismaClient();

const app = express();
const port: number = (process.env.PORT as unknown as number) || 3001;
var cors = require("cors");

async function main() {
  app.use(cors());
  app.use(express.json());
  app.set("query parser", (str: string) => qs.parse(str, { arrayLimit: 1000 }));
  app.use("/account", accountRoute);
  app.use("/auth", authRoute);
  app.use("/hormone", hormoneRoute);
  app.use("/train", trainRoute);
  app.use("/diet", dietRoute);
  app.use("/hormoneProtocol", hormoneProtocolRoute);
  app.use("/meal", mealRoute);
  app.use("/protocol", protocolRoute);
  app.use("/extraCompound", extraCompoundRoute);
  app.use("/exercise", exerciseRoute);
  app.use("/food", foodRoute);
  app.use("/subscription", subscriptionRoute);
  app.use("/plan", planRoute);
  app.use("/dashboard", dashboardRoute);
  app.use("/notification", notificationRoute);

  app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
