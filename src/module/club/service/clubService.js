module.exports = class ClubService {
  /**
   * @param {import('../repository/clubRepository')} clubRepository
   */
  constructor(clubRepository) {
    this.clubRepository = clubRepository;
  }

  async getAll() {
    return this.clubRepository.getAll();
  }
};
