export interface SharedActivity {
  id: string;
  userId: string;
  type:
    | "header"
    | "section"
    | "empty"
    | "profile_update"
    | "new_contact"
    | "new_post"
    | "new_comment";
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