import type { Request, Response } from "express";
import * as transactionService from "../services/transactionService.js";
import { auth } from "../lib/auth.js";

// Helper to check authentication
const requireUser = async (req: Request, res: Response) => {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return null; // Return null so the route handler knows to stop
    }
    return session.user.id;
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const userId = await requireUser(req, res);
        if (!userId) return; // Stop if not logged in
        
        const txs = await transactionService.getTransactions(userId, req.query);
        res.json(txs);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const userId = await requireUser(req, res);
        if (!userId) return;
        
        const tx = await transactionService.createTransaction(userId, req.body);
        res.status(201).json({ message: "Transaction created", transaction: tx });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const userId = await requireUser(req, res);
        if (!userId) return;
        
        const txId = req.params.id as string;
        const tx = await transactionService.updateTransaction(userId, txId, req.body);
        res.json({ message: "Transaction updated", transaction: tx });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const userId = await requireUser(req, res);
        if (!userId) return;
        
        const txId = req.params.id as string;
        await transactionService.deleteTransaction(userId, txId);
        res.json({ message: "Transaction deleted successfully" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
