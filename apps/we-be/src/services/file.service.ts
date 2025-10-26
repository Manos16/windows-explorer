import { db } from "../db";
import { files } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { UpdateFileInput } from "@shared/types/file";

export async function getFilesService(folderId: number) {
    const data = await db.select().from(files).where(eq(files.folderId, folderId));
    return data;
}

export const getFileService = async (id: number) => {
    const [fileRecord] = await db.select().from(files).where(eq(files.id, id));

    if (!fileRecord || fileRecord.deletedAt) {
        return null;
    }

    return fileRecord;
};

export const createFileService = async (data: {
    name: string;
    storedName: string;
    folderId: number;
    type: string;
    size: number;
    path: string;
}) => {
    const result = await db
        .insert(files)
        .values({
            name: data.name,
            storedName: data.storedName,
            folderId: data.folderId,
            type: data.type,
            size: data.size,
            path: data.path,
        })
        .returning();

    return result[0];
};

export async function updateFileService(id: number, data: UpdateFileInput) {
    const [updated] = await db
        .update(files)
        .set({
            name: data.name,
            type: data.type,
            size: data.size,
            dateModified: new Date(),
        })
        .where(eq(files.id, id))
        .returning();

    return updated || null;
}

export async function deletePermanentFileService(id: number) {
    const [deleted] = await db.delete(files).where(eq(files.id, id)).returning();
    return deleted || null;
}

export const deleteFileService = async (id: number) => {
    await db.update(files)
        .set({ deletedAt: new Date() })
        .where(eq(files.id, id));
};

export const restoreFileService = async (id: number) => {
    await db.update(files)
        .set({ deletedAt: null })
        .where(eq(files.id, id));
};
