import React, { PureComponent } from "react";
import ReactDom from "react-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';



class App extends React.Component {

    render() {
        return <React.Fragment>
                    <Table />
               </React.Fragment>;
    }
}



class Table extends React.Component {

    header = ["#", "Дата", "Инструмент", "Стоимость"];

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    async handleChangeCell(e, id, dataType, key) {
        if(e.key === 'Enter') {
            const value = e.target.value;
            this.state.data[key][dataType] = value;
            await this.updateSecurity(id, dataType, value);
        }
    }

    async handleBlurForCell(e, id, dataType, key) {
        const value = e.target.value;
        this.state.data[key][dataType] = value;
        await this.updateSecurity(id, dataType, value);
    }

    async updateSecurity(id, dataType, value) {
        const url = "http://localhost:8081/security/update/" + id;
        const json = {};
        if(dataType === "instrument") {
            json.instrument = value;
        }
        else if(dataType === "date") {
            json.date = value;
        }
        else if(dataType === "price") {
            json.price = value;
        }
        await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PATCH",
            body: JSON.stringify(json)
        })
        .then(response => {

        })
        .catch(error => {
            console.log(error);
        });

    }

    updateTable() {
        this.getSecurities()
            .then(r => {});
    }

    _prepareOptions() {
        const optionsArray = [];
        const options = {};
        if(Array.isArray(this.state.data) && this.state.data.length) {
            this.state.data.map((row) => {
                if(!(row.instrument in options)) {
                    options[row.instrument] = 1;
                }
            });
            for (const [key] of Object.entries(options)) {
                optionsArray.push(key);
            }
            return optionsArray;
        }
        else {
            return [];
        }
    }


    render() {
        const contents = this.state.data.map((row, i) =>
            <tr key={row.id}>
                <th scope="row">{i + 1}</th>
                <td><input type="date" defaultValue={row.date} onBlur={(e) => this.handleBlurForCell(e, row.id, "date", i)} onKeyDown={(e) => this.handleChangeCell(e, row.id, "date", i)}/></td>
                <td><input type="text" defaultValue={row.instrument} onBlur={(e) => this.handleBlurForCell(e, row.id, "instrument", i)} onKeyDown={(e) => this.handleChangeCell(e, row.id, "instrument", i)}/></td>
                <td><input type="number" defaultValue={row.price} onBlur={(e) => this.handleBlurForCell(e, row.id, "price", i)} onKeyDown={(e) => this.handleChangeCell(e, row.id, "price", i)}/></td>
            </tr>
        );
        return (
            <React.Fragment>
                <table className="table table-hover">
                    <thead>
                    <tr>{this.header.map((h, i) => <th scope="col" key={i}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                    {contents}
                    </tbody>
                </table>
                <AddNew />
                {renderChart.call(this)}
            </React.Fragment>
        );
    }

    async getSecurities() {
        const url = "http://localhost:8081/security/";
        const response = await fetch(url);
        const json = await response.json();
        this.setState({
            data: json
        });
    };

    async componentDidMount() {
        try {
            this.getSecurities();
            setInterval(async () => {
                await this.getSecurities();
            }, 10000);

        } catch (e) {
            console.log(e);
        }
        
    }
}

function renderChart() {
    if(this.state.data) {
        const data = this.state.data;
        const uniqueInstruments = this._prepareOptions();
        return <Chart data={data} uniqueInstruments={uniqueInstruments} />
    }
}

class AddNew extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            dataToSubmit: {
                instrument: '',
                date: null,
                price: 0
            }
        };

        this.handleClick = this.handleClick.bind(this);
    }


    handleClick = () => {
        this.setState({
            showModal: true
        });
    };

    handleClose = () => {
        this.setState({
            showModal: false,
            dataToSubmit: {
                instrument: '',
                date: null,
                price: 0
            }
        });
    };

    handleCreate = () => {
        let data = this.state.dataToSubmit;
        if(data.instrument === '') {
            alert("Введите название ценной бумаги");
            return;
        }
        if(data.date === null) {
            alert("Введите дату");
            return;
        }
        if(data.price === 0) {
            alert("Введите цену");
            return;
        }

        const url = "http://localhost:8081/security/create";
        fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    instrument: data.instrument,
                    date: data.date,
                    price: Number.parseInt(data.price)
                })
            })
            .then(response => {
                if (response.ok) {
                    alert("Успешно добавлено");
                    this.setState({
                        showModal: false,
                        dataToSubmit: {
                            instrument: '',
                            date: null,
                            price: 0
                        }
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        return (
           <React.Fragment>
               <Button onClick={this.handleClick} variant="outline-success">Добавить</Button>
               <Modal show={this.state.showModal} onHide={this.handleClose}>
                   <Modal.Header closeButton>
                       <Modal.Title>Добавление новой ценной бумаги</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>
                       <Form>
                           <Form.Group controlId="formInstrument">
                               <Form.Label>Ценная бумага</Form.Label>
                               <Form.Control required onChange={(e) => this.state.dataToSubmit.instrument = e.target.value} type="text" placeholder="Введите название ценной бумаги" />
                           </Form.Group>
                           <Form.Group controlId="formDate">
                               <Form.Label>Дата</Form.Label>
                               <Form.Control required onChange={(e) => this.state.dataToSubmit.date = e.target.value} type="date"/>
                           </Form.Group>
                           <Form.Group controlId="formPrice">
                               <Form.Label>Цена</Form.Label>
                               <Form.Control required onChange={(e) => this.state.dataToSubmit.price = e.target.value} type="number" placeholder="Введите цену" />
                           </Form.Group>
                       </Form>
                   </Modal.Body>
                   <Modal.Footer>
                       <Button variant="secondary" onClick={this.handleClose}>
                           Закрыть
                       </Button>
                       <Button variant="primary" onClick={this.handleCreate}>
                           Создать
                       </Button>
                   </Modal.Footer>
               </Modal>
           </React.Fragment>
        );
    }
}

class Chart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataKeys: []
        }
    }

    componentDidMount() {
        this.state.data = this._prepareData(this.props.data);
        this.state.dataKeys = this.props.uniqueInstruments;
    }

    _prepareData(data) {
        if(Array.isArray(data) && data.length) {
            const arrangedByDate = {};
            data.map((security) => {
                if(arrangedByDate[security.date]) {
                    arrangedByDate[security.date][security.instrument] = security.price;
                }
                else {
                    arrangedByDate[security.date] = {};
                    arrangedByDate[security.date][security.instrument] = security.price;
                }
            });
            return this._formatData(arrangedByDate);
        }
        else {
            return [];
        }
    }

    _formatData(arrangedByDate) {
        const result = [];
        Object.keys(arrangedByDate).map(function(key) {
            let element = {
                "name": key
            };
            Object.keys(arrangedByDate[key]).map(function(instrument) {
                element[instrument] = arrangedByDate[key][instrument];
            });
            result.push(element);
        });
        result.sort((a, b) => {
           return new Date(a.name) - new Date(b.name);
        });
        return result;
    }

    componentWillReceiveProps(nextProps) {
        const resultData = this._prepareData(nextProps.data);
        this.setState(
            {
                data: resultData,
                dataKeys: nextProps.uniqueInstruments
            }
        );
        this.forceUpdate();
    }


    render() {
        let colors = ['#FA5E1F', '#FDCB3F', '#71D743', '#D23333', '#BAE73F', '#B381C9'];
        let i = 0;
        const renderLines = this.state.dataKeys.map((key) => {
                const chosenColor = colors[i];
                i = (i + 1) % 6;
                return <Line connectNulls={true} type="monotone" dataKey={key} stroke={chosenColor}/>
            }
        );
        return (
            <LineChart
                width={500}
                height={300}
                data={this.state.data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {renderLines}
            </LineChart>
        );
    }
}



export default Table;

ReactDom.render(<App />, document.getElementById('react'));