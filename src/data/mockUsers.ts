import { User } from '../types/Auth';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmad Wijaya',
    email: 'ahmad.wijaya@email.com',
    houseNumber: 'A-15',
    rt: '05',
    rw: '02',
    role: 'resident'
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@email.com',
    houseNumber: 'B-23',
    rt: '06',
    rw: '02',
    role: 'rt_head'
  },
  {
    id: '3',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    houseNumber: 'C-08',
    rt: '07',
    rw: '02',
    role: 'resident'
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@email.com',
    houseNumber: 'A-32',
    rt: '05',
    rw: '02',
    role: 'admin'
  }
];