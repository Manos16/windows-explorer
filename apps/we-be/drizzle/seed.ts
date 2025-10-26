import { db } from "../src/db"
import { folders } from "./schema"
import * as dayjs from "dayjs"

async function seed() {
    console.log("🌱 Starting folders seeder...")

    await db.delete(folders)

    const now = (dayjs as any).default().toDate();

    // Folder level 1
    const inserted = await db.insert(folders).values([
        { name: "Documents", parentId: null, dateModified: now, deletedAt: null },
        { name: "Pictures", parentId: null, dateModified: now, deletedAt: null },
        { name: "Music", parentId: null, dateModified: now, deletedAt: null },
    ]).returning({ id: folders.id, name: folders.name })

    const documents = inserted.find(f => f.name === "Documents")!.id
    const pictures = inserted.find(f => f.name === "Pictures")!.id
    const music = inserted.find(f => f.name === "Music")!.id

    // Folder level 2
    const level2 = await db.insert(folders).values([
        { name: "Work", parentId: documents, dateModified: now, deletedAt: null },
        { name: "Personal", parentId: documents, dateModified: now, deletedAt: null },
        { name: "Vacations", parentId: pictures, dateModified: now, deletedAt: null },
        { name: "Family", parentId: pictures, dateModified: now, deletedAt: null },
        { name: "Albums", parentId: pictures, dateModified: now, deletedAt: null },
        { name: "Rock", parentId: music, dateModified: now, deletedAt: null },
        { name: "Jazz", parentId: music, dateModified: now, deletedAt: null },
        { name: "Classical", parentId: music, dateModified: now, deletedAt: null },
    ]).returning({ id: folders.id, name: folders.name, parentId: folders.parentId })

    // Ambil ID level 2 untuk buat level 3 (nested)
    const work = level2.find(f => f.name === "Work")!.id
    const personal = level2.find(f => f.name === "Personal")!.id
    const vacations = level2.find(f => f.name === "Vacations")!.id
    const albums = level2.find(f => f.name === "Albums")!.id
    const rock = level2.find(f => f.name === "Rock")!.id

    // Folder level 3 (child dari child)
    await db.insert(folders).values([
        { name: "Projects", parentId: work, dateModified: now, deletedAt: null },
        { name: "Reports", parentId: work, dateModified: now, deletedAt: null },
        { name: "Resume", parentId: personal, dateModified: now, deletedAt: null },
        { name: "Trip 2024", parentId: vacations, dateModified: now, deletedAt: null },
        { name: "Trip 2025", parentId: vacations, dateModified: now, deletedAt: null },
        { name: "Favorites", parentId: albums, dateModified: now, deletedAt: null },
        { name: "Live", parentId: rock, dateModified: now, deletedAt: null },
        { name: "Studio", parentId: rock, dateModified: now, deletedAt: null },
    ])

    console.log("✅ Seeder for folders completed!")
}

seed()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Seeder failed:", err)
        process.exit(1)
    })
