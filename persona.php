<?php
    $db = new mysqli('localhost:3306', 'root', 'password', 'biblioteca');
    $db->set_charset('utf8');

    if (isset($_GET['id'])) {
        $consulta = $db->prepare('SELECT * FROM persona WHERE id = ?');
        $consulta->bind_param('i', $_GET['id']);
        $consulta->execute();
        $res = $consulta->get_result();

        header('Content-type: application/json');
        echo json_encode($res->fetch_assoc());

        $consulta->close();
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $res = $db->query('SELECT * FROM persona');

        $lista = array();
        foreach ($res as $fila) {
            $lista[] = $fila;
        }

        header('Content-type: application/json');
        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fila['identidad'] = $_POST['identidad'];
        $fila['nombre'] = $_POST['nombre'];
        $fila['apellido'] = $_POST['apellido'];

        $consulta = $db->prepare('INSERT INTO persona (identidad, nombre, apellido) VALUES (?, ?, ?)');
        $consulta->bind_param('sss', $fila['identidad'], $fila['nombre'], $fila['apellido']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
        }
        $consulta->close();

        echo true;
        echo $fila;
    } else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        parse_str(file_get_contents('php://input'), $_PUT);
        $fila['id'] = $_PUT['id'];
        $fila['identidad'] = $_PUT['identidad'];
        $fila['nombre'] = $_PUT['nombre'];
        $fila['apellido'] = $_PUT['apellido'];

        if (isset($fila['identidad'])) {
            $consulta = $db->prepare('UPDATE persona SET identidad = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['identidad'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }
        if (isset($fila['nombre'])) {
            $consulta = $db->prepare('UPDATE persona SET nombre = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['nombre'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }
        if (isset($fila['apellido'])) {
            $consulta = $db->prepare('UPDATE persona SET apellido = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['apellido'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }

    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents('php://input'), $_DELETE);
        
        $consulta = $db->prepare('DELETE FROM persona WHERE id = ?');
        $consulta->bind_param('i', $_DELETE['id']);
        if(!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
        }
        $consulta->close();

        echo true;
    }

    $db->close();
?>