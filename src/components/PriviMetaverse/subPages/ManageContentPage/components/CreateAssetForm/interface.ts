export interface FormData {
  [key: string]: string;
}

export interface InputFiles {
  [key: string]: File;
}

export interface ImageDimension {
  width: number;
  height: number;
}

export interface InputFileContents {
  [key: string]: {
    src: string | ArrayBuffer | null;
    dimension?: ImageDimension;
  };
}

export interface InputRefs {
  [key: string]: HTMLInputElement | null;
}