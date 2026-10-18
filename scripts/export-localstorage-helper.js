/**
 * HCMUTE TechDocs - Local Browser State Export & Inspection Helper
 * 
 * Instructions:
 * 1. Open your browser where you manage TechDocs (e.g. https://doc.utehub.vn/admin or http://localhost:3000/admin).
 * 2. Open Developer Tools (F12 or Cmd+Option+I) -> Console tab.
 * 3. Paste the BROWSER CONSOLE SNIPPET below and press Enter.
 * 
 * If customizations are detected, it will automatically download 'techdocs_state_export.json'.
 * If no customizations exist, it will confirm that your localStorage is 100% in sync with admin-seed.json.
 */

export const BROWSER_CONSOLE_SNIPPET = `(() => {
  const KEYS = {
    UNITS: 'hcmute_techdoc_admin_units',
    CRITERIA: 'hcmute_techdoc_admin_criteria',
    SECTIONS: 'hcmute_techdoc_admin_sections',
    PHASES: 'hcmute_techdoc_admin_phases',
    START_DATE: 'hcmute_techdoc_views_start_date'
  };

  const unitsRaw = localStorage.getItem(KEYS.UNITS);
  const criteriaRaw = localStorage.getItem(KEYS.CRITERIA);
  const sectionsRaw = localStorage.getItem(KEYS.SECTIONS);
  const phasesRaw = localStorage.getItem(KEYS.PHASES);
  const startDateRaw = localStorage.getItem(KEYS.START_DATE);

  if (!unitsRaw && !criteriaRaw && !sectionsRaw && !phasesRaw) {
    console.log('%c[TechDocs Inspection] No customizations found in localStorage. Your browser is using initial admin-seed.json baseline.', 'color: #10b981; font-weight: bold; font-size: 14px;');
    return { status: 'SEED_IS_AUTHORITATIVE', hasCustomizations: false };
  }

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    viewsStartDate: startDateRaw || '16/10/2026',
    units: unitsRaw ? JSON.parse(unitsRaw) : null,
    criteria: criteriaRaw ? JSON.parse(criteriaRaw) : null,
    sections: sectionsRaw ? JSON.parse(sectionsRaw) : null,
    phases: phasesRaw ? JSON.parse(phasesRaw) : null
  };

  // Trigger download of sanitized JSON file
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'techdocs_state_export.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('%c[TechDocs Inspection] Exported customized state to techdocs_state_export.json!', 'color: #3b82f6; font-weight: bold; font-size: 14px;');
  return { status: 'CUSTOMIZATIONS_EXPORTED', hasCustomizations: true };
})();`;
