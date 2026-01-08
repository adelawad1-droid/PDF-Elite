
import React from 'react';

export type ToolType = 
  | 'merge' 
  | 'split' 
  | 'compress' 
  | 'pdf-to-word' 
  | 'word-to-pdf' 
  | 'pdf-to-jpg' 
  | 'ai-summarize'
  | 'ai-chat';

export interface PDFTool {
  id: ToolType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  message: string;
  resultUrl?: string;
}