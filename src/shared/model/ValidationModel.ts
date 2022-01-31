import ValidationModelEntry from "./ValidationModelEntry";

export default interface ValidationModel
{
    result?: boolean;
    validations?: ValidationModelEntry[];
}