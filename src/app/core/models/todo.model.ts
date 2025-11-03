export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string; // ISO string
  categoryId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  user?: User;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  language: string;
  role: string;
}
// Crud 


export interface CreateTodoDto {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}
