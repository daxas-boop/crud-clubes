const AbstractClubRepository = require('../abstractClubRepository');
const AbstractClubRepositoryError = require('../error/abstractClubRepositoryError');

test('No se puede crear una instancia directa de AbstractClubRepository', () => {
  let repoInstance;
  try {
    repoInstance = new AbstractClubRepository();
  } catch (e) {
    expect(e).toBeInstanceOf(AbstractClubRepositoryError);
  } finally {
    expect(repoInstance).toBeUndefined();
  }
});

test('Se puede crear una instancia que herede de AbstractClubRepository', () => {
  const ConcreteRepository = class extends AbstractClubRepository {};
  const respositoryInstance = new ConcreteRepository();
  expect(respositoryInstance).toBeInstanceOf(ConcreteRepository);
  expect(respositoryInstance).toBeInstanceOf(AbstractClubRepository);
});
