export interface IMailerMail {
  subject: string;
  body: string;
  to: string;
  attachments?: IMailerAttachment[];
}

export interface IMailerAttachment {
  filename?: string;
  content?: any;
  path?: string;
  href?: string;
  contentType?: any;
}

export default IMailerMail;
