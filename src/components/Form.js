import React from 'react'
import { MDBRow, MDBCol, MDBBtn } from "mdbreact";
import referal from '../assets/referal.json'
import exps from '../assets/exps.json'
import careers from '../assets/careers.json'
import '../styles/Form.css'
import conf from '../config.json'

const url = conf.backURL + conf.port
let universities = {}
let alert = ""
let code  = ""

class Form extends React.Component{    
    constructor(props){
        super(props)
        this.state = {
            form:{
                name:       {value: ''},
                lastName:   {value: ''},
                email:      {value: ''},
                pass:       {value: ''},
                phone:      {value: ''},
                university: {value: ''},
                exp:        {value: ''},
                referal:    {value: ''},
                prom_code:  {value: ' '},
                lc:         {value: ''},
                career:     {value: ''},
                englishLevel:{value: ''},
                selected_program: {value: ''},
                source:     {value: ' '}
            },
            title : '',
            className : '',
            params: ' ',
            program: this.props.program,
            loading: true,
            arrUniversities: [],
            arrRefs: [],
            arrExps: [],
            arrCars: [],
            alert: false,
            check: false,
            error: 0
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }    

    componentDidMount() {
        this.fetchData() 
        let tform = this.state.form
        
        let getParams = this.props.params.location.search
        let l = getParams.length
        let pars = getParams.substring(1,l).split("&");
        pars.map(param => {
            let ps = param.split("=")
            if(ps[0] === "code" && ps[1] === "yes")
                code = <input  type="input"
                        className="form-control"
                        name="prom_code"
                        placeholder="Código de promoción"
                        pattern="[0-9]*$"
                        onChange={this.changeHandler} />            
        })

        switch (this.state.program) {
            case "gv":
                tform.selected_program = { value: ['1'] }
                this.setState({
                    form: tform,
                    program: "gv",
                    title: "Voluntario Global",
                    className: "titleGV"
                })
                break;
            case "gt":
                    tform.selected_program = { value: ['2'] }
                    this.setState({
                        form: tform,
                        program: "gt",
                        title: "Talento Global",
                        className: "titleGT"
                    })
                break;
            case "ge":
                    tform.selected_program = { value: ['5'] }
                    this.setState({
                        form: tform,
                        program: "ge",
                        title: "Emprendedor Global",
                        className: "titleGE"
                    })
                break;
            default:
                break;
        }
    }
    
    fetchData = async () => {        
        this.setState({
            loading: true,
            error: null
        })
        
        try {
            universities = await fetch(url+"/universities").then(res => res.json())                                        
            this.setState({
                loading: false,
                arrUniversities: Object.keys(universities).sort(),
                lc: universities,
                arrRefs: referal.referal,
                arrExps: exps.exps,
                arrCars: careers.cars
            })
        } catch (error) {
            this.setState({
                loading: false,
                error: error
            })
        }
    }   

    handleSubmit = async e => {
        e.preventDefault();
        let tform = this.state.form

        let params = " "
        let getParams = this.props.params.location.search
        let l = getParams.length
        let pars = getParams.substring(1,l).split("&");
        pars.map(param => {
            let ps = param.split("=")            
            if(ps[0] === "src") tform.params = ps[1]            
            else tform.params = " "
        })

        let reg = /\s/g
        universities = await fetch(url+"/universities").then(res => res.json())
        for(let u in universities){
            let str = u.replace(reg, '')
            str = str.replace(reg, '')
            universities[str] = universities[u]
            delete universities[u]
        }
        
        let un = tform.university.value.replace(reg,'')
        un = un.replace(reg,'')
        tform.lc = universities[ un ]
        this.setState({ tform });
        
        let getURL = url + '/' +this.state.program
        fetch(getURL, {
            method: 'POST',
            mode: 'no-cors',            
            body: JSON.stringify({...this.state.form}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
        }).then(res => this.setState({error: 1, check: true}))
        .catch(err => this.setState({error: 2}))
    }         

    changeHandler = event => {              
        const name = event.target.name;
        const value = event.target.value;    
                    
        this.setState({
          form: {
              ...this.state.form,
              [name]: {
              ...this.state.form[name],
              value
            }
          }
        });
    }

    render() {        
        
        if(this.state.loading === true){
            console.log('Loading Universities');            
            return 'Loading Universities...'
        }
        
        let listUs = this.state.arrUniversities;
        let opU = listUs.map( u => 
            <option key={u}>{u}</option>
        )

        let listRfs = this.state.arrRefs;
        let opRfs = listRfs.map( u => 
            <option key={u}>{u}</option>
        )

        let listXps = this.state.arrExps;
        let opXps = listXps.map( u => 
            <option key={u}>{u}</option>
        )

        let listCars = this.state.arrCars;
        let opCar = listCars.map( u => 
            <option key={u}>{u}</option>
        )

        let deg = ""
        let engLvl = ""
        let vExp = ""
        let gte = this.state.program === "gt" | this.state.program === "ge" 
        let gve = this.state.program === "gv"       
        
        if(gve){
            vExp = <select className="form-control"
                name="exp"
                onChange={this.changeHandler}>  
                <option default>Quiero vivir mi experiencia porque..</option>                          
                {opXps}
            </select>
        }

        if( gte ){
            deg = <select className="form-control"
                        name="career"
                        onChange={this.changeHandler}
                        required>  
                        <option  defaultValue>Carrera</option>                                        
                        {opCar}
                    </select>

            engLvl = <select className="form-control"
                        name="englishLevel"
                        onChange={this.changeHandler}>  
                        <option  defaultValue>Nivel de Inglés</option>
                        <option>Básico</option>
                        <option>Intermedio</option>
                        <option>Avanzado</option>
                    </select>
        }

        let err = this.state.error
        
        if(err === 1)
            alert = <div className="alert alert-success" role="alert">
                Te has registrado correctamente.
            </div>
        else if(err === 2)
            alert = <div className="alert alert-danger" role="alert">
                Ha ocurrido un error, intentalo de nuevo más tarde.
            </div>

        let title = this.state.title
        return (
            <div>
                <div>{alert}</div>
                <div className="form-group container">
                    <h2 className="header" id={this.state.className}>{title}</h2>
                    <div className="col s12 m12">{this.props.desc}</div>
                </div>     

                <form onSubmit = {this.handleSubmit} >                    
                    <MDBRow>                        
                        <MDBCol md="6" className="mb-3">
                            <input  type="text" 
                                    name="name"
                                    className="form-control" 
                                    placeholder="Nombre"
                                    onChange={this.changeHandler}
                                    required
                            />                            
                        </MDBCol>
                        
                        <div className="form-group col-md-6">
                            <input  type="text" 
                                    name="lastName"
                                    className="form-control" 
                                    placeholder="Apellido" 
                                    onChange={this.changeHandler}
                                    required
                            />
                        </div>

                        <div className="form-group col-md-6">
                                <input  type="email" 
                                        name="email"
                                        className="form-control" 
                                        id="defaultFormRegisterEmailEx2"
                                        placeholder="Correo" 
                                        onChange={this.changeHandler}
                                        required
                                />
                        </div>
                        
                        <div className="form-group col-md-6">
                            <input  type="password" 
                                    name="pass"
                                    className="form-control" 
                                    id="inputPassword4" 
                                    placeholder="Contraseña" 
                                    onChange={this.changeHandler}
                                    required      
                            />
                        </div>

                        <div className="form-group col-md-12">
                            <input  type="tel" 
                                    name="phone"
                                    className="form-control" 
                                    placeholder="Teléfono" 
                                    pattern="^\d{3}\d{3}\d{4}$" 
                                    onChange={this.changeHandler}
                                    required
                            />
                        </div>

                        <div className="form-group col-md-12" >
                            <select className="form-control"
                                    name="university"
                                    onChange={this.changeHandler} >  
                                    <option default>Universidad</option>                                        
                                {opU}
                            </select>
                        </div>

                        <div className="form-group col-md-12">
                            {vExp}
                        </div>

                        <div className="form-group col-md-12">
                            <select className="form-control"
                                    name="referal"
                                    onChange={this.changeHandler}>  
                                    <option default>Llegué acá por...</option>                          
                                {opRfs}
                            </select>
                        </div>

                        <div className="form-group col-md-12">{deg}</div>
                        <div className="form-group col-md-12">{engLvl}</div>
                        <div className="form-group col-md-12">{code}</div>
                        
                    </MDBRow>

                    <div className="form-group form-check">
                        <input type="checkbox" 
                                className="form-check-input"
                                id="exampleCheck1"
                                required
                                 />

                        <label className="form-check-label" htmlFor="exampleCheck1">
                            Estoy de acuerdo con los 
                        </label>
                        <a href="http://aieseccolombia.org/wp-content/uploads/2017/02/AVISO-DE-PRIVACIDAD-1.pdf"> términos y condiciones de privacidad</a>
                    </div>
                    <MDBBtn className="col-md-12" color="primary" disabled={this.state.check} type="submit">
                        Crear mi cuenta                    
                    </MDBBtn>
                </form>                     
            </div>
        )
    };
}

export default Form;                