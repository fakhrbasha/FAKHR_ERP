import app, { bootstrap } from "./app.controller";

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    bootstrap();
}

export default app;