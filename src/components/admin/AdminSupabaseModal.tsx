'use client';

import React from 'react';

/**
 * @deprecated Decommissioned in Phase 3C per Requirement 6:
 * "Remove/deprecate Settings UI that allows users to replace Supabase URL/key."
 * Supabase configuration is now securely managed via environment variables.
 * Rule 15: Strictly under 300 lines (< 300).
 */
export const AdminSupabaseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onDataSynced?: () => void;
}> = () => {
  return null;
};
