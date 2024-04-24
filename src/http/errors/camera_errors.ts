export default class CameraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CameraError";
  }
}
