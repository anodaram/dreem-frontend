import TextModel from "../TextModel";
import FieldInputModel from "./input/FieldInputModel";
import LayoutElementModel from "../LayoutElementModel";

export default class FieldModel
{
  public key?: string;
  public kind?: string;
  public name?: TextModel;
  public input?: FieldInputModel;
  public layoutElement?: LayoutElementModel;
  public fields?: FieldModel[];
}
