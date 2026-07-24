CREATE TABLE Roles (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Usuarios (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Correo VARCHAR(150) NOT NULL UNIQUE,
    Telefono VARCHAR(20),
    PasswordHash TEXT NOT NULL,
    Activo BOOLEAN NOT NULL DEFAULT TRUE,
    FechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    RolId INTEGER NOT NULL,

    CONSTRAINT FK_Usuarios_Roles
        FOREIGN KEY (RolId)
        REFERENCES Roles(Id)
);

CREATE TABLE Categorias (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Descripcion TEXT
);

CREATE TABLE Perfumes (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Marca VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Concentracion VARCHAR(20),
    ContenidoML INTEGER,
    Precio NUMERIC(10,2) NOT NULL,
    Stock INTEGER NOT NULL,
    Imagen TEXT,
    Activo BOOLEAN NOT NULL DEFAULT TRUE,
    CategoriaId INTEGER NOT NULL,

    CONSTRAINT FK_Perfumes_Categorias
        FOREIGN KEY (CategoriaId)
        REFERENCES Categorias(Id)
);

CREATE TABLE Carrito (
    Id SERIAL PRIMARY KEY,
    UsuarioId INTEGER NOT NULL,
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Carrito_Usuarios
        FOREIGN KEY (UsuarioId)
        REFERENCES Usuarios(Id)
);

CREATE TABLE DetalleCarrito (
    Id SERIAL PRIMARY KEY,
    CarritoId INTEGER NOT NULL,
    PerfumeId INTEGER NOT NULL,
    Cantidad INTEGER NOT NULL,
    Precio NUMERIC(10,2) NOT NULL,

    CONSTRAINT FK_DetalleCarrito_Carrito
        FOREIGN KEY (CarritoId)
        REFERENCES Carrito(Id),

    CONSTRAINT FK_DetalleCarrito_Perfumes
        FOREIGN KEY (PerfumeId)
        REFERENCES Perfumes(Id)
);

CREATE TABLE Pedidos (
    Id SERIAL PRIMARY KEY,
    UsuarioId INTEGER NOT NULL,
    FechaPedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Total NUMERIC(10,2) NOT NULL,
    Estado VARCHAR(30) NOT NULL,

    CONSTRAINT FK_Pedidos_Usuarios
        FOREIGN KEY (UsuarioId)
        REFERENCES Usuarios(Id)
);

CREATE TABLE DetallePedido (
    Id SERIAL PRIMARY KEY,
    PedidoId INTEGER NOT NULL,
    PerfumeId INTEGER NOT NULL,
    Cantidad INTEGER NOT NULL,
    Precio NUMERIC(10,2) NOT NULL,

    CONSTRAINT FK_DetallePedido_Pedidos
        FOREIGN KEY (PedidoId)
        REFERENCES Pedidos(Id),

    CONSTRAINT FK_DetallePedido_Perfumes
        FOREIGN KEY (PerfumeId)
        REFERENCES Perfumes(Id)
);

INSERT INTO Roles (Nombre)
VALUES
('Administrador'),
('Cliente');

INSERT INTO Categorias (Nombre, Descripcion)
VALUES
('Arabes','Perfumes de origen árabe'),
('Designer','Perfumes de diseñador'),
('Nicho','Perfumes de nicho');

select * from Categorias