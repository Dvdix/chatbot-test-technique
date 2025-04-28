import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Route API pour récupérer toutes les options de questions
 * Méthode: GET
 * @returns Liste de toutes les options disponibles
 */
export async function GET() {
  try {
    // Récupérer toutes les options de la base de données
    const options = await prisma.option.findMany();
    
    // Retourner les options avec un statut 200 (OK)
    return NextResponse.json(options, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error);
    
    // Retourner une erreur 500 en cas d'échec
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des options' },
      { status: 500 }
    );
  }
}