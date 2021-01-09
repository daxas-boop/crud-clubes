const AreaController = require('../areaController');
const Area = require('../../entity/area');

const serviceMock = {
  getAll: jest.fn(() => Promise.resolve([])),
  getById: jest.fn(() => Promise.resolve({})),
  save: jest.fn(),
  delete: jest.fn(),
};

const controllerMock = new AreaController(serviceMock);

afterEach(() => {
  Object.values(serviceMock).forEach((mock) => mock.mockClear());
});

test('Configura las rutas de los metodos', () => {
  const app = {
    get: jest.fn(),
    post: jest.fn(),
  };
  controllerMock.configureRoutes(app);
  expect(app.get).toHaveBeenCalled();
  expect(app.post).toHaveBeenCalled();
});

test('El metodo index llama al servicio y renderea "area/views/index" con las areas y mensajes', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    session: {
      messages: ['message test'],
    },
  };

  await controllerMock.index(reqMock, { render: renderMock });

  expect(serviceMock.getAll).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('area/views/index', {
    areas: [],
    messages: ['message test'],
  });
});

test('El metodo create rendera "area/views/form"', () => {
  const renderMock = jest.fn();
  controllerMock.create({}, { render: renderMock });
  expect(renderMock).toHaveBeenCalledWith('area/views/form');
});

test('El metodo edit llama al servicio con el id parametro y renderea "area/views/form"', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    params: {
      id: 1,
    },
  };

  await controllerMock.edit(reqMock, { render: renderMock });

  expect(serviceMock.getById).toHaveBeenCalledTimes(1);
  expect(serviceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('area/views/form', {
    area: {},
  });
});

test('El metodo edit agarra el error del servicio y lo pasa a next', async () => {
  const reqMockWithoutId = {
    params: {},
  };
  const renderMock = jest.fn();
  const nextMock = jest.fn();
  const error = new Error('test');
  serviceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.edit(reqMockWithoutId, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('El metodo delete llama al servicio con el id parametro y redirecciona a "/areas"', async () => {
  const reqMock = {
    params: {
      id: 2,
    },
    session: {},
  };
  const redirectMock = jest.fn();

  await controllerMock.delete(reqMock, { redirect: redirectMock }, {});

  expect(serviceMock.getById).toHaveBeenCalledTimes(1);
  expect(serviceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
  expect(serviceMock.delete).toHaveBeenCalledTimes(1);
  expect(serviceMock.delete).toHaveBeenCalledWith({});
  expect(redirectMock).toHaveBeenCalledTimes(1);
  expect(redirectMock).toHaveBeenCalledWith('/areas');
});

test('El metodo agarra errores del servicio y los pasa a next', async () => {
  const nextMock = jest.fn();
  const error = new Error('Delete error');
  const reqMock = {
    params: {
      id: 1,
    },
  };

  serviceMock.getById.mockImplementationOnce(() => Promise.reject(error));
  await controllerMock.delete(reqMock, {}, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('El metodo save llama al servicio con el body, da un mensaje y redirecciona a "/areas"', async () => {
  const areaMock = new Area({
    id: 1,
    location: 'Argentina',
  });
  const reqMock = {
    body: areaMock,
    session: {},
  };
  const redirectMock = jest.fn();
  const nextMock = jest.fn();

  await controllerMock.save(reqMock, { redirect: redirectMock }, nextMock);

  expect(serviceMock.save).toHaveBeenCalledWith(areaMock);
  expect(redirectMock).toHaveBeenCalledWith('/areas');
  expect(reqMock.session.messages).toEqual(['Se actualizó el area con ID:1 (Argentina)']);
});

test('El metodo save da un mensaje distinto si el pasada area no tiene id', async () => {
  const areaMockWithoutId = new Area({
    location: 'Argentina',
  });
  const areaMock = new Area({
    id: 1,
    location: 'Argentina',
  });
  const reqMock = {
    params: {},
    session: {},
    body: areaMockWithoutId,
  };
  const redirectMock = jest.fn();

  serviceMock.save.mockImplementationOnce(() => Promise.resolve(areaMock));
  await controllerMock.save(reqMock, { redirect: redirectMock }, {});

  expect(serviceMock.save).toHaveBeenCalledTimes(1);
  expect(serviceMock.save).toHaveBeenCalledWith(areaMockWithoutId);
  expect(reqMock.session.messages).toEqual(['Se creó un area con ID:1 (Argentina)']);
});

test('El metodo save agarra errores del servicio  y los pasa a next', async () => {
  const nextMock = jest.fn();
  const reqMock = {
    params: {},
    session: {},
    body: {},
  };
  const redirectMock = jest.fn();
  const error = new Error('Save error');
  serviceMock.save.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.save(reqMock, { redirect: redirectMock }, nextMock);

  expect(serviceMock.save).toHaveBeenCalledTimes(1);
  expect(serviceMock.save).toHaveBeenCalledWith({});
  expect(nextMock).toHaveBeenCalledWith(error);
});
