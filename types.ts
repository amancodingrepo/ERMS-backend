
export interface Report {
  id: string;
  title: string;
  summary: string;
  description: string[];
  price: number;
  pages: number;
  publishedDate: string;
  category: string;
  coverImage: string;
  tableOfContents: string[];
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  content: string[];
  publishedDate: string;
  author: string;
  relatedReportId: string;
  coverImage: string;
}
