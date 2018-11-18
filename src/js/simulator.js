import $ from 'jquery';
import MersenneTwister from 'mersenne-twister';

export default class Simulator {
  constructor() {
    this.mt = new MersenneTwister();
  }
  init() {
    // bind events
    $('#execute-button').on('click', () => {
      this.onExecuteButtonClicked();
    });
    $('input[type=text]').on('focus', function () {
      this.select();
    });
  }
  onExecuteButtonClicked() {
    let params = {
      dices: parseInt($('input[name=dices]').val()),
      critical: parseInt($('input[name=critical]').val()),
      hitOffset: parseInt($('input[name=hit_offset]').val()),
      baseAttack: parseInt($('input[name=base_attack]').val()),
      trialCount: parseInt($('input[name=trial_count]').val())
    };
    if (this.validate(params)) {
      $('#simulator .status').html('Simulating...');
      // proceed async
      setTimeout(() => {
        this.show(this.simulate(params));
        $('#simulator .status').html('');
      }, 10);
    }
  }
  validate(params) {
    if (!(params.dices > 0)) {
      alert('Dices must be greater than 0.');
      return false;
    }
    if (!(params.critical > 1)) {
      alert('Critical must be greater than 1.');
      return false;
    }
    if (!(params.baseAttack >= 0)) {
      alert('Base Attack must be greater-equal than 0.');
      return false;
    }
    if (!(params.trialCount > 0)) {
      alert('Trial Count must be greater than 0.');
      return false;
    }
    return true;
  }

  exec1d10() {
    return this.mt.random_int() % 10 + 1;
  }
  isCritical(value, critical) {
    return value >= critical;
  }
  execHit(dices, critical, offset) {
    var results = [];
    for (let i = 0; i < dices; i++) {
      results.push(this.exec1d10());
    }
    let max = Math.max(...results);

    if (this.isCritical(max, critical)) {
      results = results.filter(value => this.isCritical(value, critical));
      return max + this.execHit(results.length, critical, offset);
    } else {
      return max + offset;
    }
  }
  execDamage(hitValue, baseAttack) {
    var results = [];
    let damageDices = hitValue / 10 + 1;
    for (let i = 0; i < damageDices; i++) {
      results.push(this.exec1d10());
    }
    return (results.reduce((acc, cur) => (acc + cur))) + baseAttack;
  }
  simulate(params) {
    var min = Number.MAX_VALUE, max = 0, total = 0, average = 0;
    for (let i = 0; i < params.trialCount; i++) {
      let hit = this.execHit(params.dices, params.critical, params.hitOffset);
      let result = this.execDamage(hit, params.baseAttack);
      if (min > result) { min = result }
      if (max < result) { max = result }
      total += result;
    }
    average = parseFloat(total) / parseFloat(params.trialCount);
    return { min: min, max: max, total: total, average: average };
  }
  show(result) {
    $('#result-min').html(result.min);
    $('#result-max').html(result.max);
    $('#result-average').html(result.average);
  }
}
