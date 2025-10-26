import { db } from '../db'
import {files, folders} from '../../drizzle/schema'
import { eq, isNull } from 'drizzle-orm'
import { CreateFolderInput } from "@shared/types/folder";

//all
export async function getFoldersService(parentId: number | null) {
    const folderList = await db
        .select()
        .from(folders)
        .where(parentId === null ? isNull(folders.parentId) : eq(folders.parentId, parentId));

    const fileList = await db
        .select()
        .from(files)
        .where(parentId === null ? isNull(files.folderId) : eq(files.folderId, parentId));

    return {
        folders: folderList,
        files: fileList
    }
}

//retrieve
export async function retrieveFolderService(id: number) {
    const folder = await db
        .select()
        .from(folders)
        .where(eq(folders.id, id));

    return folder[0] ?? null;
}

//create
export const createFolderService = async (data: CreateFolderInput) => {
    const newFolder = await db
        .insert(folders)
        .values({
            name: data.name,
            parentId: data.parentId ?? null,
            dateModified: new Date(),
        })
        .returning();

    return newFolder[0];
};

//update
export async function updateFolderService(id: number, data: Partial<CreateFolderInput>) {
    const updated = await db
        .update(folders)
        .set({
            ...(data.name ? { name: data.name } : {}),
            ...(data.parentId !== undefined ? { parentId: data.parentId } : {}),
            dateModified: new Date(),
        })
        .where(eq(folders.id, id))
        .returning();

    return updated[0] ?? null;
}

//delete
export async function deletePermanentFolderService(id: number) {
    const [deleted] = await db.delete(files).where(eq(files.id, id)).returning();
    return deleted || null;
}

export const deleteFolderService = async (id: number) => {
    await db.update(files)
        .set({ deletedAt: new Date() })
        .where(eq(files.id, id));
};

export const restoreFolderService = async (id: number) => {
    await db.update(files)
        .set({ deletedAt: null })
        .where(eq(files.id, id));
};