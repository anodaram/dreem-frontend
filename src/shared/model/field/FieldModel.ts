import TextModel from "../TextModel";
import FieldInputModel from "./input/FieldInputModel";
import LayoutElementModel from "../LayoutElementModel";

export default interface FieldModel
{
    key?: string;
    kind?: string;
    name?: TextModel;
    input?: FieldInputModel;
    layoutElement?: LayoutElementModel;
    fields?: FieldModel[];
}
