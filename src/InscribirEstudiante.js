import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export default class InscribirEstudiante extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      form: {
        dni: "",
        cursos: "",
      },
      resultado: "",
      errors: {},
      show: false,
      cursosAll: [],
      estudiantes: [],
      estudiante: "",
      cursoID: "",
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

  listarEstudiantes() {
    fetch("http://localhost:1234/estudiantes")
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          estudiantes: json.estudiantes,
          resultado: json.result,
        });
      });
  }

  listarCursos() {
    fetch("http://localhost:1234/cursos")
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          cursosAll: json.cursos,
          resultado: json.result,
        });
      });
  }

  componentDidMount() {
    this.listarCursos();
    this.listarEstudiantes();
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:1234/estudiantes", {
      method: "PUT",
      credentials: "include",

      body: JSON.stringify({
        dni: this.state.form.estudiante,
        cursos: [this.state.form.cursoID],
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
          resultado: "Estudiante se inscribio al curso con éxito",
          errors: {},
          show: true,
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
            <Form.Label>Estudiantes</Form.Label>
            <Form.Control
              name="estudiante"
              onChange={this.handleChange}
              as="select"
            >
              {this.state.estudiantes.map((e) => (
                <option value={e.dni}>
                  {e.nombre}
                  {", "}
                  {e.apellido}
                  {" - "}
                  {e.dni}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Cursos</Form.Label>
            <Form.Control
              name="cursoID"
              onChange={this.handleChange}
              as="select"
            >
              {this.state.cursosAll.map((l) => (
                <option value={l.numero}>{l.nombre}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button className="mt-3" onClick={this.handleSubmit} type="submit">
            Inscribir
          </Button>
        </Form>
      </div>
    );
  }
}
