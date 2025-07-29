import { Poll } from '../types/Vote';

export const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'Renovasi Taman Bermain Anak',
    description: 'Usulan untuk merenovasi taman bermain anak di area cluster dengan menambah fasilitas baru dan memperbaiki yang sudah ada.',
    category: 'facility',
    options: [
      { id: '1a', text: 'Setuju dengan renovasi penuh', votes: 45 },
      { id: '1b', text: 'Renovasi sebagian saja', votes: 23 },
      { id: '1c', text: 'Tidak perlu renovasi', votes: 8 }
    ],
    startDate: '2025-01-01',
    endDate: '2025-01-15',
    totalVotes: 76,
    status: 'active',
    createdBy: 'Pengurus RT 05',
    allowMultiple: false
  },
  {
    id: '2',
    title: 'Sistem Keamanan 24 Jam',
    description: 'Proposal implementasi sistem keamanan 24 jam dengan penambahan CCTV dan pos jaga malam.',
    category: 'security',
    options: [
      { id: '2a', text: 'Sangat mendukung', votes: 52 },
      { id: '2b', text: 'Mendukung dengan syarat', votes: 18 },
      { id: '2c', text: 'Kurang mendukung', votes: 5 },
      { id: '2d', text: 'Tidak mendukung', votes: 2 }
    ],
    startDate: '2024-12-20',
    endDate: '2025-01-10',
    totalVotes: 77,
    status: 'active',
    createdBy: 'Ketua RW 02',
    allowMultiple: false
  },
  {
    id: '3',
    title: 'Perayaan Tahun Baru Cluster',
    description: 'Pilihan konsep perayaan tahun baru bersama warga cluster. Acara akan diadakan di lapangan utama.',
    category: 'event',
    options: [
      { id: '3a', text: 'Konser musik live', votes: 34 },
      { id: '3b', text: 'Bazaar kuliner', votes: 28 },
      { id: '3c', text: 'Games dan doorprize', votes: 31 },
      { id: '3d', text: 'Pertunjukan seni tradisional', votes: 15 }
    ],
    startDate: '2024-12-15',
    endDate: '2024-12-30',
    totalVotes: 108,
    status: 'ended',
    createdBy: 'Panitia Acara',
    allowMultiple: true
  },
  {
    id: '4',
    title: 'Jadwal Pengangkutan Sampah',
    description: 'Penyesuaian jadwal pengangkutan sampah untuk efisiensi dan kebersihan lingkungan cluster.',
    category: 'maintenance',
    options: [
      { id: '4a', text: 'Senin, Rabu, Jumat', votes: 0 },
      { id: '4b', text: 'Selasa, Kamis, Sabtu', votes: 0 },
      { id: '4c', text: 'Setiap hari kecuali Minggu', votes: 0 }
    ],
    startDate: '2025-01-20',
    endDate: '2025-02-05',
    totalVotes: 0,
    status: 'upcoming',
    createdBy: 'Pengurus Kebersihan',
    allowMultiple: false
  }
];