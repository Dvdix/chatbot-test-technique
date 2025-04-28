import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Fonction pour lire un fichier CSV
function readCsvFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });
}

async function main() {
  try {
    // Nettoyer les tables existantes
    console.log('Nettoyage des tables existantes...');
    await prisma.$transaction([
      prisma.$executeRaw`DELETE FROM "Option"`,
      prisma.$executeRaw`DELETE FROM "Location"`,
      prisma.$executeRaw`DELETE FROM "Item"`
    ]);

    // Lire les données des fichiers CSV
    const optionsData = readCsvFile(path.join(__dirname, '../data/options.csv'));
    const locationsData = readCsvFile(path.join(__dirname, '../data/locations.csv'));
    const itemsData = readCsvFile(path.join(__dirname, '../data/items.csv'));

// Insérer les options
console.log('Insertion des options...');
for (const option of optionsData) {
  // Convert string '1'/'0' to boolean true/false
  const requiresLocations = option.requiresLocations === '1';
  const requiresItems = option.requiresItems === '1';
  
  await prisma.option.create({
    data: {
      id: crypto.randomUUID(),
      name: option.name,
      description: option.description,
      requiresLocations: requiresLocations,
      requiresItems: requiresItems
    }
  });
}

    // Insérer les lieux
    console.log('Insertion des lieux...');
    for (const location of locationsData) {
      await prisma.$executeRaw`
        INSERT INTO "Location" (id, name, type)
        VALUES (${crypto.randomUUID()}, ${location.name}, ${location.type})
      `;
    }

    // Insérer les items
    console.log('Insertion des items...');
    for (const item of itemsData) {
      await prisma.$executeRaw`
        INSERT INTO "Item" (id, name, category)
        VALUES (${crypto.randomUUID()}, ${item.name}, ${item.category})
      `;
    }

    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 