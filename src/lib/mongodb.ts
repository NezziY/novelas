// mongodb.ts
import { MongoClient, Db } from "mongodb";

const client = new MongoClient(import.meta.env.MONGODB_URI);
let db: Db | null = null;

// Función auxiliar para obtener la DB
async function getDB(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db("mynovelsdb");
  }
  return db;
}

// Interfaz de libro
export interface Book {
  id: string;
  title: string;
  cover: string;
  category: string;
  tags: string[];
}

// Obtener todas las novelas
export async function getNovels(): Promise<Book[]> {
  try {
    const db = await getDB();
    const novels = await db.collection("novels").find({}).toArray();

    return novels.map((novel) => ({
      id: novel.id?.toString() || novel._id.toString(),
      title: novel.title || "Sin título",
      cover: novel.cover || "/images/default-cover.png",
      category: novel.category || "Sin categoría",
      tags: novel.tags || [],
    }));
  } catch (error) {
    console.error("Error obteniendo novelas:", error);
    return [];
  }
}

// Obtener detalles de una novela
export async function getNovelDetails(id: string) {
  try {
    const db = await getDB();
    return await db.collection("novelDetails").findOne({ id: parseInt(id) });
  } catch (error) {
    console.error("Error obteniendo detalles:", error);
    return null;
  }
}

// Obtener capítulos
export async function getChapters(novelId: string) {
  try {
    const db = await getDB();
    return await db.collection("chapters").find({ novelId: parseInt(novelId) }).toArray();
  } catch (error) {
    console.error("Error obteniendo capítulos:", error);
    return [];
  }
}

// Obtener capítulo específico
export async function getChapter(novelId: string, chapterId: string) {
  try {
    const db = await getDB();
    return await db.collection("chapters").findOne({
      novelId: parseInt(novelId),
      chapterId: parseInt(chapterId),
    });
  } catch (error) {
    console.error("Error obteniendo capítulo:", error);
    return null;
  }
}
