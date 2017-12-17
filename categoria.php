<?php
    $db = new mysqli('localhost:3306', 'root', 'password', 'biblioteca');

    if (isset($_GET['id'])) {
        $consulta = $db->prepare('SELECT * FROM categoria_prestable WHERE id = ?');
        $consulta->bind_param('i', $_GET['id']);
        $consulta->execute();
        $res = $consulta->get_result();
        
        $fila = $res->fetch_assoc();
        $consulta->close();
        
        header('Content-Type: application/json');
        echo json_encode($fila);
    } else if  ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $res = $db->query('SELECT * FROM categoria_prestable');

        $lista = array();
        foreach($res as $fila) {
            $lista[] = $fila;
        }

        header('Content-Type: application/json');
        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fila['nombre'] = $_POST['nombre'];

        $consulta = $db->prepare('INSERT INTO categoria_prestable(nombre) VALUES (?)');
        $consulta->bind_param('s', $fila['nombre']);
        $consulta->execute();
        $consulta->close();
    } else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        parse_str(file_get_contents('php://input'), $_PUT);

        $fila['id'] = $_PUT['id'];
        $fila['nombre'] = $_PUT['nombre'];
        if ($fila['nombre']) {
            $consulta = $db->prepare('UPDATE categoria_prestable SET nombre = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['nombre'], $fila['id']);
            $consulta->execute();
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents('php://input'), $_DELETE);

        $consulta = $db->prepare('DELETE FROM categoria_prestable WHERE id = ?');
        $consulta->bind_param('i', $_DELETE['id']);
        $consulta->execute();
    }
?>