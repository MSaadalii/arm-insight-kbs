export const SOURCES = ['Operator observation', 'Sensor / controller', 'Maintenance record', 'Technician inspection', 'Manual / expert'];

/** Merge separately recorded present/absent claims without turning missing data into absence. */
export function resolveClaims(claims) {
  const states = new Set(claims.map(c => c.state));
  if (states.has('yes') && states.has('no')) return 'conflict';
  if (states.has('yes')) return 'yes';
  if (states.has('no')) return 'no';
  return 'unknown';
}

export function validateRecords(records, symptoms) {
  if (!records || typeof records !== 'object' || Array.isArray(records)) throw Error('Invalid source records.');
  for (const [key, claims] of Object.entries(records)) {
    if (!(key in symptoms) || !Array.isArray(claims) || claims.length > 50) throw Error('Invalid source records.');
    for (const c of claims) {
      if (!SOURCES.includes(c.source) || !['yes', 'no'].includes(c.state) ||
          typeof c.note !== 'string' || c.note.length > 1000 ||
          typeof c.at !== 'string' || !Number.isFinite(Date.parse(c.at))) throw Error('Invalid source record.');
    }
  }
  return records;
}
