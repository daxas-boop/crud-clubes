const Area = require('../../entity/area');
const { fromDataToEntity, fromModelToEntity } = require('../areaMapper');

test('fromModelToEntity devuelve una entidad de Area', () => {
  expect(
    fromModelToEntity({}),
  ).toBeInstanceOf(Area);
});

test('fromDataToEntity devuelve una entidad de Area', () => {
  expect(
    fromDataToEntity({}),
  ).toBeInstanceOf(Area);
});
