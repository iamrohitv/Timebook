import type {
  User,
  StudentProfile,
  Subject,
  TimetableEntry,
  AttendanceRecord,
  Note,
  CommunityNote,
  Conversation,
  AIProvider,
} from "../types";

export const mockUser: User = {
  id: "u1",
  name: "Rohit Verma",
  email: "rohit@timebook.app",
  avatar: "",
  createdAt: "2025-08-01T00:00:00.000Z",
};

export const mockProfile: StudentProfile = {
  userId: "u1",
  university: "Delhi Technological University",
  college: "DTU Main Campus",
  branch: "Computer Science",
  semester: 5,
  rollNo: "2K22/CS/142",
  enrollmentYear: 2022,
  cgpa: 8.4,
};

export const mockSubjects: Subject[] = [
  { id: "s1", code: "CS301", name: "Data Structures & Algorithms", semester: 5, branch: "CSE", color: "#7c3aed", credits: 4, teacher: "Dr. Sharma" },
  { id: "s2", code: "CS302", name: "Operating Systems", semester: 5, branch: "CSE", color: "#0ea5e9", credits: 4, teacher: "Prof. Gupta" },
  { id: "s3", code: "CS303", name: "Database Systems", semester: 5, branch: "CSE", color: "#059669", credits: 4, teacher: "Dr. Iyer" },
  { id: "s4", code: "CS304", name: "Computer Networks", semester: 5, branch: "CSE", color: "#e11d48", credits: 3, teacher: "Dr. Mehta" },
  { id: "s5", code: "CS305", name: "Machine Learning", semester: 5, branch: "CSE", color: "#f59e0b", credits: 3, teacher: "Prof. Rao" },
  { id: "s6", code: "HU301", name: "Engineering Economics", semester: 5, branch: "CSE", color: "#64748b", credits: 2, teacher: "Dr. Singh" },
];

export const mockTimetable: TimetableEntry[] = [
  { id: "t1", subjectId: "s1", day: "Monday", startTime: "09:00", endTime: "10:00", room: "LT-101", teacher: "Dr. Sharma", type: "lecture" },
  { id: "t2", subjectId: "s2", day: "Monday", startTime: "10:00", endTime: "11:00", room: "LT-101", teacher: "Prof. Gupta", type: "lecture" },
  { id: "t3", subjectId: "s3", day: "Monday", startTime: "11:00", endTime: "13:00", room: "Lab-3", teacher: "Dr. Iyer", type: "lab" },
  { id: "t4", subjectId: "s4", day: "Tuesday", startTime: "09:00", endTime: "10:00", room: "LT-102", teacher: "Dr. Mehta", type: "lecture" },
  { id: "t5", subjectId: "s1", day: "Tuesday", startTime: "10:00", endTime: "11:00", room: "LT-101", teacher: "Dr. Sharma", type: "tutorial" },
  { id: "t6", subjectId: "s5", day: "Tuesday", startTime: "11:00", endTime: "12:00", room: "LT-103", teacher: "Prof. Rao", type: "lecture" },
  { id: "t7", subjectId: "s2", day: "Wednesday", startTime: "09:00", endTime: "11:00", room: "Lab-1", teacher: "Prof. Gupta", type: "lab" },
  { id: "t8", subjectId: "s3", day: "Wednesday", startTime: "11:00", endTime: "12:00", room: "LT-101", teacher: "Dr. Iyer", type: "lecture" },
  { id: "t9", subjectId: "s4", day: "Thursday", startTime: "09:00", endTime: "10:00", room: "LT-102", teacher: "Dr. Mehta", type: "lecture" },
  { id: "t10", subjectId: "s5", day: "Thursday", startTime: "10:00", endTime: "12:00", room: "Lab-5", teacher: "Prof. Rao", type: "lab" },
  { id: "t11", subjectId: "s6", day: "Friday", startTime: "09:00", endTime: "10:00", room: "LT-104", teacher: "Dr. Singh", type: "lecture" },
  { id: "t12", subjectId: "s1", day: "Friday", startTime: "10:00", endTime: "11:00", room: "LT-101", teacher: "Dr. Sharma", type: "lecture" },
];

function genAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  let id = 1;
  const start = new Date("2025-08-01");
  const end = new Date("2025-09-07");
  for (const subj of mockSubjects) {
    const total = 20 + Math.floor(Math.random() * 6);
    for (let i = 0; i < total; i++) {
      const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const present = Math.random() > 0.18;
      records.push({
        id: `a${id++}`,
        subjectId: subj.id,
        date: d.toISOString(),
        status: present ? "present" : "absent",
      });
    }
  }
  // deterministic sort
  records.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return records;
}
export const mockAttendance: AttendanceRecord[] = genAttendance();

export const mockNotes: Note[] = [
  { id: "n1", title: "DSA - Trees & Graphs Handwritten", subjectId: "s1", unit: 3, topic: "Trees", fileName: "dsa-trees-graphs.pdf", fileType: "pdf", fileSize: "4.2 MB", uploadedAt: "2025-09-02T10:00:00.000Z", tags: ["trees", "graphs"], ownerId: "u1" },
  { id: "n2", title: "OS - Deadlocks Summary", subjectId: "s2", unit: 2, topic: "Deadlocks", fileName: "os-deadlocks.pdf", fileType: "pdf", fileSize: "1.8 MB", uploadedAt: "2025-09-03T08:30:00.000Z", tags: ["deadlocks", "summary"], ownerId: "u1" },
  { id: "n3", title: "DBMS - Normalization Notes", subjectId: "s3", unit: 4, topic: "Normalization", fileName: "dbms-normalization.docx", fileType: "docx", fileSize: "890 KB", uploadedAt: "2025-09-01T12:00:00.000Z", tags: ["normalization"], ownerId: "u1" },
  { id: "n4", title: "CN - TCP vs UDP", subjectId: "s4", unit: 1, topic: "Transport Layer", fileName: "cn-tcp-udp.pptx", fileType: "pptx", fileSize: "2.4 MB", uploadedAt: "2025-08-28T09:00:00.000Z", tags: ["tcp", "udp"], ownerId: "u1" },
  { id: "n5", title: "ML - Linear Regression", subjectId: "s5", unit: 1, topic: "Regression", fileName: "ml-linear-regression.pdf", fileType: "pdf", fileSize: "3.1 MB", uploadedAt: "2025-08-30T14:00:00.000Z", tags: ["regression", "supervised"], ownerId: "u1" },
];

export const mockCommunityNotes: CommunityNote[] = [
  { id: "c1", title: "OS Previous Year Papers (2020-24)", subjectId: "s2", fileName: "os-pyq-2020-24.pdf", fileType: "pdf", fileSize: "6.1 MB", uploadedAt: "2025-08-20T10:00:00.000Z", tags: ["pyq"], ownerId: "u2", university: "DTU", college: "DTU Main", branch: "CSE", semester: 5, upvotes: 142, downloads: 892, reports: 1, contributor: { id: "u2", name: "Ananya Patel", avatar: "" }, unit: 0, topic: "PYQ" },
  { id: "c2", title: "DBMS Complete Notes - Unit 1-5", subjectId: "s3", fileName: "dbms-complete.pdf", fileType: "pdf", fileSize: "12.4 MB", uploadedAt: "2025-08-22T08:00:00.000Z", tags: ["complete"], ownerId: "u3", university: "NSUT", college: "NSUT Main", branch: "CSE", semester: 5, upvotes: 231, downloads: 1240, reports: 0, contributor: { id: "u3", name: "Vikram Singh", avatar: "" }, unit: 1, topic: "Complete" },
  { id: "c3", title: "CN - Top 50 Interview Questions", subjectId: "s4", fileName: "cn-interview-50.pdf", fileType: "pdf", fileSize: "1.2 MB", uploadedAt: "2025-08-25T11:00:00.000Z", tags: ["interview"], ownerId: "u4", university: "DTU", college: "DTU Main", branch: "CSE", semester: 5, upvotes: 98, downloads: 445, reports: 0, contributor: { id: "u4", name: "Sahil Khan", avatar: "" }, unit: 0 },
  { id: "c4", title: "ML - Cheatsheet & Formulas", subjectId: "s5", fileName: "ml-cheatsheet.pdf", fileType: "pdf", fileSize: "2.0 MB", uploadedAt: "2025-09-01T09:00:00.000Z", tags: ["cheatsheet"], ownerId: "u5", university: "DTU", college: "DTU Main", branch: "IT", semester: 5, upvotes: 67, downloads: 321, reports: 2, contributor: { id: "u5", name: "Priya Nair", avatar: "" }, unit: 0 },
  { id: "c5", title: "DSA - Striver Sheet Annotated", subjectId: "s1", fileName: "dsa-striver-annotated.pdf", fileType: "pdf", fileSize: "8.9 MB", uploadedAt: "2025-08-18T07:00:00.000Z", tags: ["dsa", "striver"], ownerId: "u6", university: "DTU", college: "DTU Main", branch: "CSE", semester: 5, upvotes: 412, downloads: 2103, reports: 0, contributor: { id: "u6", name: "Arjun Das", avatar: "" }, unit: 0 },
];

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    title: "Explain deadlocks with example",
    createdAt: "2025-09-05T10:00:00.000Z",
    updatedAt: "2025-09-05T10:05:00.000Z",
    messages: [
      { id: "m1", role: "user", content: "Explain deadlocks in OS with a real example", createdAt: "2025-09-05T10:00:00.000Z" },
      { id: "m2", role: "assistant", content: "A deadlock is when two or more processes are stuck waiting for each other forever. Example: Process A holds Resource 1 and waits for Resource 2, while Process B holds Resource 2 and waits for Resource 1. Neither can proceed. Four conditions must hold: mutual exclusion, hold and wait, no preemption, and circular wait.", createdAt: "2025-09-05T10:01:00.000Z" },
    ],
  },
  {
    id: "conv2",
    title: "DBMS normalization help",
    createdAt: "2025-09-04T09:00:00.000Z",
    updatedAt: "2025-09-04T09:10:00.000Z",
    messages: [
      { id: "m3", role: "user", content: "What is 3NF in simple terms?", createdAt: "2025-09-04T09:00:00.000Z" },
      { id: "m4", role: "assistant", content: "3NF = table is in 2NF + no transitive dependencies. In plain English: every non-key attribute must depend directly on the primary key, not on another non-key attribute. Example: Student(id, dept, deptHead) violates 3NF because deptHead depends on dept, not id.", createdAt: "2025-09-04T09:01:00.000Z" },
    ],
  },
];

export const mockProviders: AIProvider[] = [
  { id: "openai", name: "OpenAI", description: "GPT-4o, GPT-4o mini", models: ["gpt-4o", "gpt-4o-mini", "o1-mini"], keyLabel: "OpenAI API Key", docsUrl: "https://platform.openai.com/api-keys", icon: "O" },
  { id: "google", name: "Google Gemini", description: "Gemini 1.5 Pro / Flash", models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash"], keyLabel: "Gemini API Key", docsUrl: "https://aistudio.google.com/app/apikey", icon: "G" },
  { id: "anthropic", name: "Anthropic Claude", description: "Claude 3.5 Sonnet", models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"], keyLabel: "Anthropic API Key", docsUrl: "https://console.anthropic.com/settings/keys", icon: "A" },
];

export const upcomingExams = [
  { id: "e1", subjectId: "s1", title: "DSA Mid Sem", date: "2025-09-15", type: "Midterm" as const },
  { id: "e2", subjectId: "s3", title: "DBMS Assignment 2", date: "2025-09-12", type: "Assignment" as const },
  { id: "e3", subjectId: "s2", title: "OS Lab Evaluation", date: "2025-09-18", type: "Lab" as const },
];
