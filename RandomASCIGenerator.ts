/**
 * Custom text block injection
 */
namespace text {

    /**
     * Generates a string of random ASCII characters. ASCII characters 23 to 126.
     * @param value Number of characters to generate, eg: 5
     */
    //% block="generate $value random asci characters"
    //% value.min=1 value.max=255
    export function generateRandomAscii(value: number): string {
        let random_text = ""
        for (let index = 0; index < value; index++) {
            // String.fromCharCode generates the character from the ASCII number
            random_text = "" + random_text + String.fromCharCode(randint(23, 126))
        }
        return random_text
    }
}
