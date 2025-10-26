export interface CreateFolderInput {
    name: string;
    parentId?: number | null;
}

export interface Folder {
    id: number;
    name: string;
    parentId?: number | null;
    dateModified: string;
    deleted_at?: string;
}
