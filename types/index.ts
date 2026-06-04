export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export interface Project {
  id: string;
  name: string;
  description: string;
  deadline: string;
  budget: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  milestones?: Milestone[]; 
}

export interface Milestone {
  id: string;
  title: string;
  status: "COMPLETED" | "PENDING";
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
}
