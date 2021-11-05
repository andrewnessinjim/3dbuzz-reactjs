export * from "../server/shared/actions";

// --------------------------
// App store
export const DIALOG_SET = "DIALOG_SET";
export const dialogSet = (id, isOpen, props = {}) => ({id, type: DIALOG_SET, isOpen, props});

export const DIALOG_LOGIN = "DIALOG_LOGIN";