import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

export const handleBodyValidation =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log(req.body,'lamoraaa');
      
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((e) => e.message);
        console.log(error.issues, "ERRORISSUE")
        const errorString = errorMessages.join(", ");
        console.log(errorString, "ErrorMessage");
        res.status(400).json({
          error: "Invalid Payload",
          message: errorString,
        });
      }
    }
  };

export const handleParamsValidation =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.params, "REQUESTPARAMSSS");
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((e) => e.message);
        const errorString = errorMessages.join(" ");
        console.log(errorString, "ErrorMessage");
        res.status(400).json({
          error: "Invalid Params",
          message: errorString,
        });
      }
    }
  };
