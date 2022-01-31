import FileFormatModel from "../../FileFormatModel";
import FieldInputModel from "./FieldInputModel";

export default interface FieldInputModelFile extends FieldInputModel
{
    formats?: FileFormatModel[];
}