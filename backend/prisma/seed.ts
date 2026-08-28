import { PrismaClient, UserRole, MovieCategory, EventStatus, MatchStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@tikets.com';
  const adminPassword = 'demo1234';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
    },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
    },
  });

  const adminPasswordValid = await bcrypt.compare(adminPassword, admin.passwordHash);
  if (!adminPasswordValid) {
    throw new Error(`Admin seed verification failed for ${admin.email}.`);
  }

  const movie1 = await prisma.movieEvent.upsert({
    where: { id: 'movie-1' },
    update: {},
    create: {
      id: 'movie-1',
      title: 'La sombra de la luna',
      synopsis: 'Un thriller emocional situado en la costa.',
      duration: 112,
      category: MovieCategory.CINE,
      posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
      trailerUrl: 'https://example.com/trailer1',
      rating: 8.9,
      status: EventStatus.NOW_SHOWING,
    },
  });

  const movie2 = await prisma.movieEvent.upsert({
    where: { id: 'movie-2' },
    update: {},
    create: {
      id: 'movie-2',
      title: 'Sonora de humo',
      synopsis: 'Una noche de jazz y electrónica en la sala principal.',
      duration: 95,
      category: MovieCategory.CONCIERTO,
      posterUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
      trailerUrl: 'https://example.com/trailer2',
      rating: 9.1,
      status: EventStatus.NOW_SHOWING,
    },
  });

  const movie3 = await prisma.movieEvent.upsert({
    where: { id: 'movie-3' },
    update: {},
    create: {
      id: 'movie-3',
      title: 'La última línea',
      synopsis: 'Una pieza contemporánea sobre corrupción y culpa.',
      duration: 130,
      category: MovieCategory.TEATRO,
      posterUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
      trailerUrl: 'https://example.com/trailer3',
      rating: 8.7,
      status: EventStatus.COMING_SOON,
    },
  });

  const room = await prisma.room.upsert({
    where: { id: 'room-1' },
    update: {},
    create: {
      id: 'room-1',
      name: 'Sala 1',
      capacity: 64,
      seatLayout: { rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], columns: 8 },
    },
  });

  // Estadios de Ecuador
  const stadiumQuito = await prisma.stadium.upsert({
    where: { id: 'stadium-quito-001' },
    update: {},
    create: {
      id: 'stadium-quito-001',
      name: 'Estadio Olímpico Atahualpa',
      city: 'Quito',
      capacity: 8000,
      seatLayout: { rows: Array.from({ length: 20 }, (_, i) => String.fromCharCode(65 + i)), columns: 40 },
      sectors: {
        create: [
          { name: 'Occidental', code: 'OCC', capacity: 2000, price: 25, seatLayout: { rows: ['A', 'B', 'C', 'D', 'E'], columns: 40 } },
          { name: 'Oriental', code: 'ORI', capacity: 2000, price: 25, seatLayout: { rows: ['F', 'G', 'H', 'I', 'J'], columns: 40 } },
          { name: 'Norte', code: 'NOR', capacity: 2000, price: 15, seatLayout: { rows: ['K', 'L', 'M', 'N', 'O'], columns: 40 } },
          { name: 'Sur', code: 'SUR', capacity: 2000, price: 15, seatLayout: { rows: ['P', 'Q', 'R', 'S', 'T'], columns: 40 } },
        ],
      },
    },
    include: { sectors: true },
  });

  const stadiumGuayaquil = await prisma.stadium.upsert({
    where: { id: 'stadium-guayaquil-001' },
    update: {},
    create: {
      id: 'stadium-guayaquil-001',
      name: 'Monumental Banco Pichincha',
      city: 'Guayaquil',
      capacity: 8500,
      seatLayout: { rows: Array.from({ length: 22 }, (_, i) => String.fromCharCode(65 + i)), columns: 38 },
      sectors: {
        create: [
          { name: 'VIP Sur', code: 'VIP_S', capacity: 2500, price: 45, seatLayout: { rows: ['A', 'B', 'C', 'D', 'E', 'F'], columns: 40 } },
          { name: 'Preferencial Norte', code: 'PREF_N', capacity: 2000, price: 30, seatLayout: { rows: ['G', 'H', 'I', 'J', 'K'], columns: 40 } },
          { name: 'General Este', code: 'GEN_E', capacity: 2000, price: 18, seatLayout: { rows: ['L', 'M', 'N', 'O', 'P'], columns: 40 } },
          { name: 'General Oeste', code: 'GEN_O', capacity: 2000, price: 18, seatLayout: { rows: ['Q', 'R', 'S', 'T', 'U'], columns: 40 } },
        ],
      },
    },
    include: { sectors: true },
  });

  const stadiumCapwell = await prisma.stadium.upsert({
    where: { id: 'stadium-capwell-001' },
    update: {},
    create: {
      id: 'stadium-capwell-001',
      name: 'Estadio Capwell',
      city: 'Guayaquil',
      capacity: 7500,
      seatLayout: { rows: Array.from({ length: 20 }, (_, i) => String.fromCharCode(65 + i)), columns: 37 },
      sectors: {
        create: [
          { name: 'Tribuna Local', code: 'TRIB_L', capacity: 2000, price: 28, seatLayout: { rows: ['A', 'B', 'C', 'D', 'E'], columns: 40 } },
          { name: 'Tribuna Visitante', code: 'TRIB_V', capacity: 1500, price: 28, seatLayout: { rows: ['F', 'G', 'H', 'I'], columns: 37 } },
          { name: 'Preferencial', code: 'PREF', capacity: 2000, price: 22, seatLayout: { rows: ['J', 'K', 'L', 'M', 'N'], columns: 40 } },
          { name: 'General', code: 'GEN', capacity: 2000, price: 12, seatLayout: { rows: ['O', 'P', 'Q', 'R', 'S'], columns: 40 } },
        ],
      },
    },
    include: { sectors: true },
  });

  const stadiumAmbato = await prisma.stadium.upsert({
    where: { id: 'stadium-ambato-001' },
    update: {},
    create: {
      id: 'stadium-ambato-001',
      name: 'Estadio Moreno Martínez',
      city: 'Ambato',
      capacity: 6000,
      seatLayout: { rows: Array.from({ length: 15 }, (_, i) => String.fromCharCode(65 + i)), columns: 40 },
      sectors: {
        create: [
          { name: 'Preferencial', code: 'PREF', capacity: 2000, price: 20, seatLayout: { rows: ['A', 'B', 'C', 'D', 'E'], columns: 40 } },
          { name: 'General Norte', code: 'GEN_N', capacity: 2000, price: 10, seatLayout: { rows: ['F', 'G', 'H', 'I', 'J'], columns: 40 } },
          { name: 'General Sur', code: 'GEN_S', capacity: 2000, price: 10, seatLayout: { rows: ['K', 'L', 'M', 'N', 'O'], columns: 40 } },
        ],
      },
    },
    include: { sectors: true },
  });

  const now = new Date();

  // Funciones de cine
  await prisma.showtime.upsert({
    where: { id: 'show-001' },
    update: {},
    create: {
      id: 'show-001',
      movieId: movie1.id,
      roomId: room.id,
      startTime: new Date(now.getTime() + 1000 * 60 * 60 * 4),
      price: 16.5,
      availableSeats: 64,
    },
  });

  await prisma.showtime.upsert({
    where: { id: 'show-002' },
    update: {},
    create: {
      id: 'show-002',
      movieId: movie2.id,
      roomId: room.id,
      startTime: new Date(now.getTime() + 1000 * 60 * 60 * 26),
      price: 24,
      availableSeats: 64,
    },
  });

  await prisma.showtime.upsert({
    where: { id: 'show-003' },
    update: {},
    create: {
      id: 'show-003',
      movieId: movie3.id,
      roomId: room.id,
      startTime: new Date(now.getTime() + 1000 * 60 * 60 * 50),
      price: 18,
      availableSeats: 64,
    },
  });

  // Partidos de Ecuador - Clásicos del fútbol ecuatoriano
  await prisma.match.upsert({
    where: { id: 'match-001' },
    update: {},
    create: {
      id: 'match-001',
      stadiumId: stadiumQuito.id,
      homeTeam: 'LDU Quito',
      awayTeam: 'Barcelona SC',
      startTime: new Date(now.getTime() + 1000 * 60 * 60 * 48),
      status: MatchStatus.SCHEDULED,
    },
  });

  await prisma.match.upsert({
    where: { id: 'match-002' },
    update: {},
    create: {
      id: 'match-002',
      stadiumId: stadiumGuayaquil.id,
      homeTeam: 'Emelec',
      awayTeam: 'El Nacional',
      startTime: new Date(now.getTime() + 1000 * 60 * 60 * 72),
      status: MatchStatus.SCHEDULED,
    },
  });

  await prisma.match.upsert({
    where: { id: 'match-003' },
    update: {},
    create: {
      id: 'match-003',
      stadiumId: stadiumCapwell.id,
      homeTeam: 'CS Emelec',
      awayTeam: 'Independiente del Valle',
      startTime: new Date(now.getTime() + 1000 * 60 * 60 * 96),
      status: MatchStatus.SCHEDULED,
    },
  });

  await prisma.match.upsert({
    where: { id: 'match-004' },
    update: {},
    create: {
      id: 'match-004',
      stadiumId: stadiumAmbato.id,
      homeTeam: 'Técnico Universitario',
      awayTeam: 'Macará',
      startTime: new Date(now.getTime() + 1000 * 60 * 60 * 120),
      status: MatchStatus.SCHEDULED,
    },
  });

  console.log('Seed ok:', {
    admin: admin.email,
    movies: [movie1.title, movie2.title, movie3.title],
    stadiums: ['Quito', 'Guayaquil (Monumental)', 'Guayaquil (Capwell)', 'Ambato'],
    matches: 4,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
