# Breakout
[Atari's Breakout game][1], rendered on HTML5 &lt;canvas&gt; a la JavaScript.
[1]: https://en.wikipedia.org/wiki/Breakout_(video_game)

### [Play it here](http://robinwu9000.github.io/breakout-game/)

## Manual
### Use your left and right keys or use your mouse.
There are advantages and
disadvantages to both. The left and right keys prevent your paddle from moving
part of your paddle off the screen, so it's harder to miss the ball near the
edges. However, this allows for lesser control of ball movements, since the
ball reflects direction based off of what half of the paddle it hits. The
mouse allows you to move part of the paddle off screen, but that means your
chances of missing are increased at the edges.

### Speeding up
The game has 2 points when the ball increases speed: at the 1/3rd mark and
then 2/3rds mark. However, you can increase and decrease the speed depending
on how far from the middle of the paddle you hit the ball. Dying resets the
speed.

### Lives
You get 3 chances to clear all the blocks.
