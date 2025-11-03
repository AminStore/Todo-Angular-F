export interface HttpOptions {
  headers?: { [key: string]: string };
  params?: { [key: string]: string | number | boolean };
  responseType?: 'json' | 'text' | 'blob';
  observe?: 'body' | 'response';
}