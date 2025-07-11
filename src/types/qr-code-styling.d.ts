declare module 'qr-code-styling' {
    export default class QRCodeStyling {
      constructor(options: {
        width: number;
        height: number;
        type?: 'svg' | 'canvas';
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
        };
        dotsOptions?: {
          color?: string;
          type?: string;
        };
        backgroundOptions?: {
          color?: string;
        };
        cornersSquareOptions?: {
          type?: string;
          color?: string;
        };
        cornersDotOptions?: {
          type?: string;
          color?: string;
        };
      });
  
      update(options: any): void;
      append(container: HTMLElement): void;
      download(options?: { extension?: 'png' | 'svg'; name?: string }): void;
    }
  }
  