const AbstractController = require('../abstractController');
const AbstractControllerError = require('../error/abstractControllerError');

test('Si intentamos crear una instancia directamente de AbstractController no da un error especifico', () => {
  try {
    // eslint-disable-next-line no-new
    new AbstractController();
  } catch (e) {
    expect(e).toBeInstanceOf(AbstractControllerError);
  }
});

test('Podemos crear una instancia que herede de AbstractController', () => {
  class Controlador extends AbstractController {}
  expect(new Controlador()).toBeInstanceOf(AbstractController);
});
