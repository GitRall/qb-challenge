// // prisma.mock.ts
// import { PrismaClient } from '../generated/prisma';
// import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// export type MockedPrismaClient = DeepMockProxy<PrismaClient>;

// export const prismaMock: MockedPrismaClient = mockDeep<PrismaClient>();

// // Återställ mocken innan varje test
// beforeEach(() => {
//   // @ts-ignore
//   prismaMock.$reset();
// });

// // Exportera mocken och en funktion för att återställa
// export default prismaMock;