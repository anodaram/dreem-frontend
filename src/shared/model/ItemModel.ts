import FieldModel from "./field/FieldModel";

export default class ItemModel
{
  public itemKind?: string;
  public fields?: FieldModel[];

  constructor(data: any)
  {
    this.itemKind = data.itemKind;
    this.fields = FieldModel.constructArray(data.fields);
  }

  public static construct(data: any): ItemModel {
    return new ItemModel(data);
  }

}
