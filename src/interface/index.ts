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


// Define the main user permission type
export interface PermissionsTableItem extends UserType {
  resource: string;
  operations: OperationType[];
}
