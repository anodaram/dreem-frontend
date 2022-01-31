/**
 * Main data class for sending localized text.
 * Where key from localization CSV file and arguments are optional text string components.
 */
export default class TextModel
{
  public key: string;
  public args: any[];
  public value: string;

  constructor(data: any)
  {
    this.key = data.key;
    this.args = data.args;
    this.value = data.value;
  }

  public static construct(data: any): TextModel{
    return new TextModel(data);
  }
}
