export interface ZoomLink {
  id: number;
  link: string;
}

export interface ZoomLinkWithCourseId {
  id?: number;
  link: string;
  courseId: string | string[];
}
