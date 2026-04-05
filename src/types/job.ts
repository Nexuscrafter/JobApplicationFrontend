export interface Job {
  _id: string;
  title: string;
  company: string;
  skills: string[];
  location: string;
  applications?: number;
}