
export default class LayoutElementModel
{
  public ignoreLayout?: boolean;
  public minWidth?: number;
  public minHeight?: number;
  public preferredWidth?: number;
  public preferredHeight?: number;
  public flexibleWidth?: number;
  public flexibleHeight?: number;
  public layoutPriority?: number;

  constructor(data: any)
  {
    this.ignoreLayout = data.ignoreLayout;
    this.minWidth = data.minWidth;
    this.minHeight = data.minHeight;
    this.preferredWidth = data.preferredWidth;
    this.preferredHeight = data.preferredHeight;
    this.flexibleWidth = data.flexibleWidth;
    this.flexibleHeight = data.flexibleHeight;
    this.layoutPriority = data.layoutPriority;
  }

  public static construct(data: any): LayoutElementModel {
    return new LayoutElementModel(data);
  }
}
