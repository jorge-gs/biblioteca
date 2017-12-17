<?php
    $db = new mysqli('localhost:3306', 'root', 'password', 'biblioteca');
    $db->set_charset('utf8');
    header('Content-type: application/json');

    if (isset($_GET['id'])) {
        $consulta = $db->prepare('SELECT * FROM clase WHERE id = ?');
        $consulta->bind_param('i', $_GET['id']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_error_list($db));
        }
        $res = $consulta->get_result();

        echo json_encode($res->fetch_assoc());

        $consulta->close();
    } else if (isset($_GET['carrera'])) {
        $consulta = $db->prepare(
            'SELECT clase_carrera.id as `cc_id`, clase.*
            FROM clase_carrera
            INNER JOIN clase ON
                clase.id = clase_carrera.clase
            WHERE clase_carrera.carrera = ?
            AND (SELECT COUNT(id) FROM seccion WHERE seccion.clase = clase.id) > 0');
        $consulta->bind_param('i', $_GET['carrera']);
        $consulta->execute();
        $res = $consulta->get_result();

        $lista = array();
        foreach ($res as $clase) {
            $requisitos = $db->query(
                'SELECT clase.*
                FROM requisito
                INNER JOIN clase
                    ON requisito.clase = clase.id
                WHERE clase_carrera = ' . $clase['cc_id'])->fetch_all(MYSQLI_ASSOC);
            foreach ($requisitos as $requisito) {
                $clase['requisito'][] = $requisito;
            }
            unset($clase['cc_id']);
            $lista[] = $clase;
        }

        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $res = $db->query('SELECT * FROM clase');
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
        $fila['duracion'] = $_POST['duracion'];
        $fila['uvs'] = $_POST['uvs'];

        $consulta = $db->prepare('INSERT INTO clase (codigo, nombre, duracion, uvs) VALUES (?, ?, ?, ?)');
        $consulta->bind_param('sssi', $fila['codigo'], $fila['nombre'], $fila['duracion'], $fila['uvs']);
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
        $fila['duracion'] = $_PUT['duracion'];
        $fila['uvs'] = $_PUT['uvs'];

        if (isset($fila['codigo'])) {
            $consulta = $db->prepare('UPDATE clase SET codigo = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['codigo'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }
        if (isset($fila['nombre'])) {
            $consulta = $db->prepare('UPDATE clase SET nombre = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['nombre'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }
        if (isset($fila['duracion'])) {
            $consulta = $db->prepare('UPDATE clase SET duracion = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['duracion'], $fila['id']);
            $consulta->execute();
            echo json_encode(mysqli_error_list($db));
            $consulta->close();
        }
        if (isset($fila['uvs'])) {
            $consulta = $db->prepare('UPDATE clase SET uvs = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['uvs'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents('php://input'), $_DELETE);
        
        $consulta = $db->prepare('DELETE FROM clase WHERE id = ?');
        $consulta->bind_param('i', $_DELETE['id']);
        if(!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
            exit();
        }
        $consulta->close();

        echo true;
    }

    $db->close();
?>