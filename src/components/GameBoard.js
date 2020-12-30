import React, { useRef, useEffect } from 'react'

const GameBoard = props => {

    const canvasRef = useRef(null)

    const draw = props.draw

    useEffect(() => {

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        //Our draw come here
        draw(context)
    }, [draw])



    const boardStyle = {
        outline: "black 2px solid",
        marginLeft: '2px'
    }

    return (
        <canvas ref={canvasRef} width={props.width} height={props.height} style={boardStyle}> </canvas>
    )

}

export default GameBoard