export type PageId =
  | 'landing'
  | 'login'
  | 'register'
  | 'onboarding'
  | 'dashboard'
  | 'discover'
  | 'problem-details'
  | 'post-problem'
  | 'find-collaborators'
  | 'profile'
  | 'my-problems'
  | 'my-collaborations'
  | 'workspace'
  | 'tasks'
  | 'messages'
  | 'notifications'
  | 'settings';

export interface NavContext {
  problemId?: string;
  studentId?: string;
  collaborationId?: string;
}

export type Navigate = (page: PageId, ctx?: NavContext) => void;

export interface Student {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  branch: string;
  department: string;
  year: number;
  skills: string[];
  interests: string[];
  availability: 'available' | 'busy' | 'unavailable';
  contributions: number;
  problemsSolved: number;
  collaborations: number;
  bio: string;
  email: string;
  github?: string;
  linkedin?: string;
  cgpa: number;
  compatibility?: number;
  location: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  branch: string;
  skills: string[];
  deadline: string;
  collaboratorsNeeded: number;
  collaboratorsJoined: number;
  status: 'open' | 'in-progress' | 'solved';
  postedBy: Student;
  postedAt: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'academic' | 'technical' | 'project' | 'research';
  views: number;
  requests: number;
  longDescription?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: Student;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  collaborationId: string;
}

export interface ChatMessage {
  id: string;
  from?: Student;
  fromSelf?: boolean;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  with: Student;
  messages: ChatMessage[];
  lastMessage: ChatMessage;
  unread: number;
}

export interface ActivityItem {
  id: string;
  student: Student;
  action: string;
  timestamp: string;
  type: 'task' | 'message' | 'file' | 'member' | 'status' | 'comment';
}

export interface Collaboration {
  id: string;
  title: string;
  description: string;
  problem: Problem;
  members: Student[];
  lead: Student;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  startDate: string;
  deadline: string;
  tasks: Task[];
  recentActivity: ActivityItem[];
}

export interface Notification {
  id: string;
  type: 'collaboration' | 'task' | 'message' | 'problem' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  avatar?: Student;
}
