
export default class RangeModelInt
{
  public min?: number;
  public max?: number;

  constructor(data: any)
  {
    this.min = data.min;
    this.max = data.max;
  }

  public static construct(data: any): RangeModelInt {
    return new RangeModelInt(data);
  }
}
