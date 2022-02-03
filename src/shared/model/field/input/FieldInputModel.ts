import TextModel from "../../TextModel";
import RangeModelInt from "../../range/RangeModelInt";
import DimensionModel from "../../DimensionModel";

export default class FieldInputModel
{
  public required?: boolean;
  public requirements?: TextModel[];
  public placeholder?: TextModel;
  public description?: TextModel;
  public range?: RangeModelInt;
  public min?: DimensionModel;
  public max?: DimensionModel;

  constructor(data: any)
  {
    this.required = data.required;
    this.requirements = TextModel.constructArray(data.requirements);
    this.placeholder = TextModel.construct(data.placeholder);
    this.description = TextModel.construct(data.description);
    this.range = RangeModelInt.construct(data.range);
    this.min = DimensionModel.construct(data.min);
    this.max = DimensionModel.construct(data.max);
  }

  public static construct(data: any): FieldInputModel {
    return new FieldInputModel(data);
  }
}
