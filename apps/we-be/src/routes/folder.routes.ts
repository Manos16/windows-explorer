import { t } from "elysia";
import {
    createFolderController, deleteFolderController, deletePermanentFolderController,
    getFoldersController, restoreFolderController,
    retrieveFolderController,
    updateFolderController
} from "../controllers/folder.controller";

export const folderRoutes = (app: any) =>
    app.group("/folders", (app: any) =>
        app
            .get("/", getFoldersController)
            .get("/:id", retrieveFolderController)
            .post(
                "/",
                createFolderController,
                {
                    body: t.Object({
                        name: t.String(),
                        parentId: t.Optional(t.Union([t.Number(), t.Null()])),
                    }),
                }
            )
            .put(
                "/:id",
                {
                    body: t.Partial(
                        t.Object({
                            name: t.String(),
                            parentId: t.Optional(t.Union([t.Number(), t.Null()])),
                        })
                    ),
                },
                updateFolderController
            )
            .delete("permanent/:id", deletePermanentFolderController)
            .delete("/:id", deleteFolderController)
            .patch("/:id/restore", restoreFolderController)
    );
