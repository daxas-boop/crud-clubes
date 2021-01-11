const { fromDataToEntity, fromModelToEntity } = require('../clubMapper');
const Club = require('../../entity/club');
const Area = require('../../../area/entity/area');

test('fromDataToEntity devuelve una entidad de Club', () => {
  expect(
    fromDataToEntity({}),
  ).toBeInstanceOf(Club);
});

test('fromModelToEntity devuelve una entidad de Club', () => {
  expect(
    fromModelToEntity({}),
  ).toBeInstanceOf(Club);
});

test('fromModelToEntity llama al segundo parametro cuando el club tiene un area', () => {
  const clubMock = new Club({
    id: 1,
    name: 'Independiente',
    shortName: undefined,
    tla: undefined,
    crestUrl: undefined,
    address: undefined,
    phone: undefined,
    website: undefined,
    email: undefined,
    founded: undefined,
    clubColors: undefined,
    venue: undefined,
    Area: new Area({}),
  });
  const mockFn = jest.fn();

  expect(fromModelToEntity(clubMock, mockFn)).toBeInstanceOf(Club);
  expect(mockFn).toHaveBeenCalledTimes(1);
});
