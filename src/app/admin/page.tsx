"use client"

import { localGet, setAccess } from "@/service/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Hapus semua import @mui/material
// import { Card, CardActions, CardContent, CardHeader, Icon, Stack } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const [menus, setMenus] = useState<any[]>([]);

    useEffect(() => {
        autoload();
    }, []);

    const autoload = async () => {
        try {
            const localUser = localGet('@user');
            const getMenus = setAccess(localUser);
            setMenus(getMenus);
        } catch (error) {
            console.log("No Role");
        }
    }

    // Fungsi goTo tidak lagi diperlukan karena kita menggunakan <Link>
    // const goTo = (url : string) => { ... }

    return (
        // Latar belakang gelap adalah ciri khas Windows Phone
        <div className="p-4 sm:p-6">
            
            {/* Ini adalah inti dari layout Metro UI:
              - `grid`: Menggunakan CSS Grid.
              - `gap-3`: Jarak antar "ubin".
              - `grid-cols-[repeat(auto-fill,minmax(140px,1fr))]`: 
                Ini adalah bagian penting. 
                - "Buat kolom sebanyak mungkin (auto-fill)"
                - "Setiap kolom memiliki lebar minimal 140px"
                - "Jika ada ruang sisa, bagi rata (1fr)"
                Ini akan secara otomatis menyesuaikan jumlah ubin per baris.
            */}
            <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
                
                {menus.map((m, i) => {
                    return (
                        <Link 
                            key={i} 
                            href={'/admin/' + m.route}
                            // Ini adalah "Ubin" (Tile) Anda
                            className="
                                group aspect-square  /* Membuat ubin selalu persegi */
                                p-3                   /* Padding di dalam ubin */
                                text-white
                                flex flex-col        /* Menyusun ikon dan teks secara vertikal */
                                justify-end           /* Mendorong konten ke BAWAH (khas Metro) */
                                overflow-hidden       /* Memastikan tidak ada yang bocor */
                                transition-transform duration-100
                                hover:scale-[1.02]    /* Efek 'sentuh' sedikit membesar */
                            "
                            // Gunakan warna solid Anda di sini. TIDAK ADA bayangan.
                            style={{ backgroundColor: '#1976d2' }} 
                        >
                            {/* size="8x" dari kode asli Anda terlalu besar untuk ubin 140px.
                              Saya ganti ke size="3x". Sesuaikan sesuai kebutuhan.
                            */}
                            <FontAwesomeIcon icon={m.icon} size="3x" />
                            
                            <span className="block mt-2 font-semibold text-lg lowercase">
                                {/* 'lowercase' sangat khas Metro UI */}
                                {m.label}
                            </span>
                        </Link>
                    )
                })}
                
           </div>
        </div>
    )
}