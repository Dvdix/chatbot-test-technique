import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Route API pour récupérer tous les lieux
 * Méthode: GET
 * @returns Liste de tous les lieux disponibles
 */
export async function GET() {
  try {
    // Récupérer tous les lieux de la base de données
    const locations = await prisma.location.findMany();
    
    // Retourner les lieux avec un statut 200 (OK)
    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux:', error);
    
    // Retourner une erreur 500 en cas d'échec
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des lieux' },
      { status: 500 }
    );
  }
}