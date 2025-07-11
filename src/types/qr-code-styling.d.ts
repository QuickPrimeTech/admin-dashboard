declare module "qr-code-styling" {
  type GradientColorStop = {
    offset: number;
    color: string;
  };

  type Gradient = {
    type: "linear" | "radial";
    rotation?: number;
    colorStops: GradientColorStop[];
  };

  type FileExtension = "png" | "jpeg" | "webp" | "svg";

  export type Options = {
    width: number;
    height: number;
    type?: "svg" | "canvas";
    data?: string;
    image?: string;
    margin?: number;
    qrOptions?: {
      typeNumber?: number;
      mode?: string;
      errorCorrectionLevel?: string;
    };
    imageOptions?: {
      hideBackgroundDots?: boolean;
      imageSize?: number;
      margin?: number;
      crossOrigin?: string;
      saveAsBlob?: boolean;
    };
    dotsOptions?: {
      color?: string;
      type?: string;
      gradient?: Gradient;
    };
    backgroundOptions?: {
      color?: string;
      gradient?: Gradient;
    };
    cornersSquareOptions?: {
      type?: string;
      color?: string;
      gradient?: Gradient;
    };
    cornersDotOptions?: {
      type?: string;
      color?: string;
      gradient?: Gradient;
    };
  };

  export default class QRCodeStyling {
    constructor(options: Options);
    update(options: Partial<Options>): void;
    append(container: HTMLElement): void;
    download(options?: { extension?: FileExtension; name?: string }): void;
  }
}
