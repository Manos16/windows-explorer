import { t } from "elysia";
import {
    getFilesController,
    createFileController,
    updateFileController,
    restoreFileController,
    deleteFileController,
    deletePermanentFileController,
    retrieveFileController,
} from "../controllers/file.controller";

export const fileRoutes = (app: any) =>
    app.group("/files", (app: any) =>
        app
            .get("/", getFilesController)
            .get("/:id", retrieveFileController)
            .post(
                "/",
                createFileController,
                {
                    body: t.Object({
                        folderId: t.String(),
                        file: t.File(),
                    }),
                    type: "multipart/form-data",
                }
            )
            .put(
                "/:id",
                {
                    body: t.Partial(
                        t.Object({
                            name: t.String(),
                            type: t.String(),
                            size: t.Number(),
                        })
                    ),
                },
                updateFileController
            )
            .delete("permanent/:id", deletePermanentFileController)
            .delete("/:id", deleteFileController)
            .patch("/:id/restore", restoreFileController)
    );
