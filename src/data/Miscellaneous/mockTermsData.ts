/**
 * Mock terms data for development fallback
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

import type { TermResponse } from '../../types/term';

export const mockTermsData: TermResponse = {
  terms: [
    {
      termCode: '1256',
      shortDescription: '2025 Summr',
      longDescription: 'Summer 2025',
      beginDate: 1747026000000,
      endDate: 1756097999999,
      instructionBeginDate: 1747026000000,
      instructionEndDate: 1756097999999,
      academicYear: '2024-25',
      pastTerm: false,
    },
    {
      termCode: '1262',
      shortDescription: '2025 Fall',
      longDescription: 'Fall 2025-2026',
      beginDate: 1756098000000,
      endDate: 1766383199999,
      instructionBeginDate: 1756875600000,
      instructionEndDate: 1765432799999,
      academicYear: '2025-26',
      pastTerm: false,
    },
  ],
};
