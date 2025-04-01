export function readFileBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async ({ target }) => {
      try {
        if (!target?.result || typeof target.result === "string") {
          reject("error");
        } else {
          resolve(target.result);
        }
      } catch (e) {
        reject(e);
      }
    };
    fileReader.readAsArrayBuffer(file);
  });
}
