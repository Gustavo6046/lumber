const { Game, Unit, Player } = require('@lumberjs/common')

let game = new Game();
let player = new Player(game, 'defacto', 'Defacto');

let stoneGeneratorType = {
    maybeNextState: function(ent) { return null; },
    tick: function(ent) { ent.props.counter = (ent.props.counter || 0) + 1; if (ent.props.counter > 40) { ent.props.counter = 0; ent.getOwner().giveResources('stone', 15)} },
    initialize: function(ent) {  },
}

let stoneGenerator = new Unit(game, stoneGeneratorType);

document.title = `Lumber (Player: ${player.basicStatus()})`;

game.start(60);