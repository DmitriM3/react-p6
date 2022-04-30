import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export default class CrearEstudiante extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      form: {
        nombre: "",
        apellido: "",
        dni: "",
        cursos: "",
      },
      resultado: "",
      errors: {},
      show: false,
      cursosAll: [],
    };
  }

  handleClose() {
    this.setState({
      show: false,
    });
  }

  handleChange(e) {
    let nombre = e.target.name;
    let valor = e.target.value;

    this.setState((state) => ({
      form: {
        ...state.form,
        [nombre]: valor,
      },
    }));
  }

  handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:1234/estudiantes", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        nombre: this.state.form.nombre,
        apellido: this.state.form.apellido,
        dni: this.state.form.dni,
        cursos: [this.state.form.cursosAll],
      }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (json.result === "error") {
          this.setState({
            resultado: json.message,
            errors: json.errors,
            show: false,
          });
          return;
        }
        this.setState({
          resultado: "Estudiante fue creado con éxito!",
          errors: {},
          show: true,
        });
      });
  }

  componentDidMount() {
    fetch("http://localhost:1234/cursos", {
      //credentials: "include",
    })
      .then((r) => r.json())
      .then((json) => {
        this.setState({
          cursosAll: json.cursos,
        });
      });
  }

  render() {
    return (
      <div>
        {this.state.show && (
          <Alert variant="success" onClose={this.handleClose} dismissible>
            <Alert.Heading>{this.state.resultado}</Alert.Heading>
          </Alert>
        )}
        <Form>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              onChange={this.handleChange}
              value={this.state.form.nombre}
              isInvalid={this.state.errors.nombre}
            />
            <Form.Control.Feedback type="invalid">
              {this.state.errors.nombre}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              onChange={this.handleChange}
              value={this.state.form.apellido}
              isInvalid={this.state.errors.apellido}
            />
            <Form.Control.Feedback type="invalid">
              {this.state.errors.apellido}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>DNI</Form.Label>
            <Form.Control
              type="text"
              name="dni"
              onChange={this.handleChange}
              value={this.state.form.dni}
              isInvalid={this.state.errors.dni}
            />
            <Form.Control.Feedback type="invalid">
              {this.state.errors.dni}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Cursos</Form.Label>
            <Form.Control
              name="cursosAll"
              onChange={this.handleChange}
              as="select"
            >
              {this.state.cursosAll.map((l) => (
                <option value={l.numero}>{l.nombre}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button className="mt-3" onClick={this.handleSubmit} type="submit">
            Crear
          </Button>
        </Form>
      </div>
    );
  }
}
