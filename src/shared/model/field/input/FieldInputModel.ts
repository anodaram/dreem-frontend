import TextModel from "../../TextModel";

export default interface FieldInputModel
{
    required?: boolean;
    requirements?: TextModel[];
    description?: TextModel;
}