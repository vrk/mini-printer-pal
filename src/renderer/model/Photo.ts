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
  GRAY_ALPHA8,
  intBufferFromCanvas,
} from "@thi.ng/pixel";
import {
  ditherWith,
  type DitherKernel,
} from "@thi.ng/pixel-dither";    
  
const BYTES_PER_LINE = 70;
const IMAGE_WIDTH = BYTES_PER_LINE * 8;
const MAX_HEIGHT_FOR_M02S_IN_PX = 925;

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
  private scaledImagePercentage: number;
  private brightness: number;
  private contrast: number;
  private lightness: number;


  constructor(
    imageSrc: string,
    kernel: DitherKernel|null = null,
    scaledImagePercentage: number,
    brightness: number,
    contrast: number,
    lightness: number
  ) {
    this.imageSrc = imageSrc;
    this.imageElement = new Image();
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')!;
    this.kernel = kernel;
    this.scaledImagePercentage = scaledImagePercentage;
    this.brightness = brightness;
    this.contrast = contrast;
    this.lightness = lightness;
  }

  async loadImage() {
    await this.loadImageToImageElement(this.imageSrc);
    const originalImageHeight = this.imageElement.height;
    const originalImageWidth = this.imageElement.width;
    this.canvas.width = IMAGE_WIDTH;
    const scalePercentage = Math.max(this.scaledImagePercentage / 100.0, 0.01); 

    const scaledImageWidth = IMAGE_WIDTH * scalePercentage;
    const scaledHeight = originalImageHeight * scaledImageWidth / originalImageWidth;
    this.canvas.height = Math.min(scaledHeight, MAX_HEIGHT_FOR_M02S_IN_PX);
    const startDrawX = IMAGE_WIDTH - scaledImageWidth; 
    this.context.filter = `brightness(${this.brightness}%) contrast(${this.contrast}%)`;
    this.context.drawImage(this.imageElement, startDrawX, 0, scaledImageWidth, scaledHeight);
    if (!this.kernel) {
      return;
    }
    const intBuffer = intBufferFromCanvas(this.canvas, GRAY_ALPHA8);
    ditherWith(this.kernel, intBuffer.copy()).blitCanvas(this.canvas);

    if (this.lightness > 99) {
      return;
    }

    // TODO: brightness filter
    const pixelData = this.getImageData();
    this.lightnenPixels(pixelData);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.putImageData(pixelData, 0, 0);
    const intBuffer2 = intBufferFromCanvas(this.canvas, GRAY_ALPHA8);
    ditherWith(this.kernel, intBuffer2.copy()).blitCanvas(this.canvas);
  }

  private lightnenPixels(pixelData: ImageData) {
    let i = 0;
    let dat = pixelData.data;
    const lightnessMultiplier = 255.0 * (100.0 - this.lightness) / 100.0;
    while (i < dat.length) {
        dat[i] = dat[i++] + lightnessMultiplier;
        dat[i] = dat[i++] + lightnessMultiplier;
        dat[i] = dat[i++] + lightnessMultiplier;
        i++; // skip alpha
    }
    return pixelData;
}

  private async loadImageToImageElement(imageSrc: string) {
    return new Promise<void>((resolve) => {
      this.imageElement.src = imageSrc;
      this.imageElement.onload = () => {
        resolve();
      };
    });

  }
  private async loadImageToNewImageElement(imageSrc: string) {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        resolve(img);
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