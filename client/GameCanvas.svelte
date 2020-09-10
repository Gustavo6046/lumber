<script>
    import { fabric } from 'fabric';


    export let game, mouse;
    export let tileSize, zoom;

    let canvas;

    // Caches Unit IDs into Fabric objects.
    let fabricCache = new Map();

    /* Canvas Rendering */

    // Camera position.
    export let posXY = {
        x: 0,
        y: 0,
    };

    // Whether a tile or spot under the cursor should be
    // highlighted.
    // Valid values: 'none', 'tile', 'point'
    export let highlight = 'none';

    // The colour of the highlight under the cursor.
    export let highlightColor = 'yellow';
    
    function getTileAt(coords) {
        return {
            x: Math.floor((coords.x + posXY.x) / tileSize * zoom),
            y: Math.floor((coords.y + posXY.y) / tileSize * zoom),
        }
    }

    function makeUnitFabricObject(u) {
        let res = new fabric.Circle({

        });

        return _initPannableFabricObj(res);
    }

    function getTileUnderMouse() {
        return getTileAt(mouse);
    }

    function updateFabricObjects() {
        fabricCache.forEach((_, key) => {
            if (!game.units.has(key)) fabricCache.delete(key);
        });

        game.units.forEach((u, key) => {
            if (!fabricCache.has(key)) fabricCache.set(key, makeUnitFabricObject(u));
        });

        fabricCache.forEach((val) => {
            _updatePannableFabricObj(val);
        });
    }

    // Add initial renderer-specific properties to a pannable Fabric object.
    function _initPannableFabricObj(o, pos) {
        o._realPos = { x: pos.x, y: pos.y };

        return o;
    }

    // Update a pannable Fabric object's renderer-specific properties
    function _updatePannableFabricObj(o) {
        o.left = (o._realPos.x - posXY.x) / zoom;
        o.top = (o._realPos.y - posXY.y) / zoom;
        o.radius = (tileSize * 0.9) * zoom;
    }

    // Makes a Fabric group of lines, to represent
    // a tile highlight.
    function makeHighlightObj(x, y, color) {

    }

    export function _tick(timeDelta) {
        updateFabricObjects();
    }
</script>

<style>
    canvas {
        background-color: #222;
        padding: 0px;
        margin: 4px;
        box-sizing: border-box;

        min-width: 70%;
        width: 100%;
        max-width: 100%;
        min-height: 50%;
        height: 70%;
        max-height: 100%;
        
        box-shadow: #ddf6 0px 0px 2px 2px;
    }
</style>

<canvas id="game-view" bind:this={canvas} on:click on:mousemove></canvas>