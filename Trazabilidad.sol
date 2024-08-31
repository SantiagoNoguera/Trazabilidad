// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Crear un contrato simple para un caso de trazabilidad de productos.

contract TrazabilidadSimple {

    uint256 public contadorProductos;

    struct Estado {
        string ubicacion;
        uint256 marcaTiempo;
    }

    struct Producto {
        string nombre;
        Estado[] historialEstados;
    }

    mapping(uint256 => Producto) public productos;

    //Función para crear productos nuevos.
    function registrarProducto(string memory _nombre) public {
        contadorProductos++;
        productos[contadorProductos].nombre = _nombre;
    }

    //Función para ver el estado del producto indicado.
    function actualizarEstado(uint256 _idProducto, string memory _ubicacion) public {
        require(_idProducto > 0 && _idProducto <= contadorProductos, "El producto no existe.");
        productos[_idProducto].historialEstados.push(
            Estado({ubicacion: _ubicacion, marcaTiempo: block.timestamp})
        );
    }

    //Función para consultar todo el historial de un producto.
    function obtenerHistorial(uint _idProducto) public view returns (Estado[] memory) {
        require(_idProducto > 0 && _idProducto <= contadorProductos, "El producto no existe.");
        return productos[_idProducto].historialEstados;
    }

    function obtenerListaProductos() public view returns (string[] memory) {
        string[] memory listarProductos = new string[](contadorProductos);

        for (uint i = 1; i <= contadorProductos; i++) {
            listarProductos[i - 1] = productos[i].nombre;
        }

        return listarProductos;
    }
}
