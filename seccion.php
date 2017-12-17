<?php
    $db = new mysqli('localhost:3306', 'root', 'password', 'biblioteca');
    $db->set_charset('utf8');
    header('Content-type: application/json');

    if (isset($_GET['id'])) {
        $consulta = $db->prepare('SELECT * FROM seccion WHERE id = ?');
        $consulta->bind_param('i', $_GET['id']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }
        $res = $consulta->get_result();

        $fila = $res->fetch_assoc();
        $clase = $db->query('SELECT * FROM clase WHERE id = ' . $fila['clase'])->fetch_assoc();
        $catedratico = $db->query('SELECT * FROM persona WHERE id = ' . $fila['catedratico'])->fetch_assoc();
        $horarios = $db->query('SELECT * FROM horario WHERE seccion = ' . $fila['id'])->fetch_all(MYSQLI_ASSOC);
        $fila['clase'] = $clase;
        $fila['catedratico'] = $catedratico;
        foreach ($horarios as $horario) {
            $dia = $db->query('SELECT * FROM dia WHERE id = ' . $horario['dia'])->fetch_assoc();
            $aula = $db->query('SELECT * FROM prestable WHERE id = ' . $horario['aula'])->fetch_assoc();
            $aula['categoria'] = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $aula['categoria'])->fetch_assoc();
            $horario['dia'] = $dia;
            $horario['aula'] = $aula;
            $fila['horario'][] = $horario;
        }

        echo json_encode($fila);

        $consulta->close();
    } else if (isset($_GET['clase'])) {
        $consulta = $db->prepare('SELECT * FROM seccion WHERE clase = ?');
        $consulta->bind_param('i', $_GET['clase']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }
        $res = $consulta->get_result();

        $lista = array();
        foreach ($res as $fila) {
            $clase = $db->query('SELECT * FROM clase WHERE id = ' . $fila['clase'])->fetch_assoc();
            $catedratico = $db->query('SELECT * FROM persona WHERE id = ' . $fila['catedratico'])->fetch_assoc();
            $horarios = $db->query('SELECT * FROM horario WHERE seccion = ' . $fila['id'])->fetch_all(MYSQLI_ASSOC);
            $fila['clase'] = $clase;
            $fila['catedratico'] = $catedratico;
            foreach ($horarios as $horario) {
                $dia = $db->query('SELECT * FROM dia WHERE id = ' . $horario['dia'])->fetch_assoc();
                $aula = $db->query('SELECT * FROM prestable WHERE id = ' . $horario['aula'])->fetch_assoc();
                $aula['categoria'] = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $aula['categoria'])->fetch_assoc();
                $horario['dia'] = $dia;
                $horario['aula'] = $aula;
                $fila['horario'][] = $horario;
            }
            $lista[] = $fila;
        }

        echo json_encode($lista);
    } else if (isset($_GET['catedratico'])) {
        $consulta = $db->prepare('SELECT * FROM seccion WHERE catedratico = ?');
        $consulta->bind_param('i', $_GET['catedratico']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }
        $res = $consulta->get_result();

        $lista = array();
        foreach ($res as $fila) {
            $clase = $db->query('SELECT * FROM clase WHERE id = ' . $fila['clase'])->fetch_assoc();
            $catedratico = $db->query('SELECT * FROM persona WHERE id = ' . $fila['catedratico'])->fetch_assoc();
            $horarios = $db->query('SELECT * FROM horario WHERE seccion = ' . $fila['id'])->fetch_all(MYSQLI_ASSOC);
            $fila['clase'] = $clase;
            $fila['catedratico'] = $catedratico;
            foreach ($horarios as $horario) {
                $dia = $db->query('SELECT * FROM dia WHERE id = ' . $horario['dia'])->fetch_assoc();
                $aula = $db->query('SELECT * FROM prestable WHERE id = ' . $horario['aula'])->fetch_assoc();
                $aula['categoria'] = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $aula['categoria'])->fetch_assoc();
                $horario['dia'] = $dia;
                $horario['aula'] = $aula;
                $fila['horario'][] = $horario;
            }
            $lista[] = $fila;
        }

        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $res = $db->query('SELECT * FROM seccion');
        if (!$res) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }

        $lista = array();
        foreach ($res as $fila) {
            $clase = $db->query('SELECT * FROM clase WHERE id = ' . $fila['clase'])->fetch_assoc();
            $catedratico = $db->query('SELECT * FROM persona WHERE id = ' . $fila['catedratico'])->fetch_assoc();
            $horarios = $db->query('SELECT * FROM horario WHERE seccion = ' . $fila['id'])->fetch_all(MYSQLI_ASSOC);
            $fila['clase'] = $clase;
            $fila['catedratico'] = $catedratico;
            foreach ($horarios as $horario) {
                $dia = $db->query('SELECT * FROM dia WHERE id = ' . $horario['dia'])->fetch_assoc();
                $aula = $db->query('SELECT * FROM prestable WHERE id = ' . $horario['aula'])->fetch_assoc();
                $aula['categoria'] = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $aula['categoria'])->fetch_assoc();
                $horario['dia'] = $dia;
                $horario['aula'] = $aula;
                $fila['horario'][] = $horario;
            }
            $lista[] = $fila;
        }

        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fila['clase'] = $_POST['clase'];
        $fila['catedratico'] = $_POST['catedratico'];
        $fila['letra'] = $_POST['letra'];

        $consulta = $db->prepare('INSERT INTO seccion (clase, catedratico, letra) VALUES (?, ?, ?)');
        $consulta->bind_param('iis', $fila['clase'], $fila['catedratico'], $fila['letra']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
            exit();
        }
        $consulta->close();

        echo true;
    } else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        parse_str(file_get_contents('php://input'), $_PUT);

        if (!is_numeric($_PUT['clase']) || !is_numeric($_PUT['catedratico']) || !is_string($_PUT['letra'])) {
            http_response_code(400);
            exit();
        }

        $fila['id'] = $_PUT['id'];
        $fila['catedratico'] = $_PUT['catedratico'];
        $fila['letra'] = $_PUT['letra'];


        if (isset($fila['catedratico'])) {
            $consulta = $db->prepare('UPDATE seccion SET catedratico = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['catedratico'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }
        if (isset($fila['letra'])) {
            $consulta = $db->prepare('UPDATE seccion SET letra = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['letra'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }

        echo true;
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents('php://input'), $_DELETE);
        
        $consulta = $db->prepare('DELETE FROM seccion WHERE id = ?');
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