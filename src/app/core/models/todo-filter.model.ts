export interface TodoFilter {
  completed?: boolean;
  priority?: 'Low' | 'Medium' | 'High';
  categoryId?: number;
  userId?: number;
  q?: string;
}
