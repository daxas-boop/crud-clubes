const { Sequelize } = require('sequelize');
const AreaRepository = require('../areaRepository');
const AreaModel = require('../../model/areaModel');
const Area = require('../../entity/area');
const AreaNotFoundError = require('../error/areaNotFoundError');

const sequelizeInstance = new Sequelize('sqlite::memory');

let repositoryMock;

const areaMock = new Area({
  location: 'Argentina',
});

beforeAll(() => {
  const areaModelMock = AreaModel.setup(sequelizeInstance);
  repositoryMock = new AreaRepository(areaModelMock);
});

beforeEach(async (done) => {
  await sequelizeInstance.sync({ force: true });
  done();
});

test('El metodo save crea un area cuando la entidad no tiene id', async () => {
  const NEW_GENERATED_ID = 1;
  const newArea = await repositoryMock.save(areaMock);
  expect(newArea.id).toEqual(NEW_GENERATED_ID);
});

test('El metodo save actualiza el area cuando la entidad tiene id', async () => {
  const NEW_GENERATED_ID = 1;
  const newArea = await repositoryMock.save(areaMock);
  expect(newArea.id).toEqual(NEW_GENERATED_ID);

  newArea.location = 'Peru';
  const modifiedArea = await repositoryMock.save(newArea);
  expect(modifiedArea.id).toEqual(NEW_GENERATED_ID);
  expect(modifiedArea.location).toEqual('Peru');
});

test('El metodo getById trae un area con la id pasada', async () => {
  const NEW_GENERATED_ID = 1;
  const newArea = await repositoryMock.save(areaMock);
  expect(newArea.id).toEqual(NEW_GENERATED_ID);

  const area = await repositoryMock.getById(NEW_GENERATED_ID);
  expect(area.id).toEqual(newArea.id);
  expect(area.location).toEqual(newArea.location);
});

test('El metodo getById da un error especifico cuando pasamos una id inexistente', async () => {
  await expect(repositoryMock.getById(1)).rejects.toThrow(AreaNotFoundError);
});

test('El metodo getAll trae todas las areas', async () => {
  const NEW_GENERATED_ID = 1;
  const newArea = await repositoryMock.save(areaMock);
  expect(newArea.id).toEqual(NEW_GENERATED_ID);

  const area = await repositoryMock.getById(NEW_GENERATED_ID);
  await expect(repositoryMock.getAll()).resolves.toEqual([area]);
});

test('El metodo delete devuelve true cuando borramos un area existente', async () => {
  const NEW_GENERATED_ID = 1;
  const newArea = await repositoryMock.save(areaMock);
  expect(newArea.id).toEqual(NEW_GENERATED_ID);

  await expect(repositoryMock.delete(newArea)).resolves.toEqual(true);
});

test('El metodo delete devuelve false cuando pasamos un area inexistente', async () => {
  await expect(repositoryMock.delete({ id: 1 })).resolves.toEqual(false);
});

test('El metodo delete da un error especifico cuando no pasamos un area con id', async () => {
  await expect(repositoryMock.delete(areaMock)).rejects.toThrow(AreaNotFoundError);
});
