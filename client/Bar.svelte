<script>
    import PanJoystick from './PanJoystick.svelte';
    import ZoomSlider from './ZoomSlider.svelte';

    export let panning = false;
    export let zooming = false;

    export let panXY = {
        x: 0,
        y: 0,
    };

    export let zoomVel = 0;
</script>

<style>
    .game-bar {
        background-color: #667;
        margin: 10px;
        padding: 8px;
        box-sizing: border-box;

        min-width: 80%;
        width: 95%;
        max-width: 95%;
        left: 50%;
        margin-left: -47.5%;
        min-height: 80px;
        height: 20%;
        max-height: 20%;
        
        box-shadow: #99c6 -2px 2px 5px 1px;

        position: absolute;
        bottom: 5px;
        display: flex;
    }
</style>

<div class="game-bar">
    <PanJoystick bind:panning={panning} bind:panXY={panXY} />
    <ZoomSlider  bind:zooming={zooming} bind:zoomVel={zoomVel} />
</div>