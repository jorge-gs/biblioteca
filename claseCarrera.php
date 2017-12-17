<?php
    $db = new mysqli('localhost:3306', 'root', 'password', 'biblioteca');
    $db->set_charset('utf8');
    
    if (isset($_GET['id'])) {
        $consulta = $db->prepare('SELECT * FROM clase_carrera WHERE id = ?');
        $consulta->bind_param('i', $_GET['id']);
        $consulta->execute();
        $res = $consulta->get_result();

        header('Content-type: application/json');
        echo json_encode($res->fetch_assoc());

        $consulta->close();
    } if (isset($_GET['clase']) && isset($_GET['carrera'])) {
        $consulta = $db->prepare('SELECT * FROM clase_carrera WHERE clase = ? AND carrera = ?');
        $consulta->bind_param('ii', $_GET['clase'], $_GET['carrera']);
        $consulta->execute();
        $res = $consulta->get_result();

        header('Content-type: application/json');
        echo json_encode($res->fetch_assoc());

        $consulta->close();
    } else if (isset($_GET['carrera'])) {
        $consulta = $db->prepare('SELECT * FROM clase_carrera WHERE carrera = ?');
        $consulta->bind_param('i', $_GET['carrera']);
        $consulta->execute();
        $res = $consulta->get_result();

        $lista = array();
        foreach ($res as $fila) {
            $lista[] = $fila;
        }

        header('Content-type: application/json');
        echo json_encode($lista);

        $consulta->close();
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $res = $db->query('SELECT * FROM clase_carrera');

        $lista = array();
        foreach ($res as $fila) {
            $lista[] = $fila;
        }

        header('Content-type: application/json');
        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fila['clase'] = $_POST['clase'];
        $fila['carrera'] = $_POST['carrera'];

        $consulta = $db->prepare('INSERT INTO clase_carrera (clase, carrera) VALUES (?, ?)');
        $consulta->bind_param('ss', $fila['clase'], $fila['carrera']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
        }
        $consulta->close();

        echo true;
    } else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        parse_str(file_get_contents('php://input'), $_PUT);
        $fila['id'] = $_PUT['id'];
        $fila['clase'] = $_PUT['clase'];
        $fila['carrera'] = $_PUT['carrera'];

        if (isset($fila['clase'])) {
            $consulta = $db->prepare('UPDATE clase_carrera SET clase = ? WHERE id = ?');
            $consulta->bind_param('ii', $fila['clase'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }
        if (isset($fila['carrera'])) {
            $consulta = $db->prepare('UPDATE clase_carrera SET carrera = ? WHERE id = ?');
            $consulta->bind_param('ii', $fila['carrera'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }

    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents('php://input'), $_DELETE);
        
        $consulta = $db->prepare('DELETE FROM clase_carrera WHERE id = ?');
        $consulta->bind_param('i', $_DELETE['id']);
        if(!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
        }
        $consulta->close();

        echo true;
    }

    $db->close();
?>