import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Addcar from "./Addcar";
import Editcar from "./Editcar";
import {CSVLink, CSVDownload} from 'react-csv';

class Carlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cars: []
        };
    }

    componentDidMount() {
        this.loadCars();
    }

    loadCars = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(res => res.json())
        .then(resData => {
           this.setState({cars: resData._embedded.cars});
        })
    }

    deleteCar = (value) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                  fetch(value, {method: 'DELETE'})
                  .then(res => this.loadCars())
                  toast.success("Car deleted !", 
                  {position: toast.POSITION.TOP_RIGHT})
              }},
              {
                label: 'No',
                onClick: () => alert('Click No')
              }
            ]
          })
        }

        addCar = (newCar) => {
            
            fetch('https://carstockrest.herokuapp.com/cars', {
                method: 'POST',
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify(newCar)})
            .then(res => this.loadCars())
            .catch(err => console.error(err))
        }

        updateCar = (link, car) => {
            
            fetch(link, {
                method: 'PUT',
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify(car)})
            .then(res => this.loadCars())
            .catch(err => console.error(err))
        }

        

    render() {

        return (
        
            <div className="container">
                <h2>My cars</h2>
                <div className = "row"> 
                <Addcar addCar={this.addCar}/> 
                <CSVLink data={this.state.cars} >Download csv</CSVLink>
                </div>
                <ReactTable
                    data={this.state.cars}
                    filterable
                    columns={[{
                        columns: [
                            {
                                Header: "Brand",
                                accessor: "brand"
                            }, {
                                Header: "Model",
                                accessor: "model"
                            }, {
                                Header: "Color",
                                accessor: "color"
                            }, {
                                Header: "Year",
                                accessor: "year"
                            }, {
                                Header: "Price",
                                accessor: "price"
                            }, 
                            {
                                Header: "Fuel",
                                accessor: "fuel"
                            }, 
                            {
                                Header: "",
                                sortabele: false,
                                filterable: false,
                                accessor: "_links.self.href",
                            Cell: ({value}) => (<button type="button" class="btn btn-danger" onClick={ () => {this.deleteCar(value)}}>Delete</button>)
                            },
                            {
                                Header: "",
                                sortabele: false,
                                filterable: false,
                                width: 100,
                                accessor: "_links.self.href",
                            Cell: ({row, value}) => (<Editcar updateCar = {this.updateCar} link = {value} car = {row}/>)
                            }
                        ]
                    }
                ]}
                    defaultPageSize={10}
                    style={{
                        height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
                      }}
                    className="-striped -highlight"/>
                <br/> 
                    <ToastContainer autoClose={1500}/>
            </div>
            
        )
    }
}

export default Carlist;