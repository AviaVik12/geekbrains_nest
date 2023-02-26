import { v4 as uuidv4 } from 'uuid';

const publicPath = './public';
let path: string = publicPath;

export class HelperFileLoader {
  static set path(_path: string) {
    path = publicPath + _path;
  }

  public static customFileName(request, file, callback) {
    const originalName = file.originalname.split('.');
    const fileExtension = originalName[originalName.length - 1];
    callback(null, `${uuidv4()}.${fileExtension}`);
  }

  public static destinationPath(request, file, callback) {
    callback(null, path);
  }
}
