
export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD'
}

export enum QuantModule {
  INTENSITY = 'INTENSITY',
  HAWKES = 'HAWKES',
  EXECUTION = 'EXECUTION',
  PORTFOLIO = 'PORTFOLIO',
  VOLATILITY = 'VOLATILITY',
  LABELING = 'LABELING'
}

export interface QuantReport {
  title: string;
  mleResults: string;
  diagnostics: string;
  strategySummary: string;
  mathNotes: string;
}

export interface MarketUniverse {
  symbol: string;
  frequency: string;
  horizon: string;
}

// Added missing BusinessProfile interface for business analysis
export interface BusinessProfile {
  concept: string;
  industry: string;
}

// Added missing GeneratedAsset interface for branding and media forge
export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
}
