import TextModel from "../../TextModel";

export default class FieldInputModel
{
  public required?: boolean;
  public requirements?: TextModel[];
  public placeholder?: TextModel;
  public description?: TextModel;

  constructor(data: any)
  {
    this.required = data.required;
    this.requirements = TextModel.constructArray(data.requirements);
    this.placeholder = TextModel.construct(data.placeholder);
    this.description = TextModel.construct(data.description);
  }

  public static construct(data: any): FieldInputModel {
    return new FieldInputModel(data);
  }
}
