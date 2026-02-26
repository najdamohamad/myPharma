import type { ImageSourcePropType } from 'react-native';

export type MedicineBoxItem = {
  id: string;
  name: string;
  strength?: string;
  expiryDate?: string | null;
  createdAt: string;
  imageSource?: ImageSourcePropType;
  scheduledDaily?: boolean;
};

const now = new Date();
const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
const expiredDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
const expiringSoon = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);

function toISOString(date: Date): string {
  return date.toISOString().split('T')[0] + 'T00:00:00.000Z';
}

export const mockMedicines: MedicineBoxItem[] = [
  {
    id: '1',
    name: 'Aspirin',
    strength: '100mg',
    expiryDate: toISOString(thirtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '2',
    name: 'Ibuprofen',
    strength: '200mg',
    expiryDate: toISOString(sixtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '3',
    name: 'Paracetamol',
    strength: '500mg',
    expiryDate: toISOString(expiredDate),
    createdAt: toISOString(new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '4',
    name: 'Vitamin D',
    strength: '1000 IU',
    expiryDate: toISOString(ninetyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '5',
    name: 'Aspirin',
    strength: '100mg',
    expiryDate: toISOString(thirtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '6',
    name: 'Antibiotic',
    strength: '250mg',
    expiryDate: toISOString(expiringSoon),
    createdAt: toISOString(new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '7',
    name: 'Calcium',
    strength: '500mg',
    expiryDate: toISOString(sixtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '8',
    name: 'Cough Syrup',
    strength: '100ml',
    expiryDate: toISOString(expiredDate),
    createdAt: toISOString(new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '9',
    name: 'Multivitamin',
    strength: 'Tablet',
    expiryDate: toISOString(ninetyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '10',
    name: 'Ibuprofen',
    strength: '400mg',
    expiryDate: toISOString(sixtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '11',
    name: 'Antihistamine',
    strength: '10mg',
    expiryDate: toISOString(expiringSoon),
    createdAt: toISOString(new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '12',
    name: 'Omega-3',
    strength: '1000mg',
    expiryDate: null,
    createdAt: toISOString(new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '13',
    name: 'Zinc',
    strength: '50mg',
    expiryDate: toISOString(ninetyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '14',
    name: 'Magnesium',
    strength: '250mg',
    expiryDate: toISOString(sixtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '15',
    name: 'Vitamin C',
    strength: '1000mg',
    expiryDate: toISOString(expiringSoon),
    createdAt: toISOString(new Date(now.getTime() - 80 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '16',
    name: 'Probiotic',
    strength: '10B CFU',
    expiryDate: toISOString(thirtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '17',
    name: 'Fish Oil',
    strength: '1000mg',
    expiryDate: toISOString(ninetyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '18',
    name: 'Melatonin',
    strength: '3mg',
    expiryDate: toISOString(sixtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '19',
    name: 'Iron',
    strength: '65mg',
    expiryDate: toISOString(expiredDate),
    createdAt: toISOString(new Date(now.getTime() - 130 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '20',
    name: 'B Complex',
    strength: 'Tablet',
    expiryDate: toISOString(sixtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 95 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '21',
    name: 'Lactase',
    strength: '9000 FCC',
    expiryDate: null,
    createdAt: toISOString(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '22',
    name: 'Coenzyme Q10',
    strength: '100mg',
    expiryDate: toISOString(ninetyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
  {
    id: '23',
    name: 'Echinacea',
    strength: '500mg',
    expiryDate: toISOString(expiringSoon),
    createdAt: toISOString(new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '24',
    name: 'Ginger Root',
    strength: '550mg',
    expiryDate: toISOString(sixtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000)),
    scheduledDaily: false,
  },
  {
    id: '25',
    name: 'Turmeric',
    strength: '500mg',
    expiryDate: toISOString(thirtyDaysFromNow),
    createdAt: toISOString(new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000)),
    scheduledDaily: true,
  },
];
