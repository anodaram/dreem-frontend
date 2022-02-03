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
  public value?: string;
  public fields?: FieldModel[];

  constructor(data: any)
  {
    this.key = data.key;
    this.kind = data.kind;
    this.name = TextModel.construct(data.name);
    this.input = FieldInputModel.construct(data.input);
    this.layoutElement = LayoutElementModel.construct(data.layoutElement);
    this.value = data.value;
  }

  public static construct(data: any): FieldModel {
    return new FieldModel(data);
  }
  public static constructArray(data: any): FieldModel[] {
    let assets: FieldModel[] = [];
    for (let i = 0; i < data.length; ++i) {
      let asset: FieldModel = FieldModel.construct(data[i]);
      assets.push(asset);
    }
    return assets;
  }
}
