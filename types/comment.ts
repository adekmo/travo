export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  userId: {
    name: string;
    avatar?: string;
  };
}