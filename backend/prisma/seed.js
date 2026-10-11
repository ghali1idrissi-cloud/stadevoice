const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  // Nettoyage de la base de données
  await prisma.lostItem.deleteMany();
  await prisma.pointOfInterest.deleteMany();
  await prisma.faqKnowledge.deleteMany();
  console.log('Base de données nettoyée.');

  // Points d'Intérêt (POI)
  const pois = await Promise.all([
    prisma.pointOfInterest.create({
      data: { name: 'Toilettes Tribune Nord', category: 'TOILET', status: 'FLUID', waitTimeMinutes: 2 }
    }),
    prisma.pointOfInterest.create({
      data: { name: 'Toilettes Tribune Sud', category: 'TOILET', status: 'BUSY', waitTimeMinutes: 8 }
    }),
    prisma.pointOfInterest.create({
      data: { name: 'Buvette Porte C', category: 'WATER', status: 'FULL', waitTimeMinutes: 15 }
    }),
    prisma.pointOfInterest.create({
      data: { name: 'Point Eau Secteur A', category: 'WATER', status: 'FLUID', waitTimeMinutes: 1 }
    }),
    prisma.pointOfInterest.create({
      data: { name: 'Sortie Porte D', category: 'EXIT', status: 'FLUID', waitTimeMinutes: 0 }
    }),
    prisma.pointOfInterest.create({
      data: { name: 'Sortie Porte E', category: 'EXIT', status: 'BUSY', waitTimeMinutes: 5 }
    }),
    prisma.pointOfInterest.create({
      data: { name: 'Infirmerie Principale', category: 'FIRST_AID', status: 'FLUID', waitTimeMinutes: 3 }
    }),
    prisma.pointOfInterest.create({
      data: { name: 'Poste de Secours Secteur B', category: 'FIRST_AID', status: 'BUSY', waitTimeMinutes: 10 }
    })
  ]);
  console.log(`${pois.length} points d'intérêt créés.`);

  // Objets Perdus
  const items = await Promise.all([
    prisma.lostItem.create({
      data: { title: 'Écharpe du Maroc', description: 'Écharpe rouge et verte, oubliée sur le siège', status: 'LOST', location: 'Tribune Est, Rang 12', contactInfo: '0600000001' }
    }),
    prisma.lostItem.create({
      data: { title: 'Téléphone iPhone 15', description: 'iPhone noir avec coque bleue', status: 'FOUND', location: 'Toilettes Nord', contactInfo: 'Accueil Sécurité' }
    }),
    prisma.lostItem.create({
      data: { title: 'Sac à dos noir', description: 'Sac à dos Nike contenant des clés', status: 'LOST', location: 'Buvette Centrale', contactInfo: 'ahmed@email.com' }
    }),
    prisma.lostItem.create({
      data: { title: 'Lunettes de soleil', description: 'Lunettes Ray-Ban', status: 'FOUND', location: 'Sortie D', contactInfo: 'Poste Info' }
    }),
    prisma.lostItem.create({
      data: { title: 'Casquette', description: 'Casquette de la Coupe du Monde 2030', status: 'LOST', location: 'Secteur Vip', contactInfo: '0600000002' }
    })
  ]);
  console.log(`${items.length} objets perdus/trouvés créés.`);

  // FAQ
  const faqs = await Promise.all([
    prisma.faqKnowledge.create({
      data: { question: 'Quel est le mot de passe du WiFi ?', answer: 'Le WiFi gratuit du stade s\'appelle "StadeVoice_Free" et ne nécessite pas de mot de passe.', tags: 'wifi, internet, connexion' }
    }),
    prisma.faqKnowledge.create({
      data: { question: 'Est-il permis de fumer dans le stade ?', answer: 'Non, le stade est un espace 100% non-fumeur. Des zones fumeurs sont disponibles uniquement à l\'extérieur des portes principales.', tags: 'fumer, cigarette, tabac, règles' }
    }),
    prisma.faqKnowledge.create({
      data: { question: 'Puis-je apporter mon sac à dos ?', answer: 'Seuls les petits sacs de moins de 15L (format A4) sont autorisés. Les grands sacs doivent être laissés aux consignes.', tags: 'sac, bagage, sécurité' }
    }),
    prisma.faqKnowledge.create({
      data: { question: 'À quelle heure ouvrent les portes ?', answer: 'Les portes ouvrent 3 heures avant le coup d\'envoi de chaque match de la Coupe du Monde.', tags: 'horaire, ouverture, porte, match' }
    }),
    prisma.faqKnowledge.create({
      data: { question: 'Où se trouvent les consignes ?', answer: 'Les consignes sont situées à l\'extérieur du stade, près des Portes A et E.', tags: 'consigne, sac, extérieur' }
    }),
    prisma.faqKnowledge.create({
      data: { question: 'Comment payer aux buvettes ?', answer: 'Les buvettes acceptent le paiement par carte bancaire, paiement mobile, et l\'application officielle du stade. Le cash n\'est plus accepté.', tags: 'paiement, buvette, argent, carte' }
    }),
    prisma.faqKnowledge.create({
      data: { question: 'Où trouver de l\'eau potable ?', answer: 'Des fontaines d\'eau potable gratuites sont réparties dans tous les secteurs du stade, près des sanitaires.', tags: 'eau, soif, boire, gratuit' }
    }),
    prisma.faqKnowledge.create({
      data: { question: 'Que faire en cas d\'urgence médicale ?', answer: 'Signalez-le immédiatement au stadier le plus proche. Des postes de secours (infirmeries) sont présents dans chaque secteur.', tags: 'urgence, médical, docteur, secours' }
    })
  ]);
  console.log(`${faqs.length} questions FAQ créées.`);

  console.log('Seeding terminé avec succès.');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
