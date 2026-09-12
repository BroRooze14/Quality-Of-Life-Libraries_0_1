/**
 * Custom blocks for creating and managing a crash-proof 2D grid
 */
//% weight=100 color=#6a1b9a icon="\uf00a" block="Grid Storage"
namespace gridTools {
    // Internal global states mapped to names to allow multiple grids safely
    let gridData: { [key: string]: string[][] } = {};
    let gridLimits: { [key: string]: boolean } = {};
    let gridMaxCols: { [key: string]: number } = {};
    let gridMaxRows: { [key: string]: number } = {};
    let gridPlaceholders: { [key: string]: string } = {};

    /**
     * Initializes a new named grid in memory.
     * @param name The unique name of your grid container, eg: "myGrid"
     * @param cols Starting column width, eg: 5
     * @param rows Starting row height, eg: 5
     */
    //% block="initialize grid named %name || with %cols cols and %rows rows"
    //% name.defl="myGrid" cols.defl=5 rows.defl=5
    export function initGrid(name: string, cols: number = 5, rows: number = 5): void {
        gridPlaceholders[name] = ".";
        gridLimits[name] = false;
        gridMaxCols[name] = cols;
        gridMaxRows[name] = rows;

        gridData[name] = [];
        for (let y = 0; y < rows; y++) {
            let rowArray: string[] = [];
            for (let x = 0; x < cols; x++) {
                rowArray.push(".");
            }
            gridData[name].push(rowArray);
        }
    }

    /**
     * Limit the maximum allowed size of a grid.
     */
    //% block="limit size of grid %name to max columns %maxCols max rows %maxRows"
    //% name.defl="myGrid" maxCols.defl=10 maxRows.defl=10
    export function limitGridSize(name: string, maxCols: number, maxRows: number): void {
        gridLimits[name] = true;
        gridMaxCols[name] = maxCols;
        gridMaxRows[name] = maxRows;
    }

    /**
     * Set a custom default character for empty cells.
     */
    //% block="set default character for grid %name to %char"
    //% name.defl="myGrid" char.defl="."
    export function setDefaultCharacter(name: string, char: string): void {
        if (!gridData[name]) return;
        let oldPlaceholder = gridPlaceholders[name] || ".";
        gridPlaceholders[name] = char;

        let matrix = gridData[name];
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] === oldPlaceholder) {
                    matrix[y][x] = char;
                }
            }
        }
    }

    /**
     * Set a value at a specific X and Y coordinate.
     */
    //% block="in grid %name set value at x %x y %y to %value"
    //% name.defl="myGrid" x.defl=0 y.defl=0 value.defl="X"
    export function setGridValue(name: string, x: number, y: number, value: string): void {
        if (!gridData[name]) initGrid(name);

        if (x < 0 || y < 0) {
            serial.writeLine(name + " (" + x + "," + y + ") out of grid range");
            return;
        }

        if (gridLimits[name]) {
            if (x >= gridMaxCols[name] || y >= gridMaxRows[name]) {
                serial.writeLine(name + " (" + x + "," + y + ") out of grid range");
                return;
            }
        }

        // Infinite growth padding logic
        let matrix = gridData[name];
        let currentRows = matrix.length;
        let currentCols = currentRows > 0 ? matrix[0].length : 0;
        let padChar = gridPlaceholders[name] || ".";

        if (x >= currentCols) {
            for (let i = 0; i < currentRows; i++) {
                while (matrix[i].length <= x) {
                    matrix[i].push(padChar);
                }
            }
        }

        if (y >= currentRows) {
            let activeCols = matrix[0].length;
            while (matrix.length <= y) {
                let newRow: string[] = [];
                for (let i = 0; i < activeCols; i++) {
                    newRow.push(padChar);
                }
                matrix.push(newRow);
            }
        }

        gridData[name][y][x] = value;
    }

    /**
     * Get a value from a specific X and Y coordinate.
     */
    //% block="from grid %name get value at x %x y %y"
    //% name.defl="myGrid" x.defl=0 y.defl=0
    export function getGridValue(name: string, x: number, y: number): string {
        if (!gridData[name]) return "";
        let matrix = gridData[name];
        if (y >= 0 && y < matrix.length && x >= 0 && x < matrix[y].length) {
            return matrix[y][x];
        }
        return gridPlaceholders[name] || ".";
    }

    /**
     * Reset the entire grid back to empty placeholders.
     */
    //% block="reset grid %name"
    //% name.defl="myGrid"
    export function resetGrid(name: string): void {
        if (!gridData[name]) return;
        let baseRows = gridLimits[name] ? gridMaxRows[name] : 5;
        let baseCols = gridLimits[name] ? gridMaxCols[name] : 5;
        let padChar = gridPlaceholders[name] || ".";

        gridData[name] = [];
        for (let y = 0; y < baseRows; y++) {
            let rowArray: string[] = [];
            for (let x = 0; x < baseCols; x++) {
                rowArray.push(padChar);
            }
            gridData[name].push(rowArray);
        }
    }

    /**
     * Print the complete grid layout to the terminal.
     */
    //% block="show grid %name in terminal"
    //% name.defl="myGrid"
    export function showInTerminal(name: string): void {
        if (!gridData[name]) return;
        let matrix = gridData[name];
        serial.writeLine("--- Grid Render: " + name + " ---");
        for (let y = 0; y < matrix.length; y++) {
            let rowString = "";
            for (let x = 0; x < matrix[y].length; x++) {
                rowString += matrix[y][x] + " ";
            }
            serial.writeLine(rowString);
        }
        serial.writeLine("-------------------");
    }
}
