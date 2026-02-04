export type Params = {
  params: Promise<{
    id: string;
  }>;
};

export type ApiResponse<T = null> = {
  message: string;
  data: T;
  success: boolean;
};
