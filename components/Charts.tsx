'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface DoughnutChartProps {
  labels: string[]
  data: number[]
  title: string
}

export function DoughnutChart({ labels, data, title }: DoughnutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        // Destroy existing chart
        if (chartRef.current) {
          chartRef.current.destroy()
        }

        chartRef.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [{
              data,
              backgroundColor: [
                '#28a745',
                '#17a2b8',
                '#ffc107',
                '#dc3545',
                '#6c757d'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    let label = context.label || ''
                    if (label) {
                      label += ': '
                    }
                    label += context.parsed + ' tickets'
                    return label
                  }
                }
              }
            }
          }
        })
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [labels, data])

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <div style={{ height: '300px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

interface LineChartProps {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
  }[]
  title: string
}

export function LineChart({ labels, datasets, title }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy()
        }

        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: datasets.map(ds => ({
              ...ds,
              tension: 0.4,
              fill: true
            }))
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [labels, datasets])

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <div style={{ height: '300px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

interface PieChartProps {
  labels: string[]
  data: number[]
  title: string
}

export function PieChart({ labels, data, title }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy()
        }

        chartRef.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels,
            datasets: [{
              data,
              backgroundColor: [
                '#28a745',
                '#17a2b8',
                '#ffc107',
                '#dc3545',
                '#6c757d'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    const label = context.label || ''
                    const value = context.parsed
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                    const percentage = ((value / total) * 100).toFixed(1)
                    return `${label}: ${value} (${percentage}%)`
                  }
                }
              }
            }
          }
        })
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [labels, data])

  return <canvas ref={canvasRef}></canvas>
}

interface BarChartProps {
  labels: string[]
  data: number[]
  title: string
}

export function BarChart({ labels, data, title }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy()
        }

        chartRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Number of Tickets',
              data,
              backgroundColor: [
                '#dc3545',
                '#ffc107',
                '#17a2b8'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        })
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [labels, data])

  return <canvas ref={canvasRef}></canvas>
}
