export interface CompanyData {
  id: string;
  companyName : string;
  companyPhone : string;
  level : number;
  exp?: string;
  maxAccount?: number;
  createdDate : string;
  updatedDate : string;
  updatedBy : string;
}

export interface Product {
    productId : string,
    productName : string,
    category : string,
    cost : number,
    price : number,
    createdBy : string,
    createdDate : string,
    modifiedBy : string,
    modifiedDate : string,
    photo : string,
    stockReady : number,
    stockMin : number,
    stockCrash : number,
    stockNew : number,
    reason : string
}

export interface User {
    username : string,
    fullName : string,
    role : string,
    userStatus : string,
    branchId : string,
    companyId : string,
    device : string,
    lastLogin : string,
    mobileToken : string,
    createdDate : string,
    updatedDate : string,
    version : string
}

export interface UserData {
  username: string;
  fullName: string;
  role: string;
  photoUrl?: string;
  branchId?: string;
  companyId?: string;
  createdDate?: string;
  device?: string;
  key?: string;
  uuid?: string;
  lastLogin?: string;
  mobileToken?: string;
  userStatus?: "Active" | "InActive";
  updatedDate?: string;
  version?: string;
  refCode?: string | null;
  affiliateCode?:string | null;
}

export interface Trx {
    trxId : string,
    kasir : string,
    kasirId : string,
    createdDate : string,
    status : string,
    trxQty : number,
    trxTotal : number,
    branchId : string,
    note : string,
    kembalian : number,
}

export interface Item {
    id: string,
    productId: string,
    productName: string,
    cost: number,
    price: number,
    priceOrigin: number,
    qty: number,
    subTotal: number,
    totalCost: number,
    disc: number,
    persen: number,
    typeDisc: number,
    total: number,
    trxId:  string,
    branchId:  string,
    createdDate : string,
}