<script>
    import PanJoystick from './PanJoystick.svelte';

    export let panning = false;
    export let panXY = {
        x: 0,
        y: 0,
    };
</script>

<style>
    .game-bar {
        background-color: #667;
        margin: 4px;
        padding: 10px;
        box-sizing: border-box;

        min-width: 80%;
        width: 100%;
        max-width: 100%;
        min-height: 100px;
        height: 20%;
        max-height: 20%;
        
        box-shadow: #99c6 -2px 2px 5px 1px;
    }
</style>

<div class="game-bar">
    <PanJoystick bind:panning={panning} bind:panXY={panXY} />
</div>