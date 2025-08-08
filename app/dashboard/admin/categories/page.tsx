'use client'

import { Category } from '@/types/category'
import { useEffect, useState } from 'react'

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [editModeId, setEditModeId] = useState<string | null>(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [editCategoryDescription, setEditCategoryDescription] = useState('');

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    // Fungsi untuk menampilkan pesan feedback sementara
    const displayMessage = (msg: string, type: 'success' | 'error') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
        setMessage(null);
        setMessageType(null);
        }, 5000);
    };

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
        const res = await fetch('/api/categories');
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(errorData.message || `Gagal memuat kategori: ${res.statusText}`);
        }
        const data = await res.json();
        setCategories(data);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error ...', error)
            displayMessage(`Gagal ...: ${error.message}`, 'error');
          } else {
            console.error('Unexpected error', error)
            displayMessage('Gagal ...: Terjadi kesalahan tidak diketahui.', 'error');
          }
        } finally {
        setIsLoading(false); // Set loading false setelah fetch selesai (baik sukses/gagal)
        }
    };

    useEffect(() => {
        fetchCategories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCreate = async () => {
        if (!newCategoryName.trim()) { 
        displayMessage('Nama kategori wajib diisi.', 'error');
        return;
        }

        setIsLoading(true);
        try {
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategoryName, description: newCategoryDescription }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Gagal membuat kategori.');
        }

        displayMessage('Kategori berhasil ditambahkan!', 'success');
        setNewCategoryName('');
        setNewCategoryDescription('');
        fetchCategories();
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error ...', error)
            displayMessage(`Gagal ...: ${error.message}`, 'error');
          } else {
            console.error('Unexpected error', error)
            displayMessage('Gagal ...: Terjadi kesalahan tidak diketahui.', 'error');
          }
        } finally {
        setIsLoading(false);
        }
    };

    const handleEditClick = (category: Category) => {
        setEditModeId(category._id);
        setEditCategoryName(category.name);
        setEditCategoryDescription(category.description || '');
    };

    const handleCancelEdit = () => {
        setEditModeId(null); // Keluar dari mode edit
        setEditCategoryName('');
        setEditCategoryDescription('');
    };

    const handleUpdate = async () => {
        if (!editModeId || !editCategoryName.trim()) { // Validasi ID dan nama tidak boleh kosong
        displayMessage('Nama kategori tidak boleh kosong saat mengedit.', 'error');
        return;
        }

        setIsLoading(true); // Set loading true
        try {
        const res = await fetch(`/api/categories/${editModeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: editCategoryName, description: editCategoryDescription }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Gagal mengupdate kategori.');
        }

        displayMessage('Kategori berhasil diupdate!', 'success');
        handleCancelEdit();
        fetchCategories();
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error ...', error)
            displayMessage(`Gagal ...: ${error.message}`, 'error');
          } else {
            console.error('Unexpected error', error)
            displayMessage('Gagal ...: Terjadi kesalahan tidak diketahui.', 'error');
          }
        } finally {
        setIsLoading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setCategoryToDeleteId(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDeleteId) return;

        setIsLoading(true);
        try {
        const res = await fetch(`/api/categories/${categoryToDeleteId}`, {
            method: 'DELETE',
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Gagal menghapus kategori.');
        }

        displayMessage('Kategori berhasil dihapus!', 'success');
        setShowConfirmModal(false);
        setCategoryToDeleteId(null);
        fetchCategories();
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error ...', error)
            displayMessage(`Gagal ...: ${error.message}`, 'error');
          } else {
            console.error('Unexpected error', error)
            displayMessage('Gagal ...: Terjadi kesalahan tidak diketahui.', 'error');
          }
        } finally {
        setIsLoading(false);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setCategoryToDeleteId(null);
    };
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Pengelolaan Kategori
        </h1>

        {/* Display Pesan Feedback */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg text-white ${
              messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
            } shadow-md text-center`}
          >
            {message}
          </div>
        )}

        {/* Form Tambah Kategori Baru */}
        <div className="mb-10 p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Tambah Kategori Baru</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nama Kategori (wajib)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              disabled={isLoading}
            />
            <textarea
              placeholder="Deskripsi Kategori (Opsional)"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              rows={3}
              className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm resize-y"
              disabled={isLoading}
            ></textarea>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Menambahkan...' : 'Tambah Kategori'}
            </button>
          </div>
        </div>

        {/* Daftar Kategori */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-5 text-center">Daftar Kategori</h2>
          {isLoading && !categories.length ? (
            <div className="text-center text-gray-600 p-4">Memuat kategori...</div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-600 p-4 border rounded-md bg-gray-50">
              Belum ada kategori yang ditambahkan.
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-gray-50 p-5 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-200"
                >
                  {/* Mode Edit vs Mode Lihat */}
                  {editModeId === category._id ? (
                    // Tampilan saat dalam mode edit
                    <div className="flex-1 flex flex-col gap-3">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        disabled={isLoading}
                      />
                      <textarea
                        value={editCategoryDescription}
                        onChange={(e) => setEditCategoryDescription(e.target.value)}
                        rows={2}
                        className="p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm resize-y"
                        disabled={isLoading}
                      ></textarea>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleUpdate}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-200"
                          disabled={isLoading}
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Tampilan saat tidak dalam mode edit
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-2">
                        Dibuat: {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {/* Tombol Edit dan Hapus (sembunyikan saat dalam mode edit) */}
                  {editModeId !== category._id && (
                    <div className="flex gap-2 md:ml-4 mt-3 md:mt-0">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200 shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 shadow-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus kategori ini? Aksi ini tidak dapat dibatalkan.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Menghapus...' : 'Hapus'}
              </button>
              <button
                onClick={cancelDelete}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                disabled={isLoading}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoriesPage