<?php
    $db = new mysqli('localhost:3306', 'root', 'password', 'biblioteca');
    $db->set_charset('utf8');

    if (isset($_GET['id'])) {
        if (!is_numeric($_GET['id'])) {
            http_response_code(400);
            exit();
        }

        $consulta = $db->prepare('SELECT * FROM horario WHERE id = ?');
        $consulta->bind_param('i', $_GET['id']);
        $consulta->execute();
        $res = $consulta->get_result();

        $fila = $res->fetch_assoc();
        $res2 = $db->query('SELECT * FROM dia WHERE id = ' . $fila['dia'])->fetch_assoc();
        $res3 = $db->query('SELECT * FROM prestable WHERE id = ' . $fila['aula'])->fetch_assoc();
        $res4 = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $res3['categoria'])->fetch_assoc();
        $fila['dia'] = $res2;
        $fila['aula'] = $res3;
        $fila['aula']['categoria'] = $res4;

        header('Content-type: application/json');
        echo json_encode($fila);

        $consulta->close();
    } else if (isset($_GET['seccion'])) {
        $consulta = $db->prepare('SELECT * FROM horario WHERE seccion = ?');
        $consulta->bind_param('i', $_GET['seccion']);
        $consulta->execute();
        $res = $consulta->get_result();

        $lista = array();
        foreach ($res as $fila) {
            $res2 = $db->query('SELECT * FROM dia WHERE id = ' . $fila['dia'])->fetch_assoc();
            $res3 = $db->query('SELECT * FROM prestable WHERE id = ' . $fila['aula'])->fetch_assoc();
            $res4 = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $res3['categoria'])->fetch_assoc();
            $fila['dia'] = $res2;
            $fila['aula'] = $res3;
            $fila['aula']['categoria'] = $res4;
            $lista[] = $fila;
        }

        header('Content-type: application/json');
        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $res = $db->query('SELECT * FROM horario');

        $lista = array();
        foreach ($res as $fila) {
            $res2 = $db->query('SELECT * FROM dia WHERE id = ' . $fila['dia'])->fetch_assoc();
            $res3 = $db->query('SELECT * FROM prestable WHERE id = ' . $fila['aula'])->fetch_assoc();
            $res4 = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $res3['categoria'])->fetch_assoc();
            $fila['dia'] = $res2;
            $fila['aula'] = $res3;
            $fila['aula']['categoria'] = $res4;
            $lista[] = $fila;
        }

        header('Content-type: application/json');
        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fila['seccion'] = $_POST['seccion'];
        $fila['dia'] = $_POST['dia'];
        $fila['aula'] = $_POST['aula'];
        $fila['inicio'] = $_POST['inicio'];
        $fila['duracion'] = $_POST['duracion'];

        $consulta = $db->prepare('INSERT INTO horario (seccion, dia, aula, inicio, duracion) VALUES (?, ?, ?, ?, ?)');
        $consulta->bind_param('iiiss', $fila['seccion'], $fila['dia'], $fila['aula'], $fila['inicio'], $fila['duracion']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
            exit();
        }
        $consulta->close();

        echo true;
    } else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        parse_str(file_get_contents('php://input'), $_PUT);

        if (!is_numeric($_PUT['seccion']) || !is_numeric($_PUT['dia']) || !is_string($_PUT['aula'])) {
            http_response_code(400);
            exit();
        }

        $fila['id'] = $_PUT['id'];
        $fila['seccion'] = $_PUT['seccion'];
        $fila['dia'] = $_PUT['dia'];
        $fila['aula'] = $_PUT['aula'];
        $fila['inicio'] = $_PUT['inicio'];
        $fila['duracion'] = $_PUT['duracion'];


        if (isset($fila['dia'])) {
            $consulta = $db->prepare('UPDATE horario SET dia = ? WHERE id = ?');
            $consulta->bind_param('ii', $fila['dia'], $fila['id']);
            if (!$consulta->execute()) {
                echo json_encode(mysqli_stmt_error_list($consulta));
                exit();
            }
            $consulta->close();
        }
        if (isset($fila['aula'])) {
            $consulta = $db->prepare('UPDATE horario SET aula = ? WHERE id = ?');
            $consulta->bind_param('ii', $fila['aula'], $fila['id']);
            if (!$consulta->execute()) {
                echo json_encode(mysqli_stmt_error_list($consulta));
                exit();
            }
            $consulta->close();
        }
        if (isset($fila['inicio'])) {
            $consulta = $db->prepare('UPDATE horario SET inicio = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['inicio'], $fila['id']);
            if (!$consulta->execute()) {
                echo json_encode(mysqli_stmt_error_list($consulta));
                exit();
            }
            $consulta->close();
        }
        if (isset($fila['duracion'])) {
            $consulta = $db->prepare('UPDATE horario SET duracion = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['duracion'], $fila['id']);
            if (!$consulta->execute()) {
                echo json_encode(mysqli_stmt_error_list($consulta));
                exit();
            }
            $consulta->close();
        }
        echo true;
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents('php://input'), $_DELETE);
        
        $consulta = $db->prepare('DELETE FROM horario WHERE id = ?');
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