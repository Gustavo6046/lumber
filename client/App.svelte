<script>
import { onMount } from 'svelte';

    import { Game, Player } from '../common';

    import Bar from './Bar.svelte';
    import GameCanvas from './GameCanvas.svelte';

    let game = new Game();
    let _canvasTick;

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

    export let zoom = 2;
    
    function onclick() {
        // Reset panning.
        panning = false;
    }
    
    function onmousemove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }

    function _tick(timeDelta) {
        if (panning) {
            posXY.x += panXY.x * zoom / 3;
            posXY.y += panXY.y * zoom / 3;
        }

        _canvasTick(timeDelta);
    }

    onMount(() => {
        game.start(30, _tick);
    });

    let canvas;
</script>


<style>
    .game-panel {
        background-color: #fff1;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: #99c6 -2px 2px 5px 1px;
    }

    .copyright-stuff {
        color: #fff3;
        font-family:Arial, Helvetica, sans-serif;
        text-align: center;
    }
</style>


<div class="game-panel">
    <GameCanvas game={game} tileSize=64 zoom={zoom} posXY={posXY} mouse={mouse} on:click={onclick} on:mousemove={onmousemove} bind:canvas={canvas} bind:_tick={_canvasTick}></GameCanvas>
    <Bar bind:panning={panning} bind:panXY={panXY} posXY={posXY} />
</div>