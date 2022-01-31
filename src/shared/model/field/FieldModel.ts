import TextModel from "../TextModel";
import FieldInputModel from "./input/FieldInputModel";

export default interface FieldModel
{
    key?: string;
    kind?: string;
    name?: TextModel;
    input?: FieldInputModel;
    fields?: FieldModel[];
}