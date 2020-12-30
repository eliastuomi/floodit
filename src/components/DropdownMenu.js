import React, { useRef, useEffect, useState } from 'react'
import './DropdownMenu.css'


const DropdownMenu = props => {
    const dropdownRef = useRef(null)
    const [isActive, setIsActive] = useState(false)
    const onClick = () => setIsActive(!isActive)

    useEffect(() => {
        const pageClickEvent = (e) => {
            // If the active element exists and is clicked outside of
            if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
                setIsActive(!isActive)
            }
        }

        // If the item is active (ie open) then listen for clicks
        if (isActive) {
            window.addEventListener('click', pageClickEvent)
        }

        return () => {
            window.removeEventListener('click', pageClickEvent)
        }

    }, [isActive])

    const humanReadableSave = (grid, pn, pt) => {
        const ret = `${grid[0].length}x${grid.length} - ${pn} players${pn === 2 ? ' - player ' + String(pt) + ' turn' : ''}` 
        return ret
    } 


    return (
        <div className="menu-container">
            <button onClick={onClick} className="menu-trigger">
                Load
          </button>
            <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
                {props.loadFiles.map(f => {
                    return(<button key={f.id} onClick={() => props.loadFunc(f.id)}>{humanReadableSave(f.data, f.playerNumber, f.playerTurn)}</button>)
                })}
            </nav>
        </div>
    )
}

export default DropdownMenu