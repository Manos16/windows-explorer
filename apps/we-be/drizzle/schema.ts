import {pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const folders = pgTable("folders", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    parentId: integer("parent_id"),
    dateModified: timestamp("date_modified").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at")
});

export const foldersRelations = relations(folders, ({ one, many }) => ({
    parent: one(folders, {
        fields: [folders.parentId],
        references: [folders.id],
    }),
    children: many(folders),
}));

export const files = pgTable("files", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    storedName: text("stored_name").notNull(),
    folderId: integer("folder_id").references(() => folders.id).notNull(),
    type: text("type").notNull(),
    size: integer("size").notNull(),
    path: text("path").notNull(),
    dateModified: timestamp("date_modified").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at")
});
