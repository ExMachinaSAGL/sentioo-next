export default interface Notification {
  id: string;
  unread: boolean;
  title: string;
  text: string;
  creationTime: string;
  validFrom: string;
  priority: number;
  type?: string;
}