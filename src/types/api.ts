export type Params = {
  params: Promise<{
    id: string;
  }>;
};

export type ApiResponse<T> = {
  message: string;
  data: T | null;
  success: boolean;
};
