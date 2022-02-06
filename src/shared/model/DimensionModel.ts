
export default class DimensionModel
{
  public width?: number;
  public height?: number;
  public length?: number;

  constructor(data: any)
  {
    this.width = data.width;
    this.height = data.height;
    this.length = data.length;
  }

  public static construct(data: any): DimensionModel {
    return new DimensionModel(data);
  }
}
