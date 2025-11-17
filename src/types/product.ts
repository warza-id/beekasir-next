// src/types/product.ts
export interface Product {
  productId: string;
  productName: string;
  category: string;
  cost: string; // Menggunakan string karena ini adalah nilai uang
  price: string;
  stockReady: string;
  stockMin: string;
  stockCrash: string;
  photo: string;
  satuan: string;
  favorit: boolean;
  hidden: boolean;
}