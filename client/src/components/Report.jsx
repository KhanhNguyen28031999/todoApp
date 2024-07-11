import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Card, Col, Row } from 'react-bootstrap';
const Report = ({ theme }) => {
    const [todos, setTodos] = useState([]);
    const getTodo = () => {
        fetch('http://localhost:3001/task/stat?apitoken=' + localStorage.getItem('apitoken'))
            .then((res) => res.json()).then((res) => {
                setTodos(res.result);
            });
    }
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    var date = [];
    for (let i = sevenDaysAgo.getTime(); i <= Date.now(); i += 86400000) {
        const currentDate = new Date(i);
        const stat = {
            day: currentDate.getDate(),
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
            estPomodoro: 0,
            task: 0
        };
        date.push(stat);
    }
    let maxPomo = 0;
    let maxCount = 0;
    let count = 0;
    let streak = 0;
    if (todos && todos.length > 0) {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < todos.length; j++) {
                if (date[i].day === todos[j].finishAtDay && date[i].month === todos[j].finishAtMonth && date[i].year === todos[j].finishAtYear) {
                    date[i].estPomodoro += todos[j].estPomodoro;
                    date[i].task++;
                    count++;
                }
            }
            if (maxPomo < date[i].estPomodoro) {
                maxPomo = date[i].estPomodoro;
                maxCount = count;
            }
            else {
                count = 0;
            }

        }
    }
    date.map((date) => {
        if (date.estPomodoro === 0) {
            streak = 0;
        }
        else {
            streak++;
        }

    })
    useEffect(() => {
        getTodo();
    }, []);
    const options = {
        scales: {
            x:
            {
                grid: {
                    color: 'rgba(255,255,255,0.2)'
                },
                ticks: {
                    color: 'rgb(255,255,255)'
                }
            }
            ,
            y:
            {
                grid: {
                    color: 'rgba(255,255,255,0.2)'
                },
                ticks: {
                    color: 'rgb(255,255,255)'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'rgb(255,255,255)'
                }
            },
        }
    };

    const labels = date.map((stat) => `${stat.month}/${stat.day}`);
    const data = {
        labels,
        datasets: [{
            label: 'Số pomodoro',
            data: date.map((stat) => stat.estPomodoro),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            Color: 'rgb(0, 0, 0)'
        },
        {
            label: 'Số task',
            data: date.map((stat) => stat.task),
            fill: false,
            borderColor: 'rgb(205, 92, 8)',
            tension: 0.1,
            Color: 'rgb(0, 0, 0)'
        }]
    };
    return (
        <div style={{ width: "90%", marginLeft: "15px" }}>
            <Row className='mb-5 mt-3'>
                <Col>
                    <Card id={theme}>
                        <Card.Body>
                            <Card.Title><box-icon name='hot' type='solid' color='white'></box-icon></Card.Title>
                            <Card.Text>
                                <Row style={{ fontSize: "16pt" }}>
                                    <Col>
                                        <span >Streak</span>
                                    </Col>
                                    <Col>
                                        <span className='d-flex justify-content-end'>{streak}</span>
                                    </Col>
                                </Row>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card id={theme}>
                        <Card.Body>
                            <Card.Title><box-icon name='hot' type='solid' color='white'></box-icon></Card.Title>
                            <Card.Text>
                                <Row style={{ fontSize: "16pt" }}>
                                    <Col>
                                        <span >Task</span>
                                    </Col>
                                    <Col>
                                        <span className='d-flex justify-content-end'>{maxCount}</span>
                                    </Col>
                                </Row>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card id={theme}>
                        <Card.Body>
                            <Card.Title><box-icon name='hot' type='solid' color='white'></box-icon></Card.Title>
                            <Card.Text>
                                <Row style={{ fontSize: "16pt" }}>
                                    <Col>
                                        <span>Pomo</span>
                                    </Col>
                                    <Col>
                                        <span className='d-flex justify-content-end'>{maxPomo}</span>
                                    </Col>
                                </Row>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className={`chart-container ${theme}`}>
                <Line data={data} options={options} />
            </div>
        </div >
    )
}

export default Report