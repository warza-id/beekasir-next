// src/components/ProductTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Chip,
  TableSortLabel, // Diperlukan untuk sorting
  TextField,     // Diperlukan untuk filtering/pencarian
  Box             // Diperlukan untuk tata letak
} from '@mui/material';
import { Product } from '@/types/product'; 
import { visuallyHidden } from '@mui/utils'; // Untuk aksesibilitas sorting

// --- Tipe Data untuk Sorting ---
type Order = 'asc' | 'desc';
type HeadCellId = keyof Product | 'cost' | 'price' | 'stockReady'; // Kolom yang dapat di-sort

interface ProductTableProps {
  products: Product[];
}

// Fungsi helper untuk perbandingan dan sorting
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends HeadCellId>(
  order: Order,
  orderBy: Key,
): (
  a: Product,
  b: Product,
) => number {
  if (orderBy === 'cost' || orderBy === 'price' || orderBy === 'stockReady') {
    // Sortir nilai numerik (di sini disimpan sebagai string, jadi harus diubah)
    return order === 'desc'
      ? (a, b) => parseFloat(b[orderBy] as string) - parseFloat(a[orderBy] as string)
      : (a, b) => parseFloat(a[orderBy] as string) - parseFloat(b[orderBy] as string);
  }

  // Sortir string
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy as keyof Product)
    : (a, b) => -descendingComparator(a, b, orderBy as keyof Product);
}

export default function ProductTable({ products }: ProductTableProps) {
  // 1. State untuk Sorting
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<HeadCellId>('productName');

  // 2. State untuk Filtering
  const [filterText, setFilterText] = useState('');

  // Handler Sorting
  const handleRequestSort = (property: HeadCellId) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // --- 3. Filtering dan Sorting Logic (useMemo) ---
  const visibleRows = useMemo(() => {
    // A. Filtering
    const filteredProducts = products.filter(product => {
      const lowerCaseFilter = filterText.toLowerCase();
      return (
        product.productName.toLowerCase().includes(lowerCaseFilter) ||
        product.category.toLowerCase().includes(lowerCaseFilter)
      );
    });

    // B. Sorting
    return filteredProducts.sort(getComparator(order, orderBy));
  }, [products, order, orderBy, filterText]);


  // Definisi Header Tabel
  const headCells: { id: HeadCellId; label: string; align?: 'right' }[] = [
    { id: 'productName', label: 'Nama Produk' },
    { id: 'category', label: 'Kategori' },
    { id: 'cost', label: 'Biaya (Cost)', align: 'right' },
    { id: 'price', label: 'Harga (Price)', align: 'right' },
    { id: 'stockReady', label: 'Stok Siap', align: 'right' },
    { id: 'satuan', label: 'Satuan' },
    { id: 'hidden', label: 'Status' },
  ];

  return (
    <>
      {/* Input Pencarian/Filter */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Master Produk
        </Typography>
        <TextField
          label="Cari Produk atau Kategori"
          variant="outlined"
          size="small"
          onChange={(e) => setFilterText(e.target.value)}
          value={filterText}
          sx={{ width: '300px' }}
        />
      </Box>

      {/* Tabel */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="master product table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align || 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center">
                  <Typography variant="subtitle1" color="textSecondary">
                    Tidak ada data produk ditemukan (Filter/Data Kosong).
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((product) => (
                <TableRow
                  key={product.productId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{product.productName}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">Rp {product.cost}</TableCell>
                  <TableCell align="right">Rp {product.price}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={product.stockReady}
                      color={
                        parseInt(product.stockReady) < parseInt(product.stockMin)
                          ? 'warning'
                          : parseInt(product.stockReady) < parseInt(product.stockCrash)
                          ? 'error'
                          : 'success'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{product.satuan}</TableCell>
                  <TableCell>
                    {product.hidden ? (
                      <Chip label="Hidden" color="default" size="small" />
                    ) : (
                      <Chip label="Aktif" color="primary" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}