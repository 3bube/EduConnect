import { Request, Response, NextFunction } from "express";

// Express async handler middleware
export const handleAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      console.error("Error:", error.message || error);
      res.status(500).json({ error: error.message || "Something went wrong" });
    }
  };
};
