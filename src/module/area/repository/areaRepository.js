const AbstractAreaRepository = require('./abstractAreaRepository');
const { fromModelToEntity } = require('../mapper/areaMapper');
const AreaNotFoundError = require('./error/areaNotFoundError');

module.exports = class AreaRepository extends AbstractAreaRepository {
  constructor(areaModel) {
    super();
    this.areaModel = areaModel;
  }

  async getAll() {
    const areas = await this.areaModel.findAll();
    return areas.map((areaData) => fromModelToEntity(areaData));
  }

  async getById(id) {
    const area = await this.areaModel.findByPk(id);
    if (!area) {
      throw new AreaNotFoundError(`Area with id:${id} not found`);
    }
    return fromModelToEntity(area);
  }

  async save(area) {
    const savedArea = await this.areaModel.build(area, { isNewRecord: !area.id }).save();
    return fromModelToEntity(savedArea);
  }

  async delete(area) {
    if (!area || !area.id) {
      throw new AreaNotFoundError();
    }
    return Boolean(await this.areaModel.destroy({ where: { id: area.id } }));
  }
};
