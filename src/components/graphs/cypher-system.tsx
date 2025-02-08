'use client'

import { useState, useCallback, ReactElement, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#2B6B5E', '#CC4A49']
const ROLLS = 50
const DICE_FACES = 20

interface RollResult {
    name: string
    value: number
}

export function CypherSystemGraph(): ReactElement {
    const [difficulty, setDifficulty] = useState<number>(5)
    const [effort, setEffort] = useState<number>(1)
    const [results, setResults] = useState<RollResult[]>([
        { name: 'Successi', value: 0 },
        { name: 'Fallimenti', value: 0 },
    ])

    const simulateRolls = useCallback(() => {
        let successes = 0

        // Simulate 50 dice rolls
        for (let i = 0; i < ROLLS; i++) {
            const roll = Math.floor(Math.random() * DICE_FACES) + 1
            if (roll >= (difficulty - effort) * 3) {
                successes++
            }
        }

        setResults([
            { name: 'Successi', value: successes },
            { name: 'Fallimenti', value: ROLLS - successes },
        ])
    }, [difficulty, effort])

    useEffect(() => {
        simulateRolls()
    }, [simulateRolls])

    return (
        <div className="flex flex-col items-center gap-12 p-4">
            <div className="flex gap-4">
                <span className="my-auto font-medium">CD:</span>
                <input
                    type="number"
                    min="1"
                    max="10"
                    value={difficulty}
                    onChange={(e) => setDifficulty(Math.min(10, Math.max(1, Number(e.target.value))))}
                    className="w-20 rounded border p-2"
                />
                <span className="my-auto font-medium">Tenacia:</span>
                <input
                    type="number"
                    min="0"
                    max="6"
                    value={effort}
                    onChange={(e) => setEffort(Math.min(6, Math.max(0, Number(e.target.value))))}
                    className="w-20 rounded border p-2"
                />
                <button
                    onClick={simulateRolls}
                    className="rounded bg-[#CC4A49] px-4 py-2 text-white transition-colors hover:bg-[#a63c3b]"
                >
                    Tira i dadi
                </button>
            </div>

            <div className="h-[400px] w-full max-w-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={results}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            label={({ name, value }) => `${name}: ${value}`}
                        >
                            {results.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="text-center">
                <p className="text-sm text-gray-500">
                    I valori sopra esposti rappresentano il numero di successi e fallimenti ottenuti su 50 tiri di dado.
                </p>
            </div>
        </div>
    )
}
