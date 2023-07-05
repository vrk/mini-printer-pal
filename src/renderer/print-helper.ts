const BYTES_PER_LINE = 70;

export function getImageDataForImage(image: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  // Canvas dimensions need to be a multiple of 40 for this printer
  canvas.width = 560;
  canvas.height = 560;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return context.getImageData(0, 0, canvas.width, canvas.height);
}

function toRgba(imageData: ImageData, x: number, y: number) {
  const { data, width } = imageData;
  const r = data[((width * y) + x) * 4];
  const g = data[((width * y) + x) * 4 + 1];
  const b = data[((width * y) + x) * 4 + 2];
  const a = data[((width * y) + x) * 4 + 3];
  return { r, g, b, a}
}

export async function getPrintData(imageData: ImageData) {
  // const pic = await Jimp.read(printableImgPath)
  // let remaining = pic.bitmap.height;
  let remaining = imageData.height;
  let printData = [];
  let index = 0;

  // ********
  // FROM https://github.com/vivier/phomemo-tools/tree/master#31-header
  // PRINTING HEADER

  // Initialize printer
  printData[index++] = 27;
  printData[index++] = 64;

  // Select justification
  printData[index++] = 27;
  printData[index++] = 97;

  // Justify (0=left, 1=center, 2=right)
  printData[index++] = 0;

  // End of header
  printData[index++] = 31;
  printData[index++] = 17;
  printData[index++] = 2;
  printData[index++] = 4;
  // ********

  let line = 0;

  while (remaining > 0) {
    let lines = remaining
    if (lines > 256) {
      lines = 256;
    }

    // ********
    // FROM https://github.com/vivier/phomemo-tools/tree/master#32-block-marker
    // PRINTING MARKER

    // Print raster bit image
    printData[index++] = 29
    printData[index++] = 118
    printData[index++] = 48

    // Mode: 0=normal, 1=double width, 2=double height, 3=quadruple
    printData[index++] = 0

    // Bytes per line
    printData[index++] = BYTES_PER_LINE
    printData[index++] = 0

    // Number of lines to print in this block.
    printData[index++] = lines - 1;
    printData[index++] = 0
    // ********

    remaining -= lines;

    while (lines > 0) {
      // ******
      // PRINT LINE
      for (let x = 0; x < BYTES_PER_LINE; x++) {
        let byte = 0;

        for (let bit = 0; bit < 8; bit++) {
          imageData.data
          // const rgba = Jimp.intToRGBA(pic.getPixelColor(x * 8 + bit, line));
          const xVal = x * 8 + bit;
          const yVal = line;
          const rgba = toRgba(imageData, xVal, yVal);
          console.log(rgba);
          if (rgba.r === 0 && rgba.a !== 0) {
            byte |= 1 << (7 - bit)
          }
        }
        if (byte === 0x0a) {
          byte = 0x14;
        }
        printData[index++] = byte;
      }
      // ******
      lines--;
      line++;
    }
  }


  // ******
  // FROM: https://github.com/vivier/phomemo-tools/tree/master#33-footer
  // PRINT FOOTER

  // command ESC d : print and feed n lines (twice)
  printData[index++] = 27;
  printData[index++] = 100;
  printData[index++] = 2;

  printData[index++] = 27;
  printData[index++] = 100;
  printData[index++] = 2;

  // just footer codes now

  // b'\x1f\x11\x08'
  printData[index++] = 31;
  printData[index++] = 17;
  printData[index++] = 8;
  // \x1f\x11\x0e
  printData[index++] = 31;
  printData[index++] = 17;
  printData[index++] = 14;

  // x1f\x11\x07
  printData[index++] = 31;
  printData[index++] = 17;
  printData[index++] = 7;

  // b'\x1f\x11\x09'
  printData[index++] = 31;
  printData[index++] = 17;
  printData[index++] = 9;

  return printData;
}

export async function sendToPrinter(characteristic: any, printData: number[]) {
  const uint8Array = new Uint8Array(printData);
  let index = 0;
  while (true) {
    if (index + 512 < uint8Array.length) {
      await characteristic.writeValue(uint8Array.slice(index, index + 512));
      index += 512;
    } else if (index < uint8Array.length) {
      await characteristic.writeValue(uint8Array.slice(index, uint8Array.length));
      break;
    } else {
      break;
    }
  }
}