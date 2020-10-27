import * as React from 'react';
import axios from 'axios';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const Regex = RegExp(/^\s?[A-Z0–9]+[A-Z0–9._+-]{0,}@[A-Z0–9._+-]+\.[A-Z0–9]{2,4}\s?$/i);
const Regmob = RegExp(/^[0-9\b]+$/);
export interface IValues {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    password: string,
    errors : 
     {
         firstName: string,
         lastName: string,
         email: string,
         phone: string,
         address: string,
         password: string
    }
}
export interface IFormState {
    [key: string]: any;
    values: IValues[];
    submitSuccess: boolean;
    loading: boolean;
    name?:any;
    errors:any;
}
class Create extends React.Component<RouteComponentProps, IFormState> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            values: [],
            loading: false,
            submitSuccess: false,
            errors : {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                password: ''
            }
            
        }
    }
    private processFormSubmission = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        this.setState({ loading: true });
        const formData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phone: this.state.phone,
            address: this.state.address,
            password: this.state.password,
        }
        this.setState({ submitSuccess: true, value: [...this.state.values, formData], loading: false });
        axios.post(`https://localhost:44383/api/user/PostU`, formData).then(data => [
            setTimeout(() => {
                this.props.history.push('/');
            }, 1500)
        ]).catch(error => {
            this.setState({ errorMessage: error.message });
            console.error('There was an error!', error);
        });;
    }

    private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const{name , value} = e.currentTarget;
        let errors = this.state.errors;
        switch (name) {
            case 'firstName':
               errors.first_name = value.length < 5 ? 'Username must be 5 characters long!': '';
               break;
            case 'email':
               errors.email = Regex.test(value)? '': 'Email is not valid!';
               break;
            case 'password':
               errors.password = value.length < 8 ? 'Password must be eight characters long!': '';
               break;
            case 'phone':
               errors.phone = Regmob.test(value) && value.length !== 10 ? 'Mobile Number is not valid!': '';
               break;
            default:
              break;
          }
         // this.setState(Object.assign(this.state, { errors,[name]: value }));
         this.setState({
            [e.currentTarget.name]: e.currentTarget.value,
          
        })
      console.log(this.state.errors);
            
      
}
public render() {
    const { submitSuccess, loading ,errors} = this.state;
    return (
        <div>
            <div className={"col-md-12 form-wrapper"}>
                <h2> Create Post </h2>
                {!submitSuccess && (
                    <div className="alert alert-info" role="alert">
                        Fill the form below to create a new post
                </div>
                )}
                {submitSuccess && (
                    <div className="alert alert-info" role="alert">
                        The form was successfully submitted!
                        </div>
                )}
                <form id={"create-post-form"} onSubmit={this.processFormSubmission} noValidate={false}>
                    <div className="form-group col-md-12">
                        <label htmlFor="firstName"> First Name </label>
                        <input type="text" id="firstName" onChange={(e) => this.handleInputChanges(e)} name="firstName" className="form-control" placeholder="Enter customer's first name" />
                        {errors.firstName.length > 0 &&  <span style={{color: "red"}}>{errors.firstName}</span>}
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="lastName"> Last Name </label>
                        <input type="text" id="lastName" onChange={(e) => this.handleInputChanges(e)} name="lastName" className="form-control" placeholder="Enter customer's last name" />
                        
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="email"> Email </label>
                         <input type="email" id="email" onChange={(e) => this.handleInputChanges(e)} name="email" className="form-control" placeholder="Enter customer's email address" />
                         {errors.email.length > 0 &&  <span style={{color: "red"}}>{errors.email}</span>}
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="phone"> Phone </label>
                        <input type="text" id="phone" onChange={(e) => this.handleInputChanges(e)} name="phone" className="form-control" placeholder="Enter customer's phone number" />
                        {errors.phone.length > 0  &&  <span style={{color: "red"}}>{errors.phone}</span>}
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="address"> Address </label>
                        <input type="text" id="address" onChange={(e) => this.handleInputChanges(e)} name="address" className="form-control" placeholder="Enter customer's address" />
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="password"> password </label>
                        <input type="text" id="password" onChange={(e) => this.handleInputChanges(e)} name="password" className="form-control" placeholder="Enter password" />
                        {errors.password.length > 0 &&  <span style={{color: "red"}}>{errors.password}</span>}
                    </div>
                    <div className="form-group col-md-4 pull-right">
                        <button className="btn btn-success" type="submit">
                            Create Customer
                        </button>
                        {loading &&
                            <span className="fa fa-circle-o-notch fa-spin" />
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

}
export default withRouter(Create)