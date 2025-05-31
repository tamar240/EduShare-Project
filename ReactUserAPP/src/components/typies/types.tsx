export type Subject = {
    teacherName: any;
    id: number;
    name: string;
    ownerId: number;
    createdAt: string;
    updatedAt: string;
  };
  
  export type Lesson = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    subjectId: number;
    ownerId: number;
    permission: number;
   originalSummary?: UploadedFileData;
   orginalSummaryId: number;
    processedSummary?: UploadedFileData;
    processedSummaryId: number;
   
  };
  
  export interface UserFilesPageProps {
    type: 'PERSONAL' | 'PUBLIC';
  }
  
  export interface SubjectsListProps {
    subjects: Subject[];
    setSubjects: (subjects: Subject[]) => void;
    onSelectSubject: (subject: Subject) => void;
    type: "PERSONAL" | "PUBLIC";
  }

 export interface LessonListProps {
  selectedSubjectLessons: Lesson[] | null;
  subjectId:number;
  type:'PUBLIC'|'PERSONAL';
 }
 export interface UploadedFileData {
  id: string;
  fileName: string;
  fileType: string;
  filePath: string;
  size: number;
  lessonId: string;
  s3Key: string;
  mimeType?: string; // Added mimeType property
  ownerId: number;

}

