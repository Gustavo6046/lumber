import { v4 as uuidv4 } from 'uuid';

/**
 * A single unit ingame. For example,
 * a villager.
 */
module.exports = class Unit {
    /**
     * Creates an instance of Unit.
     * 
     * @constructor
     * @param {Game} game The game this unit shall be part of.
     * @param {string} type The type of this unit. Should be a valid index into game.types.
     * @param {string} id The ID of this unit. Does not need to exist; make sure to register() once you are done setting this unit up!
     */
    constructor(game, type, id) {
        /** @private */ this.game = game;

        if (id == null) {
            this.id = uuidv4();
        }

        else {
            this.id = id;
        }

        this.typename = type;

        this.pos = [0, 0];
        this.state = 'spawn';
        this.owner = null; // null by default, aka Gaia, aka 
        this.props = {}; // properties of this Unit.

        this.updateType();

        this.type.initialize(this);
    }

    /**
     * Sets the owner of this Unit. It should be a valid Player
     * in the unit's Game.
     * 
    * @param {string} name The name of this Unit's owner.
     */
    setOwner(name) {
        this.owner = name;
    }

    /**
     * Retrieves the owner of this Unit. Units without an owner
     * are implicitly owned by the Gaia of this unit's Game (game.gaia).
     */
    getOwner() {
        return this.game.players.get(this.owner);
    }

    /**
     * Sets the type for this Unit, .
     * @param {string} name The name of the new type.
     */
    setType(name) {
        this.typename = name;
        this.updateType();

        // reset the state
        this.state = 'spawn';
    }

    /**
     * Sets this unit to a new state, overriding existing
     * state changes (state.maybeNextState).
     * 
     * @param {string} name The name of the new state to set.
     */
    setState(name) {
        this.state = newState;
    }

    /**
     * Checks for and updates the type of an Unit, should the
     * typename be changed.
     * 
     * @returns {Object} The type found while updating, or null if it does not need updating.
     */
    updateType() {
        if (this.type.name == this.typename) return null;

        return this.type = this.game.types.get(this.typename);
    }

    /**
     * Sets the position of this unit to a new value.
     * 
     * @param {number} x The X coordinate of the new position.
     * @param {number} y The Y coordinate of the new position.
     */
    setPos(x, y) {
        this.pos[0] = x;
        this.pos[1] = y;
    }
    
    /**
     * Gets the X coordinate of the position of this unit.
     * @returns {number}
     */
    getX() {
        return this.pos[0];
    }

    /**
     * Gets the Y coordinate of the position of this unit.
     * @returns {number}
     */
    getY() {
        return this.pos[1];
    }

    /**
     * Gets a copy of the Gets the XY scoordinate of this unit's position.
     * Modifying this array will not modify the original position,
     * stored in the actual unit.
     * 
     * @returns {Array}
     */
    getXY() {
        return Array.from(this.pos);
    }

    /**
     * Performs a tick on this unit.
     */
    tick() {
        let newState = this.type.maybeNextState(this);

        if (newState != null) {
            this.state = newState;
        }

        this.type.states[this.state].tick(this);
    }

    updateChunk() {
        let chunk = this.game.chunks.getChunkOfPos(this.getXY());

        if (this._lastChunk != null && this._lastChunk !== chunk) {
            this._lastChunk.delete(this.id);
            this._lastChunk = chunk;
        }
    }

    /**
     * Registers this unit into the game set to it.
     */
    register() {
        this.game.units.set(this.id, this);
        this.getOwner().units.set(this.id, this);

        this.updateChunk();
    }
}
