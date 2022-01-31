import TextModel from "./TextModel";

/**
 * Model which represents each asset when user clicks create asset - backend returns collection of available assets to build.
 */
export default interface CreateAssetModel
{
    key?: string;
    interactable?: boolean;
    name?: TextModel;
    icon?: string;
}