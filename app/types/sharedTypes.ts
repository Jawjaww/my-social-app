export interface Activity {
    id: string;
    userId: string;
    type: 'profile_update' | 'new_contact' | 'new_post' | 'new_comment';
    timestamp: number;
    description: string;
    metadata?: {
      [key: string]: any;
    };
  }
  
  export interface Contact {
    id: string;
    name: string;
    avatar?: string;
  }

  export interface User {
    id: string;
    name: string;
    avatar?: string;
  }