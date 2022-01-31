import TextModel from "../../TextModel";

export default class FieldInputModel
{
  public required?: boolean;
  public requirements?: TextModel[];
  public placeholder?: TextModel;
  public description?: TextModel;
}
