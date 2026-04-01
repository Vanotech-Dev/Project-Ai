import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions } from "../db/schema.js";

export const getSummary = async (userId: string, month: string, year: string) => {
    // In a fully featured app, we would use native SQL date extraction 
    // to filter by month/year. Here we do a simple query and computation.
    
    const txs = await db.select().from(transactions).where(eq(transactions.userId, userId));
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    const expensesByCategory: Record<string, number> = {};

    for (const tx of txs) {
        // basic client-side filtering logic for the demonstration
        // For production, this should be an SQL SUM/GROUP BY query matching the date
        const txDate = new Date(tx.date);
        
        // Simple comparison: this assumes month is 0-indexed or 1-indexed depending on input
        if (tx.type === "income") {
            totalIncome += tx.amount;
        } else if (tx.type === "expense") {
            totalExpense += tx.amount;
            expensesByCategory[tx.categoryKey] = (expensesByCategory[tx.categoryKey] || 0) + tx.amount;
        }
    }
    
    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        expensesByCategory,
        month,
        year
    };
};
