
export default class FileFormatModel
{
  public name?: string;
  public mimeType?: string;

  constructor(data: any)
  {
    this.name = data.name;
    this.mimeType = data.mimeType;
  }

  public static construct(data: any): FileFormatModel{
    return new FileFormatModel(data);
  }
  public static constructArray(data: any): FileFormatModel[] {
    let assets: FileFormatModel[] = [];
    for (let i = 0; i < data.length; ++i) {
      let asset: FileFormatModel = FileFormatModel.construct(data[i]);
      assets.push(asset);
    }
    return assets;
  }
}
