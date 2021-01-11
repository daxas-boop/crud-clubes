const { Sequelize } = require('sequelize');
const ClubRepository = require('../clubRepository');
const ClubModel = require('../../model/clubModel');
const AreaModel = require('../../../area/model/areaModel');
const Club = require('../../entity/club');
const Area = require('../../../area/entity/area');
const ClubNotFoundError = require('../error/clubNotFoundError');
const ClubIdNotDefinedError = require('../error/clubIdNotDefinedError');

const sequelizeInstance = new Sequelize('sqlite::memory');
let repositoryMock;
let areaModelMock;

const areaMock = new Area({
  id: 1,
  location: 'Argentina',
});

const clubMock = new Club({
  name: 'Racing Club',
  shortName: 'Racing',
  tla: 'RC',
  crestUrl: './test.png',
  address: 'idk',
  phone: '4444-2321',
  website: 'www.racing.com',
  email: 'racing@socios.com',
  founded: '1913',
  clubColors: 'Celeste',
  venue: 'El cilindro',
  Area: new Area({
    id: 1,
  }),
});

beforeAll(() => {
  areaModelMock = AreaModel.setup(sequelizeInstance);
  const clubModelMock = ClubModel.setup(sequelizeInstance);
  clubModelMock.setupAssosiations(areaModelMock);
  repositoryMock = new ClubRepository(clubModelMock, areaModelMock);
});

beforeEach(async (done) => {
  await sequelizeInstance.sync({ force: true });
  done();
});

test('El metodo save crea un club cuando la entidad no tiene id', async () => {
  await areaModelMock.create(areaMock);
  const NEW_GENERATED_ID = 1;
  const newClub = await repositoryMock.save(clubMock);

  expect(newClub.id).toEqual(NEW_GENERATED_ID);
  expect(newClub.name).toEqual('Racing Club');
});

test('El metodo save actualiza un club cuando la entidad tiene id', async () => {
  await areaModelMock.create(areaMock);
  const NEW_GENERATED_ID = 1;
  const newClub = await repositoryMock.save(clubMock);
  expect(newClub.id).toEqual(NEW_GENERATED_ID);

  newClub.name = 'Rac';
  const modifiedClub = await repositoryMock.save(newClub);
  expect(modifiedClub.name).toEqual('Rac');
});

test('El metodo getById trae un club con la id pasada', async () => {
  await areaModelMock.create(areaMock);
  const NEW_GENERATED_ID = 1;
  const newClub = await repositoryMock.save(clubMock);
  expect(newClub.id).toEqual(NEW_GENERATED_ID);

  const club = await repositoryMock.getById(NEW_GENERATED_ID);
  expect(club.id).toEqual(NEW_GENERATED_ID);
  expect(club.name).toEqual('Racing Club');
});

test('El metodo getById da un error especifico si el club es inexistente', async () => {
  await expect(repositoryMock.getById(1)).rejects.toThrow(ClubNotFoundError);
});

test('El metodo getAll trae todos los clubes', async () => {
  await areaModelMock.create(areaMock);
  const NEW_GENERATED_ID = 1;
  const newClub = await repositoryMock.save(clubMock);
  expect(newClub.id).toEqual(NEW_GENERATED_ID);

  const clubs = await repositoryMock.getAll();
  const club = await repositoryMock.getById(NEW_GENERATED_ID);
  expect(clubs).toEqual([club]);
});

test('El metodo delete devuelve true cuando borramos un club satisfactoriamente', async () => {
  await areaModelMock.create(areaMock);
  const NEW_GENERATED_ID = 1;
  const newClub = await repositoryMock.save(clubMock);
  expect(newClub.id).toEqual(NEW_GENERATED_ID);

  const club = await repositoryMock.getById(NEW_GENERATED_ID);
  await expect(repositoryMock.delete(club)).resolves.toEqual(true);
});

test('El metodo delete devuelve false cuando intentamos borrar un club inexistente', async () => {
  const clubMockWithId = new Club({
    id: 1,
  });
  await expect(repositoryMock.delete(clubMockWithId)).resolves.toEqual(false);
});

test('El metodo delete da un error especifico cuando no le pasamos un club o un club sin id', async () => {
  await expect(repositoryMock.delete(clubMock)).rejects.toThrow(ClubIdNotDefinedError);
});
