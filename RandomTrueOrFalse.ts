/**
 * Custom blocks for probability and logic
 */
namespace logic {

    /**
     * Randomly returns true or false (50/50 chance).
     */
    //% block="random true or false"
    export function randomBoolean(): boolean {
        // randint(0, 1) returns either 0 or 1. If it's 1, it returns true.
        return randint(0, 1) === 1;
    }
}
