export type AreaType = 'institucional' | 'educativa';

export type SubjectType =
  | 'inscripciones'
  | 'vacantes'
  | 'documentacion'
  | 'tramites'
  | 'horarios'
  | 'secretaria'
  | 'docentes'
  | 'matematicas'
  | 'nuevas_tecnologias'
  | 'lengua'
  | 'ingles'
  | 'educacion_fisica'
  | 'ciencias_sociales'
  | 'ciencias_naturales'
  | 'edi_plataformas';

export interface RagMatchedDocTrace {
  id: string;
  title: string;
  sourceType: 'google_form_drive' | 'drive' | 'knowledge_base';
  category: string;
  score: number;
  matchedTerms: string[];
  excerpt: string;
}

export interface RagTraceInfo {
  keywords: string[];
  totalDocsScanned: number;
  driveDocsScanned: number;
  matchedDocuments: RagMatchedDocTrace[];
  generationMode: 'gemini-api' | 'rag-local-synthesizer';
  processingMs: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  area: AreaType;
  subject?: SubjectType;
  sources?: string[];
  ragTrace?: RagTraceInfo;
  exercise?: {
    question: string;
    hint: string;
    solution: string;
  };
  isSimplerExplanation?: boolean;
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  folderCategory?: string;
  authorName?: string;
  moduleLevel?: string;
  sourceType?: 'google_form' | 'drive_upload';
  contentPreview?: string;
  size?: string;
  webViewLink?: string;
  synced: boolean;
}

export interface DriveFolderItem {
  name: string;
  category: string;
  allowedUsers: string;
  status: string;
}

export interface DriveStatus {
  connected: boolean;
  userEmail?: string;
  folderName?: string;
  regStructureCreated?: boolean;
  fileCount: number;
  lastSync?: string;
  folders?: DriveFolderItem[];
  files: DriveFileItem[];
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  area: AreaType;
  subject: SubjectType;
  category: string;
  content: string;
  source: string;
  keywords: string[];
}
