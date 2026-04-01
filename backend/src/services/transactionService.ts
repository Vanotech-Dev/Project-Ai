import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions } from "../db/schema.js";

type NewTransaction = typeof transactions.$inferInsert;
type UpdateTransaction = Partial<NewTransaction>;

export const getTransactions = async (userId: string, filters: any) => {
    // We order by Date descending (newest first)
    // We can add the month/year filtering here later
    const query = db.select()
        .from(transactions)
        .where(eq(transactions.userId, userId))
        .orderBy(desc(transactions.date));
    
    return await query;
};

export const createTransaction = async (userId: string, data: any) => {
    const { type, amount, categoryKey, date, notes } = data;
    
    const [newTx] = await db.insert(transactions)
        .values({
            userId,
            type,
            amount,
            categoryKey,
            date: new Date(date),
            notes
        })
        .returning();
        
    return newTx;
};

export const updateTransaction = async (userId: string, txId: string, data: UpdateTransaction) => {
    const { type, amount, categoryKey, date, notes } = data;
    
    const [updatedTx] = await db.update(transactions)
        .set({
            ...(type && { type }),
            ...(amount !== undefined && { amount }),
            ...(categoryKey && { categoryKey }),
            ...(date && { date: new Date(date as any) }),
            ...(notes !== undefined && { notes }),
            updatedAt: new Date()
        })
        .where(and(eq(transactions.id, txId), eq(transactions.userId, userId)))
        .returning();
        
    if (!updatedTx) throw new Error("Transaction not found or you don't have permission");
    return updatedTx;
};

export const deleteTransaction = async (userId: string, txId: string) => {
    const [deletedTx] = await db.delete(transactions)
        .where(and(eq(transactions.id, txId), eq(transactions.userId, userId)))
        .returning();
        
    if (!deletedTx) throw new Error("Transaction not found or you don't have permission");
    return deletedTx;
};
