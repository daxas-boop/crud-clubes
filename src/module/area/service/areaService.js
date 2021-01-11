const Area = require('../entity/area');
const AreaNotDefinedError = require('./error/areaNotDefinedError');
const AreaIdNotDefinedError = require('./error/areaIdNotDefinedError');

module.exports = class AreaService {
  constructor(areaRepository) {
    this.areaRepository = areaRepository;
  }

  async getAll() {
    return this.areaRepository.getAll();
  }

  async getById(id) {
    if (!id) {
      throw new AreaIdNotDefinedError();
    }
    return this.areaRepository.getById(id);
  }

  async save(area) {
    if (!(area instanceof Area)) {
      throw new AreaNotDefinedError();
    }
    return this.areaRepository.save(area);
  }

  async delete(area) {
    if (!(area instanceof Area)) {
      throw new AreaNotDefinedError();
    }
    return this.areaRepository.delete(area);
  }
};
