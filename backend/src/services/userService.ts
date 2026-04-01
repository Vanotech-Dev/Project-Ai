import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { user } from "../db/schema.js";

export const getUserById = async (userId: string) => {
    const foundUser = await db.select().from(user).where(eq(user.id, userId)).limit(1);
    if (!foundUser.length) {
        throw new Error("User not found");
    }
    return foundUser[0];
};

export const updateUser = async (userId: string, data: Partial<typeof user.$inferSelect>) => {
    // We strictly pick the fields we allow the user to update
    const { name, bio, phone, twoFAEnabled } = data;
    
    const [updatedUser] = await db.update(user)
        .set({ 
            ...(name && { name }), 
            ...(bio !== undefined && { bio }), 
            ...(phone !== undefined && { phone }), 
            ...(twoFAEnabled !== undefined && { twoFAEnabled }),
            updatedAt: new Date(),
        })
        .where(eq(user.id, userId))
        .returning();
        
    return updatedUser;
};
