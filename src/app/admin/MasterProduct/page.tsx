// src/app/(dashboard)/master-product/page.tsx
"use client"
import { collection, getDocs, doc } from 'firebase/firestore';
import { Container, Typography, Box } from '@mui/material';
import { Product } from '@/types/product'; // Sesuaikan path
import { DB, refProduct } from '@/service/firebase';
import ProductTable from '@/component/ProductTable';
import { useEffect, useState } from 'react';

export default async function MasterProductPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
          getProducts();
        return () => {
          
        }
    }, []);


   async function getProducts() {

  try {
    // 1. Definisikan path koleksi
    const productsCollectionRef = collection(
        DB, 
        refProduct()
    );
    console.log(productsCollectionRef);
    
    // 2. Ambil snapshot data
    const snapshot = await getDocs(productsCollectionRef);
    
    // 3. Konversi data
    const productsData: Product[] = snapshot.docs.map((doc) => ({
      productId: doc.id, // Menggunakan ID dokumen sebagai productId
      productName: '', // Default values if field is missing
      category: '',
      cost: '0',
      price: '0',
      stockReady: '0',
      stockMin: '0',
      stockCrash: '0',
      photo: '',
      satuan: '-',
      favorit: false,
      hidden: false,
      // Overwrite dengan data dari Firestore (asumsikan data Firestore memiliki field yang sama)
      ...doc.data(), 
    })) as Product[]; // Type assertion untuk memastikan struktur
    
    setProducts(productsData);

  } catch (error) {
    console.error('Error fetching products:', error);
    // Kembalikan array kosong jika terjadi kesalahan
    
  }
}

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <ProductTable products={products} />
    </Container>
  );
}