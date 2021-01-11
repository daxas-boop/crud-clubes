const Area = require('../../entity/area');
const AreaService = require('../areaService');
const AreaIdNotDefinedError = require('../error/areaIdNotDefinedError');
const AreaNotDefinedError = require('../error/areaNotDefinedError');

const repositoryMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const areaServiceMock = new AreaService(repositoryMock);

afterEach(() => {
  Object.values(repositoryMock).forEach((mockFn) => mockFn.mockClear());
});

test('El metodo getAll llama a getAll del repositorio 1 vez', async () => {
  await areaServiceMock.getAll();
  expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
});

test('El metodo getById llama a getById del repositorio 1 vez con el id pasado', async () => {
  await areaServiceMock.getById(1);
  expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
  expect(repositoryMock.getById).toHaveBeenCalledWith(1);
});

test('El metodo getById da un error especifico cuando no le pasamos id', async () => {
  await expect(areaServiceMock.getById()).rejects.toThrow(AreaIdNotDefinedError);
});

test('El metodo save llama a save del repositorio 1 vez con el area pasada', async () => {
  const areaMock = new Area({ id: 1, location: 'Argentina' });
  await areaServiceMock.save(areaMock);
  expect(repositoryMock.save).toHaveBeenCalledTimes(1);
  expect(repositoryMock.save).toHaveBeenCalledWith(areaMock);
});

test('El metodo save da un error especifico cuando no le pasamos una instancia de area', async () => {
  await expect(areaServiceMock.save({ id: 1, location: 'Argentina' })).rejects.toThrow(AreaNotDefinedError);
});

test('El metodo delete llama a delete del repositorio 1 vez con la renta pasada', async () => {
  const areaMock = new Area({ id: 1, location: 'Argentina' });
  await areaServiceMock.delete(areaMock);
  expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
  expect(repositoryMock.delete).toHaveBeenCalledWith(areaMock);
});

test('El metodo delete da un error especifico cuando no le pasamos una instancia de area', async () => {
  await expect(areaServiceMock.delete({ id: 1, location: 'Argentina' })).rejects.toThrow(AreaNotDefinedError);
});
