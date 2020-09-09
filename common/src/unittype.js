module.exports = function makeUnitType(id, name, funcs) {
    let ut = {};

    ut.id = id;
    ut.name = name;

    ut.maybeNextState = funcs.maybeNextState || function(_unit) { return null };
    ut.tick = funcs.tick || function(_unit) {};
    ut.initialize = funcs.initialize || function(_unit) {};

    return ut;
}