export interface ExportEntry {
  username: string;
  href: string;
}

export interface AnalysisTotals {
  totalSeguindo: number;
  totalSeguidores: number;
  totalReciprocos: number;
  totalNaoReciprocos: number;
  percentualReciprocidade: number;
}

export interface AnalysisResult {
  ok: true;
  totals: AnalysisTotals;
  naoReciprocos: ExportEntry[];
  followersFilesFound: number;
}

export type AnalysisErrorCode =
  | "html-export"
  | "full-export"
  | "missing-followers"
  | "missing-following"
  | "not-a-zip"
  | "empty-zip"
  | "parse-error";

export interface AnalysisError {
  ok: false;
  code: AnalysisErrorCode;
  detail?: string;
}

export type AnalysisOutcome = AnalysisResult | AnalysisError;
