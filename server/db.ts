import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, resumes, InsertResume, apiKeys, InsertApiKey } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Resume history queries
export async function saveResume(resume: InsertResume) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save resume: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(resumes).values(resume);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save resume:", error);
    throw error;
  }
}

export async function getUserResumes(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get resumes: database not available");
    return [];
  }

  try {
    const result = await db.select().from(resumes).where(eq(resumes.userId, userId));
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error("[Database] Failed to get resumes:", error);
    return [];
  }
}

export async function getResumeById(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get resume: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(resumes).where(eq(resumes.id, id)).limit(1);
    if (result.length === 0 || result[0]?.userId !== userId) {
      return undefined;
    }
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get resume:", error);
    return undefined;
  }
}

export async function deleteResume(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete resume: database not available");
    return false;
  }

  try {
    // First check if the resume belongs to the user
    const resume = await getResumeById(id, userId);
    if (!resume) {
      return false;
    }

    await db.delete(resumes).where(eq(resumes.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete resume:", error);
    return false;
  }
}

// ========================================
// APIキー関連のヘルパー関数
// ========================================

export async function upsertApiKey(
  userId: number,
  encryptedOpenAIKey: string | null,
  encryptedGeminiKey: string | null,
  primaryProvider: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert API key: database not available");
    return false;
  }

  try {
    const values: InsertApiKey = {
      userId,
      encryptedOpenAIKey,
      encryptedGeminiKey,
      primaryProvider,
    };

    await db.insert(apiKeys).values(values).onDuplicateKeyUpdate({
      set: {
        encryptedOpenAIKey,
        encryptedGeminiKey,
        primaryProvider,
        updatedAt: new Date(),
      },
    });
    return true;
  } catch (error) {
    console.error("[Database] Failed to upsert API key:", error);
    return false;
  }
}

export async function getApiKey(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get API key: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(apiKeys).where(eq(apiKeys.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get API key:", error);
    return undefined;
  }
}

export async function deleteApiKey(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete API key: database not available");
    return false;
  }

  try {
    await db.delete(apiKeys).where(eq(apiKeys.userId, userId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete API key:", error);
    return false;
  }
}
