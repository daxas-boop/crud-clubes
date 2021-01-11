const ClubController = require('../clubController');
const Club = require('../../entity/club');
const Area = require('../../../area/entity/area');
const AreasNotFoundError = require('../error/areasNotFoundError');

const clubServiceMock = {
  getAll: jest.fn(() => Promise.resolve([])),
  getById: jest.fn(() => Promise.resolve({})),
  save: jest.fn(),
  delete: jest.fn(),
};

const areaServiceMock = {
  getAll: jest.fn(() => Promise.resolve([])),
  getById: jest.fn(() => Promise.resolve({})),
  save: jest.fn(),
  delete: jest.fn(),
};

const uploadMock = {
  single: jest.fn(),
};

const controllerMock = new ClubController(clubServiceMock, uploadMock, areaServiceMock);

afterEach(() => {
  Object.values(clubServiceMock).forEach((mockFn) => mockFn.mockClear());
  Object.values(areaServiceMock).forEach((mockFn) => mockFn.mockClear());
});

test('Configura las rutas correctamente', () => {
  const app = {
    get: jest.fn(),
    post: jest.fn(),
  };
  controllerMock.configureRoutes(app);
  expect(app.get).toHaveBeenCalled();
  expect(app.post).toHaveBeenCalled();
  expect(uploadMock.single).toHaveBeenCalled();
});

test('El metodo index llama a getAll del servicio y renderea "club/views/index" con los clubes obtenidos', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    session: {
      messages: ['Test message'],
    },
  };

  await controllerMock.index(reqMock, { render: renderMock });

  expect(clubServiceMock.getAll).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('club/views/index', {
    clubs: [],
    messages: ['Test message'],
  });
});

test('El metodo view llama a getById del servicio con la id del parametro y renderea "club/views/view"', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    session: {},
    params: { id: 1 },
  };

  await controllerMock.view(reqMock, { render: renderMock }, {});

  expect(clubServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(clubServiceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('club/views/view', {
    club: {},
  });
});

test('El metodo view captura errores del servicio y llama a next con el error', async () => {
  const renderMock = jest.fn();
  const nextMock = jest.fn();
  const reqMock = {
    session: {},
    params: { id: 1 },
  };
  const error = new Error('Service error');
  clubServiceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.view(reqMock, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('El metodo edit llama a ambos servicios y renderea "club/views/form" con el club obtenido y las areas', async () => {
  const renderMock = jest.fn();
  const reqMock = {
    session: {},
    params: { id: 1 },
  };

  await controllerMock.edit(reqMock, { render: renderMock }, {});

  expect(clubServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(clubServiceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
  expect(areaServiceMock.getAll).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('club/views/form', {
    club: {},
    areas: [],
  });
});

test('El metodo edit captura errores del servicio y llama a next con el error', async () => {
  const renderMock = jest.fn();
  const nextMock = jest.fn();
  const reqMock = {
    session: {},
    params: { id: 1 },
  };
  const error = new Error('Service error');
  clubServiceMock.getById.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.edit(reqMock, { render: renderMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('El metodo delete llama al servicio con el id parametro y redirecciona a "/clubs"', async () => {
  const redirectMock = jest.fn();
  const reqMock = {
    session: {},
    params: { id: 1 },
  };

  await controllerMock.delete(reqMock, { redirect: redirectMock }, {});

  expect(clubServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(clubServiceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
  expect(clubServiceMock.delete).toHaveBeenCalledTimes(1);
  expect(clubServiceMock.delete).toHaveBeenCalledWith({});
});

test('El metodo delete captura errores en el servicio y llama a next con el error', async () => {
  const redirectMock = jest.fn();
  const nextMock = jest.fn();
  const reqMock = {
    session: {},
    params: { id: 1 },
  };
  const error = new Error('Service error');
  clubServiceMock.getById.mockImplementation(() => Promise.reject(error));

  await controllerMock.delete(reqMock, { redirect: redirectMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('El metodo save llama al servicio con el body, da un mensaje y redirecciona a "/clubs"', async () => {
  const fileUrl = './test.png';
  const bodyMock = new Club({
    id: 1,
    name: 'Racing Club',
    shortName: undefined,
    tla: undefined,
    crestUrl: fileUrl,
    address: undefined,
    phone: undefined,
    website: undefined,
    email: undefined,
    founded: undefined,
    clubColors: undefined,
    venue: undefined,
    Area: new Area({}),
  });
  const reqMock = {
    body: bodyMock,
    file: { path: fileUrl },
    session: {},
    params: {},
  };
  const redirectMock = jest.fn();
  const next = jest.fn();

  await controllerMock.save(reqMock, { redirect: redirectMock }, next);

  expect(clubServiceMock.save).toHaveBeenCalledTimes(1);
  expect(clubServiceMock.save).toHaveBeenCalledWith(bodyMock);
  expect(reqMock.session.messages).toEqual(['El club con id 1 (Racing Club) se actualizo con exito.']);
});

test('El metodo save da un mensaje distinto si el club no tiene id', async () => {
  const fileUrl = './test.png';
  const bodyMockWithoutId = new Club({
    name: 'Independiente',
    shortName: undefined,
    tla: undefined,
    crestUrl: fileUrl,
    address: undefined,
    phone: undefined,
    website: undefined,
    email: undefined,
    founded: undefined,
    clubColors: undefined,
    venue: undefined,
    Area: new Area({}),
  });
  const bodyMock = new Club({
    id: 1,
    name: 'Independiente',
    shortName: undefined,
    tla: undefined,
    crestUrl: fileUrl,
    address: undefined,
    phone: undefined,
    website: undefined,
    email: undefined,
    founded: undefined,
    clubColors: undefined,
    venue: undefined,
    Area: new Area({}),
  });
  const reqMock = {
    body: bodyMockWithoutId,
    file: { path: fileUrl },
    session: {},
    params: {},
  };
  const redirectMock = jest.fn();
  const next = jest.fn();

  clubServiceMock.save.mockImplementationOnce(() => Promise.resolve(bodyMock));
  await controllerMock.save(reqMock, { redirect: redirectMock }, next);

  expect(clubServiceMock.save).toHaveBeenCalledTimes(1);
  expect(clubServiceMock.save).toHaveBeenCalledWith(bodyMockWithoutId);
  expect(reqMock.session.messages).toEqual(['El club con id 1 (Independiente) se creo con exito.']);
});

test('El metodo save captura errores en el servicio y llama a next con el error', async () => {
  const nextMock = jest.fn();
  const redirectMock = jest.fn();
  const reqMock = {
    body: {},
  };
  const error = new Error('Service error');
  clubServiceMock.save.mockImplementationOnce(() => Promise.reject(error));

  await controllerMock.save(reqMock, { reditect: redirectMock }, nextMock);

  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});

test('El metodo create trae todas las areas y renderea "club/views/form"', async () => {
  const renderMock = jest.fn();
  areaServiceMock.getAll.mockImplementationOnce(() => Promise.resolve([new Area({})]));

  await controllerMock.create({}, { render: renderMock }, {});

  expect(areaServiceMock.getAll).toHaveBeenCalledTimes(1);
  expect(renderMock).toHaveBeenCalledWith('club/views/form', {
    areas: [new Area({})],
  });
});

test('El metodo da un error especifico cuando no hay areas en el sistema', async () => {
  const renderMock = jest.fn();
  const nextMock = jest.fn();
  areaServiceMock.getAll.mockImplementationOnce(() => Promise.resolve([]));

  await controllerMock.create({}, { render: renderMock }, nextMock);

  const error = new AreasNotFoundError('Necesitas al menos 1 area para crear un club');
  expect(nextMock).toHaveBeenCalledTimes(1);
  expect(nextMock).toHaveBeenCalledWith(error);
});
