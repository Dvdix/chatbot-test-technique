import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Route API pour récupérer tous les items
 * Méthode: GET
 * @returns Liste de tous les items disponibles
 */
export async function GET() {
  try {
    // Récupérer tous les items de la base de données
    const items = await prisma.item.findMany();
    
    // Retourner les items avec un statut 200 (OK)
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des items:', error);
    
    // Retourner une erreur 500 en cas d'échec
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des items' },
      { status: 500 }
    );
  }
}