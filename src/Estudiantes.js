import React, { Component } from "react";

import Table from "react-bootstrap/Table";

export default class Estudiantes extends Component {
  constructor(props) {
    super(props);
    // this.limpiar = this.limpiar.bind(this);
    this.listarEstudiantes = this.listarEstudiantes.bind(this);

    this.state = {
      estudiantes: [],
    };
  }

  listarEstudiantes(inputValue) {
    fetch("http://localhost:1234/estudiantes?apellido=" + inputValue)
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          estudiantes: json.estudiantes,
          resultado: json.result,
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.inputValue !== this.props.inputValue)
      this.listarEstudiantes(this.props.inputValue);
  }

  componentDidMount() {
    this.listarEstudiantes(this.props.inputValue);
  }

  // limpiar() {
  //   this.setState({
  //     estudiantes: [],
  //   });
  // }

  render() {
    return (
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Curso Inscripto</th>
            </tr>
          </thead>
          <tbody>
            {this.state.estudiantes.map((p, index) => (
              <tr key={index}>
                <td>{p.nombre}</td>
                <td>{p.apellido}</td>
                <td>{p.dni}</td>
                <td>{p.cursos && p.cursos[0].nombre}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}
