"use client"

import { AlertSweet, ToastSweet, localSave } from "@/service/helper";
// Hapus import MUI
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AUTH, DB } from "@/service/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowUpRightFromSquare, 
  faSignIn, 
  faEnvelope, // Tambahkan ikon
  faLock,     // Tambahkan ikon
  faSpinner   // Tambahkan ikon
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image"; // Gunakan Next/Image
import { CompanyData, UserData } from "@/service/model";

export default function Login() {
  const { handleSubmit, register, formState: { errors }} = useForm();
  const [loading, setLoading] = useState(false);
  const [loadingDesc, setLoadingDesc] = useState('Please wait');
  const router = useRouter();

  const handleLogin = (data:any) => {
    getUser(data);
  }

  useEffect(() => {
    setLoading(false);
    return () => {}
  }, [])
  

  async function getUser(user : any) {
    setLoading(true);
    setLoadingDesc('Memeriksa Otentikasi 1/4');
    
    const ref = doc(DB, 'Users', user.username);
    const data = await getDoc(ref);
    const row = data.data() as UserData;
    
    if (!row) {
      setLoading(false);
      setLoadingDesc('Username atau Password Tidak Sesuai');
      AlertSweet('warning', 'Login Gagal','Username atau Password tidak sesuai');
    } else if(row.userStatus != 'Active'){
      setLoading(false);
      setLoadingDesc('User Tidak Dapat digunakan');
      AlertSweet('warning', 'Login Gagal','Username atau Password tidak dapat digunakan');
    } else {
      localSave('@user', row);
      getCompany(row, user);
    }
  }

  async function getCompany(user : any, login: any) {
    try {
      setLoading(true);
      setLoadingDesc('Memeriksa Otentikasi 2/4');
      const ref = doc(DB, 'Company', user.companyId);
      const data = await getDoc(ref);
      const row = data.data() as CompanyData;
      console.log(row);
      if (!row) {
        setLoading(false);
        setLoadingDesc('Usaha Tidak Terdaftar');
        AlertSweet('warning', 'Login Gagal','Silahkan login di aplikasi mobile untuk melengkapi data.');
      } else if(row.level < 1){
        setLoading(false);
        setLoadingDesc('Upgrade Langganan untuk menggunakan beekasir web');
        AlertSweet('warning', 'Ups Akses Terkunci','Silahkan upgrade member ke Pro untuk menggunakan fitur web.');
      } else {
        localSave('@company', row);
        getBranch(user, login);
      }
    } catch (error) {
      setLoading(false);
      AlertSweet('error', 'Login Gagal','ERR.62 ' + error);
    }
  }

  async function getBranch(user : any, login: any) {
    try {
      setLoading(true);
      setLoadingDesc('Memeriksa Otentikasi 3/4');
      const ref = doc(DB, 'Company/' + user.companyId + '/Branch', user.branchId);
      const data = await getDoc(ref);
      const row = data.data();
      
      if (!row) {
        setLoading(false);
        setLoadingDesc('Cabang Tidak Terdaftar');
        AlertSweet('warning', 'Login Gagal','Silahkan login di aplikasi mobile untuk melengkapi data.');
      } else {
        localSave('@branch', row);
        setLoadingDesc('Cabang User ditemukan');
        checkLDAP(login);
      }
    } catch (error) {
      setLoading(false);
      AlertSweet('error', 'Login Gagal','ERR.100 ' + error);
    }
  }

  async function checkLDAP(user : any) {
    setLoading(true);
    setLoadingDesc('Memeriksa Otentikasi 4/4');
    
    signInWithEmailAndPassword(AUTH, user.username, user.password).then((value) => {
      ToastSweet('success', 'Welcome ' + value.user.email + '.');
      setLoadingDesc('Anda akan diarahkan ke halaman admin.');
      router.push('/admin/PosTrx');
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      if (err.code.includes('wrong-password')) {
        AlertSweet('warning', 'Login Gagal','Username atau Password tidak sesuai');
      } else if (err.code.includes('user-disable')) {
        AlertSweet('warning', 'Login Gagal','User Tidak Aktif');
      } else if (err.code.includes('too-many-requests')) {
        AlertSweet('warning', 'Login Gagal','User diblokir sementara karena teralu banyak percobaan login');
      } else if (err.code.includes('auth/network-request-failed')) {
        AlertSweet('warning', 'Login Gagal','Ops, Untuk Login Membutuhkan Koneksi Internet.');
      } else {
        AlertSweet('error', 'Login Gagal','ERR.LOGIN.36 Ups Terjadi kesalahan sistem. silahkan ulangi.');
      }
    });
  }

  // Helper untuk progress bar
  const getProgress = () => {
    if (loadingDesc.includes('1/4')) return '25%';
    if (loadingDesc.includes('2/4')) return '50%';
    if (loadingDesc.includes('3/4')) return '75%';
    if (loadingDesc.includes('4/4')) return '100%';
    return '0%';
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Kolom Kiri (Branding) - Tersembunyi di mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-indigo-700 text-white p-12">
        <Link href={'/'}>
          <Image
            src="/beekasir-logo.svg" // Pastikan path logo benar
            alt="Beekasir Logo"
            width={120}
            height={120}
            priority
          />
        </Link>
        <h1 className="mt-6 text-4xl font-bold">Selamat Datang</h1>
        <p className="mt-4 text-lg text-center text-indigo-100">
          Akses panel admin Beekasir Web untuk mengelola usaha Anda.
        </p>
      </div>

      {/* Kolom Kanan (Formulir) */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 lg:w-1/2">
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo untuk Tampilan Mobile */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link href={'/'}>
              <Image
                src="/beekasir-logo.svg"
                alt="Beekasir Logo"
                width={80}
                height={80}
              />
            </Link>
          </div>
          <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in ke Beekasir Web
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            
            {/* Input Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="email"
                  type="email"
                  disabled={loading}
                  { ...register('username', { required:{ value:true, message:'Silahkan masukkan email' }})}
                  className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.username ? 'ring-red-500' : 'ring-gray-300'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all`}
                  placeholder="anda@email.com"
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.username?.message?.toString()}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="password"
                  type="password"
                  disabled={loading}
                  { ...register('password', { required:{ value:true, message:'Silahkan masukkan password' }})}
                  className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.password ? 'ring-red-500' : 'ring-gray-300'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password?.message?.toString()}
                </p>
              )}
            </div>

            {/* Tombol Login */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>Login...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <FontAwesomeIcon icon={faSignIn} />
                  </>
                )}
              </button>
            </div>

            {/* Loading Progress Bar */}
            {loading && (
              <div className="space-y-2 text-center">
                <p className="text-sm text-gray-700">{loadingDesc}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: getProgress() }}
                  ></div>
                </div>
              </div>
            )}
          </form>

          {/* Link ke Playstore */}
          <p className="mt-10 text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <a 
              href="https://play.google.com/store/apps/details?id=com.beebeesoft.beekasir"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Download di Playstore
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-1 h-3 w-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}