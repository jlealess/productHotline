import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  browserHistory,
  withRouter
} from "react-router-dom";

class Form extends React.Component{
  constructor() {
    super();

    this.state = {
      name: '',
      price: '',
      brand: '',
      camera: '',
      battery: '',
      weight: '',
      size: '',
      weight: ''
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.currentTarget.name]: event.target.value
    })
  }



  render(){
    return (
    <React.Fragment>
      <form action="" onSubmit={this.props.submit}>
        <input type="text" placeholder="Name" name='name' value={this.state.name} required onChange={this.handleChange} />
          <input type="text" placeholder='Price' name='price' value={this.state.price} required onChange={this.handleChange} />
          <input type="text" placeholder='Brand' name='brand' value={this.state.brand} required onChange={this.handleChange} />
          <input type="text" placeholder='Camera' name='camera' value={this.state.camera} onChange={this.handleChange} />
          <input type="text" placeholder='Battery' name='battery' value={this.state.battery} onChange={this.handleChange} />
          <input type="text" placeholder='Weight' name='weight' value={this.state.weight} onChange={this.handleChange} />
          <input type="text" placeholder='Size' name='size' value={this.state.size} onChange={this.handleChange} />
          <input type="text" placeholder='Weight' name='weight' value={this.state.weight} onChange={this.handleChange} />
          <button>Submit</button>
      </form>
      {console.log(this.props.submit)}
    </React.Fragment>
    )
  }
}

export default Form;