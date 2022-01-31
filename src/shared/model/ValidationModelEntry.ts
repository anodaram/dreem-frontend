import TextModel from "./TextModel";

export default interface ValidationModelEntry
{
    result?: boolean;
    text?: TextModel;
    message?: string;
}