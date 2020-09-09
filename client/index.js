// @flow

//const { Game, Unit, Player, UnitType } = require('@lumberjs/common') // prod

const { Game, Unit, Player, UnitType } = require('../common') // test

game = new Game();
player = new Player(game, 'defacto', 'Defacto');
player.register();

game.addType('stonegen', 'Stone Generator', {
    tick: function(ent) {
        let player = ent.getOwner();

        ent.props.counter = (ent.props.counter || 0) + 1;
        
        if (ent.props.counter > 40) {
            ent.props.counter = 0;
            player.giveResources('stone', 15);
            console.log(`Added stone to player ${player.name}!`);
        }
    },
})

stoneGenerator = new Unit(game, 'stonegen');
stoneGenerator.setOwner(player);
stoneGenerator.register();

console.log('Started!');

game.start(60, function() {
    document.title = `Lumber | ${player.basicStatus()}`;
});