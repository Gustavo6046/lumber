// @flow

import Player from './player';
import makeUnitType from './unittype'


/**
 * A Chunk that lies within the world
 * of a Game. Used to partition this world's
 * XY coordinates seamlessly and improve performance.
 */
class Chunk {
    constructor(xy) {
        this.pos = Array.from(xy);

        this.units = new Map();
    }
}

/**
 * The main environment of the game.
 */
module.exports = class Game {
    /**
     * Creates an instance of Game.
     */
    constructor() {
        /**
         * All Players in this Game.
         */
        this.players = new Map();

        /**
         * All Units within this Game.
         */
        this.units = new Map();

        /**
         * Chunks of the world of this Game.
         */
        this.chunks = new Map();

        /**
         * Unit types registered in this Game.
         */
        this.types = new Map();

        /**
         * The uniform size of a Chunk, as both width and height, X and Y.
         */
        this.chunkSize = 10;

        /**
         * Minimum radius around the which to spawn new Players into
         * the world of this Game.
         */
        this.minSpawnRadius = 30;

        /**
         * Maximum radius around the which to spawn new Players into
         * the world of this Game.
         */
        this.maxSpawnRadius = 50;
        
        /**
         * How much the min. and max. spawn radiuss should be increased by after
         * each player is spawned, divided by the natural logarithm of the actual
         * values prior to actually adding to them.
         */
        this.spawnRadiusIncrement = 35;

        /**
         * The default Player for an unit or building without owner.
         */
        this.gaia = new Player();

        // Set Gaia to be null so it's the default.
        this.players.set(null, this.gaia);

        // Also alias ':gaia:' to Gaia.
        this.players.set(':gaia:', this.gaia);

        /**
         * The interval ID of the _tick entrypoint,
         * or 'null' if none is running.
         */
        this.interval = null;
    }

    /**
     * Registers a Unit type to this Game.
     * @param {string} id The abbreviated id of the unit type.
     * @param {string} name The human-readable name of the unit type.
     * @param {object} funcs A set of functions expected from the unit type.
     */
    addUnitType(id, name, funcs) {
        this.types.set(id, makeUnitType(id, name, funcs));
    }

    /**
     * Gets the next spawn position around the which
     * to place the initial Units and buildings of a Player
     * in the world of this Game.
     */
    nextSpawnPos() {
        let angle = Math.random() * Math.PI * 2;
        let dist = Math.random() * (this.maxSpawnRadius - this.minSpawnRadius) + this.minSpawnRadius;

        let x = Math.cos(angle) * this.minSpawnRadius;
        let y = Math.cos(angle) * this.minSpawnRadius;
    }

    /**
     * Updates some values of this Game (such as spawn radius bounds)
     * after a Player is registered.
     */
    addedPlayer(newPlayer) {
        this.minSpawnRadius += this.spawnRadiusIncrement / Math.log(this.minSpawnRadius);
        this.maxSpawnRadius += this.spawnRadiusIncrement / Math.log(this.maxSpawnRadius);
    }

    /**
     * Get the identifier of the Chunk that contains the given XY coordinates.
     * @param {Array} xy A list with two values; namely, the X and Y coordinates whose chunk to fetch.
     * @returns {string} The identifier.
     */
    getChunkNameOfPos(xy) {
        return `${Math.floor(xy[0] / this.chunkSize)},${Math.floor(xy[1] / this.chunkSize)}`;
    }

    /**
     * Get the Chunk that contains the given XY coordinates.
     * @param {Array} xy A list with two values; namely, the X and Y coordinates whose chunk to fetch.
     */
    getChunkOfPos(xy) {
        let name = this.getChunkNameOfPos(xy);

        if (this.chunks.has(name)) {
            return this.chunks.get(name);
        }

        else {
            let c = new Chunk([Math.floor(xy[0] / this.chunkSize), Math.floor(xy[1] / this.chunkSize)]);
            this.chunks.set(name, c);
            return c;
        }
    }

    /**
     * Starts the game tick loop.
     * 
     * @param {number} tps Ticks per second.
     * 
     * @returns The JavaScript interval handle of the running loop, returned by setInterval.
     */
    start(tps, perTick) {
        if (this.interval) {
            clearInterval(this.interval);
        }

        return this.interval = setInterval(this._tick.bind(this, perTick), 1000 / tps);
    }

    /**
     * Stops the game tick loop.
     * 
     * @returns {boolean} True if there was a loop running that was stopped successfully, or False if there was none.
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            return true;
        }

        else {
            return false;
        }
    }

    _tick(_perTick) {
        let timeDelta = _perTick.lastTime;

        _perTick.lastTime = Date.now();
        timeDelta = Date.now() - timeDelta;

        timeDelta /= 1000;

        this.units.forEach((u) => {
            u.tick(timeDelta);
        });

        _perTick(timeDelta);
    }
}