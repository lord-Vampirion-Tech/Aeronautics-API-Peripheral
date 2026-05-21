# Swivel Bearing

<div class="doc-hero">

![icon](icons/swivel_bearing.png)

<div>

This block is used in the mod to rotate parts of structures by a specified angle, and also allows certain parts of a structure to rotate freely (the component can loosely “hang” on it).

</div>
</div>

| Operating Mode     | Description                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| Always locked      | The structure’s rotation is strictly tied to gear rotation. Does not respond to redstone signals       |
| Partially locked   | When a redstone signal is applied, the structure becomes freely rotatable; otherwise it remains locked |
| Partially unlocked | When a redstone signal is applied, the structure becomes locked; otherwise it rotates freely           |
| Always unlocked    | The structure always rotates freely. Ignores redstone signals                                          |

> 💡 Note  
> CC Tweaked functions cannot change the operating mode of this block. Only redstone signals can be applied depending on the configured mode.

---

## Block interface functions

You can connect the block to a CC Tweaked terminal like this:

```lua
local swivel_bearing = peripheral.wrap("swivel_bearing_0") -- name can be obtained when activating the block in chat
```
This is how it looks in the world (test screenshot):

![imgs](imgs/swivel_bearing_0.png) 

---

## Available functions

| Function            | Return value    | Description                                         |
| ------------------- | --------------- | --------------------------------------------------- |
| getTargetAngle()    | number (0–360°) | The target rotation angle of the bearing in degrees |
| getTargetAngleRad() | number (0–2π)   | The target rotation angle of the bearing in radians |

---

## Usage example

```lua
-- connect the block to the terminal
local swivel_bearing = peripheral.wrap("swivel_bearing_0")

-- assume the angle is set to 45 degrees

-- get angle in degrees
local angle_in_degrees = swivel_bearing.getTargetAngle()

-- get angle in radians
local angle_in_radians = swivel_bearing.getTargetAngleRad()

```
