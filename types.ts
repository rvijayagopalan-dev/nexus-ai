
export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: 'work' | 'personal' | 'urgent';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  TASKS = 'TASKS',
  SETTINGS = 'SETTINGS'
}
