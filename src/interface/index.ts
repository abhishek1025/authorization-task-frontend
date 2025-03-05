export type ApiHandlerParams = {
  // eslint-disable-next-line
  data?: any;
  endpoint: string;
  token?: string;
};

export interface UserType {
  id: string;
  name: string;
  email: string;
}

export type OperationType = {
  operation: string;
  id: number;
};


export interface PermissionsTableItem extends UserType {
  resource: string;
  operations: OperationType[];
}


export type PermissionFormState = {
  userId: string;
  resource: string;
  permissions: {
    id: string;
    type: "new" | "delete" | "existing";
  }[];
  existingPermissions: string[];
}

export type PermissionFormPropsType = {
  isEdit: boolean,
  initialData: PermissionFormState
}
