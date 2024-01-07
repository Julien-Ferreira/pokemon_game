import { prompt } from "./prompt.js";

class Pokemon {
  constructor(name, emoji, health, attack) {
    this.name = name;
    this.emoji = emoji;
    this.health = health;
    this.maxHealth = health;
    this.attack = attack;
  }

  randomAttack() {
    const randomIndex = Math.floor(Math.random() * this.attack.length);
    return this.attack[randomIndex];
  }

  logPokemon() {
    console.log(`Pokemon : ${this.name} ${this.emoji}
    Health : ${this.health}
    Attacks : `);
    this.logAttacks();
  }

  logAttacks() {
    this.attack.forEach((atk) => {
      atk.logAttack();
    });
  }

  getHealth() {
    let health = "";
    let healthCopy = this.health;
    for (let i = 0; i < 10; i++) {
      health += healthCopy > 0 ? "🟩" : "🟥";
      healthCopy -= this.maxHealth / 10;
    }
    return health;
  }
}

class Attack {
  constructor(name, power, stability) {
    this.name = name;
    this.power = power;
    this.stability = stability;
  }

  performAttack() {
    const stabilityPowerRemove =
      Math.floor(Math.random() * this.power) * (1 - this.stability);
    return this.power - stabilityPowerRemove;
  }

  logAttack() {
    console.log(
      `${this.name} - Power : ${this.power} - Stability : ${this.stability}`
    );
  }
}

const pikachu = new Pokemon("Pikachu", "⚡️", 100, [
  new Attack("Thunderbolt", 30, 0.2),
  new Attack("Electro Ball", 20, 0.4),
  new Attack("Quick Attack", 10, 0.8),
]);

const bulbasaur = new Pokemon("Bulbasaur", "🍃", 110, [
  new Attack("Vine Whip", 25, 0.3),
  new Attack("Seed Bomb", 20, 0.5),
  new Attack("Tackle", 10, 0.8),
]);

const charmander = new Pokemon("Charmander", "🔥", 90, [
  new Attack("Flamethrower", 35, 0.2),
  new Attack("Ember", 25, 0.3),
  new Attack("Scratch", 15, 0.75),
]);

const wait5Sec = async () => {
  await new Promise((resolve) => {
    let i = 0;

    const interval = setInterval(() => {
      i++;
      if (i === 5) {
        clearInterval(interval);
        resolve("");
      }
      console.log(`... ${i}`);
    }, 1000);
  });
};

class Game {
  static POKEMONS = [pikachu, bulbasaur, charmander];

  constructor() {
    this.opponentPokemon = Game.POKEMONS[0];
  }

  start() {
    this.playerPokemon = this.choosePokemon();
    this.opponentPokemon = Game.POKEMONS.filter(
      (p) => p !== this.playerPokemon
    )[Math.floor(Math.random() * (Game.POKEMONS.length - 1))];

    this.battle();
  }

  logBattle() {
    console.log(`---
    Battle : 
    

    ${this.playerPokemon.getHealth()}
    ${this.playerPokemon.name} ${this.playerPokemon.emoji}
    
    VS
    
    ${this.opponentPokemon.getHealth()}
    ${this.opponentPokemon.name} ${this.opponentPokemon.emoji}
    
    `);
  }

  async battle() {
    this.logBattle();

    if (this.playerPokemon.health <= 0 || this.opponentPokemon?.health <= 0) {
      this.finish();
      return;
    }

    this.playerPokemon.logAttacks();
    const attackChoice = Number(prompt("Choose your attack -->"));
    if (attackChoice < 1 || attackChoice > 3 || isNaN(attackChoice)) {
      console.log("Please choose a number between 1 and 3 ");
      return this.battle();
    }

    const playerAttack = this.playerPokemon.attack[attackChoice - 1];
    const playerAttackDamage = playerAttack.performAttack();
    const opponentAttack = this.opponentPokemon.randomAttack();
    const opponentAttackDamage = opponentAttack.performAttack();

    console.log(
      `Player use ${playerAttack.name} and made ${playerAttackDamage} damage and opponent use ${opponentAttack.name} and made ${opponentAttackDamage} damage`
    );

    this.opponentPokemon.health -= playerAttackDamage;
    this.playerPokemon.health -= opponentAttackDamage;

    await wait5Sec();
    this.battle();
  }

  finish() {
    if (this.opponentPokemon?.health <= 0) {
      console.log(
        `${this.opponentPokemon.name} is out of health, ${this.playerPokemon.name} WON !! `
      );
    } else
      console.log(
        `${this.playerPokemon.name} is out of health, ${this.opponentPokemon.name} WON !! `
      );
  }

  choosePokemon() {
    const userChoice = Number(
      prompt(
        "Choose your Pokemon: \n1- Pikachu ⚡️ \n2- Bulbasaure 🍃 \n3- Charmander 🔥 \n -->"
      )
    );

    if (userChoice > 3 || userChoice < 1 || isNaN(userChoice)) {
      console.log("Please choose a number between 1 and 3 ");
      return this.choosePokemon();
    }

    return Game.POKEMONS[userChoice - 1];
  }
}

const game = new Game();
game.start();
