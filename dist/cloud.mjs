import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY, WORKSPACE_ID } from './config.mjs';

let client = null;

export function cloudEnabled() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
}

export function getClient() {
  if (!cloudEnabled()) return null;
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

/** Pull the shared workspace document. Returns null if missing or offline. */
export async function pullWorkspace() {
  const sb = getClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from('workspaces')
    .select('data, updated_at')
    .eq('id', WORKSPACE_ID)
    .maybeSingle();
  if (error) throw Error(error.message);
  if (!data?.data) return null;
  return { workspace: data.data, updatedAt: data.updated_at };
}

/** Upsert full workspace blob + mirror cases/tickets for SQL inspection. */
export async function pushWorkspace(workspace) {
  const sb = getClient();
  if (!sb) return { ok: false, reason: 'not-configured' };

  const payload = {
    id: WORKSPACE_ID,
    data: workspace,
    updated_at: new Date().toISOString()
  };

  const { error: wErr } = await sb.from('workspaces').upsert(payload);
  if (wErr) throw Error(wErr.message);

  // Mirror cases for viva / SQL demos (best-effort; workspace blob is source of truth)
  const cases = (workspace.cases || []).map(c => ({
    id: c.id,
    workspace_id: WORKSPACE_ID,
    name: c.name,
    asset: c.asset || '',
    notes: c.notes || '',
    policy: c.policy || 'Safety first',
    evidence: c.evidence || {},
    records: c.records || {},
    kb: c.kb,
    created_at: c.created
  }));

  const tickets = (workspace.tickets || []).map(t => ({
    id: t.id,
    workspace_id: WORKSPACE_ID,
    fault: t.fault || null,
    name: t.name,
    action: t.action,
    severity: t.severity,
    asset: t.asset || '',
    status: t.status,
    updated_at: new Date().toISOString()
  }));

  // Replace mirrors for this workspace so deletes stay consistent
  await sb.from('cases').delete().eq('workspace_id', WORKSPACE_ID);
  await sb.from('tickets').delete().eq('workspace_id', WORKSPACE_ID);
  if (cases.length) {
    const { error } = await sb.from('cases').insert(cases);
    if (error) throw Error(error.message);
  }
  if (tickets.length) {
    const { error } = await sb.from('tickets').insert(tickets);
    if (error) throw Error(error.message);
  }

  return { ok: true, updatedAt: payload.updated_at };
}
