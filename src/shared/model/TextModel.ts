/**
 * Main data class for sending localized text.
 * Where key from localization CSV file and arguments are optional text string components.
 */
export default interface TextModel
{
    key?: string;
    args?: any[];
    value?: string;
}