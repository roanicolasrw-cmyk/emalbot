export type AreaType = 'institucional' | 'educativa';

export type SubjectType = 
  | 'inscripciones'
  | 'vacantes'
  | 'documentacion'
  | 'tramites'
  | 'horarios'
  | 'secretaria'
  | 'matematicas'
  | 'nuevas_tecnologias'
  | 'lengua'
  | 'educacion_fisica'
  | 'ciencias_sociales'
  | 'ciencias_naturales'
  | 'edi_plataformas';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  area: AreaType;
  subject?: SubjectType;
  sources?: string[];
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
