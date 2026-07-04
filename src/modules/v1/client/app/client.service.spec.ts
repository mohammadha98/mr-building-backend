import { ClientService } from './client.service';

describe('ClientService', () => {
  it('creates a client without province or city relations', async () => {
    const prisma = {
      client: {
        create: jest.fn().mockResolvedValue({ id: 1 }),
      },
    } as any;

    const service = new ClientService(prisma);

    await service.create({ phone: '09981876247', key: 'ABC123', password: null } as any);

    expect(prisma.client.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          phone: '09981876247',
          key: 'ABC123',
          password: null,
          provincesId: null,
          citiesId: null,
        }),
      }),
    );
  });
});
