document.addEventListener('DOMContentLoaded', () => {
    let provider;
    let signer;
    let contract;

    const contractAddress = '0x9A0d69bdB1f6D12A17698a1737f05738e9700be5';
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_idProducto",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_ubicacion",
                    "type": "string"
                }
            ],
            "name": "actualizarEstado",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_nombre",
                    "type": "string"
                }
            ],
            "name": "registrarProducto",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "contadorProductos",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_idProducto",
                    "type": "uint256"
                }
            ],
            "name": "obtenerHistorial",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "ubicacion",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "marcaTiempo",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct TrazabilidadSimple.Estado[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "obtenerListaProductos",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "productos",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "nombre",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    // Función para conectar Metamask y actualizar el estado
    async function connectMetamask() {
        const connectionStatus = document.getElementById('connectionStatus');
        const accountAddress = document.getElementById('accountAddress');

        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                contract = new ethers.Contract(contractAddress, contractABI, signer);

                const account = accounts[0];
                connectionStatus.textContent = 'Conectado a Metamask';
                accountAddress.textContent = `Dirección de la cuenta: ${account}`;

                console.log('Conectado a Metamask:', account);
            } catch (error) {
                console.error('Error conectando a Metamask:', error);
                connectionStatus.textContent = 'Error al conectar a Metamask';
            }
        } else {
            alert('Metamask no está instalado.');
        }
    }

    // Función para verificar el estado de conexión
    function checkMetamaskConnection() {
        const connectionStatus = document.getElementById('connectionStatus');
        const accountAddress = document.getElementById('accountAddress');

        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
                if (accounts.length > 0) {
                    connectionStatus.textContent = 'Conectado a Metamask';
                    accountAddress.textContent = `Dirección de la cuenta: ${accounts[0]}`;
                } else {
                    connectionStatus.textContent = 'No conectado a Metamask';
                    accountAddress.textContent = 'Dirección de la cuenta: N/A';
                }
            }).catch(error => {
                console.error('Error verificando la conexión a Metamask:', error);
            });
        } else {
            connectionStatus.textContent = 'Metamask no está instalado';
            accountAddress.textContent = 'Dirección de la cuenta: N/A';
        }
    }

    // Función para registrar un producto
    async function registerProduct() {
        const productName = document.getElementById('productName').value;
        if (contract && productName) {
            try {
                const tx = await contract.registrarProducto(productName);
                await tx.wait();
                alert('Producto registrado correctamente.');
            } catch (error) {
                console.error('Error registrando el producto:', error);
            }
        }
    }

    // Función para actualizar el estado del producto
    async function updateProductStatus() {
        const productId = document.getElementById('productId').value;
        const location = document.getElementById('location').value;
        if (contract && productId && location) {
            try {
                const tx = await contract.actualizarEstado(productId, location);
                await tx.wait();
                alert('Estado del producto actualizado correctamente.');
            } catch (error) {
                console.error('Error actualizando el estado del producto:', error);
            }
        }
    }

    // Función para obtener el historial de un producto
    async function getProductHistory() {
        const productHistoryId = document.getElementById('productHistoryId').value;
        const historyOutput = document.getElementById('historyOutput');
        if (contract && productHistoryId) {
            try {
                const history = await contract.obtenerHistorial(productHistoryId);
                historyOutput.innerHTML = ''; // Limpiar la salida antes de agregar nuevos datos

                history.forEach(entry => {
                    const li = document.createElement('li');
                    const date = new Date(entry.marcaTiempo * 1000); // Convertir el timestamp a milisegundos
                    const formattedDate = date.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    li.textContent = `Ubicación: ${entry.ubicacion}, Fecha: ${formattedDate}`;
                    historyOutput.appendChild(li);
                });
            } catch (error) {
                console.error('Error obteniendo el historial del producto:', error);
            }
        }
    }


    async function getProductList() {
        const productListElement = document.getElementById('productList');
        if (contract) {
            try {
                const products = await contract.obtenerListaProductos();
                productListElement.innerHTML = ''; // Limpiar la lista antes de agregar los productos
                products.forEach(product => {
                    const li = document.createElement('li');
                    li.textContent = product;
                    productListElement.appendChild(li);
                });
            } catch (error) {
                console.error('Error obteniendo la lista de productos:', error);
            }
        }
    }

    // Verificar el estado de conexión al cargar la página
    document.addEventListener('DOMContentLoaded', checkMetamaskConnection);

    // Eventos para los botones
    document.getElementById('connectButton').addEventListener('click', connectMetamask);
    document.getElementById('registerProduct').addEventListener('click', registerProduct);
    document.getElementById('updateStatus').addEventListener('click', updateProductStatus);
    document.getElementById('getHistory').addEventListener('click', getProductHistory);
    document.getElementById('getProductList').addEventListener('click', getProductList);
});
