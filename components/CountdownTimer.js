"use client"
import React, { useEffect, useState } from "react"

let timerId

function CountdownTimer() {
    const [count, setCount] = useState(60)

    useEffect(() => {
        timerId = setInterval(() => {
            if (count === 1) setCount(60)
            setCount((c) => c - 1)
        }, 1000)

        return () => clearInterval(timerId)
    }, [count])

    return (
        <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
            <div className="flex flex-col p-1.5 bg-secondary rounded-lg text-secondary-content">
                <span className="countdown text-3xl">
                    <span style={{ "--value": 15 }}></span>
                </span>
                days
            </div>
            <div className="flex flex-col p-1.5 bg-secondary rounded-lg text-secondary-content">
                <span className="countdown text-3xl">
                    <span style={{ "--value": 10 }}></span>
                </span>
                hours
            </div>
            <div className="flex flex-col p-1.5 bg-secondary rounded-lg text-secondary-content">
                <span className="countdown text-3xl">
                    <span style={{ "--value": 24 }}></span>
                </span>
                min
            </div>
            <div className="flex flex-col p-1.5 bg-secondary rounded-lg text-secondary-content">
                <span className="countdown text-3xl">
                    <span style={{ "--value": count }}></span>
                </span>
                sec
            </div>
        </div>
    )
}

export default CountdownTimer
