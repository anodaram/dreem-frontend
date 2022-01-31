import FieldModel from "./field/FieldModel";

export default interface ItemModel
{
    itemKind?: string;
    fields?: FieldModel[];
}