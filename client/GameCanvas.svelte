<script>
    import { onMount } from 'svelte';


    export let game;
    export let tileSize, zoom;
    export let highlights;
    export let showDebugInfo = false;

    let size = {x: 0, y: 0};
    let outer;

    let canvas;

    onMount(() => {
        if (!canvas) {
            throw new Error("Could not initialize GameCanvas: canvas not found!");
        }

        canvas.addEventListener('mousemove', onmousemove);
    });

    /* Canvas Rendering */

    // Camera position.
    export let posXY = {
        x: 0,
        y: 0,
    };

    export let mouse = {
        x: 0,
        y: 0,
        valid: false
    };

    function transformFromCamera(what) {
        return {
            x: (what.x + posXY.x - size.x / 2) * zoom,
            y: (what.y + posXY.y - size.y / 2) * zoom,
        };
    }

    function transformToCamera(what) {
        return {
            x: (what.x) / zoom - posXY.x + size.x / 2,
            y: (what.y) / zoom - posXY.y + size.y / 2,
        };
    }

    function getHighlightPos(hl) {
        if (hl.pos === 'mouse') {
            return mouse.valid ? mouse : null;
        }

        else {
            return transformToCamera(hl.pos);
        }
    }

    function onmousemove(e) {
        mouse.x = e.clientX - canvas.offsetLeft;
        mouse.y = e.clientY - canvas.offsetTop;
        mouse.valid = true;
    }

    function onmouseout() {
        mouse.valid = false;
    }

    function getTileAt(coords) {
        return {
            x: Math.floor(coords.x / tileSize),
            y: Math.floor(coords.y / tileSize),
        };
    }

    function getTileBounds(tileXY, coordMod) {
        // left-top
        let tl = {
            x: tileXY.x * tileSize,
            y: tileXY.y * tileSize,
        };

        // right-bottom
        let br = {
            x: (tileXY.x + 1) * tileSize,
            y: (tileXY.y + 1) * tileSize,
        };

        // center (duh)
        let center = {
            x: (tileXY.x + 0.5) * tileSize,
            y: (tileXY.y + 0.5) * tileSize,
        };

        // optional transform
        if (coordMod) {
            tl = coordMod(tl);
            br = coordMod(br);

            center = coordMod(center);
        }

        return {
            left:   tl.x,
            right:  br.x,

            top:    tl.y,
            bottom: br.y,

            topleft: tl,
            bottomright: br,

            center: center,

            radius: 0.5 * tileSize / zoom,
            diameter: tileSize / zoom
        };
    }

    function clear(cctx) {
        cctx.clearRect(0, 0, size.x, size.y);
    }

    function drawUnits(cctx) {

    }

    function drawHighlight(cctx, hl) {
        let pos = getHighlightPos(hl);

        if (pos == null) {
            return;
        }

        function _path() {
            cctx.beginPath();

            if (hl.type === 'point') {
                cctx.arc(
                    pos.x, pos.y, 12 / zoom,
                    0, Math.PI * 2
                );

                cctx.stroke();
            }

            else if (hl.type === 'tile') {
                let bounds = getTileBounds(getTileAt(transformFromCamera(pos)), transformToCamera);

                cctx.strokeRect(bounds.left, bounds.top, bounds.diameter, bounds.diameter);
            }
        }

        cctx.strokeStyle = hl.color;

        cctx.lineWidth = 4;
        _path();

        cctx.strokeStyle = hl.strongColor;

        cctx.lineWidth = 0.5;
        _path();
    }

    function drawHighlights(cctx) {
        highlights.forEach((hl) => {
            drawHighlight(cctx, hl);
        });
    }

    function drawGame() {
        let ob = outer.getBoundingClientRect();
        let m = parseFloat(window.getComputedStyle(outer, null).getPropertyValue('padding-left')) * 2;

        canvas.width    = ob.right - ob.left - m;
        canvas.height   = ob.bottom - ob.top - m;

        let b = canvas.getBoundingClientRect();
        
        size.x  = b.right - b.left;
        size.y  = b.bottom - b.top;

        let cctx = canvas.getContext('2d');

        clear(cctx);
        drawUnits(cctx);
        drawHighlights(cctx);
    }

    export function _tick(timeDelta) {
        drawGame();
    }
</script>

<style>
    canvas {
        background-color: #121218;
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
        
        box-shadow: #ddf6 0px 0px 2px 2px;
        color: #888;
    }

    div {
        width: 100%;
        height: 70%;
        box-sizing: border-box;
        margin: 0px;
        padding: 10px;

        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
    }
</style>

<div bind:this={outer}>
    {#if showDebugInfo}
        <p>Zoom: {Math.round(100 / zoom)}% | Pos: {Math.round(posXY.x)},{Math.round(posXY.y)} | Mouse: {Math.round(mouse.x)}px,{Math.round(mouse.y)}px (real: {Math.round(transformFromCamera(mouse).x)},{Math.round(transformFromCamera(mouse).y)} - tile: {Math.round(getTileAt(transformFromCamera(mouse)).x)},{Math.round(getTileAt(transformFromCamera(mouse)).y)}) | Visual tile size: {Math.round(tileSize / zoom)}px</p>
    {/if}

    <canvas id="game-view" bind:this={canvas} on:click on:mousemove={onmousemove} on:mouseout={onmouseout}></canvas>
</div>