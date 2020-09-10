// @flow

/**
 * A player partaking in the game. This is only an interface
 * containing in-game state (such as resources) and used by
 * common classes (Unit, Game etc).
 */
module.exports = class Player {
    /**
     * Creates a new instance of Player.
     * 
     * @param {Game} game The Game this Player shall pertain to.
     * @param {id} id The ID of this new Player.
     * @param {name} name The name of this new Player.
     */
    constructor(game: Game, id, name) {
        this.id = id;
        this.name = name;

        /**
         * The Game this Player pertains to.
         */
        this.game = game;

        /**
         * Amount of each resource held by this Player, by name.
         */
        this.resources = {}; // everything defaults to 0

        /**
         * Index of Units held by this Player, by ID.
         */
        this.units = new Map();
    }

    /**
     * Registers this Player to the Game, and calls Game.addedPlayer.
     */
    register() {
        this.game.players.set(this.id, this);
        this.game.addedPlayer(this);
    }

    popCount() {
        let res = 0;

        this.units.forEach((u) => {
            if (!u.props.noCount) res++;
        });

        return res;
    }

    /**
     * Give a certain amount of a certain resource to this Player.
     * 
     * @param {string} type The type of this Resource. Please use lowercase.
     * @param {number} amount The amount of this Resource to be given to this player.
     * 
     * @returns The final amount of resource held by this Player.
     */
    giveResources(type, amount) {
        if (this.resources[type] == null) {
            return this.resources[type] = amount;
        }

        else {
            return this.resources[type] += amount;
        }
    }

    /**
     * Spends a certain amount of a certain Resource.
     * 
     * No need to check with canAffordResources before calling this function; this
     * is already done within spendResources.
     * 
     * @param {string} type The type of this Resource. There are no predefinitions; the exact value depends on what other Units, Buildings etc use this resource. Please use lowercase.
     * @param {number} amount The amount of this Resource to be spent. If this value exceeds the amount actually held by the player, nothing is done.
     * 
     * @returns {boolean} True if the resources could be (and were) spent, False otherwise.
     */
    spendResources(type, amount) {
        let canAfford = this.canAffordResources(type, amount);

        if (res) {
            this.resources[type] -= amount;
        }
        
        return res;
    }

    /**
     * Checks if this player has at least a certain amount of a certain Resource.
     * 
     * @param {string} type The type of this Resource. There are no predefinitions; the exact value depends on what other Units, Buildings etc use this resource. Please use lowercase.
     * @param {number} amount The amount of this Resource to be spent. If this value exceeds the amount actually held by the player, nothing is done.
     * 
     * @returns {boolean} True if this player can afford the resources, False otherwise.
     */
    canAffordResources(type, amount) {
        return this.resources != null && this.resources[type] >= amount;
    }

    /**
     * Formats a String that succintly contains the most base status of a Player,
     * such as name, list of resources, et cetera.
     */
    basicStatus() {
        let res = this.name;
        let resources = [];

        Object.keys(this.resources).forEach((name) => {
            resources.push(`${this.resources[name]} ${name}`);
        });

        if (resources.length > 0) {
            res += ` - ${resources.join(', ')}`;
        }

        res += ` - pop: ${this.popCount()}`

        return res;
    }
}