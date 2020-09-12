<script>
import { onMount } from 'svelte';

    import { Game, Player } from '../common';

    import Bar from './Bar.svelte';
    import GameCanvas from './GameCanvas.svelte';

    let game = new Game();
    let _canvasTick;

    let panScale = 16.0;

    let mh = {
        type:           'point',
        color:          '#5AD8',
        strongColor:    '#FFFC',
        pos:            'mouse',
    };

    let highlights = [
        mh,
    ];


    // Mouse position in canvas.
    let mouse = {
        x: 0,
        y: 0
    };

    // Camera position.
    let posXY = {
        x: 0,
        y: 0,
    };

    // Panning joystick position.
    let panXY = {
        x: 0,
        y: 0,
    };

    // Whether we are currently panning the view.
    let panning = false;
    let zooming = false;

    let zoomVel = 0;
    
    function initGame() {
        
    }

    let zoom = 2;

    let maxZoom = 3;
    let minZoom = 0.5;

    let minZoomSpeed = 2.5;
    let maxZoomSpeed = 4.0;

    function makeHighlight(type, color, pos) {
        return {
            // Whether a tile or spot under the cursor should be
            // highlighted.
            // Valid values: 'none', 'tile', 'point'
            type: type,

            // The color of the highlight.
            // Any CSS-compatible value works.
            color: color,

            // The focal position of the highlight.
            // Valid values: 'mouse', { x: number, y: number }
            pos: pos
        }
    }
    
    function onclick() {
        // Reset panning.
        panning = false;

        // [TEST]
        mh.type = (mh.type === 'tile') ? 'point' : 'tile';
    }

    function _tick(timeDelta) {
        if (panning) {
            posXY.x += panXY.x * zoom * panScale * timeDelta;
            posXY.y += panXY.y * zoom * panScale * timeDelta;
        }

        if (zooming) {
            let zoomTransformed = (zoom - minZoom) / (maxZoom - minZoom);
            let zoomSpeedScale = zoomTransformed * maxZoomSpeed + (1 - zoomTransformed) * minZoomSpeed;

            zoom += zoomVel * zoomSpeedScale * timeDelta;

            if (zoom < minZoom) {
                zoom = minZoom;
            }

            if (zoom > maxZoom) {
                zoom = maxZoom;
            }
        }

        _canvasTick(timeDelta);
    }

    onMount(() => {
        initGame();

        game.start(30, _tick);
    });
</script>


<style>
    .game-panel {
        width: 100%;
        height: 100%;
    }
</style>

<div class="game-panel">
    <GameCanvas
        game={game} highlights={highlights}
        tileSize=64 zoom={zoom} posXY={posXY}
        bind:mouse={mouse} on:click={onclick}
        bind:_tick={_canvasTick}
    ></GameCanvas>
    <Bar bind:panning={panning} bind:panXY={panXY} bind:zooming={zooming} bind:zoomVel={zoomVel} />
</div>