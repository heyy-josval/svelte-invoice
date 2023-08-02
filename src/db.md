# Cliente: Almacena la información de los clientes.

ID_cliente (clave primaria)
Nombres
Apellidos
Correo
Número de teléfono
DNI
Dirección

# Vendedor: Almacena la información de los vendedores.

ID_vendedor (clave primaria)
Nombres
Apellidos
Correo
Número de teléfono
DNI
Dirección
Salario

# Producto: Almacena la información de los productos que se facturan.

ID_producto (clave primaria)
Nombre del producto
Precio unitario
Descripción

# Factura: Almacena la información de las facturas generadas.

ID_factura (clave primaria)
Vendedor
Cliente
Productos
Fecha de emisión
Total factura
