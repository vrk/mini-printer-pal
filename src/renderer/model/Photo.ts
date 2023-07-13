/**
 * - Photo
    - Constructor()
    - initialize(HTMLImageElement)
        - create originalImageData
        - create scaledImageData
    - `imageElement`: HTMLImageElement
    - `canvas`: HTMLCanvasElement
    - `originalImageData`: number[] readonly
    - `scaledImageData`: Uint8array (mutable)
    - `ditheredImageData`: Uint8array
    - setScale()
    - applyDitherAlgorithm()
    - getOriginalImageSrc()
    - getDitheredImageSrc()
    - getPrintPayload()
 */

import {
  canvas2d,
  GRAY_ALPHA8,
  imagePromise,
  IntBuffer,
  intBufferFromCanvas,
} from "@thi.ng/pixel";
import {
  ATKINSON,
  BURKES,
  DIFFUSION_2D,
  DIFFUSION_COLUMN,
  DIFFUSION_ROW,
  ditherWith,
  FLOYD_STEINBERG,
  JARVIS_JUDICE_NINKE,
  SIERRA2,
  STUCKI,
  THRESHOLD,
  type DitherKernel,
} from "@thi.ng/pixel-dither";    
  
const BYTES_PER_LINE = 70;
const IMAGE_WIDTH = BYTES_PER_LINE * 8;

export class Photo {
  // imageElement: HTMLImageElement;
  // canvas: HTMLCanvasElement;
  // originalImageData: number[];
  // scaledImageData: Uint8Array;
  // ditheredImageData: Uint8Array;
  readonly imageSrc: string;
  private canvas: HTMLCanvasElement;
  private imageElement: HTMLImageElement;
  private context: CanvasRenderingContext2D;
  private kernel?: DitherKernel|null;


  constructor(imageSrc: string, kernel: DitherKernel|null = null) {
    this.imageSrc = imageSrc;
    this.imageElement = new Image();
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')!;
    this.kernel = kernel;
  }

  async loadImage() {
    await this.loadImageToImageElement(this.imageSrc);
    const originalImageHeight = this.imageElement.height;
    const originalImageWidth = this.imageElement.width;
    this.canvas.width = IMAGE_WIDTH;
    this.canvas.height = originalImageHeight * IMAGE_WIDTH / originalImageWidth;
    this.context.drawImage(this.imageElement, 0, 0, this.canvas.width, this.canvas.height);
    if (!this.kernel) {
      // this.context.drawImage(this.imageElement, 0, 0, this.canvas.width, this.canvas.height);
      return;
    }
    const intBuffer = intBufferFromCanvas(this.canvas, GRAY_ALPHA8);
    ditherWith(this.kernel, intBuffer.copy()).blitCanvas(this.canvas);
  }

  private async loadImageToImageElement(imageSrc: string) {
    return new Promise<void>((resolve) => {
      this.imageElement.src = imageSrc;
      this.imageElement.onload = () => {
        resolve();
      };
    });

  }

  getCanvasDataUrl() {
    return this.canvas.toDataURL();
    // return this.imageElement.src;
  }
  getCanvas(): HTMLElement {
    return this.canvas as HTMLElement;
  }

  getImageData() {
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
}