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


  constructor(imageSrc: string) {
    this.imageSrc = imageSrc;
    this.imageElement = new Image();
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')!;
  }

  async loadImage() {
    console.log("LOADING")
    await this.loadImageToImageElement(this.imageSrc);
    const originalImageHeight = this.imageElement.height;
    const originalImageWidth = this.imageElement.width;
    this.canvas.width = IMAGE_WIDTH;
    this.canvas.height = originalImageHeight * IMAGE_WIDTH / originalImageWidth;
    // this.canvas = document.createElement('canvas');
    // this.canvas.width = this.imageElement.width;
    // this.canvas.height = this.imageElement.height;
    // console.log(this.imageElement, this.imageElement.height)
    // this.context = this.canvas.getContext('2d')!;
    this.context.drawImage(this.imageElement, 0, 0, this.canvas.width, this.canvas.height);
    // console.log(this.canvas)
  }

  private async loadImageToImageElement(imageSrc: string) {
    return new Promise<void>((resolve) => {
      this.imageElement.src = imageSrc;
      this.imageElement.onload = () => {
        console.log('hiiiiii it is load');
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
}