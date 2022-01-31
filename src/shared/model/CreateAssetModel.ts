import TextModel from "./TextModel";

/**
 * Model which represents each asset when user clicks create asset - backend returns collection of available assets to build.
 */
export default class CreateAssetModel
{
  public key: string;
  public interactable: boolean;
  public name: TextModel;
  public icon: string;

  constructor(data: any)
  {
    this.key = data.key;
    this.interactable = data.interactable;
    this.name = TextModel.construct(data.name);
    this.icon = data.icon;
  }


  public static construct(data: any): CreateAssetModel {
    return new CreateAssetModel(data);
  }

  public static constructArray(data: any): CreateAssetModel[] {
    let assets: CreateAssetModel[] = [];
    for (let i = 0; i < data.length; ++i) {
      let asset: CreateAssetModel = CreateAssetModel.construct(data[i]);
      assets.push(asset);
    }
    return assets;
  }

}
