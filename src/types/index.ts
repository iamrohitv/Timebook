// ── User & Profiles ───────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
};

export type StudentProfile = {
  userId: string;
  university: string;
  college: string;
  branch: string;
  semester: number;
  rollNo: string;
  enrollmentYear: number;
  cgpa?: number;
};

// ── Academic ─────────────────────────────────────────────────────
export type Subject = {
  id: string;
  code: string;
  name: string;
  semester: number;
  branch: string;
  color: string;
  credits: number;
  teacher?: string;
};

export type TimetableEntry = {
  id: string;
  subjectId: string;
  subject?: Subject;
  day: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  room: string;
  teacher: string;
  type: "lecture" | "lab" | "tutorial";
};

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ── Attendance ───────────────────────────────────────────────────
export type AttendanceRecord = {
  id: string;
  subjectId: string;
  date: string; // ISO
  status: "present" | "absent" | "cancelled";
  timetableEntryId?: string;
};

export type AttendanceSummary = {
  subjectId: string;
  subject?: Subject;
  total: number;
  present: number;
  absent: number;
  percentage: number;
};

// ── Notes ────────────────────────────────────────────────────────
export type Note = {
  id: string;
  title: string;
  subjectId: string;
  subject?: Subject;
  unit?: number;
  topic?: string;
  fileName: string;
  fileType: "pdf" | "docx" | "pptx" | "image" | "other";
  fileSize: string;
  fileUrl?: string;
  uploadedAt: string;
  tags: string[];
  ownerId: string;
  isPublic?: boolean;
};

export type CommunityNote = Note & {
  university: string;
  college: string;
  branch: string;
  semester: number;
  upvotes: number;
  downloads: number;
  reports: number;
  contributor: Pick<User, "id" | "name" | "avatar">;
  hasUpvoted?: boolean;
};

// ── AI ───────────────────────────────────────────────────────────
export type AIProviderId = "openai" | "google" | "anthropic";

export type AIProvider = {
  id: AIProviderId;
  name: string;
  description: string;
  models: string[];
  keyLabel: string;
  docsUrl: string;
  icon: string;
};

export type AIProviderConfig = {
  providerId: AIProviderId;
  apiKey: string;
  model: string;
  enabled: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  contextSources?: string[]; // e.g. note ids, subject ids
};

export type StudyMaterial = {
  id: string;
  title: string;
  content?: string;
  fileName?: string;
};

export type AIGenerationType =
  | "summary"
  | "detailed"
  | "revision"
  | "keypoints"
  | "flashcards"
  | "mcqs"
  | "questions";

export type AIGeneratedContent = {
  id: string;
  type: AIGenerationType;
  title: string;
  content: string;
  createdAt: string;
  sourceId: string;
};

// ── Academic hierarchy for community ─────────────────────────────
export type University = { id: string; name: string };
export type College = { id: string; universityId: string; name: string };
export type Branch = { id: string; name: string; code: string };
