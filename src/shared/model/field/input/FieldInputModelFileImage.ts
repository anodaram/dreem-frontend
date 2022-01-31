import FieldInputModelFile from "./FieldInputModelFile";
import DimensionModel from "../../DimensionModel";

export default interface FieldInputModelFileImage extends FieldInputModelFile
{
    min?: DimensionModel;
    max?: DimensionModel;
}