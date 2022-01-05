export const removeUndef = <T extends any>(obj: T | undefined): obj is T => obj !== undefined;
