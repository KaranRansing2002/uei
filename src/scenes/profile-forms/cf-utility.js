export function getRankValue(rank) {
    switch (rank) {
      case 'newbie':
        return 0;
      case 'pupil':
        return 1;
      case 'specialist':
        return 2;
      case 'expert':
        return 3;
      case 'candidate master':
        return 4;
      case 'master':
        return 5;
      case 'international master':
        return 6;
      case 'grandmaster':
        return 7;
      case 'international grandmaster':
        return 8;
      case 'legendary grandmaster':
        return 9;
      default:
        return 0;
    }
}
export function getRankName(rankValue) {
    switch (rankValue) {
      case 0:
        return 'newbie';
      case 1:
        return 'pupil';
      case 2:
        return 'specialist';
      case 3:
        return 'expert';
      case 4:
        return 'candidate master';
      case 5:
        return 'master';
      case 6:
        return 'international master';
      case 7:
        return 'grandmaster';
      case 8:
        return 'international grandmaster';
      case 9:
        return 'legendary grandmaster';
      default:
        return 'unknown';
    }
  }