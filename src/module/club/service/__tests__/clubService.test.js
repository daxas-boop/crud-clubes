const ClubService = require('../clubService');
const ClubIdNotDefinedError = require('../error/clubIdNotDefinedError');
const ClubNotDefinedError = require('../error/clubNotDefinedError');
const Club = require('../../entity/club');

const repositoryMock = {
  getAll: jest.fn(),
  getById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const serviceMock = new ClubService(repositoryMock);

test('El metodo getAll llama a getAll del repositorio 1 vez', () => {
  serviceMock.getAll();
  expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
});

test('El metodo getById llama a getById del repositorio 1 vez con el parametro pasado', () => {
  serviceMock.getById(23);
  expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
  expect(repositoryMock.getById).toHaveBeenCalledWith(23);
});

test('El metodo getById da un error especifico si no le pasamos un parametro', async () => {
  await expect(serviceMock.getById()).rejects.toThrow(ClubIdNotDefinedError);
});

test('El metodo save llama a save del repositorio 1 vez con el parametro pasado', () => {
  const mockClub = new Club({
    id: 1,
  });
  serviceMock.save(mockClub);
  expect(repositoryMock.save).toHaveBeenCalledTimes(1);
  expect(repositoryMock.save).toHaveBeenCalledWith(mockClub);
});

test('El metodo save da un error especifico cuando no le pasamos un parametro', async () => {
  await expect(serviceMock.save()).rejects.toThrow(ClubNotDefinedError);
});

test('El metodo delete llama a delete del repositorio 1 vez con el parametro pasado', () => {
  const mockClub = new Club({
    id: 1,
  });
  serviceMock.delete(mockClub);
  expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
  expect(repositoryMock.delete).toHaveBeenCalledWith(mockClub);
});

test('El metodo delete da un error especifico cuando no le pasamos una instancia de club', async () => {
  await expect(serviceMock.delete({ id: 1 })).rejects.toThrow(ClubNotDefinedError);
});
