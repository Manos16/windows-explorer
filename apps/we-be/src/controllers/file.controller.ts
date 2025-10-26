import {
    getFilesService,
    createFileService,
    updateFileService,
    deleteFileService, deletePermanentFileService, restoreFileService, getFileService,
} from "../services/file.service";
import { UpdateFileInput } from "@shared/types/file";
import * as path from "node:path";
import fs from "fs/promises";

export const getFilesController = async ({ query, set }: any) => {
    try {
        const folderId = Number(query.folderId);
        if (isNaN(folderId)) {
            set.status = 400;
            return { success: false, message: "folderId is required and must be number" };
        }

        const data = await getFilesService(folderId);
        return { success: true, data };
    } catch (error: any) {
        set.status = 500;
        return { success: false, message: error.message };
    }
};

export const retrieveFileController = async ({ params, set }: any) => {
    try {
        const fileRecord = await getFileService(Number(params.id));

        if (!fileRecord) {
            set.status = 404;
            return { message: "File not found" };
        }

        const filePath = path.join(process.cwd(), fileRecord.path, fileRecord.storedName);
        const file = Bun.file(filePath);

        if (!(await file.exists())) {
            set.status = 404;
            return { message: "File not found on disk" };
        }

        set.headers["Content-Type"] = file.type || fileRecord.type;
        return file;
    } catch (error) {
        set.status = 500;
        return { message: "Error serving file" };
    }
};

export const createFileController = async ({ body, set }: any) => {
    try {
        const folderId = Number(body.folderId);
        if (isNaN(folderId)) {
            set.status = 400;
            return { success: false, message: "Invalid folderId" };
        }

        const file = body.file as File;
        if (!file) {
            set.status = 400;
            return { success: false, message: "No file uploaded" };
        }

        const uploadDir = path.join(process.cwd(), "uploads", "files", folderId.toString());
        await fs.mkdir(uploadDir, { recursive: true });

        const storedName = crypto.randomUUID() + path.extname(file.name);
        const buffer = await file.arrayBuffer();
        const filePath = path.join(uploadDir, storedName);
        await Bun.write(filePath, Buffer.from(buffer));

        const newFile = await createFileService({
            name: file.name,
            storedName,
            folderId,
            type: file.type || "application/octet-stream",
            size: file.size,
            path: `uploads/files/${folderId}`,
        });

        return { success: true, data: newFile };
    } catch (error) {
        console.error("Upload error:", error);
        set.status = 500;
        return {
            success: false,
            message: "Failed to upload file",
            error: String(error),
        };
    }
};

export const updateFileController = async ({ params, body, set }: any) => {
    try {
        const id = Number(params.id);
        const input: UpdateFileInput = body;

        const data = await updateFileService(id, input);
        if (!data) {
            set.status = 404;
            return { success: false, message: "File not found" };
        }

        return { success: true, message: "File updated", data };
    } catch (error: any) {
        set.status = 500;
        return { success: false, message: error.message };
    }
};

export const deletePermanentFileController = async ({ params, set }: any) => {
    try {
        const id = Number(params.id);
        const deleted = await deletePermanentFileService(id);

        if (!deleted) {
            set.status = 404;
            return { success: false, message: "File not found" };
        }

        return { success: true, message: "File deleted", data: deleted };
    } catch (error: any) {
        set.status = 500;
        return { success: false, message: error.message };
    }
};

export const deleteFileController = async ({ params, set }: any) => {
    try {
        await deleteFileService(Number(params.id));
        return { success: true, message: "File moved to recycle bin" };
    } catch (error: any) {
        set.status = 500;
        return { success: false, message: "Failed to delete file", error: error.message };
    }
};

export const restoreFileController = async ({ params, set }: any) => {
    try {
        await restoreFileService(Number(params.id));
        return { success: true, message: "File restored successfully" };
    } catch (error: any) {
        set.status = 500;
        return { success: false, message: "Failed to restore file", error: error.message };
    }
};
