export interface UpdateFileInput {
    name?: string;
    type?: string;
    size?: number;
}

export interface File {
    id: number;
    name: string;
    storedName: string;
    type: string;
    size: number;
    folderId: number;
    path: string;
    dateModified: string;
    deleted_at: string;
}

