import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';

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
        fetch(value, {method: 'DELETE'})
            .then(res => this.loadCars())
            toast.success("Car deleted !", 
            {position: toast.POSITION.TOP_RIGHT}
            )}

    render() {
        // const rows = this.state.cars.map(value =>
        // <tr><td>{value.brand}</td><td>{value.model}</td><td>{value.color}</td><td>{val
        // ue.fuel}</td><td>{value.year}</td><td>{value.price}</td></tr>)

        return (
            <div className="container">
                <h2>My cars</h2>
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
                                accessor: "_links.self.href",
                            Cell: ({value}) => (<button type="button" class="btn btn-danger" onClick={ () => {this.deleteCar(value)}}>Delete</button>)
                            }
                        ]
                    }
                ]}
                    defaultPageSize={10}
                    style={{
                        height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
                      }}
                    className="-striped -highlight"/>
                <br/> {/* <table className="table table-striped">
                    <tbody>
                        {rows}
                        </tbody>
                    </table> */}
                    <ToastContainer autoClose={1500}/>
            </div>
        )
    }
}

export default Carlist;