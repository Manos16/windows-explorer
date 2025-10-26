import {
    createFolderService,
    deleteFolderService, deletePermanentFolderService,
    getFoldersService, restoreFolderService,
    retrieveFolderService, updateFolderService
} from '../services/folder.service'

export const getFoldersController = async ({ query, set }: any) => {
    try {
        const parentId =
            query.parentId === undefined
                ? null
                : query.parentId === "null"
                    ? null
                    : Number(query.parentId);

        const folders = await getFoldersService(parentId);

        set.status = 200;
        return {
            success: true,
            message: "Folders fetched successfully",
            data: folders,
        };
    } catch (error: any) {
        set.status = 500;
        return {
            success: false,
            message: error.message || "Internal Server Error",
        };
    }
};

export const retrieveFolderController = async ({ params, set }: any) => {
    try {
        const id = Number(params.id);
        const folder = await retrieveFolderService(id);

        if (!folder) {
            set.status = 404;
            return { success: false, message: "Folder not found" };
        }

        set.status = 200;
        return { success: true, data: folder };
    } catch (error: any) {
        set.status = 500;
        return { success: false, message: error.message };
    }
};

export const createFolderController = async ({ body }: any) => {
    try {
        const folder = await createFolderService(body);
        return {
            success: true,
            data: folder,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create folder",
        };
    }
};

export const updateFolderController = async ({ params, body, set }: any) => {
    try {
        const id = Number(params.id);
        const updatedFolder = await updateFolderService(id, body);

        if (!updatedFolder) {
            set.status = 404;
            return { success: false, message: "Folder not found" };
        }

        set.status = 200;
        return {
            success: true,
            message: "Folder updated successfully",
            data: updatedFolder,
        };
    } catch (error: any) {
        set.status = 500;
        return { success: false, message: error.message };
    }
};

export const deletePermanentFolderController = async ({ params, set }: any) => {
    try {
        const id = Number(params.id);
        const deleted = await deletePermanentFolderService(id);

        if (!deleted) {
            set.status = 404;
            return { success: false, message: "Folder not found" };
        }

        set.status = 200;
        return {
            success: true,
            message: "Folder deleted successfully",
            data: deleted,
        };
    } catch (error: any) {
        set.status = 500;
        return { success: false, message: error.message };
    }
};


export const deleteFolderController = async ({ params, set }: any) => {
    try {
        await deleteFolderService(Number(params.id));
        return { success: true, message: "File moved to recycle bin" };
    } catch (error: any) {
        set.status = 500;
        return { success: false, message: "Failed to delete file", error: error.message };
    }
};

export const restoreFolderController = async ({ params, set }: any) => {
    try {
        await restoreFolderService(Number(params.id));
        return { success: true, message: "File restored successfully" };
    } catch (error: any) {
        set.status = 500;
        return { success: false, message: "Failed to restore file", error: error.message };
    }
};