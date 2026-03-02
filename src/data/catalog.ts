import type { ImageSourcePropType } from 'react-native';

export type CabinetItem = {
  id: string;
  name: string;
  subtitle?: string;
  statusDot?: 'blue' | 'red' | 'amber' | null;
  imageSource: ImageSourcePropType;
};

export type CatalogItem = {
  id: string;
  name: string;
  subtitle?: string;
  statusDot?: 'blue' | 'red' | 'amber' | null;
  imageSource: ImageSourcePropType;
};

const PARACETAMOL = require('../../assets/images/medicines/Paracetamol.png');
const IBUPROFENE = require('../../assets/images/medicines/Ibuprofene.png');
const RHUME = require('../../assets/images/medicines/Rhume.png');
const ANTIHISTAMINIQUE = require('../../assets/images/medicines/Antihistaminique.png');
const BOX6 = require('../../assets/images/medicines/box_6_cutout.png');

export const catalogItems: CatalogItem[] = [
  { id: 'cat-paracetamol', name: 'Paracétamol', subtitle: '500 mg', statusDot: 'blue', imageSource: PARACETAMOL },
  { id: 'cat-ibuprofene', name: 'Ibuprofène', subtitle: '200 mg', statusDot: 'red', imageSource: IBUPROFENE },
  { id: 'cat-rhume', name: 'Rhume & Grippe', subtitle: '', statusDot: 'blue', imageSource: RHUME },
  { id: 'cat-antihistaminique', name: 'Antihistaminique', subtitle: '', statusDot: 'amber', imageSource: ANTIHISTAMINIQUE },
  { id: 'cat-box', name: 'Boîte médicaments', subtitle: '', statusDot: 'red', imageSource: BOX6 },
  { id: 'cat-vitamine', name: 'Vitamine D', subtitle: '1000 IU', statusDot: 'blue', imageSource: PARACETAMOL },
];
