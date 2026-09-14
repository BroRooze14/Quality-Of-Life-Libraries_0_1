input.onButtonPressed(Button.A, function () {
    gridTools.resetGrid("Grid")
})
input.onButtonPressed(Button.B, function () {
    gridTools.showInTerminal("Grid")
})
gridTools.initGrid("Grid")
gridTools.setDefaultCharacter("Grid", "0")
gridTools.setGridValue(
"Grid",
3,
1,
"X"
)
serial.writeLine(gridTools.getGridValue("Grid", 0, 0))
