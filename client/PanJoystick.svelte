<script>
    import { onMount } from "svelte";


    export let panXY = {
        x: 0,
        y: 0,
    };

    let start = {
        x: 0,
        y: 0,
    };

    let _lastPanPos;
    let status;
    let paused = false;

    export let panning = false;

    let joystickBase = null;
    let joystickHead = null;

    let center = {
        x: 0,
        y: 0
    };

    function updateSizes() {
        let headBounds = joystickHead.getBoundingClientRect();
        let headRadius = (headBounds.bottom - headBounds.top) / 2;

        center.x = joystickBase.clientWidth / 2 - headRadius;
        center.y = joystickBase.clientHeight / 2 - headRadius;

        center.maxRad = Math.pow(center.x - headRadius, 2) + Math.pow(center.y - headRadius, 2);
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

        if (panning) {
            headPos.x += panXY.x;
            headPos.y += panXY.y;
        }

        joystickHead.style.left = headPos.x + 'px';
        joystickHead.style.top  = headPos.y + 'px';

        if (!panning) {
            joystickBase.style.backgroundColor = `rgb(20, 20, 20)`;
            joystickBase.style.boxShadow = 'rgb(0, 0, 0, 80) 0px 0px 4px 2px';
        }
    }

    function joystickStop(why, e) {
        panning = false;

        panXY.x = 0;
        panXY.y = 0;

        updateHead();
    }

    function joystickPause(resume) {
        if (panning) {
            paused = !resume;

            updateHead();
        }
    }

    function joystickStart(why, e) {
        panning = true;

        panXY.x = 0;
        panXY.y = 0;

        start.x = e.clientX;
        start.y = e.clientY;

        updateHead();
    }

    function joystickMove(e) {
        if (panning) {
            if (!paused) {
                panXY.x = e.clientX - start.x;
                panXY.y = e.clientY - start.y;

                // prevent joystick head from going past boundary
                let dist = Math.pow(panXY.x, 2) + Math.pow(panXY.y, 2);

                if (dist > center.maxRad) {
                    joystickPause(false);
                    return;
                }

                else {
                    // set the redness of the base accordingly to the 'danger'
                    let danger = dist / center.maxRad;

                    joystickBase.style.backgroundColor = `rgb(${Math.round(20 + danger * 40)}, 20, ${Math.round(30 - danger * 15)})`;
                    joystickBase.style.boxShadow = `rgb(${Math.round(danger * 70)}, ${Math.round(danger * 40)}, ${Math.round(30 - danger * 25)}, 80) 0px 0px 4px 3px`;
                }
            }
            
            updateHead();
        }
    }
</script>

<style>
    .joystick-base {
        margin: 5px;
        background-color: #555;
        border-radius: 100%;
        display: inline-block;
        padding: 50px;
        position: relative;
        box-shadow: #00000078 0px 0px 4px 2px;
        box-sizing: border-box;

        -moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none; -o-user-select:none;
    }

    .joystick-head {
        margin: 0px;
        border-radius: 50%;
        width: 10%;
        height: 10%;
        position: absolute;
        display: inline-block;
        padding: 8px;
    }
</style>

{#if panning}
    <style>
        .joystick-head {
            background-color: #9af;
            box-shadow: #9afe 0px 0px 1px 2px;
        }
    </style>
{:else}
    <style>
        .joystick-head {
            background-color: #999;
            box-shadow: #999b 0px 0px 1px 2px;
        }

        .joystick-base:hover > .joystick-head {
            background-color: #a99;
            box-shadow: #a99c 0px 0px 1px 2px;
        }
    </style>
{/if}

<div class="joystick-base" bind:this={joystickBase} unselectable="on"
    on:mousedown={joystickStart.bind(this, 'mousedown')}
    on:dragend={joystickStop}
    on:mouseout={joystickPause.bind(this, false)}
    on:mouseover={joystickPause.bind(this, true)}
    on:mouseup={joystickStop}
    on:mousemove={joystickMove}
>
    <div class="joystick-head" bind:this={joystickHead}>.</div>
</div>
