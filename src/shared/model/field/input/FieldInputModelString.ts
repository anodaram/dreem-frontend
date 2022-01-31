import FieldInputModel from "./FieldInputModel";
import RangeModelInt from "../../range/RangeModelInt";

export default interface FieldInputModelString extends FieldInputModel
{
    range?: RangeModelInt;
}