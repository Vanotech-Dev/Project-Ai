import type { Request, Response } from "express";
import * as userService from "../services/userService.js";
import { auth } from "../lib/auth.js";

// Fetch the robust profile details for the authenticated user
export const getProfile = async (req: Request, res: Response) => {
    try {
        // Better Auth gives us getSession to check if the user is logged in
        // In Express, we pass headers 
        const session = await auth.api.getSession({ headers: req.headers as any });
        
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const profile = await userService.getUserById(session.user.id);
        res.json(profile);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

// Update user details such as name, bio, and phone number
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as any });
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const updatedUser = await userService.updateUser(session.user.id, req.body);
        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};
