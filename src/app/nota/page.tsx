"use client"
import { formatCcy } from "@/service/helper";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Tentukan lebar nota Anda di sini
// 58mm = w-[219px]
// 80mm = w-[302px]
const RECEIPT_WIDTH_CLASS = "w-[302px]"; // <-- GANTI INI UNTUK 58mm / 80mm

export default function Nota() {
    const param = useSearchParams();
    const [trx, setTrx] = useState<any>(null);
    const [company, setCompany] = useState<any>(null);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 1. Tambah state loading

    // --- 2. Perbaikan Logika Fetch & Print ---

    // Efek ini HANYA untuk mengambil data
    useEffect(() => {
        async function getData() {
            try {
                const c : string | null = param.get('c');
                const b : string | null = param.get('b');
                const t : string | null = param.get('t');

                // Validasi parameter
                if (!c || !b || !t) {
                    // Anda bisa redirect atau menampilkan error
                    console.error("Parameter tidak lengkap");
                    return;
                }

                // Jalankan fetch secara paralel agar lebih cepat
                const [companyData, notaData, itemsData] = await Promise.all([
                    getCompany(c, b),
                    getNota(c, t),
                    getNotaItems(c, t)
                ]);

                // Set semua state
                setCompany(companyData);
                setTrx(notaData);
                if (itemsData) {
                    setItems(itemsData);
                }
                
            } catch (error) {
                console.error("Gagal mengambil data nota:", error);
            } finally {
                setIsLoading(false); // Set loading false saat selesai (atau gagal)
            }
        }
        
        getData();
    }, [param]); // Tambahkan dependensi `param`
    
    useEffect(() => {
        // Hanya panggil print() JIKA loading sudah selesai DAN data ada
        if (isLoading === false && trx) {
            window.print();
            // Opsional: Tutup tab atau kembali ke halaman sebelumnya
            // window.close();
            // router.back();
        }
    }, [isLoading]); // Dependensi pada isLoading dan trx

    // --- 3. Ubah Fungsi Fetch untuk MENGEMBALIKAN data ---

    async function getNota(c : string | null, t : string | null) {
        const api = await fetch('/api/nota', {
            method: 'POST',
            headers :  {
                'Content-Type': 'application/json',
                'ApiKey': '20240101',
            },
            body: JSON.stringify({
                "companyId" : c,
                "trxId" : t
            })});
        const res = await api.json();
        return res.data; // Kembalikan data
    }

    async function getCompany(c : string | null, b : string | null) {
        const api = await fetch('/api/company', {
            method: 'POST',
            headers :  {
                'Content-Type': 'application/json',
                'ApiKey': '20240101',
            },
            body: JSON.stringify({
                "companyId" : c,
                "branchId" : b
            })});
        const res = await api.json();
        return res.data; // Kembalikan data
    }

    async function getNotaItems(c : string | null, t : string | null) {
        const api = await fetch('/api/notaitems', {
            method: 'POST',
            headers :  {
                'Content-Type': 'application/json',
                'ApiKey': '20240101',
            },
            body: JSON.stringify({
                "companyId" : c,
                "trxId" : t
            })});
        const res = await api.json();
        return res.data; // Kembalikan data
    }

    // --- Tampilan Loading ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className={`${RECEIPT_WIDTH_CLASS} font-mono text-center p-4 bg-white shadow-lg`}>
                    Memuat nota...
                </div>
            </div>
        );
    }

    // --- 4. Tampilan Nota (Struktur HTML Baru) ---
    // (MUI Grid dan class responsive sm:/lg: Dihapus)

    // Wrapper ini PENTING untuk @media print
    return (
        <div className="print-wrapper flex justify-center items-start min-h-screen bg-gray-100 p-4">
            
            {/* Container Nota Utama 
              - `font-mono` untuk font thermal printer
              - `text-xs` atau `text-[10pt]` untuk font kecil
              - `text-black` agar terbaca jelas
            */}
            <div className={`receipt-container-on-print ${RECEIPT_WIDTH_CLASS} bg-white text-black font-mono text-xs p-2 shadow-lg`}>
                
                {/* Header Struk */}
                <div className="text-center">
                    <h2 className="font-bold text-sm uppercase">
                        { (company?.companyName) ? company.companyName : '...' }
                    </h2>
                    <p className="text-[10px] leading-tight">
                        { (company?.branchAddress) ? company.branchAddress : '...' }
                    </p>
                    <p className="text-[10px] leading-tight">
                        Telp: { (company?.companyPhone) ? company.companyPhone : '...' }
                    </p>
                </div>

                {/* Garis Pemisah */}
                <div className="border-t border-dashed border-black my-2"></div>

                {/* Info Transaksi */}
                <div className="flex justify-between text-[10px]">
                    <span>No: { (trx?.trxId) ? trx.trxId : '...' }</span>
                    <span>Kasir: { (trx?.kasir) ? trx.kasir : 'Staff' }</span>
                </div>
                <div className="text-[10px]">
                    <span>Waktu: { (trx?.createdDate) ? trx.createdDate : '...' }</span>
                </div>

                {/* Info Pembeli */}
                <div className="mt-1 text-[10px]">
                    <p>Pembeli: { (trx?.memberName) ? trx.memberName : '-' }</p>
                </div>

                {/* Garis Pemisah */}
                <div className="border-t border-dashed border-black my-2"></div>

                {/* Daftar Item */}
                <div>
                    {items.map((data : any, i) => (
                        <div key={i} className="mb-1">
                            {/* Baris 1: Nama Item */}
                            <p className="uppercase">{data.productName}</p>
                            {/* Baris 2: (Qty @ Harga Satuan) --- (Total Harga Item) */}
                            <div className="flex justify-between">
                                <span>  {data.qty} @ {formatCcy(data.price)}</span>
                                <span className="font-semibold">{formatCcy(data.qty * data.price)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Garis Pemisah */}
                <div className="border-t border-dashed border-black my-2"></div>

                {/* Perhitungan Total */}
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span>Total Item</span>
                        <span>{ (trx?.trxQty) ? formatCcy(trx.trxQty) : '0' }</span>
                    </div>
                    
                    <div className="flex justify-between font-bold text-sm">
                        <span>TOTAL</span>
                        <span>Rp{ (trx?.trxTotal) ? formatCcy(trx.trxTotal) : '0' }</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span>{ (trx?.method) ? trx.method.toUpperCase() : 'CASH' }</span>
                        <span>Rp{ (trx?.amount) ? formatCcy(trx.amount) : '0' }</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Kembalian</span>
                        <span>Rp{ (trx?.kembalian) ? formatCcy(trx.kembalian) : '0' }</span>
                    </div>
                </div>

                {/* Status & Catatan */}
                <div className="border-t border-dashed border-black my-2 pt-2">
                    <span className="font-bold text-sm uppercase">{trx?.status}</span>
                    <p className="text-[10px]">{trx?.note}</p>
                </div>


                {/* Footer Struk */}
                <div className="text-center mt-3">
                    <p>Bukti Transaksi ini dicetak otomatis dari aplikasi beekasir</p>
                    <p className="font-bold">Terima Kasih</p>
                </div>
            </div>
        </div>
    )
}