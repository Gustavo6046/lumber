<script>
    import { onMount } from "svelte";


    export let zoomVel = 0;

    let start = {
        x: 0,
        y: 0,
    };

    window.addEventListener('resize', () => {
        updateSizes();
        updateHead();
    });

    let _lastPanPos;
    let status;
    let paused = false;

    export let zooming = false;

    let sliderBase = null;
    let sliderHead = null;

    let maxDist;

    let center = {
        x: 0,
        y: 0
    };

    function updateSizes() {
        let headBounds = sliderHead.getBoundingClientRect();
        let headRadius = (headBounds.bottom - headBounds.top) / 2;

        let baseBounds = sliderBase.getBoundingClientRect();
        let baseW = baseBounds.right - baseBounds.left;
        let baseH = baseBounds.bottom - baseBounds.top;

        center.x = baseW / 2 - headRadius;
        center.y = baseH / 2 - headRadius;

        maxDist = center.y - headRadius - parseFloat(window.getComputedStyle(sliderBase, null).getPropertyValue('padding-top'));
    }

    onMount(() => {
        updateSizes();
        updateHead();
    });

    function updateHead() {
        let headPos = {
            x: center.x,
            y: center.y
        };

        if (zooming) {
            headPos.y += zoomVel * maxDist;
        }

        sliderHead.style.left = headPos.x + 'px';
        sliderHead.style.top  = headPos.y + 'px';

        if (!zooming) {
            sliderBase.style.backgroundColor = `rgb(20, 20, 20)`;
            sliderBase.style.boxShadow = 'rgb(0, 0, 0, 80) 0px 0px 4px 2px';
        }
    }

    function sliderStop(why, e) {
        zooming = false;
        zoomVel = 0;

        updateHead();
    }

    function sliderPause(resume) {
        if (zooming) {
            paused = !resume;

            updateHead();
        }
    }

    function sliderStart(why, e) {
        zooming = true;

        zoomVel = 0;

        start.x = e.clientX;
        start.y = e.clientY;

        updateHead();
    }

    function sliderMove(e) {
        if (zooming) {
            if (!paused) {
                zoomVel = (e.clientY - start.y) / maxDist;

                // prevent slider head from going past boundary
                let dist = Math.abs(e.clientY - start.y);

                if (dist > maxDist) {
                    sliderPause(false);
                    return;
                }

                else {
                    // set the redness of the base accordingly to the 'danger'
                    let danger = dist / maxDist;

                    sliderBase.style.backgroundColor = `rgb(${Math.round(20 + danger * 40)}, 20, ${Math.round(30 - danger * 15)})`;
                    sliderBase.style.boxShadow = `rgb(${Math.round(danger * 70)}, ${Math.round(danger * 40)}, ${Math.round(30 - danger * 25)}, 80) 0px 0px 4px 3px`;
                }
            }
            
            updateHead();
        }
    }
</script>

<style>
    .slider-base {
        margin: 5px;
        padding: 8px;
        height: 90%;
        background-color: #555;
        border-radius: 10%;
        display: inline-block;
        position: relative;
        box-shadow: #00000078 0px 0px 4px 2px;
        box-sizing: border-box;

        -moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none; -o-user-select:none;
    }

    .slider-head {
        margin: 0px;
        padding: 0px;
        border-radius: 100%;
        width: 75%;
        height: 10%;
        font-size: 50%;
        position: absolute;
        display: inline-block;
    }
</style>

{#if zooming}
    <style>
        .slider-head {
            background-color: #9af;
            box-shadow: #9afe 0px 0px 1px 2px;
        }
    </style>
{:else}
    <style>
        .slider-head {
            background-color: #999;
            box-shadow: #999b 0px 0px 1px 2px;
        }

        .slider-base:hover > .slider-head {
            background-color: #a99;
            box-shadow: #a99c 0px 0px 1px 2px;
        }
    </style>
{/if}

<div class="slider-base" bind:this={sliderBase} unselectable="on"
    on:mousedown={sliderStart.bind(this, 'mousedown')}
    on:dragend={sliderStop}
    on:mouseout={sliderPause.bind(this, false)}
    on:mouseover={sliderPause.bind(this, true)}
    on:mouseup={sliderStop}
    on:mousemove={sliderMove}
>
    <div class="slider-head" bind:this={sliderHead}>.</div>
</div>
