/**
 * Interface for Term Data from the University API
 * @author Daekyun Kim <daekyun97@gmail.com>
 */
export interface TermData {
  termCode: string;
  shortDescription: string;
  longDescription: string;
  beginDate: number;
  endDate: number;
  instructionBeginDate: number;
  instructionEndDate: number;
  academicYear: string;
  pastTerm: boolean;
}

export interface TermResponse {
  terms: TermData[];
}

export interface TermInfo {
  termCode: string;
  displayName: string;
  year: number;
  season: 'Spring' | 'Summer' | 'Fall';
}
