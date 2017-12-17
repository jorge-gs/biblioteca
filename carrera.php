<?php
    $db = new mysqli('localhost:3306', 'root', 'password', 'biblioteca');
    $db->set_charset('utf8');
    header('Content-type: application/json');

    if (isset($_GET['id'])) {
        $consulta = $db->prepare('SELECT * FROM carrera WHERE id = ?');
        $consulta->bind_param('i', $_GET['id']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }
        $res = $consulta->get_result();

        echo json_encode($res->fetch_assoc());
        $consulta->close();
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $res = $db->query('SELECT * FROM carrera');
        if (!$res) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }

        $lista = array();
        foreach ($res as $fila) {
            $lista[] = $fila;
        }
        
        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fila['codigo'] = $_POST['codigo'];
        $fila['nombre'] = $_POST['nombre'];

        $consulta = $db->prepare('INSERT INTO carrera (codigo, nombre) VALUES (?, ?)');
        $consulta->bind_param('ss', $fila['codigo'], $fila['nombre']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
            exit();
        }
        $consulta->close();

        echo true;
    } else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        parse_str(file_get_contents('php://input'), $_PUT);
        $fila['id'] = $_PUT['id'];
        $fila['codigo'] = $_PUT['codigo'];
        $fila['nombre'] = $_PUT['nombre'];

        if (isset($fila['codigo'])) {
            $consulta = $db->prepare('UPDATE carrera SET codigo = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['codigo'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }
        if (isset($fila['nombre'])) {
            $consulta = $db->prepare('UPDATE carrera SET nombre = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['nombre'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents('php://input'), $_DELETE);
        
        $consulta = $db->prepare('DELETE FROM carrera WHERE id = ?');
        $consulta->bind_param('i', $_DELETE['id']);
        if(!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
        }
        $consulta->close();

        echo true;
    }

    $db->close();
?>