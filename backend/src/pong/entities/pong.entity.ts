interface Position {
    x: number
    y: number
}

interface Size {
    width: number
    height: number
}

interface Rectangle {
    position: Position
    size: Size
}

export interface Frame {
    paddleLeft: Rectangle
    paddleRight: Rectangle
    ball: Rectangle
    score: { playerOne: number; playerTwo: number }
    gameOver: boolean
}
