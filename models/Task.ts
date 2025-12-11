export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TASK_STATUS;
  createdDate?: string;
  dueDate?: string;
}

export enum TASK_STATUS {
  COMPLETED = 'completed',
  PENDING = 'pending',
}
