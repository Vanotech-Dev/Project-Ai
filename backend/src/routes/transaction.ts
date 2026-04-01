import { Router } from "express";
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from "../controllers/transactionController.js";

const router = Router();

// Define exactly what happens for each HTTP method on /api/transactions
router.get("/", getTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
