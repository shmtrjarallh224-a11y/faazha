import { Router, type IRouter } from "express";
import { db, serviceRequestsTable, usersTable, providersTable, categoriesTable, notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";
import { CreateRequestBody, ListRequestsQueryParams, GetRequestParams, UpdateRequestParams, UpdateRequestBody } from "@workspace/api-zod";

const router: IRouter = Router();

function formatRequest(r: any, client: any, providerUser: any, provider: any, cat: any) {
  return {
    id: r.id,
    clientId: r.clientId,
    clientName: client?.name ?? "",
    clientAvatarUrl: client?.avatarUrl ?? null,
    providerId: r.providerId,
    providerName: providerUser?.name ?? "",
    providerAvatarUrl: providerUser?.avatarUrl ?? null,
    providerCategoryName: cat?.name ?? "",
    status: r.status,
    serviceType: r.serviceType,
    description: r.description,
    city: r.city,
    district: r.district,
    lat: r.lat ? parseFloat(r.lat) : null,
    lng: r.lng ? parseFloat(r.lng) : null,
    scheduledAt: r.scheduledAt?.toISOString() ?? null,
    completedAt: r.completedAt?.toISOString() ?? null,
    isImmediate: r.isImmediate,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/requests", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const params = ListRequestsQueryParams.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const { status, role } = params.data;

  const conditions: any[] = [];
  if (role === "provider") {
    const [provider] = await db.select().from(providersTable).where(eq(providersTable.userId, req.userId!));
    if (provider) conditions.push(eq(serviceRequestsTable.providerId, provider.id));
    else { res.json([]); return; }
  } else {
    conditions.push(eq(serviceRequestsTable.clientId, req.userId!));
  }
  if (status) conditions.push(eq(serviceRequestsTable.status, status as any));

  const rows = await db
    .select()
    .from(serviceRequestsTable)
    .where(and(...conditions))
    .orderBy(desc(serviceRequestsTable.createdAt));

  const result = await Promise.all(rows.map(async (r) => {
    const [client] = await db.select().from(usersTable).where(eq(usersTable.id, r.clientId));
    const [provider] = await db.select().from(providersTable).where(eq(providersTable.id, r.providerId));
    const [providerUser] = provider ? await db.select().from(usersTable).where(eq(usersTable.id, provider.userId)) : [null];
    const [cat] = provider ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, provider.categoryId)) : [null];
    return formatRequest(r, client, providerUser, provider, cat);
  }));

  res.json(result);
});

router.post("/requests", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = CreateRequestBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d = parsed.data;

  const [newReq] = await db.insert(serviceRequestsTable).values({
    clientId: req.userId!,
    providerId: d.providerId,
    serviceType: d.serviceType,
    description: d.description,
    city: d.city,
    district: d.district,
    lat: d.lat != null ? String(d.lat) : null,
    lng: d.lng != null ? String(d.lng) : null,
    scheduledAt: d.scheduledAt ? new Date(d.scheduledAt) : null,
    isImmediate: d.isImmediate,
    status: "pending",
  }).returning();

  // Notify provider
  const [provider] = await db.select().from(providersTable).where(eq(providersTable.id, d.providerId));
  const [client] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (provider) {
    await db.insert(notificationsTable).values({
      userId: provider.userId,
      type: "new_request",
      title: "طلب خدمة جديد",
      body: `لديك طلب خدمة جديد من ${client?.name ?? "عميل"}`,
      relatedId: newReq.id,
    });
  }

  const [providerUser] = provider ? await db.select().from(usersTable).where(eq(usersTable.id, provider.userId)) : [null];
  const [cat] = provider ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, provider.categoryId)) : [null];

  res.status(201).json(formatRequest(newReq, client, providerUser, provider, cat));
});

router.get("/requests/:id", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [r] = await db.select().from(serviceRequestsTable).where(eq(serviceRequestsTable.id, id));
  if (!r) { res.status(404).json({ error: "Request not found" }); return; }

  const [client] = await db.select().from(usersTable).where(eq(usersTable.id, r.clientId));
  const [provider] = await db.select().from(providersTable).where(eq(providersTable.id, r.providerId));
  const [providerUser] = provider ? await db.select().from(usersTable).where(eq(usersTable.id, provider.userId)) : [null];
  const [cat] = provider ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, provider.categoryId)) : [null];

  res.json(formatRequest(r, client, providerUser, provider, cat));
});

router.patch("/requests/:id", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateRequestBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [r] = await db.select().from(serviceRequestsTable).where(eq(serviceRequestsTable.id, id));
  if (!r) { res.status(404).json({ error: "Request not found" }); return; }

  const updateData: any = {};
  if (parsed.data.status) updateData.status = parsed.data.status;
  if (parsed.data.status === "completed") {
    updateData.completedAt = new Date();
    await db
      .update(providersTable)
      .set({ completedJobs: serviceRequestsTable.providerId as any })
      .where(eq(providersTable.id, r.providerId));
  }

  const [updated] = await db
    .update(serviceRequestsTable)
    .set(updateData)
    .where(eq(serviceRequestsTable.id, id))
    .returning();

  // Notify client
  const notifMap: Record<string, string> = {
    accepted: "تم قبول طلبك",
    rejected: "تم رفض طلبك",
    completed: "تم إنهاء الخدمة",
  };
  if (parsed.data.status && notifMap[parsed.data.status]) {
    await db.insert(notificationsTable).values({
      userId: r.clientId,
      type: parsed.data.status === "accepted" ? "request_accepted" :
            parsed.data.status === "rejected" ? "request_rejected" : "service_completed",
      title: notifMap[parsed.data.status],
      body: notifMap[parsed.data.status],
      relatedId: id,
    });
  }

  const [client] = await db.select().from(usersTable).where(eq(usersTable.id, updated.clientId));
  const [provider] = await db.select().from(providersTable).where(eq(providersTable.id, updated.providerId));
  const [providerUser] = provider ? await db.select().from(usersTable).where(eq(usersTable.id, provider.userId)) : [null];
  const [cat] = provider ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, provider.categoryId)) : [null];

  res.json(formatRequest(updated, client, providerUser, provider, cat));
});

export default router;
