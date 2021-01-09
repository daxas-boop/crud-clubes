const AbstractAreaRepository = require('../abstractAreaRepository');
const AbstractAreaRepositoryError = require('../error/abstractAreaRepositoryError');

test('No se puede crear una instancia directa de AbstractAreaRepository', () => {
  try {
    // eslint-disable-next-line no-new
    new AbstractAreaRepository();
  } catch (e) {
    expect(e).toBeInstanceOf(AbstractAreaRepositoryError);
  }
});

test('Se puede crear una instancia que herede de AbstractAreaRepository', () => {
  class Repository extends AbstractAreaRepository {}
  expect(new Repository()).toBeInstanceOf(AbstractAreaRepository);
});
