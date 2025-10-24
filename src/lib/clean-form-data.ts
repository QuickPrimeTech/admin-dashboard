type CleanedFormDataValue =
  | string
  | string[]
  | {
      name: string;
      size: number;
      type: string;
    }[]
  | undefined;

type CleanedFormData = Record<string, CleanedFormDataValue>;
