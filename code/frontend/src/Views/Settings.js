import { createTheme } from '@mui/material/styles';

export const allergen_list = [
    "Gluten",
    "Gluten/Weizen",
    "Gluten/Roggen",
    "Gluten/Gerste",
    "Gluten/Hafer",
    "Gluten/Dinkel",
    "Gluten/Kamut",
    "Gluten/Emmer",
    "Gluten/Einkorn",
    "Gluten/Grünkern",
    "Krebstiere",
    "Eier",
    "Fisch",
    "Erdnuss",
    "Soja",
    "Milch",
    "Schalenfrüchte",
    "Schalenfrüchte/Mandeln",
    "mit Geschmacksverstärker",
    "mit Farbstoff",
    "gewachst",
    "geschwärzt",
    "mit Phosphat",
    "mit Konservierungsstoff",
    "geschwefelt",
    "mit Antioxidationsmittel",
    "enthält eine Phenylalaninquelle",
    "mit Süßungsmittel",
    "mit einer Zuckerart und Süßungsmittel"
  ];

export const categories = ['Alcoholics', 'Non-Alcoholics', 'Food', 'Snacks', 'internal'];


export const allergenOptions = allergen_list.map(allergen => ({
    value: allergen,
    label: allergen
  }));

export const categoryOptions = categories.map(cat => ({
  value: cat,
  label: cat
}));




