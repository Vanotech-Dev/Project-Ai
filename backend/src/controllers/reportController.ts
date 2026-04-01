import type { Request, Response } from "express";
import * as reportService from "../services/reportService.js";
import { auth } from "../lib/auth.js";

export const getSummary = async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const { month, year } = req.query;
        // fallback to current month/year if not provided
        const m = (month as string) || (new Date().getMonth() + 1).toString();
        const y = (year as string) || new Date().getFullYear().toString();
        
        const summary = await reportService.getSummary(session.user.id, m, y);
        res.json(summary);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
